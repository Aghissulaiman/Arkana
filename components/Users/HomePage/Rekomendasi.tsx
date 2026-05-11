"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, Gift, Smartphone, CreditCard, ShoppingCart } from "lucide-react";
import Link from "next/link";

const RECOMMENDED_REWARDS = [
  {
    id: 1,
    name: "Voucher GoFood",
    points: "5.000",
    stock: "Tersedia",
    icon: Gift,
    color: "text-emerald-500",
    bg: "bg-emerald-100",
  },
  {
    id: 2,
    name: "Pulsa Rp25.000",
    points: "2.500",
    stock: "Tersedia",
    icon: Smartphone,
    color: "text-blue-500",
    bg: "bg-blue-100",
  },
  {
    id: 3,
    name: "E-Money Rp20.000",
    points: "2.000",
    stock: "Habis",
    icon: CreditCard,
    color: "text-violet-500",
    bg: "bg-violet-100",
  },
  {
    id: 4,
    name: "Voucher Tokopedia",
    points: "10.000",
    stock: "Tersedia",
    icon: ShoppingCart,
    color: "text-green-500",
    bg: "bg-green-100",
  },
];

export default function Recommendations() {
  return (
    <div className="w-full bg-slate-50 font-sans pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Rekomendasi Tukar Poin</h2>
            <p className="text-slate-500 font-medium text-sm mt-1">Pilihan hadiah terbaik untuk Anda</p>
          </div>

          <Link href="/user/transactions">
            <Button variant="ghost" className="text-primary hover:text-primary hover:bg-primary/10 font-bold text-sm px-4 h-10 rounded-xl transition-colors">
              Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RECOMMENDED_REWARDS.map((item) => {
            const Icon = item.icon;
            const isAvailable = item.stock !== "Habis";
            
            return (
              <Card
                key={item.id}
                className={`group relative bg-white rounded-[2rem] p-6 border transition-all duration-300 flex flex-col cursor-pointer ${
                  !isAvailable
                    ? "opacity-60 border-slate-100 cursor-not-allowed"
                    : "border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/20"
                }`}
              >
                {!isAvailable && (
                  <div className="absolute top-4 right-4 z-10">
                    <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-500 font-bold text-[10px]">Stok Habis</Badge>
                  </div>
                )}

                <div className={`${item.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 ${isAvailable && "group-hover:scale-110"}`}>
                  <Icon className={`w-8 h-8 ${item.color}`} />
                </div>

                <div className="flex-1">
                  <Badge className="bg-slate-100 text-slate-500 border-0 mb-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                    Pilihan
                  </Badge>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">{item.name}</h3>
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Harga</p>
                    <p className="text-xl font-black text-primary">
                      {item.points} <span className="text-xs font-semibold text-slate-400">pts</span>
                    </p>
                  </div>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                    isAvailable ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}