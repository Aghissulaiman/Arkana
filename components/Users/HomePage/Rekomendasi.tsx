"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Loader2, Coins, ShoppingBag, Ticket, DollarSign, Heart, Sparkles, TrendingUp, ChevronRight } from "lucide-react";

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
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
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

    // Generate placeholder image jika tidak ada gambar
    const rewardsWithImages = (rewardsData || []).map(reward => ({
      ...reward,
      image_url: reward.image_url || getPlaceholderImage(reward.category)
    }));

    setRewards(rewardsWithImages);
    setLoading(false);
  };

  const getPlaceholderImage = (category: string): string => {
    const placeholders: Record<string, string> = {
      product: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=200&h=200&fit=crop",
      voucher: "https://images.unsplash.com/photo-1556742049-0cfed2f4b3b2?w=200&h=200&fit=crop",
      cash: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?w=200&h=200&fit=crop",
      donation: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=200&h=200&fit=crop",
    };
    return placeholders[category] || placeholders.product;
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
    
    const { data: { user } } = await supabase.auth.getUser();
    
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
    { value: "all", label: "Semua", icon: ShoppingBag },
    { value: "product", label: "Produk", icon: ShoppingBag },
    { value: "voucher", label: "Voucher", icon: Ticket },
    { value: "cash", label: "Tarik Tunai", icon: DollarSign },
    { value: "donation", label: "Donasi", icon: Heart },
  ];

  const filteredRewards = selectedCategory === "all" 
    ? rewards 
    : rewards.filter(r => r.category === selectedCategory);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-800">Tukar Poin</h1>
          <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
            <Coins className="w-5 h-5 text-green-600" />
            <span className="font-bold text-green-700">{userPoints.toLocaleString()}</span>
            <span className="text-xs text-green-600">poin</span>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        
        {/* Banner Progress */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-5 mb-6 text-white">
          <div className="flex justify-between items-start mb-3">
            <div>
              <p className="text-green-100 text-sm">Poin Anda</p>
              <p className="text-3xl font-bold">{userPoints.toLocaleString()}</p>
            </div>
            <Sparkles className="w-8 h-8 opacity-50" />
          </div>
          <div className="h-2 bg-green-400/30 rounded-full overflow-hidden">
            <div className="h-full bg-green-300 rounded-full w-2/3" />
          </div>
          <p className="text-green-100 text-xs mt-2">
            Terus kumpulkan poin untuk dapat hadiah menarik!
          </p>
        </div>

        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isActive = selectedCategory === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  isActive
                    ? "bg-green-600 text-white shadow-md"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-green-300"
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Product Grid - Like E-commerce */}
        {filteredRewards.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Belum ada reward untuk kategori ini</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {filteredRewards.map((reward) => {
              const isEnough = userPoints >= reward.points_required;
              const isOutOfStock = reward.category === "product" && reward.stock <= 0;
              
              return (
                <div
                  key={reward.id}
                  onClick={() => handleRedeem(reward)}
                  className={`bg-white rounded-xl overflow-hidden shadow-sm cursor-pointer transition-all hover:shadow-md hover:-translate-y-1 ${
                    !isEnough || isOutOfStock ? "opacity-60" : ""
                  }`}
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100 relative">
                    <Image
                      src={reward.image_url}
                      alt={reward.name}
                      fill
                      className="object-cover"
                    />
                    {reward.category === "product" && reward.stock <= 10 && reward.stock > 0 && (
                      <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-0.5 rounded-full">
                        Sisa {reward.stock}
                      </span>
                    )}
                    {isOutOfStock && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="bg-white text-gray-700 text-xs px-2 py-1 rounded-full">Stok Habis</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Info */}
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800 text-sm line-clamp-1">
                      {reward.name}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                      {reward.description}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-green-600" />
                        <span className="font-bold text-green-700 text-sm">
                          {reward.points_required.toLocaleString()}
                        </span>
                      </div>
                      {reward.cash_value > 0 && (
                        <span className="text-xs text-gray-400">
                          Rp{reward.cash_value.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <button
                      className={`w-full mt-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isEnough && !isOutOfStock
                          ? "bg-green-600 text-white hover:bg-green-700"
                          : "bg-gray-100 text-gray-400 cursor-not-allowed"
                      }`}
                      disabled={!isEnough || isOutOfStock}
                    >
                      {isOutOfStock ? "Stok Habis" : 
                       isEnough ? "Tukar Sekarang" : 
                       `Kurang ${(reward.points_required - userPoints).toLocaleString()} poin`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tips Card */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-green-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-green-800">Tips Mengumpulkan Poin</p>
              <p className="text-xs text-green-700 mt-1">
                Jual sampahmu ke agen terdekat! Setiap kg sampah bisa menghasilkan 100-1000 poin. 
                Kumpulkan sebanyak-banyaknya dan tukarkan dengan hadiah menarik!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Detail & Konfirmasi */}
      {selectedReward && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Image */}
            <div className="aspect-video bg-gray-100 relative rounded-t-2xl overflow-hidden">
              <Image
                src={selectedReward.image_url}
                alt={selectedReward.name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedReward(null)}
                className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-md"
              >
                ✕
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <h2 className="text-xl font-bold text-gray-800">{selectedReward.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full">
                  <Coins className="w-4 h-4 text-green-600" />
                  <span className="font-bold text-green-700">{selectedReward.points_required.toLocaleString()} poin</span>
                </div>
                {selectedReward.cash_value > 0 && (
                  <span className="text-sm text-gray-500">
                    ≈ Rp{selectedReward.cash_value.toLocaleString()}
                  </span>
                )}
              </div>
              
              <p className="text-gray-600 text-sm mt-4 leading-relaxed">
                {selectedReward.description}
              </p>
              
              {selectedReward.category === "product" && (
                <p className="text-sm text-gray-500 mt-3">
                  📦 Stok tersisa: {selectedReward.stock}
                </p>
              )}
              
              {selectedReward.category === "cash" && (
                <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm font-medium text-gray-700">Informasi Pencairan</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Dana akan ditransfer ke rekening Anda dalam 1x24 jam setelah verifikasi.
                  </p>
                </div>
              )}
              
              <button
                onClick={confirmRedeem}
                disabled={redeeming}
                className="w-full mt-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 disabled:opacity-50 transition-all"
              >
                {redeeming ? "Memproses..." : "Konfirmasi Tukar Poin"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}