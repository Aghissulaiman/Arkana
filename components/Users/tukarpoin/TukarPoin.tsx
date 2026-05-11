"use client";

import { useState } from "react";
import { 
  Gift, 
  Search,
  CheckCircle,
  Smartphone,
  CreditCard,
  ShoppingCart,
  ShoppingBag,
  Package,
  Battery,
  Coffee,
  Trophy,
  ArrowRight,
  SlidersHorizontal
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function TukarPoin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("Semua");
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const userPoints = 1250;

  const rewards = [
    { id: 1, name: "Voucher GoFood", points: 5000, stock: "Tersedia", category: "Voucher", icon: Gift, color: "text-emerald-500", bg: "bg-emerald-100" },
    { id: 2, name: "Pulsa Rp25.000", points: 2500, stock: "Tersedia", category: "Pulsa", icon: Smartphone, color: "text-blue-500", bg: "bg-blue-100" },
    { id: 3, name: "E-Money Rp20.000", points: 2000, stock: "Habis", category: "E-Money", icon: CreditCard, color: "text-violet-500", bg: "bg-violet-100" },
    { id: 4, name: "Voucher Tokopedia", points: 10000, stock: "Tersedia", category: "Voucher", icon: ShoppingCart, color: "text-green-500", bg: "bg-green-100" },
    { id: 5, name: "Voucher Shopee", points: 8000, stock: "Tersedia", category: "Voucher", icon: ShoppingBag, color: "text-orange-500", bg: "bg-orange-100" },
    { id: 6, name: "Paket Sembako", points: 15000, stock: "Tersedia", category: "Sembako", icon: Package, color: "text-amber-600", bg: "bg-amber-100" },
    { id: 7, name: "Power Bank", points: 12000, stock: "Tersedia", category: "Elektronik", icon: Battery, color: "text-slate-700", bg: "bg-slate-200" },
    { id: 8, name: "Tumbler Exclusive", points: 7500, stock: "Tersedia", category: "Perlengkapan", icon: Coffee, color: "text-rose-500", bg: "bg-rose-100" },
  ];

  const CATEGORY_CHIPS = ["Semua", "Voucher", "Pulsa", "E-Money", "Sembako", "Elektronik", "Perlengkapan"];

  const filteredRewards = rewards.filter(r => {
    const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchChip = activeChip === "Semua" || r.category === activeChip;
    return matchSearch && matchChip;
  });

  const handleRedeem = (reward: any) => {
    if (reward.points > userPoints) return;
    if (reward.stock === "Habis") return;
    setSelectedReward(reward);
    setShowConfirm(true);
  };

  const confirmRedeem = () => {
    setShowConfirm(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans py-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 space-y-10">
        
        {/* Header & Poin Card */}
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <Badge className="bg-primary/10 text-primary border-0 mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">Rewards</Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">Tukar Poin</h1>
            <p className="text-lg text-slate-500 font-medium max-w-xl">
              Pilih dan tukarkan poin yang telah Anda kumpulkan dengan berbagai hadiah eksklusif.
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute left-10 bottom-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mb-10" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-amber-300" />
                <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">Total Poin Anda</p>
              </div>
              <p className="text-5xl font-black mb-6">{userPoints.toLocaleString()}</p>
              <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-2">
                <p className="text-sm font-medium text-white/80">Kumpulkan lebih banyak?</p>
                <button className="text-sm font-bold flex items-center gap-1 hover:text-amber-300 transition-colors">
                  Jual Sampah <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
            </div>
            <Input
              className="pl-14 pr-6 py-7 rounded-2xl bg-white border-slate-200 text-lg focus-visible:ring-2 focus-visible:ring-primary transition-all w-full shadow-sm"
              placeholder="Cari voucher, pulsa, atau sembako..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button className="h-[60px] px-8 rounded-2xl gap-3 text-base font-bold shadow-sm bg-white border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors border">
            <SlidersHorizontal className="w-5 h-5 text-primary" />
            Filter
          </Button>
        </div>

        {/* Category Chips */}
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
          {CATEGORY_CHIPS.map((chip) => {
            const isActive = activeChip === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/30 transform scale-105"
                    : "bg-white text-slate-600 shadow-sm border border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                }`}
              >
                {chip}
              </button>
            );
          })}
        </div>

        {/* Rewards Grid */}
        {filteredRewards.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">Tidak Ada Hadiah Ditemukan</h3>
            <p className="text-slate-500 max-w-md mx-auto text-lg">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRewards.map((reward) => {
              const isAffordable = reward.points <= userPoints;
              const isAvailable = reward.stock !== "Habis";
              const isDisabled = !isAffordable || !isAvailable;
              const Icon = reward.icon;

              return (
                <div
                  key={reward.id}
                  onClick={() => handleRedeem(reward)}
                  className={`group relative bg-white rounded-[2rem] p-6 border transition-all duration-300 flex flex-col ${
                    isDisabled
                      ? "opacity-60 border-slate-100 cursor-not-allowed"
                      : "border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-primary/20 cursor-pointer"
                  }`}
                >
                  {!isAffordable && isAvailable && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-rose-200 text-rose-600 font-bold text-[10px]">Poin Kurang</Badge>
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-500 font-bold text-[10px]">Stok Habis</Badge>
                    </div>
                  )}

                  <div className={`${reward.bg} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 ${!isDisabled && "group-hover:scale-110"}`}>
                    <Icon className={`w-8 h-8 ${reward.color}`} />
                  </div>

                  <div className="flex-1">
                    <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-0 mb-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {reward.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">{reward.name}</h3>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">Harga</p>
                      <p className={`text-xl font-black ${isAffordable ? "text-primary" : "text-rose-500"}`}>
                        {reward.points.toLocaleString()} <span className="text-xs font-semibold text-slate-400">pts</span>
                      </p>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      !isDisabled ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white" : "bg-slate-100 text-slate-400"
                    }`}>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Confirm Modal */}
        {showConfirm && selectedReward && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 transition-opacity">
            <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-md w-full mx-4 transform scale-100 animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">Konfirmasi Penukaran</h3>
              <p className="text-slate-500 mb-8 text-lg">
                Anda akan menukar <strong className="text-slate-800">{selectedReward.points.toLocaleString()} poin</strong> untuk mendapatkan <strong className="text-slate-800">{selectedReward.name}</strong>. Lanjutkan?
              </p>
              <div className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShowConfirm(false)}
                  className="flex-1 py-6 rounded-2xl text-base font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </Button>
                <Button
                  onClick={confirmRedeem}
                  className="flex-1 py-6 rounded-2xl text-base font-bold bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  Ya, Tukar Sekarang
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Success Toast */}
        {isSuccess && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 text-sm font-semibold z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="w-8 h-8 bg-emerald-500/20 rounded-full flex items-center justify-center shrink-0">
              <CheckCircle className="w-5 h-5 text-emerald-400" />
            </div>
            Berhasil menukar poin! Cek email Anda untuk detail voucher.
          </div>
        )}
      </div>
    </div>
  );
}