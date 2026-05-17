"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Search,
  Calendar,
  Truck,
  Gift,
  Loader2,
  AlertCircle,
  Filter,
  Eye,
  Star,
  MessageCircle,
  Send,
  X
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "sonner";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";

type PickupRequest = {
  id: string;
  request_code: string;
  waste_type: string;
  estimated_weight: number;
  actual_weight: number;
  status: string;
  points_earned: number;
  created_at: string;
  updated_at: string;
  agent_name?: string;
  agent_id?: string;
};

type RedeemRequest = {
  id: string;
  reward_name: string;
  points_spent: number;
  status: string;
  created_at: string;
};

type Review = {
  id: string;
  rating: number;
  comment: string;
};

const WASTE_LABELS: Record<string, string> = {
  plastic: "Plastik",
  paper: "Kertas",
  cardboard: "Kardus",
  glass: "Kaca",
  aluminium: "Aluminium",
  metal: "Logam",
  electronic: "Elektronik",
  mixed: "Campuran",
};

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  pending: { 
    label: "Menunggu", 
    bg: "bg-yellow-50", 
    text: "text-yellow-700",
    icon: Clock
  },
  accepted: { 
    label: "Diproses", 
    bg: "bg-blue-50", 
    text: "text-blue-700",
    icon: Truck
  },
  picked_up: { 
    label: "Dijemput", 
    bg: "bg-purple-50", 
    text: "text-purple-700",
    icon: Package
  },
  completed: { 
    label: "Selesai", 
    bg: "bg-green-50", 
    text: "text-green-700",
    icon: CheckCircle
  },
  cancelled: { 
    label: "Dibatalkan", 
    bg: "bg-red-50", 
    text: "text-red-700",
    icon: XCircle
  },
  processed: { 
    label: "Diproses", 
    bg: "bg-blue-50", 
    text: "text-blue-700",
    icon: Clock
  },
};

export default function RiwayatPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [activeTab, setActiveTab] = useState("semua");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [redeems, setRedeems] = useState<RedeemRequest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // State untuk review
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState<PickupRequest | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [existingReviews, setExistingReviews] = useState<Record<string, Review>>({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Ambil pickup requests user
    const { data: pickupData, error: pickupError } = await supabase
      .from("pickup_requests")
      .select(`
        *,
        agents (id, agent_name)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!pickupError) {
      const formattedPickups = (pickupData || []).map((p: any) => ({
        ...p,
        agent_id: p.agents?.id,
        agent_name: p.agents?.agent_name,
        points_earned: p.points_earned || 0,
      }));
      setPickups(formattedPickups);
      
      // Ambil review yang sudah ada untuk pickup ini
      const pickupIds = formattedPickups.map(p => p.id);
      if (pickupIds.length > 0) {
        const { data: reviewsData } = await supabase
          .from("reviews")
          .select("pickup_request_id, rating, comment")
          .in("pickup_request_id", pickupIds)
          .eq("user_id", user.id);
        
        const reviewsMap: Record<string, Review> = {};
        reviewsData?.forEach((r: any) => {
          reviewsMap[r.pickup_request_id] = {
            id: r.id,
            rating: r.rating,
            comment: r.comment,
          };
        });
        setExistingReviews(reviewsMap);
      }
    }

    // Ambil redeem requests user
    const { data: redeemData } = await supabase
      .from("redeem_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setRedeems(redeemData || []);
    setLoading(false);
  };

  const openReviewModal = (pickup: PickupRequest) => {
    if (existingReviews[pickup.id]) {
      toast.info("Anda sudah memberikan ulasan untuk transaksi ini");
      return;
    }
    setSelectedPickup(pickup);
    setReviewRating(0);
    setReviewComment("");
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    if (!selectedPickup) return;
    if (reviewRating === 0) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }
    
    setSubmittingReview(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Anda harus login");
      setSubmittingReview(false);
      return;
    }
    
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      agent_id: selectedPickup.agent_id,
      pickup_request_id: selectedPickup.id,
      rating: reviewRating,
      comment: reviewComment,
      is_approved: true,
    });
    
    if (error) {
      toast.error("Gagal mengirim ulasan: " + error.message);
    } else {
      toast.success("Terima kasih atas ulasannya!");
      setShowReviewModal(false);
      setSelectedPickup(null);
      // Update existing reviews
      setExistingReviews(prev => ({
        ...prev,
        [selectedPickup.id]: {
          id: "new",
          rating: reviewRating,
          comment: reviewComment,
        }
      }));
      // Refresh data untuk update rating agent
      fetchData();
    }
    
    setSubmittingReview(false);
  };

  const getAllTransactions = () => {
    const pickupTransactions = pickups.map(p => ({
      id: p.id,
      type: "penjemputan",
      title: WASTE_LABELS[p.waste_type] || p.waste_type,
      subtitle: p.agent_name ? `Agen: ${p.agent_name}` : "Penjemputan Sampah",
      details: `Berat: ${(p.actual_weight || p.estimated_weight || 0).toFixed(1)} kg`,
      points: p.points_earned > 0 ? `+${p.points_earned.toLocaleString()}` : null,
      pointsValue: p.points_earned,
      date: p.created_at,
      status: p.status,
      code: p.request_code || p.id.slice(0, 8),
      isEarn: true,
      agent_id: p.agent_id,
      hasReviewed: !!existingReviews[p.id],
    }));

    const redeemTransactions = redeems.map(r => ({
      id: r.id,
      type: "tukar poin",
      title: r.reward_name,
      subtitle: "Penukaran Poin",
      details: null,
      points: `-${r.points_spent.toLocaleString()}`,
      pointsValue: -r.points_spent,
      date: r.created_at,
      status: r.status === "pending" ? "processed" : r.status,
      code: r.id.slice(0, 8),
      isEarn: false,
      hasReviewed: false,
    }));

    return [...pickupTransactions, ...redeemTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const transactions = getAllTransactions();
  
  const filteredTransactions = transactions.filter(t => {
    if (activeTab !== "semua" && t.type !== activeTab) return false;
    if (statusFilter !== "semua" && t.status !== statusFilter) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { id: "semua", label: "Semua", icon: Clock, count: transactions.length },
    { id: "penjemputan", label: "Penjemputan", icon: Truck, count: pickups.length },
    { id: "tukar poin", label: "Tukar Poin", icon: Gift, count: redeems.length },
  ];

  const statusOptions = [
    { value: "semua", label: "Semua Status" },
    { value: "pending", label: "Menunggu" },
    {value: "accepted", label: "Diproses" },
    { value: "completed", label: "Selesai" },
    { value: "cancelled", label: "Dibatalkan" },
  ];

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 cursor-pointer transition-all ${
              star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"
            }`}
            onClick={() => setReviewRating(star)}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-5xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
          <p className="text-sm text-gray-500 mt-1">Semua aktivitas penjemputan dan penukaran poin Anda</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-gray-500" />
            Filter
            {statusFilter !== "semua" && (
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Filter Dropdown */}
        {showFilter && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 mb-2">Filter Status</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === opt.value
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Transactions List */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Tidak ada transaksi</h3>
            <p className="text-sm text-gray-400">
              {activeTab === "penjemputan" 
                ? "Belum ada penjemputan sampah" 
                : activeTab === "tukar poin" 
                   ? "Belum ada penukaran poin"
                   : "Belum ada aktivitas"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((item) => {
              const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
              const StatusIcon = statusStyle.icon;
              const date = new Date(item.date);
              const isCompletedPickup = item.type === "penjemputan" && item.status === "completed";
              
              return (
                <div key={`${item.type}-${item.id}`} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all">
                  <div className="flex items-start justify-between flex-wrap gap-3">
                    {/* Left side */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <div className={`p-2 rounded-lg ${item.type === "penjemputan" ? "bg-green-100" : "bg-orange-100"}`}>
                          {item.type === "penjemputan" ? <Truck className="w-4 h-4 text-green-600" /> : <Gift className="w-4 h-4 text-orange-600" />}
                        </div>
                        <span className="text-sm font-semibold text-gray-800">
                          {item.title}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                          <StatusIcon className="w-3 h-3" />
                          {statusStyle.label}
                        </span>
                      </div>
                      
                      <p className="text-xs text-gray-500 mb-1">{item.subtitle}</p>
                      {item.details && <p className="text-xs text-gray-400">{item.details}</p>}
                      
                      <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                        <span>{date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}</span>
                        <span>•</span>
                        <span>{date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className="font-mono">#{item.code}</span>
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="text-right flex flex-col items-end gap-2">
                      {item.points && (
                        <p className={`text-lg font-bold ${item.isEarn ? "text-green-600" : "text-orange-600"}`}>
                          {item.points}
                        </p>
                      )}
                      
                      {/* 🔥 TOMBOL BERI ULASAN - HANYA UNTUK TRANSAKSI PENJEMPUTAN YANG SUDAH SELESAI */}
                      {isCompletedPickup && !item.hasReviewed && (
                        <button
                          onClick={() => {
                            const pickup = pickups.find(p => p.id === item.id);
                            if (pickup) openReviewModal(pickup);
                          }}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                        >
                          <Star className="w-3 h-3" />
                          Beri Ulasan
                        </button>
                      )}
                      
                      {isCompletedPickup && item.hasReviewed && (
                        <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-gray-50 text-gray-400 rounded-lg">
                          <CheckCircle className="w-3 h-3" />
                          Sudah Dinilai
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Stats Summary */}
        {transactions.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white">
            <p className="text-green-100 text-xs mb-3">📊 Ringkasan Aktivitas</p>
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">{pickups.filter(p => p.status === "completed").length}</p>
                <p className="text-green-100 text-xs">Penjemputan</p>
              </div>
              <div className="w-px h-10 bg-green-500" />
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">{pickups.reduce((sum, p) => sum + (p.points_earned || 0), 0).toLocaleString()}</p>
                <p className="text-green-100 text-xs">Poin Didapat</p>
              </div>
              <div className="w-px h-10 bg-green-500" />
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">{redeems.reduce((sum, r) => sum + r.points_spent, 0).toLocaleString()}</p>
                <p className="text-green-100 text-xs">Poin Ditukar</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 🔥 MODAL REVIEW */}
      {showReviewModal && selectedPickup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-800">Beri Ulasan</h3>
              <button 
                onClick={() => setShowReviewModal(false)} 
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-5">
              <div>
                <p className="text-sm text-gray-600 mb-1">Agen: <span className="font-semibold">{selectedPickup.agent_name}</span></p>
                <p className="text-xs text-gray-400">Sampah: {WASTE_LABELS[selectedPickup.waste_type]} • {selectedPickup.actual_weight || selectedPickup.estimated_weight} kg</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 transition-all ${
                          star <= reviewRating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ulasan <span className="text-gray-400">(Opsional)</span>
                </label>
                <textarea
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                  placeholder="Ceritakan pengalaman Anda dengan agen ini..."
                />
              </div>
              
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview || reviewRating === 0}
                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold disabled:opacity-50"
              >
                {submittingReview ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Kirim Ulasan"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}