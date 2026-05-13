"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  X,
  Tag,
  Edit3,
  Save,
  Zap,
  CheckCircle2,
  TrendingUp,
  Package,
} from "lucide-react";

interface WastePrice {
  id: string;
  waste_type: string;
  price_per_kg: number;
  updated_at: string;
}

const DB_WASTE_PRICES: WastePrice[] = [
  {
    id: "0a99cc44-0a99cc44",
    waste_type: "paper",
    price_per_kg: 250,
    updated_at: "2026-05-11",
  },
  {
    id: "2ef5b223-2ef5b223",
    waste_type: "aluminium",
    price_per_kg: 800,
    updated_at: "2026-05-11",
  },
  {
    id: "5dd95dc6-5dd95dc6",
    waste_type: "mixed",
    price_per_kg: 100,
    updated_at: "2026-05-11",
  },
  {
    id: "62147a32-62147a32",
    waste_type: "electronic",
    price_per_kg: 1000,
    updated_at: "2026-05-11",
  },
  {
    id: "7a109ec4-7a109ec4",
    waste_type: "glass",
    price_per_kg: 150,
    updated_at: "2026-05-11",
  },
  {
    id: "d88bea2f-d88bea2f",
    waste_type: "cardboard",
    price_per_kg: 200,
    updated_at: "2026-05-11",
  },
  {
    id: "dee2b943-dee2b943",
    waste_type: "metal",
    price_per_kg: 600,
    updated_at: "2026-05-11",
  },
  {
    id: "feb3326a-feb3326a",
    waste_type: "plastic",
    price_per_kg: 300,
    updated_at: "2026-05-11",
  },
];

const PACKS = [
  {
    id: 1,
    name: "Starter Pro",
    price: 150000,
    duration: "1 Bulan",
    features: ["Fee +2%", "Verifikasi Akun"],
  },
  {
    id: 2,
    name: "Business Elite",
    price: 400000,
    duration: "3 Bulan",
    features: ["Fee +5%", "Prioritas Pickup"],
  },
];

export default function PricingPage() {
  const [wasteModal, setWasteModal] = useState<{
    open: boolean;
    data: WastePrice | null;
  }>({
    open: false,
    data: null,
  });

  const handleEditWaste = (item: WastePrice) => {
    setWasteModal({ open: true, data: item });
  };

  return (
    <div className="w-full bg-white min-h-screen">
      {/* HEADER SECTION */}
      <div className="px-6 md:px-12 py-10 border-b border-slate-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-xl">
                <TrendingUp className="text-emerald-600" size={28} />
              </div>
              Katalog Harga
            </h1>
            <p className="text-slate-400 font-medium">
              Monitoring harga sampah real-time Arkana.
            </p>
          </div>
          <Button
            onClick={() => setWasteModal({ open: true, data: null })}
            className="bg-slate-900 hover:bg-emerald-600 text-white rounded-2xl px-6 py-6 h-auto font-bold transition-all shadow-xl shadow-slate-200 active:scale-95"
          >
            <Plus size={20} className="mr-2" /> Tambah Jenis
          </Button>
        </div>
      </div>

      <div className="px-6 md:px-12 py-12 space-y-20">
        {/* GRID HARGA SAMPAH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {DB_WASTE_PRICES.map((item) => (
            <div
              key={item.id}
              className="group relative bg-white border border-slate-100 rounded-[32px] p-7 transition-all duration-300 hover:border-emerald-500/30 hover:shadow-[0_20px_50px_rgba(16,185,129,0.08)]"
            >
              <button
                onClick={() => handleEditWaste(item)}
                className="absolute top-6 right-6 p-2.5 bg-slate-50 text-slate-400 rounded-2xl hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
              >
                <Edit3 size={16} />
              </button>

              <div className="space-y-6">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-[20px] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <Tag size={26} />
                </div>

                <div>
                  <h3 className="text-xs font-black text-slate-300 uppercase tracking-widest mb-1">
                    Waste Type
                  </h3>
                  <p className="text-xl font-bold text-slate-800 capitalize tracking-tight">
                    {item.waste_type}
                  </p>
                </div>

                <div className="flex items-end justify-between border-t border-slate-50 pt-5">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      Price per kg
                    </p>
                    <p className="text-2xl font-black text-emerald-600 leading-none">
                      Rp {item.price_per_kg.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-8 w-8 bg-slate-50 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-300">
                    KG
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION PAKET MEMBER */}
        <div className="space-y-10">
          <div className="flex items-center gap-4">
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] whitespace-nowrap">
              Premium Membership
            </h2>
            <div className="h-px bg-slate-100 w-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {PACKS.map((pack) => (
              <div
                key={pack.id}
                className="relative overflow-hidden bg-slate-900 rounded-[40px] p-10 group"
              >
                {/* Decorative Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] -mr-32 -mt-32 rounded-full" />

                <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8">
                  <div className="space-y-6">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                      <Zap size={12} fill="currentColor" /> {pack.duration} Plan
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold text-white tracking-tight mb-3">
                        {pack.name}
                      </h4>
                      <div className="flex gap-2">
                        {pack.features.map((f, i) => (
                          <span
                            key={i}
                            className="flex items-center gap-1.5 text-[10px] font-bold bg-white/5 text-slate-300 px-3 py-1.5 rounded-xl border border-white/5"
                          >
                            <CheckCircle2
                              size={10}
                              className="text-emerald-400"
                            />{" "}
                            {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <p className="text-3xl font-black text-white">
                      Rp {pack.price.toLocaleString()}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      One time payment
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL STYLING */}
      {wasteModal.open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <Card className="w-full max-w-md rounded-[40px] shadow-2xl border-none overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-8 py-8 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="font-black text-xl text-slate-900 tracking-tight">
                  {wasteModal.data ? "Edit Detail" : "Jenis Baru"}
                </h3>
                <p className="text-xs font-medium text-slate-400">
                  Pastikan data input sudah sesuai.
                </p>
              </div>
              <button
                onClick={() => setWasteModal({ open: false, data: null })}
                className="p-3 hover:bg-slate-50 rounded-2xl text-slate-400 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Nama Sampah
                </label>
                <Input
                  defaultValue={wasteModal.data?.waste_type || ""}
                  placeholder="Misal: Tembaga"
                  className="rounded-2xl bg-slate-50 border-none h-14 font-bold focus-visible:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Harga Beli (Rp)
                </label>
                <Input
                  type="number"
                  defaultValue={wasteModal.data?.price_per_kg || ""}
                  placeholder="0"
                  className="rounded-2xl bg-slate-50 border-none h-14 font-black text-emerald-600 text-lg"
                />
              </div>
              <Button className="w-full bg-slate-900 hover:bg-emerald-600 text-white rounded-[24px] py-8 font-black text-base transition-all active:scale-95 shadow-xl shadow-slate-200 mt-4">
                <Save size={20} className="mr-3" /> Simpan Perubahan
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
