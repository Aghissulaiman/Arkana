"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { 
  Loader2, 
  Coins, 
  Package, 
  Ticket, 
  DollarSign, 
  Heart,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner";

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
  created_at: string;
};

export default function RewardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClientSupabaseClient();
  
  const [reward, setReward] = useState<Reward | null>(null);
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [redeeming, setRedeeming] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Ambil user points
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

    // Ambil detail reward
    const { data: rewardData, error } = await supabase
      .from("rewards")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !rewardData) {
      toast.error("Reward tidak ditemukan");
      router.push("/user/redeem");
      return;
    }

    setReward(rewardData);
    setLoading(false);
  };

  const handleRedeem = async () => {
    if (!reward) return;
    
    if (userPoints < reward.points_required) {
      toast.error(`Poin tidak cukup! Butuh ${reward.points_required.toLocaleString()} poin`);
      return;
    }

    setShowConfirm(true);
  };

  const confirmRedeem = async () => {
    if (!reward) return;
    
    setRedeeming(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase.rpc("redeem_points", {
      p_user_id: user?.id,
      p_points_spent: reward.points_required,
      p_reward_id: reward.id,
      p_reward_name: reward.name,
    });

    if (error) {
      toast.error("Gagal: " + error.message);
    } else if (data?.success) {
      toast.success("Berhasil menukar poin!");
      await fetchData();
      router.push("/user/redeem/history");
    } else {
      toast.error(data?.message || "Gagal menukar poin");
    }
    
    setRedeeming(false);
    setShowConfirm(false);
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "product": return <Package className="w-5 h-5" />;
      case "voucher": return <Ticket className="w-5 h-5" />;
      case "cash": return <DollarSign className="w-5 h-5" />;
      case "donation": return <Heart className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case "product": return "Produk";
      case "voucher": return "Voucher";
      case "cash": return "Tarik Tunai";
      case "donation": return "Donasi";
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "product": return "bg-blue-100 text-blue-700";
      case "voucher": return "bg-purple-100 text-purple-700";
      case "cash": return "bg-green-100 text-green-700";
      case "donation": return "bg-rose-100 text-rose-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const isEnough = reward ? userPoints >= reward.points_required : false;
  const isOutOfStock = reward?.category === "product" && (reward?.stock || 0) <= 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <AlertCircle className="w-12 h-12 text-gray-400 mb-3" />
        <p className="text-gray-500">Reward tidak ditemukan</p>
        <Link href="/user/redeem" className="mt-4 text-green-600 hover:underline">
          Kembali ke Tukar Poin
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          
          {/* Image Section */}
          <div className="relative h-64 md:h-80 bg-gray-100">
            {reward.image_url ? (
              <Image
                src={reward.image_url}
                alt={reward.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                {getCategoryIcon(reward.category)}
                <span className="ml-2 text-gray-400">No Image</span>
              </div>
            )}
            
            {/* Category Badge */}
            <div className="absolute top-4 left-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getCategoryColor(reward.category)}`}>
                {getCategoryIcon(reward.category)}
                {getCategoryLabel(reward.category)}
              </span>
            </div>
            
            {/* Stock Badge (for product) */}
            {reward.category === "product" && (
              <div className="absolute top-4 right-4">
                <span className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium ${
                  reward.stock <= 5 && reward.stock > 0 
                    ? "bg-orange-100 text-orange-700" 
                    : "bg-gray-100 text-gray-700"
                }`}>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  Stok: {reward.stock} {reward.stock <= 5 && reward.stock > 0 && "(Hampir Habis!)"}
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="p-6 md:p-8">
            
            {/* Title & Points */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                {reward.name}
              </h1>
              <div className="flex items-center gap-2 bg-green-50 px-4 py-2 rounded-full">
                <Coins className="w-5 h-5 text-green-600" />
                <span className="text-xl font-bold text-green-700">
                  {reward.points_required.toLocaleString()}
                </span>
                <span className="text-sm text-green-600">poin</span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Deskripsi</h3>
              <p className="text-gray-600 leading-relaxed">
                {reward.description || "Tidak ada deskripsi untuk reward ini."}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              
              {/* Points Info */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Coins className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-700">Kamu Butuh</h3>
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {reward.points_required.toLocaleString()} poin
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Poin kamu saat ini: {userPoints.toLocaleString()}
                </p>
              </div>

              {/* Value Info */}
              {reward.cash_value > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <h3 className="font-semibold text-gray-700">Nilai Tukar</h3>
                  </div>
                  <p className="text-2xl font-bold text-green-600">
                    Rp{reward.cash_value.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Setara dengan {Math.floor(reward.cash_value / 10).toLocaleString()} poin × Rp10
                  </p>
                </div>
              )}

              {/* Stock Info */}
              {reward.category === "product" && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShoppingBag className="w-5 h-5 text-blue-600" />
                    <h3 className="font-semibold text-gray-700">Stok Tersedia</h3>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">
                    {reward.stock} item
                  </p>
                </div>
              )}
            </div>

            {/* Action Button */}
            {reward.category === "cash" && (
              <div className="bg-blue-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  💡 Dana akan ditransfer ke rekening Anda dalam 1x24 jam setelah verifikasi.
                  Pastikan data rekening Anda sudah lengkap di profil.
                </p>
              </div>
            )}

            {reward.category === "donation" && (
              <div className="bg-rose-50 rounded-xl p-4 mb-6">
                <p className="text-sm text-rose-800">
                  ❤️ Terima kasih telah berdonasi! Donasi Anda akan disalurkan kepada yang membutuhkan.
                </p>
              </div>
            )}

            <button
              onClick={handleRedeem}
              disabled={!isEnough || isOutOfStock}
              className={`w-full py-3 rounded-xl font-semibold transition-all ${
                isEnough && !isOutOfStock
                  ? "bg-green-600 text-white hover:bg-green-700 shadow-md"
                  : isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-100 text-gray-500 cursor-not-allowed"
              }`}
            >
              {isOutOfStock 
                ? "Stok Habis" 
                : isEnough 
                  ? "Tukar Sekarang" 
                  : `Butuh ${(reward.points_required - userPoints).toLocaleString()} poin lagi`}
            </button>

            {/* Link ke History */}
            <div className="text-center mt-4">
              <Link 
                href="/user/redeem/history" 
                className="text-sm text-green-600 hover:underline"
              >
                Lihat riwayat penukaran poin →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Modal */}
      {showConfirm && reward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Konfirmasi Tukar Poin</h3>
            </div>
            
            <div className="space-y-3 mb-6">
              <p className="text-gray-600">
                Kamu akan menukarkan <span className="font-bold text-green-600">{reward.points_required.toLocaleString()} poin</span>
              </p>
              <p className="text-gray-600">
                Untuk mendapatkan: <span className="font-semibold">{reward.name}</span>
              </p>
              {reward.category === "cash" && reward.cash_value > 0 && (
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-sm text-green-800">
                    💵 Dana Rp{reward.cash_value.toLocaleString()} akan ditransfer ke rekening Anda.
                  </p>
                </div>
              )}
              {reward.category === "donation" && (
                <div className="bg-rose-50 p-3 rounded-lg">
                  <p className="text-sm text-rose-800">
                    ❤️ Terima kasih atas donasi Anda!
                  </p>
                </div>
              )}
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmRedeem}
                disabled={redeeming}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {redeeming ? "Memproses..." : "Ya, Tukar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}