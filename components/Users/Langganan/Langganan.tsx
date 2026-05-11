"use client";

import { useState } from "react";
import { Check, CreditCard, Wallet, Smartphone, ShieldCheck, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function Langganan() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Gratis",
      price: "0",
      desc: "Untuk penggunaan dasar harian",
      features: [
        "Jual sampah & dapat poin",
        "Penjemputan 3–5 hari kerja",
        "Riwayat transaksi standar",
      ],
      active: true,
      icon: <ShieldCheck className="w-6 h-6 text-slate-500" />
    },
    {
      id: "pro",
      name: "Pro",
      price: "49.000",
      desc: "Solusi cepat untuk pengguna aktif",
      features: [
        "Semua fitur Gratis",
        "Penjemputan prioritas 1x24 jam",
        "Poin 2x lipat setiap transaksi",
        "Akses eksklusif semua reward",
      ],
      highlight: true,
      icon: <Zap className="w-6 h-6 text-amber-500" />
    },
    {
      id: "business",
      name: "Business",
      price: "199.000",
      desc: "Skala besar untuk usaha & kantor",
      features: [
        "Semua fitur Pro",
        "Penjemputan tanpa batas (unlimited)",
        "Poin 3x lipat & bonus bulanan",
        "Laporan analitik lengkap",
      ],
      icon: <Wallet className="w-6 h-6 text-blue-500" />
    },
  ];

  const handleSubscribe = (id: string) => {
    setSelectedPlan(id);
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      window.location.href = "/dashboard/langganan/pembayaran";
    }, 1200);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 space-y-12">
        {/* HEADER */}
        <div className="text-center max-w-2xl mx-auto">
          <Badge className="bg-primary/10 text-primary border-0 mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Pricing Plans</Badge>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Langganan Premium</h1>
          <p className="text-lg text-slate-500 font-medium">
            Tingkatkan pengalaman Anda dengan layanan prioritas, penjemputan instan, dan dapatkan poin lebih banyak.
          </p>
        </div>

        {/* CURRENT PLAN */}
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Paket Aktif Anda</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-extrabold text-slate-900">Gratis</p>
                <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">Aktif Selamanya</Badge>
              </div>
            </div>
          </div>
        </div>

        {/* PLANS GRID */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-[2rem] p-8 flex flex-col bg-white transition-all duration-500 ${
                plan.highlight
                  ? "border-2 border-primary shadow-2xl scale-105 z-10"
                  : "border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/20"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-4 inset-x-0 flex justify-center">
                  <span className="bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg uppercase tracking-wider">
                    Paling Populer
                  </span>
                </div>
              )}
              
              {/* TOP */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-slate-800">{plan.name}</h3>
                  <div className={`p-2.5 rounded-xl ${plan.highlight ? 'bg-amber-100' : 'bg-slate-100'}`}>
                    {plan.icon}
                  </div>
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-4xl font-black text-slate-900">Rp{plan.price}</span>
                  {plan.id !== "free" && <span className="text-sm font-semibold text-slate-400">/bulan</span>}
                </div>

                <p className="text-sm text-slate-500 font-medium h-10">
                  {plan.desc}
                </p>
              </div>

              <div className="w-full h-px bg-slate-100 mb-6" />

              {/* FEATURES */}
              <ul className="space-y-4 mb-8 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className={`mt-0.5 rounded-full p-1 shrink-0 ${plan.highlight ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-500'}`}>
                      <Check className="w-3.5 h-3.5" strokeWidth={3} />
                    </div>
                    <span className="text-sm font-medium text-slate-600">{f}</span>
                  </li>
                ))}
              </ul>

              {/* BUTTON */}
              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={plan.active}
                className={`w-full py-4 rounded-2xl text-base font-bold transition-all duration-300 ${
                  plan.active
                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                    : plan.highlight
                    ? "bg-primary text-white shadow-lg shadow-primary/30 hover:shadow-xl hover:scale-[1.02]"
                    : "bg-white border-2 border-slate-200 text-slate-700 hover:border-primary hover:text-primary"
                }`}
              >
                {plan.active ? "Paket Saat Ini" : "Pilih Paket Ini"}
              </button>
            </div>
          ))}
        </div>

        {/* PAYMENT METHODS */}
        <div className="max-w-3xl mx-auto mt-16 text-center">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Metode Pembayaran Tersedia</p>
          <div className="flex flex-wrap justify-center gap-4">
            {['Kartu Kredit/Debit', 'Transfer Bank', 'E-Wallet', 'QRIS'].map((method) => (
              <div key={method} className="bg-white border border-slate-100 shadow-sm px-6 py-3 rounded-2xl flex items-center gap-2 text-sm font-semibold text-slate-600">
                {method === 'Kartu Kredit/Debit' && <CreditCard className="w-4 h-4 text-slate-400" />}
                {method === 'Transfer Bank' && <Wallet className="w-4 h-4 text-slate-400" />}
                {method === 'E-Wallet' && <Smartphone className="w-4 h-4 text-slate-400" />}
                {method === 'QRIS' && <Zap className="w-4 h-4 text-slate-400" />}
                {method}
              </div>
            ))}
          </div>
        </div>

        {/* LOADING OVERLAY */}
        {isProcessing && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl flex flex-col items-center max-w-sm w-full mx-4 transform scale-100 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 relative mb-6">
                <div className="absolute inset-0 rounded-full border-4 border-slate-100" />
                <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Memproses...</h3>
              <p className="text-slate-500 text-center text-sm">Mohon tunggu sebentar, kami sedang menyiapkan halaman pembayaran Anda.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}