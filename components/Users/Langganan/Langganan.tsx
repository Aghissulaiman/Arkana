"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function Langganan() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Gratis",
      price: "0",
      desc: "Untuk penggunaan dasar",
      features: [
        "Jual sampah & dapat poin",
        "Penjemputan 3–5 hari",
        "Riwayat transaksi",
      ],
      active: true,
    },
    {
      id: "pro",
      name: "Pro",
      price: "49.000",
      desc: "Untuk pengguna aktif",
      features: [
        "Semua fitur Gratis",
        "Penjemputan 1x24 jam",
        "Poin 2x lipat",
        "Akses semua reward",
      ],
      highlight: true,
    },
    {
      id: "business",
      name: "Business",
      price: "199.000",
      desc: "Untuk usaha & skala besar",
      features: [
        "Semua fitur Pro",
        "Penjemputan unlimited",
        "Poin 3x lipat",
        "Laporan lengkap",
      ],
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
    <div className="max-w-5xl mx-auto space-y-8">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-semibold">Langganan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pilih paket sesuai kebutuhan kamu
        </p>
      </div>

      {/* CURRENT PLAN */}
      <div className="p-5 rounded-xl border bg-muted/30 flex justify-between items-center">
        <div>
          <p className="text-xs text-muted-foreground">Paket aktif</p>
          <p className="text-base font-semibold">Gratis</p>
        </div>
        <span className="text-xs text-muted-foreground">Selamanya</span>
      </div>

      {/* PLANS */}
      <div className="grid md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-2xl border p-6 flex flex-col justify-between transition ${
              plan.highlight
                ? "border-primary shadow-md"
                : "border-border"
            }`}
          >
            {/* TOP */}
            <div>
              <p className="text-sm text-muted-foreground">{plan.name}</p>

              <h2 className="text-3xl font-bold mt-1">
                Rp{plan.price}
                <span className="text-sm font-normal text-muted-foreground">
                  {plan.id !== "free" && "/bulan"}
                </span>
              </h2>

              <p className="text-xs text-muted-foreground mt-1">
                {plan.desc}
              </p>

              {/* FEATURES */}
              <ul className="mt-5 space-y-3">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <Check className="w-4 h-4 text-primary mt-0.5" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* BUTTON */}
            <button
              onClick={() => handleSubscribe(plan.id)}
              disabled={plan.active}
              className={`mt-6 h-10 rounded-lg text-sm font-medium transition ${
                plan.active
                  ? "bg-muted text-muted-foreground cursor-default"
                  : plan.highlight
                  ? "bg-primary text-white hover:opacity-90"
                  : "border border-border hover:bg-muted"
              }`}
            >
              {plan.active ? "Sedang digunakan" : "Pilih Paket"}
            </button>
          </div>
        ))}
      </div>

      {/* PAYMENT */}
      <div className="border rounded-xl p-5">
        <p className="text-sm font-medium mb-3">Metode pembayaran</p>

        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="px-3 py-1 bg-muted rounded">Kartu</span>
          <span className="px-3 py-1 bg-muted rounded">Bank</span>
          <span className="px-3 py-1 bg-muted rounded">E-Wallet</span>
          <span className="px-3 py-1 bg-muted rounded">QRIS</span>
        </div>
      </div>

      {/* LOADING */}
      {isProcessing && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-xl text-center">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sm">Memproses...</p>
          </div>
        </div>
      )}
    </div>
  );
}