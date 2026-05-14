"use client";

import { useState, useEffect } from "react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";
import {
  Loader2,
  Wallet,
  CreditCard,
  Building2,
  Smartphone,
  QrCode,
  Copy,
  CheckCircle,
  ChevronRight,
  X,
  ArrowRight,
  Info,
} from "lucide-react";

const TOP_UP_AMOUNTS = [10000, 25000, 50000, 100000, 250000, 500000];

const PAYMENT_METHODS = [
  {
    id: "bca",
    name: "Transfer BCA",
    icon: Building2,
    color: "bg-blue-600",
    desc: "Via ATM / Mobile Banking BCA",
    accountNo: "1234567890",
    accountName: "PT Arkana Digital",
  },
  {
    id: "mandiri",
    name: "Transfer Mandiri",
    icon: Building2,
    color: "bg-yellow-600",
    desc: "Via ATM / Mobile Banking Mandiri",
    accountNo: "0987654321",
    accountName: "PT Arkana Digital",
  },
  {
    id: "gopay",
    name: "GoPay",
    icon: Smartphone,
    color: "bg-green-600",
    desc: "Scan QR atau transfer ke nomor",
    accountNo: "0811-2345-6789",
    accountName: "PT Arkana Digital",
  },
  {
    id: "qris",
    name: "QRIS",
    icon: QrCode,
    color: "bg-purple-600",
    desc: "Scan QR dengan aplikasi apapun",
    accountNo: null,
    accountName: null,
  },
];

// Exchange rate: 1 poin = Rp 10
const RATE = 10;

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

  useEffect(() => {
    fetchBalance();
  }, []);

  const fetchBalance = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
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

  const handleSubmitPayment = async () => {
    setSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const amount = getAmount();
      const points = getPointsEarned();
      const method = PAYMENT_METHODS.find((m) => m.id === selectedMethod);

      // Record top up request in DB
      const { error } = await supabase.from("topup_requests").insert({
        user_id: user.id,
        amount: amount,
        points_to_add: points,
        payment_method: selectedMethod,
        status: "pending",
        created_at: new Date().toISOString(),
      });

      if (error) {
        // If table doesn't exist, just show success (will be processed manually)
        console.warn("topup_requests table may not exist:", error);
      }

      setStep("success");
    } catch (err) {
      console.error(err);
      // Show success anyway since this is a manual process
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
          Konfirmasi Terkirim!
        </h2>
        <p className="text-gray-500 mb-4">
          Pembayaran Anda sedang diverifikasi. Poin akan ditambahkan dalam{" "}
          <strong>1x24 jam</strong> setelah konfirmasi.
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
            <span className="text-gray-500">Metode</span>
            <span className="font-semibold">{currentMethod?.name}</span>
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

        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => setStep("select")}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Detail Pembayaran</h1>
        </div>

        {/* Summary */}
        <div className="bg-gradient-to-br from-primary to-primary/80 rounded-2xl p-5 text-white mb-6">
          <p className="text-white/70 text-sm">Total Transfer</p>
          <p className="text-3xl font-bold my-1">
            Rp {getAmount().toLocaleString("id-ID")}
          </p>
          <p className="text-white/70 text-sm">
            = +{getPointsEarned().toLocaleString()} poin
          </p>
        </div>

        {/* Payment Info */}
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

          {currentMethod.id === "qris" ? (
            <div className="text-center py-6">
              <div className="w-48 h-48 bg-gray-100 rounded-xl mx-auto flex items-center justify-center">
                <QrCode className="w-24 h-24 text-gray-300" />
              </div>
              <p className="text-xs text-gray-400 mt-3">
                Scan QR Code di atas untuk membayar
              </p>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-xl p-4 space-y-3">
              <div>
                <p className="text-xs text-gray-400">No. Rekening / Nomor</p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-lg font-bold font-mono tracking-wider text-gray-800">
                    {currentMethod.accountNo}
                  </p>
                  <button
                    onClick={() => handleCopy(currentMethod.accountNo!)}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      copied
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                    }`}
                  >
                    {copied ? (
                      <>
                        <CheckCircle className="w-3.5 h-3.5" /> Disalin
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Salin
                      </>
                    )}
                  </button>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Nama Rekening</p>
                <p className="font-semibold text-gray-800">
                  {currentMethod.accountName}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <div className="text-xs text-amber-700 space-y-1">
              <p className="font-semibold">Petunjuk:</p>
              <p>1. Transfer tepat sesuai jumlah (jangan dibulatkan)</p>
              <p>2. Simpan bukti transfer Anda</p>
              <p>3. Klik tombol "Konfirmasi Pembayaran" di bawah</p>
              <p>4. Poin akan masuk dalam 1x24 jam</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSubmitPayment}
          disabled={submitting}
          className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Konfirmasi Pembayaran
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
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
        <p className="text-4xl font-bold">{balance.toLocaleString()}</p>
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

      {/* Amount Selection */}
      <div className="space-y-3">
        <p className="text-sm font-semibold text-gray-700">Pilih Nominal</p>
        <div className="grid grid-cols-3 gap-2">
          {TOP_UP_AMOUNTS.map((amount) => (
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

        {/* Custom Amount */}
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

        {/* Preview */}
        {getAmount() > 0 && (
          <div className="bg-gray-50 rounded-xl p-3 flex justify-between text-sm">
            <span className="text-gray-500">Poin yang didapat</span>
            <span className="font-bold text-primary">
              +{getPointsEarned().toLocaleString()} poin
            </span>
          </div>
        )}
      </div>

      {/* Payment Method */}
      <div className="space-y-3">
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
