"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import {
  Loader2,
  Coins,
  ShoppingBag,
  Ticket,
  DollarSign,
  Heart,
  Sparkles,
  Gift,
  Star,
  Clock,
  ChevronRight,
  X,
  Zap,
  Package,
} from "lucide-react";

type Reward = {
  id: string;
  name: string;
  description: string;
  category: string;
  points_required: number;
  cash_value: number;
  stock: number;
  image_url: string;
  is_active: boolean;
};

export default function RedeemPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [redeeming, setRedeeming] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      console.warn("Client-side login redirect suppressed; middleware enforces auth");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("balance_points")
      .eq("user_id", user.id)
      .single();

    setUserPoints(profile?.balance_points || 0);

    const { data: rewardsData } = await supabase
      .from("rewards")
      .select("*")
      .eq("is_active", true)
      .order("points_required", { ascending: true });

    const rewardsWithImages = (rewardsData || []).map((reward) => ({
      ...reward,
      image_url: reward.image_url || getPlaceholderImage(reward.category, reward.id),
    }));

    setRewards(rewardsWithImages);
    setLoading(false);
  };

  const getPlaceholderImage = (category: string, id: string): string => {
    const seed = parseInt(id.replace(/-/g, '').slice(0, 6), 16) || Math.floor(Math.random() * 100);
    
    const images: Record<string, string[]> = {
      product: [
        `https://picsum.photos/id/${100 + (seed % 50)}/400/400`,
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1560343090-f0409e92791a?w=400&h=400&fit=crop",
      ],
      voucher: [
        `https://picsum.photos/id/${150 + (seed % 50)}/400/400`,
        "https://images.unsplash.com/photo-1556741533-6e6a3bd8e3d2?w=400&h=400&fit=crop",
      ],
      cash: [
        `https://picsum.photos/id/${20 + (seed % 30)}/400/400`,
        "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=400&h=400&fit=crop",
      ],
      donation: [
        `https://picsum.photos/id/${30 + (seed % 40)}/400/400`,
        "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=400&h=400&fit=crop",
      ],
    };
    
    const list = images[category] || images.product;
    return list[seed % list.length];
  };

  const handleRedeem = (reward: Reward) => {
    if (userPoints < reward.points_required) {
      alert(`Poin tidak cukup! Butuh ${reward.points_required.toLocaleString()} poin`);
      return;
    }
    setSelectedReward(reward);
  };

  const confirmRedeem = async () => {
    if (!selectedReward) return;

    setRedeeming(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase.rpc("redeem_points", {
      p_user_id: user?.id,
      p_points_spent: selectedReward.points_required,
      p_reward_id: selectedReward.id,
      p_reward_name: selectedReward.name,
    });

    if (error) {
      alert("Gagal: " + error.message);
    } else if (data?.success) {
      alert("✅ Berhasil menukar poin!");
      await fetchData();
    } else {
      alert(data?.message || "Gagal menukar poin");
    }

    setRedeeming(false);
    setSelectedReward(null);
  };

  const categories = [
    { value: "all", label: "Semua", icon: Gift },
    { value: "product", label: "Produk", icon: ShoppingBag },
    { value: "voucher", label: "Voucher", icon: Ticket },
    { value: "cash", label: "Tarik Tunai", icon: DollarSign },
    { value: "donation", label: "Donasi", icon: Heart },
  ];

  const filteredRewards =
    selectedCategory === "all"
      ? rewards
      : rewards.filter((r) => r.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        <p className="text-sm text-slate-400">Memuat katalog hadiah...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header
      <div className="sticky top-0 z-20 bg-white/80 backdrop-blur-lg border-b border-slate-100 px-4 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Tukar Poin</h1>
            <p className="text-xs text-slate-400 mt-0.5">Pilih hadiah favoritmu</p>
          </div>
          <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-amber-100 px-4 py-2 rounded-full shadow-sm border border-amber-200">
            <Coins className="w-5 h-5 text-amber-500" />
            <span className="font-bold text-amber-700 text-lg">
              {userPoints.toLocaleString()}
            </span>
            <span className="text-xs text-amber-500">poin</span>
          </div>
        </div>
      </div> */}

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Banner Hero */}
        <div className="relative bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 mb-8 overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-white/80" />
              <span className="text-white/80 text-xs font-medium">✨ Program Reward</span>
            </div>
            <h2 className="text-white text-2xl font-bold mb-2">
              {userPoints >= 1000 ? "🎉 Selamat!" : "✨ Semangat!"}
            </h2>
            <p className="text-white/80 text-sm mb-4 max-w-sm">
              {userPoints >= 1000 
                ? `Kamu punya ${userPoints.toLocaleString()} poin! Yuk tukarkan dengan hadiah menarik.`
                : `Kumpulkan ${(1000 - userPoints).toLocaleString()} poin lagi untuk mendapatkan hadiah spesial!`}
            </p>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden max-w-xs">
              <div 
                className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full transition-all duration-500"
                style={{ width: `${Math.min((userPoints / 5000) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
                    : "bg-white text-slate-600 border border-slate-200 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredRewards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-100">
            <Gift className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-medium">Belum ada hadiah</p>
            <p className="text-xs text-slate-300 mt-1">Coba kategori lain ya</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredRewards.map((reward) => {
              const isEnough = userPoints >= reward.points_required;
              const isOutOfStock = reward.category === "product" && reward.stock <= 0;

              return (
                <div
                  key={reward.id}
                  onClick={() => handleRedeem(reward)}
                  className={`group bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                    !isEnough || isOutOfStock ? "opacity-50" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="aspect-square bg-gradient-to-br from-slate-50 to-slate-100 relative overflow-hidden">
                    <Image
                      src={reward.image_url}
                      alt={reward.name}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {reward.category === "product" && reward.stock <= 10 && reward.stock > 0 && (
                      <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        Sisa {reward.stock}
                      </span>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="bg-white text-slate-600 text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                          Stok Habis
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">
                      {reward.name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                        <Coins className="w-3 h-3 text-amber-500" />
                        <span className="font-bold text-amber-600 text-xs">
                          {reward.points_required.toLocaleString()}
                        </span>
                      </div>
                      {reward.cash_value > 0 && (
                        <span className="text-[10px] text-slate-400">
                          ~Rp{reward.cash_value.toLocaleString()}
                        </span>
                      )}
                    </div>
                    
                    <div className="mt-3">
                      <div
                        className={`w-full py-2 rounded-xl text-xs font-semibold text-center transition-all ${
                          isEnough && !isOutOfStock
                            ? "bg-emerald-600 text-white hover:bg-emerald-700"
                            : "bg-slate-100 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {isOutOfStock
                          ? "Stok Habis"
                          : isEnough
                            ? "Tukarkan"
                            : `Kurang ${(reward.points_required - userPoints).toLocaleString()}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips Card */}
        <div className="mt-10 bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">💡 Tips Mengumpulkan Poin</p>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Jual sampah ke agen terdekat! Setiap kg sampah menghasilkan 100-1000 poin. 
                Semakin banyak sampah, semakin banyak poin!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4 backdrop-blur-sm" onClick={() => setSelectedReward(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Image */}
            <div className="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 relative rounded-t-2xl overflow-hidden">
              <Image
                src={selectedReward.image_url}
                alt={selectedReward.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <button
                onClick={() => setSelectedReward(null)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg hover:bg-white transition-all"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <h2 className="text-xl font-bold text-slate-800 flex-1">
                  {selectedReward.name}
                </h2>
              </div>
              
              <div className="flex items-center gap-2 mt-3">
                <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span className="font-bold text-amber-600">
                    {selectedReward.points_required.toLocaleString()} poin
                  </span>
                </div>
                {selectedReward.cash_value > 0 && (
                  <span className="text-sm text-slate-400">
                    ≈ Rp{selectedReward.cash_value.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="mt-4 p-3 bg-slate-50 rounded-xl">
                <p className="text-slate-600 text-sm leading-relaxed">
                  {selectedReward.description}
                </p>
              </div>

              {selectedReward.category === "product" && (
                <div className="mt-3 flex items-center gap-2 text-sm text-slate-500">
                  <Package className="w-4 h-4" />
                  <span>Stok tersisa: {selectedReward.stock}</span>
                </div>
              )}

              {selectedReward.category === "cash" && (
                <div className="mt-4 p-3 bg-blue-50 rounded-xl">
                  <p className="text-sm font-medium text-blue-700">Informasi Pencairan</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Dana akan ditransfer ke rekening Anda dalam 1x24 jam setelah verifikasi.
                  </p>
                </div>
              )}

              <button
                onClick={confirmRedeem}
                disabled={redeeming}
                className="w-full mt-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:opacity-50 transition-all duration-200 shadow-lg shadow-emerald-200"
              >
                {redeeming ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Memproses...
                  </div>
                ) : (
                  "Konfirmasi Tukar Poin"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}