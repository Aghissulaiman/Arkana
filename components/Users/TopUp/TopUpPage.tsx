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
  Copy,
  CheckCircle,
  ChevronRight,
  X,
  ArrowRight,
  Info,
  CreditCard,
} from "lucide-react";
import Script from "next/script";

// Payment methods for Midtrans
const PAYMENT_METHODS = [
  {
    id: "credit_card",
    name: "Kartu Kredit",
    icon: CreditCard,
    color: "bg-blue-600",
    desc: "Visa / Mastercard / JCB",
  },
  {
    id: "bank_transfer_bca",
    name: "Transfer BCA",
    icon: Building2,
    color: "bg-blue-600",
    desc: "Via ATM / Mobile Banking BCA",
  },
  {
    id: "bank_transfer_mandiri",
    name: "Transfer Mandiri",
    icon: Building2,
    color: "bg-yellow-600",
    desc: "Via ATM / Mobile Banking Mandiri",
  },
  {
    id: "bank_transfer_bri",
    name: "Transfer BRI",
    icon: Building2,
    color: "bg-red-600",
    desc: "Via ATM / Mobile Banking BRI",
  },
  {
    id: "qris",
    name: "QRIS",
    icon: QrCode,
    color: "bg-purple-600",
    desc: "Scan QR dengan aplikasi apapun",
  },
  {
    id: "gopay",
    name: "GoPay",
    icon: Smartphone,
    color: "bg-green-600",
    desc: "Bayar dengan GoPay",
  },
];

// Exchange rate: 1 poin = Rp 10
const RATE = 10;

declare global {
  interface Window {
    snap: any;
  }
}

export default function TopUpPage() {
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [step, setStep] = useState<"select" | "payment" | "success">("select");
  const [copied, setCopied] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snapLoaded, setSnapLoaded] = useState(false);
  const [orderData, setOrderData] = useState<{
    order_id: string;
    amount: number;
    points: number;
  } | null>(null);

  const MIDTRANS_CLIENT_KEY = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;

  useEffect(() => {
    fetchBalance();
  }, []);

  useEffect(() => {
    // Load Midtrans Snap script
    if (!document.querySelector('#midtrans-snap-script')) {
      const script = document.createElement('script');
      script.id = 'midtrans-snap-script';
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
      script.setAttribute('data-client-key', MIDTRANS_CLIENT_KEY || '');
      script.onload = () => setSnapLoaded(true);
      document.body.appendChild(script);
    } else {
      setSnapLoaded(true);
    }
  }, [MIDTRANS_CLIENT_KEY]);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("profiles")
        .select("balance_points")
        .eq("user_id", user.id)
        .single();

      setBalance(data?.balance_points || 0);
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

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaymentWithMidtrans = async () => {
    const amount = getAmount();
    const points = getPointsEarned();

    if (amount < 10000) {
      toast.error("Minimal top up Rp 10.000");
      return;
    }

    if (!selectedMethod) {
      toast.error("Pilih metode pembayaran terlebih dahulu");
      return;
    }

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not found");

      // Panggil API untuk create payment
      const response = await fetch("/api/midtrans/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          points,
          user_id: user.id,
          payment_method: selectedMethod,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Gagal membuat pembayaran");
      }

      setOrderData({
        order_id: data.order_id,
        amount,
        points,
      });

      // Open Midtrans Snap popup
      if (snapLoaded && window.snap) {
        window.snap.pay(data.token, {
          onSuccess: (result: any) => {
            console.log("Payment success:", result);
            handlePaymentSuccess(data.order_id, amount, points);
          },
          onPending: (result: any) => {
            console.log("Payment pending:", result);
            toast.info("Pembayaran pending, silakan selesaikan pembayaran");
            setStep("payment");
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
      } else {
        // Fallback: redirect ke payment URL
        if (data.payment_url) {
          window.location.href = data.payment_url;
        }
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      toast.error(err.message || "Terjadi kesalahan");
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = async (orderId: string, amount: number, points: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update status topup request
      await supabase
        .from("topup_requests")
        .update({ status: "success", completed_at: new Date().toISOString() })
        .eq("order_id", orderId);

      // Tambah poin ke user
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance_points")
        .eq("user_id", user.id)
        .single();

      const newBalance = (profile?.balance_points || 0) + points;

      await supabase
        .from("profiles")
        .update({ balance_points: newBalance })
        .eq("user_id", user.id);

      setBalance(newBalance);
      setStep("success");
      toast.success(`Top up berhasil! +${points.toLocaleString()} poin`);
    } catch (err) {
      console.error("Error updating balance:", err);
      toast.error("Poin akan ditambahkan dalam beberapa saat");
      setStep("success");
    } finally {
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
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Top Up Berhasil!
        </h2>
        <p className="text-gray-500 mb-4">
          Selamat! Poin Anda telah bertambah.
        </p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Jumlah Transfer</span>
            <span className="font-semibold">
              Rp {getAmount().toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Poin yang Didapat</span>
            <span className="font-semibold text-primary">
              +{getPointsEarned().toLocaleString()} poin
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Saldo Sekarang</span>
            <span className="font-semibold">
              {balance.toLocaleString()} poin
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            setStep("select");
            setSelectedAmount(null);
            setCustomAmount("");
            setSelectedMethod(null);
          }}
          className="w-full py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors"
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
          data-client-key={MIDTRANS_CLIENT_KEY}
          strategy="lazyOnload"
        />

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setStep("select")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Detail Pembayaran</h1>
        </div>

        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white mb-6">
          <p className="text-white/70 text-sm">Total Pembayaran</p>
          <p className="text-3xl font-bold my-1">
            Rp {getAmount().toLocaleString("id-ID")}
          </p>
          <p className="text-white/70 text-sm">
            = +{getPointsEarned().toLocaleString()} poin
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 ${currentMethod.color} rounded-xl flex items-center justify-center`}
            >
              <currentMethod.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-800">{currentMethod.name}</p>
              <p className="text-xs text-gray-400">{currentMethod.desc}</p>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-4 text-center">
            <p className="text-sm text-blue-800">
              Anda akan diarahkan ke halaman pembayaran Midtrans
            </p>
          </div>
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-700 space-y-1">
              <p className="font-semibold">Informasi:</p>
              <p>1. Klik tombol "Lanjutkan Pembayaran" di bawah</p>
              <p>2. Anda akan diarahkan ke halaman Midtrans</p>
              <p>3. Pilih metode pembayaran yang diinginkan</p>
              <p>4. Poin akan langsung bertambah setelah pembayaran sukses</p>
            </div>
          </div>
        </div>

        <button
          onClick={handlePaymentWithMidtrans}
          disabled={submitting}
          className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Lanjutkan Pembayaran
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
      <Toaster position="top-right" richColors />

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Top Up Poin</h1>
        <p className="text-sm text-gray-500 mt-1">
          Tambah saldo poin untuk ditukarkan dengan reward
        </p>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="w-5 h-5 text-white/70" />
          <p className="text-white/70 text-sm">Saldo Poin Anda</p>
        </div>
        <p className="text-3xl font-bold">{balance.toLocaleString()}</p>
        <p className="text-white/60 text-sm mt-1">
          ≈ Rp {(balance * RATE).toLocaleString("id-ID")}
        </p>
      </div>

      {/* Exchange Rate Info */}
      <div className="bg-primary/5 border border-primary/15 rounded-xl p-3 flex items-center gap-3 text-sm">
        <Info className="w-4 h-4 text-primary shrink-0" />
        <p className="text-primary/80">
          <strong>Kurs:</strong> Rp {RATE.toLocaleString()} = 1 poin
        </p>
      </div>

      {/* Two Column Layout untuk Desktop */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left: Amount Selection */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">Pilih Nominal</p>
          <div className="grid grid-cols-3 gap-2">
            {[10000, 25000, 50000, 100000, 250000, 500000].map((amount) => (
              <button
                key={amount}
                onClick={() => {
                  setSelectedAmount(amount);
                  setCustomAmount("");
                }}
                className={`py-3 rounded-xl text-sm font-semibold transition-all ${
                  selectedAmount === amount
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-white border border-gray-200 text-gray-700 hover:border-primary/50"
                }`}
              >
                {amount >= 1000
                  ? `Rp ${(amount / 1000).toLocaleString()}k`
                  : `Rp ${amount}`}
              </button>
            ))}
          </div>

          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium text-sm">
              Rp
            </span>
            <input
              type="text"
              value={customAmount}
              onChange={(e) => {
                const raw = e.target.value.replace(/\D/g, "");
                setCustomAmount(raw);
                setSelectedAmount(null);
              }}
              placeholder="Nominal lainnya..."
              className="w-full pl-9 pr-3 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {getAmount() > 0 && (
            <div className="bg-gray-50 rounded-xl p-3 flex justify-between text-sm">
              <span className="text-gray-500">Poin yang didapat</span>
              <span className="font-bold text-primary">
                +{getPointsEarned().toLocaleString()} poin
              </span>
            </div>
          )}
        </div>

        {/* Right: Payment Method */}
        <div className="space-y-4">
          <p className="text-sm font-semibold text-gray-700">
            Pilih Metode Pembayaran
          </p>
          <div className="space-y-2">
            {PAYMENT_METHODS.map((method) => (
              <button
                key={method.id}
                onClick={() => setSelectedMethod(method.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  selectedMethod === method.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div
                  className={`w-10 h-10 ${method.color} rounded-xl flex items-center justify-center shrink-0`}
                >
                  <method.icon className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-800">
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-400">{method.desc}</p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 transition-colors ${
                    selectedMethod === method.id
                      ? "text-primary"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Proceed Button */}
      <button
        onClick={() => {
          if (!selectedMethod) {
            toast.error("Pilih metode pembayaran terlebih dahulu");
            return;
          }
          if (getAmount() < 10000) {
            toast.error("Minimal top up Rp 10.000");
            return;
          }
          setStep("payment");
        }}
        disabled={!getAmount() || getAmount() < 10000 || !selectedMethod}
        className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        Lanjutkan Pembayaran
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}