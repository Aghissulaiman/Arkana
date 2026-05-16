"use client";

import { useState, useEffect } from "react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";
import {
  Loader2,
  Wallet,
  Building2,
  Smartphone,
  QrCode,
  CheckCircle,
  ChevronRight,
  X,
  ArrowRight,
  Info,
  CreditCard,
  TrendingUp,
} from "lucide-react";
import Script from "next/script";

const PAYMENT_METHODS = [
  { id: "credit_card", name: "Kartu Kredit", icon: CreditCard, color: "bg-blue-600", desc: "Visa / Mastercard" },
  { id: "bank_transfer_bca", name: "Transfer BCA", icon: Building2, color: "bg-blue-600", desc: "Via ATM / Mobile Banking" },
  { id: "bank_transfer_mandiri", name: "Transfer Mandiri", icon: Building2, color: "bg-yellow-600", desc: "Via ATM / Mobile Banking" },
  { id: "qris", name: "QRIS", icon: QrCode, color: "bg-purple-600", desc: "Scan QR dengan aplikasi apapun" },
  { id: "gopay", name: "GoPay", icon: Smartphone, color: "bg-green-600", desc: "Bayar dengan GoPay" },
];

const RATE = 10; // Rp10 = 1 poin (balance_income)

declare global {
  interface Window {
    snap: any;
  }
}

export default function AgentTopUpPage() {
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "payment" | "success">("select");
  const [submitting, setSubmitting] = useState(false);
  const [snapLoaded, setSnapLoaded] = useState(false);
  const [successAmount, setSuccessAmount] = useState(0);
  const [successBalance, setSuccessBalance] = useState(0);

  useEffect(() => {
    fetchAgentData();
  }, []);

  useEffect(() => {
    if (!document.querySelector('#midtrans-snap-script')) {
      const script = document.createElement('script');
      script.id = 'midtrans-snap-script';
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '');
      script.onload = () => setSnapLoaded(true);
      document.body.appendChild(script);
    } else {
      setSnapLoaded(true);
    }
  }, []);

  const fetchAgentData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Ambil data agent
      const { data: agent } = await supabase
        .from("agents")
        .select("id, balance_income")
        .eq("user_id", user.id)
        .single();

      if (agent) {
        setAgentId(agent.id);
        setBalance(agent.balance_income || 0);
      }
    } catch (error) {
      console.error("Error fetching agent data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getAmount = () => {
    if (selectedAmount) return selectedAmount;
    const val = parseInt(customAmount.replace(/\D/g, ""));
    return isNaN(val) ? 0 : val;
  };

  const getPointsEarned = () => Math.floor(getAmount() / RATE);

  const addIncomeToAgent = async (agentId: string, amount: number) => {
    console.log("=== ADDING INCOME TO AGENT ===");
    console.log("Agent ID:", agentId);
    console.log("Amount to add:", amount);

    // Ambil balance_income sekarang
    const { data: agent } = await supabase
      .from("agents")
      .select("balance_income")
      .eq("id", agentId)
      .single();

    const newBalance = (agent?.balance_income || 0) + amount;

    const { error: updateError } = await supabase
      .from("agents")
      .update({ balance_income: newBalance })
      .eq("id", agentId);

    if (updateError) {
      console.error("Update error:", updateError);
      throw updateError;
    }

    return newBalance;
  };

  const handlePayment = async () => {
    const amount = getAmount();
    const pointsToAdd = getPointsEarned();

    if (amount < 10000) {
      toast.error("Minimal top up Rp 10.000");
      return;
    }
    if (!selectedMethod) {
      toast.error("Pilih metode pembayaran");
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");
      if (!agentId) throw new Error("Agent not found");

      const response = await fetch("/api/midtrans/create-payment-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          points_to_add: pointsToAdd,
          user_id: user.id,
          agent_id: agentId,
          payment_method: selectedMethod,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Gagal membuat pembayaran");

      if (snapLoaded && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: async (result: any) => {
            console.log("=== PAYMENT SUCCESS ===", result);
            
            try {
              const newBalance = await addIncomeToAgent(agentId, pointsToAdd);
              setSuccessAmount(pointsToAdd);
              setSuccessBalance(newBalance);
              setStep("success");
              toast.success(`+Rp ${(pointsToAdd * RATE).toLocaleString()} saldo berhasil ditambahkan!`);
            } catch (err) {
              console.error("Error adding income:", err);
              toast.error("Pembayaran sukses tapi gagal menambah saldo. Hubungi admin.");
            }
            setSubmitting(false);
          },
          onPending: (result: any) => {
            console.log("Payment pending:", result);
            toast.info("Pembayaran pending, silakan selesaikan pembayaran");
            setSubmitting(false);
          },
          onError: (result: any) => {
            console.error("Payment error:", result);
            toast.error("Pembayaran gagal, silakan coba lagi");
            setSubmitting(false);
          },
          onClose: () => {
            console.log("Payment popup closed");
            setSubmitting(false);
          },
        });
      } else if (data.payment_url) {
        window.location.href = data.payment_url;
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Terjadi kesalahan");
      setSubmitting(false);
    }
  };

  const currentMethod = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (step === "success") {
    return (
      <div className="max-w-md mx-auto px-4 py-12 text-center">
        <Toaster position="top-right" richColors />
        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Top Up Berhasil!</h2>
        <p className="text-gray-500 mb-4">Saldo pendapatan Anda telah bertambah.</p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Saldo yang Ditambahkan</span>
            <span className="font-semibold text-primary">+Rp {(successAmount * RATE).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Poin yang Didapat</span>
            <span className="font-semibold text-primary">+{successAmount.toLocaleString()} poin</span>
          </div>
          <div className="flex justify-between text-sm pt-2 border-t">
            <span className="text-gray-500">Total Balance</span>
            <span className="font-bold">Rp {successBalance.toLocaleString()}</span>
          </div>
        </div>
        <button
          onClick={() => {
            setStep("select");
            setSelectedAmount(null);
            setCustomAmount("");
            setSelectedMethod(null);
            fetchAgentData();
          }}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90"
        >
          Top Up Lagi
        </button>
      </div>
    );
  }

  if (step === "payment" && currentMethod) {
    return (
      <div className="max-w-md mx-auto px-4 py-6">
        <Toaster position="top-right" richColors />
        <Script 
          src="https://app.sandbox.midtrans.com/snap/snap.js" 
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} 
          strategy="lazyOnload" 
        />

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep("select")} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Detail Pembayaran</h1>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white mb-6">
          <p className="text-white/70 text-sm">Total Pembayaran</p>
          <p className="text-3xl font-bold my-1">Rp {getAmount().toLocaleString("id-ID")}</p>
          <p className="text-white/70 text-sm">= +{getPointsEarned().toLocaleString()} poin (balance income)</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 ${currentMethod.color} rounded-xl flex items-center justify-center`}>
              <currentMethod.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{currentMethod.name}</p>
              <p className="text-xs text-gray-400">{currentMethod.desc}</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-800">Klik tombol di bawah untuk membayar</p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5" />
            <div className="text-xs text-amber-700">
              <p className="font-semibold">Cara Bayar (Testing):</p>
              <p>1. Pilih "Kartu Kredit" di halaman Midtrans</p>
              <p>2. Masukkan kartu: <strong className="font-mono">4811 1111 1111 1114</strong></p>
              <p>3. Expiry: <strong>01/25</strong>, CVV: <strong>123</strong></p>
              <p>4. Klik "Bayar" → saldo akan langsung bertambah!</p>
            </div>
          </div>
        </div>

        <button
          onClick={handlePayment}
          disabled={submitting}
          className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Bayar Sekarang <ArrowRight className="w-4 h-4" /></>}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <Toaster position="top-right" richColors />

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Top Up Balance Agent</h1>
        <p className="text-sm text-gray-500 mt-1">Tambah saldo pendapatan untuk operasional</p>
      </div>

      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-white/70" />
          <p className="text-white/70 text-sm">Balance Income Anda</p>
        </div>
        <p className="text-3xl font-bold">Rp {balance.toLocaleString("id-ID")}</p>
        <p className="text-white/60 text-sm mt-1">≈ {balance.toLocaleString()} poin</p>
      </div>

      <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 flex items-center gap-3 text-sm">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <p className="text-primary/80"><strong>Kurs:</strong> Rp {RATE.toLocaleString()} = 1 poin (balance)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Pilih Nominal</p>
          <div className="grid grid-cols-3 gap-2">
            {[10000, 25000, 50000, 100000, 250000, 500000].map((amount) => (
              <button
                key={amount}
                onClick={() => { setSelectedAmount(amount); setCustomAmount(""); }}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedAmount === amount ? "bg-primary text-white shadow-md" : "bg-white border border-gray-200 text-gray-700 hover:border-primary/50"
                }`}
              >
                {amount >= 1000 ? `Rp ${(amount / 1000).toLocaleString()}k` : `Rp ${amount}`}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rp</span>
            <input
              type="text"
              value={customAmount}
              onChange={(e) => { setCustomAmount(e.target.value.replace(/\D/g, "")); setSelectedAmount(null); }}
              placeholder="Nominal lainnya..."
              className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>
          {getAmount() > 0 && (
            <div className="bg-gray-50 rounded-xl p-3 flex justify-between text-sm">
              <span className="text-gray-500">Poin yang didapat</span>
              <span className="font-bold text-primary">+{getPointsEarned().toLocaleString()} poin</span>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Pilih Metode Pembayaran</p>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  selectedMethod === method.id ? "border-primary bg-primary/5" : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className={`w-10 h-10 ${method.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <method.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">{method.name}</p>
                  <p className="text-xs text-gray-400">{method.desc}</p>
                </div>
                <ChevronRight className={`w-4 h-4 ${selectedMethod === method.id ? "text-primary" : "text-gray-300"}`} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          if (!selectedMethod) { toast.error("Pilih metode pembayaran"); return; }
          if (getAmount() < 10000) { toast.error("Minimal top up Rp 10.000"); return; }
          setStep("payment");
        }}
        disabled={!getAmount() || getAmount() < 10000 || !selectedMethod}
        className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-40 flex items-center justify-center gap-2"
      >
        Lanjutkan Pembayaran <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}