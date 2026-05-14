"use client";

import { useState, useEffect } from "react";
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
  SlidersHorizontal,
  Loader2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";

type Reward = {
  id: string;
  name: string;
  points_required: number;
  stock: number;
  category: string;
  image_url?: string;
  description?: string;
  is_active: boolean;
};

const CATEGORY_ICON_MAP: Record<string, any> = {
  voucher: Gift,
  pulsa: Smartphone,
  "e-money": CreditCard,
  product: Package,
  cash: ShoppingCart,
  donation: Coffee,
};

const CATEGORY_COLOR_MAP: Record<string, string> = {
  voucher: "text-emerald-500 bg-emerald-100",
  pulsa: "text-blue-500 bg-blue-100",
  "e-money": "text-violet-500 bg-violet-100",
  product: "text-amber-600 bg-amber-100",
  cash: "text-green-500 bg-green-100",
  donation: "text-rose-500 bg-rose-100",
};

const CATEGORY_CHIPS = ["Semua", "Voucher", "Pulsa", "E-Money", "Product", "Cash", "Donation"];

export default function TukarPoin() {
  const supabase = createClientSupabaseClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeChip, setActiveChip] = useState("Semua");
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [userPoints, setUserPoints] = useState(0);
  const [userId, setUserId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [recentRedeems, setRecentRedeems] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }
      setUserId(user.id);

      // Fetch user points
      const { data: profileData } = await supabase
        .from("profiles")
        .select("balance_points")
        .eq("user_id", user.id)
        .single();
      setUserPoints(profileData?.balance_points || 0);

      // Fetch rewards
      const { data: rewardsData, error } = await supabase
        .from("rewards")
        .select("*")
        .eq("is_active", true)
        .order("points_required", { ascending: true });

      if (!error && rewardsData) {
        setRewards(rewardsData);
      } else {
        // Fallback static rewards if table doesn't exist
        setRewards([
          {
            id: "1",
            name: "Voucher GoFood",
            points_required: 5000,
            stock: 10,
            category: "voucher",
            is_active: true,
          },
          {
            id: "2",
            name: "Pulsa Rp25.000",
            points_required: 2500,
            stock: 20,
            category: "pulsa",
            is_active: true,
          },
          {
            id: "3",
            name: "E-Money Rp20.000",
            points_required: 2000,
            stock: 0,
            category: "e-money",
            is_active: true,
          },
          {
            id: "4",
            name: "Voucher Tokopedia",
            points_required: 10000,
            stock: 5,
            category: "voucher",
            is_active: true,
          },
        ]);
      }

      // Fetch recent redeems
      const { data: redeemData } = await supabase
        .from("redeem_requests")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentRedeems(redeemData || []);
    } finally {
      setLoading(false);
    }
  };

  const filteredRewards = rewards.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchChip =
      activeChip === "Semua" ||
      r.category.toLowerCase() === activeChip.toLowerCase();
    return matchSearch && matchChip;
  });

  const handleRedeem = (reward: Reward) => {
    if (reward.points_required > userPoints) return;
    if (reward.stock !== undefined && reward.stock <= 0) return;
    setSelectedReward(reward);
    setShowConfirm(true);
  };

  const confirmRedeem = async () => {
    if (!selectedReward || !userId) return;

    setSubmitting(true);
    try {
      // 1. Check if user has enough points
      const { data: profileData } = await supabase
        .from("profiles")
        .select("balance_points")
        .eq("user_id", userId)
        .single();

      const currentPoints = profileData?.balance_points || 0;
      if (currentPoints < selectedReward.points_required) {
        toast.error("Poin Anda tidak mencukupi");
        setShowConfirm(false);
        return;
      }

      // 2. Deduct points
      const { error: deductError } = await supabase
        .from("profiles")
        .update({
          balance_points: currentPoints - selectedReward.points_required,
        })
        .eq("user_id", userId);

      if (deductError) throw deductError;

      // 3. Create redeem request
      const { error: redeemError } = await supabase
        .from("redeem_requests")
        .insert({
          user_id: userId,
          reward_id: selectedReward.id,
          reward_name: selectedReward.name,
          points_spent: selectedReward.points_required,
          status: "pending",
          created_at: new Date().toISOString(),
        });

      if (redeemError) {
        // Rollback if insert fails
        await supabase
          .from("profiles")
          .update({ balance_points: currentPoints })
          .eq("user_id", userId);
        throw redeemError;
      }

      // 4. Reduce stock if product
      if (selectedReward.stock > 0) {
        await supabase
          .from("rewards")
          .update({ stock: selectedReward.stock - 1 })
          .eq("id", selectedReward.id);
      }

      // 5. Create notification
      await supabase.from("notifications").insert({
        user_id: userId,
        type: "redeem_success",
        title: "Penukaran Poin Berhasil! 🎁",
        message: `Anda berhasil menukar ${selectedReward.points_required.toLocaleString()} poin dengan ${selectedReward.name}. Pesanan sedang diproses.`,
        is_read: false,
      });

      // Update local state
      setUserPoints(currentPoints - selectedReward.points_required);
      setShowConfirm(false);
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 4000);
      await fetchData();
    } catch (err: any) {
      toast.error("Gagal menukar poin: " + err?.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans py-10">
      <Toaster position="top-right" richColors />

      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 space-y-10">
        {/* Header & Poin Card */}
        <div className="grid lg:grid-cols-3 gap-8 items-center">
          <div className="lg:col-span-2">
            <Badge className="bg-primary/10 text-primary border-0 mb-4 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest">
              Rewards
            </Badge>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
              Tukar Poin
            </h1>
            <p className="text-lg text-slate-500 font-medium max-w-xl">
              Pilih dan tukarkan poin yang telah Anda kumpulkan dengan berbagai
              hadiah eksklusif.
            </p>
          </div>

          <div className="bg-gradient-to-br from-primary to-primary/80 rounded-[2rem] p-8 text-white shadow-xl shadow-primary/20 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10" />
            <div className="absolute left-10 bottom-0 w-24 h-24 bg-white/10 rounded-full blur-xl -mb-10" />
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Trophy className="w-5 h-5 text-amber-300" />
                <p className="text-sm font-semibold text-white/80 uppercase tracking-wider">
                  Total Poin Anda
                </p>
              </div>
              <p className="text-5xl font-black mb-6">
                {userPoints.toLocaleString()}
              </p>
              <div className="flex items-center justify-between border-t border-white/20 pt-4 mt-2">
                <p className="text-sm font-medium text-white/80">
                  Kumpulkan lebih banyak?
                </p>
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
              placeholder="Cari voucher, pulsa, atau produk..."
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
            <h3 className="text-2xl font-bold text-slate-800 mb-3">
              Tidak Ada Hadiah Ditemukan
            </h3>
            <p className="text-slate-500 max-w-md mx-auto text-lg">
              Coba sesuaikan kata kunci pencarian atau ubah filter kategori.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredRewards.map((reward) => {
              const isAffordable = reward.points_required <= userPoints;
              const isAvailable = !reward.stock || reward.stock > 0;
              const isDisabled = !isAffordable || !isAvailable;
              const IconComponent = CATEGORY_ICON_MAP[reward.category] || Gift;
              const colorClass =
                CATEGORY_COLOR_MAP[reward.category] ||
                "text-gray-500 bg-gray-100";

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
                      <Badge
                        variant="outline"
                        className="bg-white/80 backdrop-blur-sm border-rose-200 text-rose-600 font-bold text-[10px]"
                      >
                        Poin Kurang
                      </Badge>
                    </div>
                  )}
                  {!isAvailable && (
                    <div className="absolute top-4 right-4 z-10">
                      <Badge
                        variant="outline"
                        className="bg-white/80 backdrop-blur-sm border-slate-200 text-slate-500 font-bold text-[10px]"
                      >
                        Stok Habis
                      </Badge>
                    </div>
                  )}

                  <div
                    className={`${colorClass} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-300 ${
                      !isDisabled && "group-hover:scale-110"
                    }`}
                  >
                    <IconComponent className="w-8 h-8" />
                  </div>

                  <div className="flex-1">
                    <Badge className="bg-slate-100 text-slate-500 hover:bg-slate-200 border-0 mb-3 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {reward.category}
                    </Badge>
                    <h3 className="text-lg font-bold text-slate-800 leading-tight mb-2">
                      {reward.name}
                    </h3>
                    {reward.description && (
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {reward.description}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-1">
                        Harga
                      </p>
                      <p
                        className={`text-xl font-black ${
                          isAffordable ? "text-primary" : "text-rose-500"
                        }`}
                      >
                        {reward.points_required.toLocaleString()}{" "}
                        <span className="text-xs font-semibold text-slate-400">
                          pts
                        </span>
                      </p>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                        !isDisabled
                          ? "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Confirm Modal */}
      {showConfirm && selectedReward && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-[2rem] shadow-2xl max-w-md w-full mx-4">
            <div className="flex justify-between items-start mb-6">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center">
                <Gift className="w-8 h-8 text-primary" />
              </div>
              <button
                onClick={() => setShowConfirm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">
              Konfirmasi Penukaran
            </h3>
            <p className="text-slate-500 mb-6 text-lg">
              Anda akan menukar{" "}
              <strong className="text-slate-800">
                {selectedReward.points_required.toLocaleString()} poin
              </strong>{" "}
              untuk mendapatkan{" "}
              <strong className="text-slate-800">{selectedReward.name}</strong>.
            </p>

            <div className="bg-gray-50 rounded-xl p-4 mb-6 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Poin saat ini</span>
                <span className="font-semibold">
                  {userPoints.toLocaleString()} pts
                </span>
              </div>
              <div className="flex justify-between text-red-500">
                <span>Poin digunakan</span>
                <span>- {selectedReward.points_required.toLocaleString()} pts</span>
              </div>
              <div className="flex justify-between border-t pt-2 text-primary font-bold">
                <span>Sisa poin</span>
                <span>
                  {(userPoints - selectedReward.points_required).toLocaleString()} pts
                </span>
              </div>
            </div>

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
                disabled={submitting}
                className="flex-1 py-6 rounded-2xl text-base font-bold shadow-lg shadow-primary/20"
              >
                {submitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Ya, Tukar Sekarang"
                )}
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
          Berhasil menukar poin! Pesanan sedang diproses.
        </div>
      )}
    </div>
  );
}