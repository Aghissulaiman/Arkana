"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { 
  Loader2, 
  MapPin, 
  Star, 
  Phone, 
  Package,
  Leaf,
  Recycle,
  Building2,
  Truck,
  ArrowLeft,
  User,
  Clock,
  MessageCircle,
  Info,
  Users,
  Calendar,
  X
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

type Agent = {
  id: string;
  agent_name: string;
  phone: string;
  address: string;
  service_area: string;
  waste_categories: string[];
  is_active: boolean;
  avg_rating?: number;
  total_reviews?: number;
  total_pickups?: number;
  joined_date?: string;
};

type PriceCatalog = {
  waste_type: string;
  price_per_kg: number;
};

type Review = {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
};

type Schedule = {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  break_start: string | null;
  break_end: string | null;
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

const WASTE_ICONS: Record<string, any> = {
  plastic: Package,
  paper: Leaf,
  cardboard: Package,
  glass: Package,
  aluminium: Package,
  metal: Recycle,
  electronic: Recycle,
  mixed: Building2,
};

const WASTE_COLORS: Record<string, string> = {
  plastic: "bg-blue-100 text-blue-700",
  paper: "bg-amber-100 text-amber-700",
  cardboard: "bg-orange-100 text-orange-700",
  glass: "bg-emerald-100 text-emerald-700",
  aluminium: "bg-slate-100 text-slate-700",
  metal: "bg-gray-100 text-gray-700",
  electronic: "bg-purple-100 text-purple-700",
  mixed: "bg-slate-100 text-slate-700",
};

const DUMMY_COVER = "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format";

export default function RequestPickupPage({ agentId: initialAgentId }: { agentId?: string }) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [prices, setPrices] = useState<PriceCatalog[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [selectedWaste, setSelectedWaste] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [agentId, setAgentId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [openStatusMessage, setOpenStatusMessage] = useState("");
  
  // State untuk review
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    if (initialAgentId) {
      setAgentId(initialAgentId);
    } else {
      const searchParams = new URLSearchParams(window.location.search);
      const urlAgentId = searchParams.get("agentId") || searchParams.get("agent");
      if (urlAgentId) {
        setAgentId(urlAgentId);
      } else {
        toast.error("Agent ID tidak ditemukan");
        setLoading(false);
      }
    }
  }, [initialAgentId]);

  useEffect(() => {
    if (!agentId) return;
    fetchData();
    checkUserReview();
  }, [agentId]);

  const fetchData = async () => {
    if (!agentId) return;
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Ambil profile user
    const { data: profile } = await supabase
      .from("profiles")
      .select("address")
      .eq("user_id", user.id)
      .single();
    setUserAddress(profile?.address || "");

    // Ambil data agent
    const { data: agentData, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .single();

    if (agentError || !agentData) {
      toast.error("Agent tidak ditemukan");
      setLoading(false);
      return;
    }

    // Ambil jadwal agent
    const { data: scheduleData } = await supabase
      .from("agent_schedules")
      .select("*")
      .eq("agent_id", agentId);

    // Cek status buka
    const now = new Date();
    const dayIndex = now.getDay() === 0 ? 6 : now.getDay() - 1;
    const todaySchedule = scheduleData?.find(s => s.day_of_week === dayIndex);
    
    if (todaySchedule) {
      const currentTime = now.getHours() * 60 + now.getMinutes();
      const openTime = parseTimeToMinutes(todaySchedule.open_time);
      const closeTime = parseTimeToMinutes(todaySchedule.close_time);
      
      if (!todaySchedule.is_open || currentTime < openTime || currentTime > closeTime) {
        setIsOpen(false);
        setOpenStatusMessage(`Buka: ${todaySchedule.open_time} - ${todaySchedule.close_time}`);
      }
    }

    // Ambil total pickups
    const { data: completedPickups } = await supabase
      .from("pickup_requests")
      .select("id")
      .eq("agent_id", agentId)
      .eq("status", "completed");
    const totalPickups = completedPickups?.length || 0;

    // 🔥 AMBIL REVIEWS - PAKAI CARA SIMPLE
    const { data: reviewsData, error: reviewsError } = await supabase
      .from("reviews")
      .select("*")
      .eq("agent_id", agentId)
      .eq("is_approved", true)
      .order("created_at", { ascending: false })
      .limit(10);

    console.log("Reviews data:", reviewsData);
    if (reviewsError) console.error("Reviews error:", reviewsError);

    // Format reviews dengan ambil nama user
    const formattedReviews: Review[] = [];
    if (reviewsData && reviewsData.length > 0) {
      for (const review of reviewsData) {
        const { data: userProfile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", review.user_id)
          .single();
        
        formattedReviews.push({
          id: review.id,
          user_name: userProfile?.full_name || "Pengguna",
          rating: review.rating,
          comment: review.comment || "",
          created_at: review.created_at,
        });
      }
    }
    setReviews(formattedReviews);

    // Hitung rata-rata rating dari reviews yang ada
    const avgRating = formattedReviews.length > 0 
      ? formattedReviews.reduce((sum, r) => sum + r.rating, 0) / formattedReviews.length 
      : 0;

    setAgent({
      ...agentData,
      avg_rating: avgRating,
      total_reviews: formattedReviews.length,
      total_pickups: totalPickups,
      joined_date: new Date(agentData.created_at).toLocaleDateString("id-ID", { year: "numeric", month: "long" }),
    });

    // Ambil harga
    const { data: priceData } = await supabase
      .from("price_catalog")
      .select("waste_type, price_per_kg")
      .is("agent_id", null);
    setPrices(priceData || []);

    const initialSelected: Record<string, number> = {};
    agentData.waste_categories?.forEach((w: string) => {
      initialSelected[w] = 0;
    });
    setSelectedWaste(initialSelected);
    setLoading(false);
  };

  const checkUserReview = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !agentId) return;
    
    const { data: existingReview } = await supabase
      .from("reviews")
      .select("id")
      .eq("user_id", user.id)
      .eq("agent_id", agentId)
      .maybeSingle();
    
    setHasReviewed(!!existingReview);
  };

  const parseTimeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    return hours * 60 + minutes;
  };

  const updateWeight = (wasteType: string, weight: number) => {
    setSelectedWaste(prev => ({
      ...prev,
      [wasteType]: Math.max(0, weight)
    }));
  };

  const getPricePerKg = (wasteType: string) => {
    return prices.find(p => p.waste_type === wasteType)?.price_per_kg || 0;
  };

  const calculateTotalPoints = () => {
    let total = 0;
    Object.entries(selectedWaste).forEach(([wasteType, weight]) => {
      total += weight * getPricePerKg(wasteType);
    });
    return total;
  };

  const calculateTotalWeight = () => {
    return Object.values(selectedWaste).reduce((a, b) => a + b, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isOpen) {
      toast.error(openStatusMessage || "Agent sedang tutup");
      return;
    }

    const totalWeight = calculateTotalWeight();
    if (totalWeight === 0) {
      toast.error("Masukkan minimal satu jenis sampah dengan berat > 0");
      return;
    }

    if (!userAddress) {
      toast.error("Alamat belum lengkap. Silakan lengkapi profil terlebih dahulu.");
      router.push("/complete-profile");
      return;
    }

    setSubmitting(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    const activeWastes = Object.keys(selectedWaste).filter(w => selectedWaste[w] > 0);
    let finalWasteType = "mixed";
    if (activeWastes.length === 1) {
      finalWasteType = activeWastes[0];
    }

    const { error: requestError } = await supabase
      .from("pickup_requests")
      .insert({
        user_id: user?.id,
        agent_id: agentId,
        waste_type: finalWasteType,
        estimated_weight: totalWeight,
        pickup_address: userAddress,
        notes: notes,
        status: "pending",
      });

    if (requestError) {
      toast.error("Gagal mengirim permintaan: " + requestError.message);
      setSubmitting(false);
      return;
    }

    toast.success("Permintaan penjemputan berhasil dikirim!");
    setTimeout(() => router.push("/user/home"), 2000);
    setSubmitting(false);
  };

  // 🔥 SUBMIT REVIEW
  const handleSubmitReview = async () => {
    if (reviewRating === 0) {
      toast.error("Pilih rating terlebih dahulu");
      return;
    }
    
    setSubmittingReview(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Anda harus login untuk memberi ulasan");
      setSubmittingReview(false);
      return;
    }
    
    const { error } = await supabase.from("reviews").insert({
      user_id: user.id,
      agent_id: agentId,
      rating: reviewRating,
      comment: reviewComment,
      is_approved: true,
    });
    
    if (error) {
      toast.error("Gagal mengirim ulasan: " + error.message);
    } else {
      toast.success("Terima kasih atas ulasannya!");
      setShowReviewModal(false);
      setReviewRating(0);
      setReviewComment("");
      setHasReviewed(true);
      fetchData(); // Refresh data
    }
    
    setSubmittingReview(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3.5 h-3.5 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">Agent tidak ditemukan</p>
        <Link href="/user/home" className="mt-4 text-green-600 hover:underline">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const totalPoints = calculateTotalPoints();
  const totalWeight = calculateTotalWeight();

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Kembali</span>
        </button>

        {/* Hero Section */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="relative h-32 bg-gradient-to-r from-green-600 to-green-500">
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-4 -mt-10">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg border-4 border-white">
                <Building2 className="w-10 h-10 text-white" />
              </div>
              
              <div className="flex-1 pt-2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{agent.agent_name}</h1>
                  {isOpen ? (
                    <Badge className="bg-green-500 text-white">🟢 Buka</Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white">🔴 Tutup</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-green-600" />
                    {agent.service_area}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-green-600" />
                    {agent.total_pickups || 0} penjemputan
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4 text-green-600" />
                    Bergabung {agent.joined_date}
                  </div>
                </div>
                
                <div className="flex items-center gap-2 mt-3">
                  <div className="flex items-center gap-1">
                    {renderStars(agent.avg_rating || 0)}
                    <span className="text-sm font-semibold text-gray-700 ml-1">
                      {agent.avg_rating?.toFixed(1) || "0"}
                    </span>
                  </div>
                  <span className="text-xs text-gray-400">({agent.total_reviews || 0} ulasan)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Daftar Harga Sampah
                </h2>
              </div>
              <div className="divide-y divide-gray-100">
                {agent.waste_categories?.map((wasteType) => {
                  const Icon = WASTE_ICONS[wasteType] || Package;
                  const price = getPricePerKg(wasteType);
                  return (
                    <div key={wasteType} className="flex items-center justify-between p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${WASTE_COLORS[wasteType]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <p className="font-semibold text-gray-800">{WASTE_LABELS[wasteType]}</p>
                      </div>
                      <p className="text-xl font-bold text-green-600">{price.toLocaleString()} poin/kg</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 🔥 REVIEWS SECTION - INI YANG LO MINTA */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-green-600" />
                  Ulasan Pelanggan
                </h2>
                <p className="text-xs text-gray-500 mt-1">{reviews.length} ulasan</p>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-80 overflow-y-auto">
                {reviews.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>Belum ada ulasan</p>
                    <p className="text-xs mt-1">Jadilah yang pertama memberi ulasan</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-semibold text-gray-800">{review.user_name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                          </div>
                        </div>
                      </div>
                      {review.comment && (
                        <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Order Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                  <h2 className="font-bold text-lg text-white flex items-center gap-2">
                    <Truck className="w-5 h-5" />
                    Form Penjemputan
                  </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat Penjemputan <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={userAddress}
                      onChange={(e) => setUserAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      placeholder="Jl. Contoh No. 123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis & Berat Sampah
                    </label>
                    <div className="space-y-2">
                      {agent.waste_categories?.map((wasteType) => {
                        const price = getPricePerKg(wasteType);
                        const weight = selectedWaste[wasteType] || 0;
                        const points = weight * price;
                        
                        return (
                          <div key={wasteType} className="flex items-center gap-2 p-2 bg-gray-50 rounded-xl">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{WASTE_LABELS[wasteType]}</p>
                              <p className="text-[10px] text-gray-400">{price.toLocaleString()} poin/kg</p>
                            </div>
                            <input
                              type="number"
                              step="0.1"
                              min="0"
                              value={weight || ""}
                              onChange={(e) => updateWeight(wasteType, parseFloat(e.target.value) || 0)}
                              className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-center text-sm"
                              placeholder="kg"
                            />
                            <div className="w-14 text-right">
                              <p className="text-sm font-semibold text-green-600">+{points.toLocaleString()}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="bg-green-50 rounded-xl p-3">
                    <div className="flex justify-between text-sm">
                      <span>Total Berat</span>
                      <span className="font-semibold">{totalWeight.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between text-lg mt-1">
                      <span>Total Poin</span>
                      <span className="font-bold text-green-600">{totalPoints.toLocaleString()}</span>
                    </div>
                  </div>

                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm"
                    placeholder="Catatan (opsional)..."
                  />

                  <Button
                    type="submit"
                    disabled={submitting || totalWeight === 0 || !isOpen}
                    className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Ajukan Penjemputan"}
                  </Button>

                  {/* 🔥 TOMBOL BERI ULASAN */}
                  {!hasReviewed && (
                    <Button
                      type="button"
                      onClick={() => setShowReviewModal(true)}
                      variant="outline"
                      className="w-full py-2 gap-2 border-green-600 text-green-600 hover:bg-green-50"
                    >
                      <Star className="w-4 h-4" />
                      Beri Ulasan untuk Agen Ini
                    </Button>
                  )}

                  {!isOpen && (
                    <p className="text-xs text-red-500 text-center">{openStatusMessage || "Agent sedang tutup"}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 🔥 MODAL REVIEW */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Beri Ulasan</h3>
              <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      className="focus:outline-none"
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
                <label className="block text-sm font-medium mb-2">Ulasan (Opsional)</label>
                <textarea
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500"
                  placeholder="Ceritakan pengalaman Anda..."
                />
              </div>
              
              <Button
                onClick={handleSubmitReview}
                disabled={submittingReview || reviewRating === 0}
                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl"
              >
                {submittingReview ? <Loader2 className="w-5 h-5 animate-spin" /> : "Kirim Ulasan"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}