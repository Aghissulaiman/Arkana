"use client";

import { useState, useEffect, use } from "react";
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
  CheckCircle,
  User,
  Clock,
  Shield,
  ThumbsUp,
  MessageCircle,
  Send,
  ChevronRight,
  Award,
  Calendar,
  Image as ImageIcon,
  Play,
  Heart,
  Share2,
  Info,
  TrendingUp,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import Image from "next/image";

type Agent = {
  id: string;
  agent_name: string;
  phone: string;
  address: string;
  service_area: string;
  waste_categories: string[];
  is_active: boolean;
  rating?: number;
  total_reviews?: number;
  distance_km?: number;
  avatar_url?: string;
  cover_url?: string;
  joined_date?: string;
  total_pickups?: number;
};

type PriceCatalog = {
  waste_type: string;
  price_per_kg: number;
};

type Review = {
  id: string;
  user_name: string;
  user_avatar?: string;
  rating: number;
  comment: string;
  created_at: string;
  pickup_weight?: number;
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

export default function RequestPickupPage({ params }: PageProps) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [prices, setPrices] = useState<PriceCatalog[]>([]);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedWaste, setSelectedWaste] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [agentId, setAgentId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const [openStatusMessage, setOpenStatusMessage] = useState("");

  useEffect(() => {
    params.then((resolved) => {
      setAgentId(resolved.id);
    });
  }, [params]);

  useEffect(() => {
    if (!agentId) return;
    fetchData();
  }, [agentId]);

  const fetchData = async () => {
    if (!agentId) return;
    
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("Client-side login redirect suppressed; middleware enforces auth");
      setLoading(false);
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone, address")
      .eq("user_id", user.id)
      .single();

    setUserName(profile?.full_name || "");
    setUserPhone(profile?.phone || "");
    setUserAddress(profile?.address || "");

    // Ambil data agent
    const { data: agentData, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .single();

    if (agentError || !agentData) {
      toast.error("Agent tidak ditemukan");
      console.warn("Client-side redirect suppressed; agent not found");
      setLoading(false);
      return;
    }

    // Ambil jadwal agent
    const { data: scheduleData } = await supabase
      .from("agent_schedules")
      .select("*")
      .eq("agent_id", agentId);

    setSchedules(scheduleData || []);

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
      
      if (todaySchedule.break_start && todaySchedule.break_end) {
        const breakStart = parseTimeToMinutes(todaySchedule.break_start);
        const breakEnd = parseTimeToMinutes(todaySchedule.break_end);
        if (currentTime >= breakStart && currentTime <= breakEnd) {
          setIsOpen(false);
          setOpenStatusMessage(`Istirahat ${todaySchedule.break_start} - ${todaySchedule.break_end}`);
        }
      }
    }

    // Ambil rating & total pickups
    const { data: completedPickups } = await supabase
      .from("pickup_requests")
      .select("id")
      .eq("agent_id", agentId)
      .eq("status", "completed");

    const totalPickups = completedPickups?.length || 0;
    const avgRating = 4.7; // Sementara, nanti dari tabel reviews

    // Ambil reviews
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*, profiles!reviews_user_id_fkey(full_name, avatar_url)")
      .eq("agent_id", agentId)
      .order("created_at", { ascending: false })
      .limit(5);

    const formattedReviews: Review[] = (reviewsData || []).map(r => ({
      id: r.id,
      user_name: r.profiles?.full_name || "User",
      user_avatar: r.profiles?.avatar_url,
      rating: r.rating,
      comment: r.comment,
      created_at: r.created_at,
      pickup_weight: r.pickup_weight,
    }));

    setReviews(formattedReviews);

    setAgent({
      ...agentData,
      rating: avgRating,
      total_reviews: formattedReviews.length,
      total_pickups: totalPickups,
      distance_km: +(Math.random() * 5 + 0.5).toFixed(1),
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
    const agentSpecific = prices.find(p => p.waste_type === wasteType && p.agent_id === agentId);
    if (agentSpecific) return agentSpecific.price_per_kg;
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
    setTimeout(() => {
      router.push("/user/riwayat");
    }, 2000);
    
    setSubmitting(false);
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${star <= rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
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

        {/* Hero Section - Cover & Profile */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          <div className="relative h-48 bg-gradient-to-r from-green-600 to-green-500">
            <img
              src={DUMMY_COVER}
              alt="Cover"
              className="w-full h-full object-cover opacity-40"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
          
          <div className="relative px-6 pb-6">
            <div className="flex flex-col md:flex-row gap-5 -mt-12">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-2xl bg-white shadow-lg overflow-hidden border-4 border-white">
                {agent.avatar_url ? (
                  <img src={agent.avatar_url} alt={agent.agent_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Building2 className="w-12 h-12 text-white" />
                  </div>
                )}
              </div>
              
              {/* Info */}
              <div className="flex-1 pt-2">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-800">{agent.agent_name}</h1>
                  {agent.is_active && isOpen ? (
                    <Badge className="bg-green-500 text-white px-3 py-1">🟢 Buka</Badge>
                  ) : (
                    <Badge className="bg-red-500 text-white px-3 py-1">🔴 Tutup</Badge>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4 text-green-600" />
                    {agent.service_area}
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4 text-green-600" />
                    {isOpen ? "Sedang Buka" : openStatusMessage}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4 text-green-600" />
                    {agent.total_pickups || 0}+ Penjemputan
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {renderStars(agent.rating || 4.5)}
                    <span className="text-sm font-semibold text-gray-700 ml-1">{agent.rating?.toFixed(1)}</span>
                    <span className="text-xs text-gray-400">({agent.total_reviews || 0} ulasan)</span>
                  </div>
                  <div className="w-px h-4 bg-gray-300" />
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    Bergabung {agent.joined_date}
                  </div>
                </div>
              </div>
              
              {/* Contact Button */}
              <div className="pt-2">
                <Button variant="outline" className="gap-2 rounded-xl">
                  <Phone className="w-4 h-4" />
                  {agent.phone || "Hubungi"}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Price List & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price List */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  Daftar Harga Sampah
                </h2>
                <p className="text-xs text-gray-500 mt-1">Harga per kilogram (kg)</p>
              </div>
              <div className="divide-y divide-gray-100">
                {agent.waste_categories?.map((wasteType) => {
                  const Icon = WASTE_ICONS[wasteType] || Package;
                  const price = getPricePerKg(wasteType);
                  return (
                    <div key={wasteType} className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${WASTE_COLORS[wasteType]}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">{WASTE_LABELS[wasteType] || wasteType}</p>
                          <p className="text-xs text-gray-400">per kilogram</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-green-600">
                          {price.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-400">poin/kg</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                <div>
                  <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-green-600" />
                    Ulasan Pelanggan
                  </h2>
                  <p className="text-xs text-gray-500 mt-1">
                    {reviews.length} ulasan dari pelanggan
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-800">{agent.rating?.toFixed(1)}</p>
                    {renderStars(agent.rating || 4.5)}
                  </div>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {reviews.length === 0 ? (
                  <div className="p-8 text-center text-gray-400">
                    <MessageCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
                    <p>Belum ada ulasan</p>
                    <p className="text-xs mt-1">Jadilah yang pertama memberi ulasan</p>
                  </div>
                ) : (
                  reviews.map((review) => (
                    <div key={review.id} className="p-5 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                          {review.user_avatar ? (
                            <img src={review.user_avatar} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <User className="w-5 h-5 text-gray-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2">
                            <div>
                              <p className="font-semibold text-gray-800">{review.user_name}</p>
                              <div className="flex items-center gap-2 mt-0.5">
                                {renderStars(review.rating)}
                                <span className="text-xs text-gray-400">{formatDate(review.created_at)}</span>
                              </div>
                            </div>
                            {review.pickup_weight && (
                              <Badge variant="outline" className="text-[10px]">
                                {review.pickup_weight} kg
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-2">{review.comment}</p>
                        </div>
                      </div>
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
                  <p className="text-green-100 text-xs mt-1">Isi data sampah yang akan dijemput</p>
                </div>
                
                <form onSubmit={handleSubmit} className="p-5 space-y-5">
                  {/* Alamat */}
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
                      placeholder="Jl. Contoh No. 123, RT 01/RW 02"
                    />
                  </div>

                  {/* Jenis Sampah */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Jenis & Berat Sampah <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-3">
                      {agent.waste_categories?.map((wasteType) => {
                        const price = getPricePerKg(wasteType);
                        const weight = selectedWaste[wasteType] || 0;
                        const points = weight * price;
                        
                        return (
                          <div key={wasteType} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{WASTE_LABELS[wasteType] || wasteType}</p>
                              <p className="text-xs text-gray-400">{price.toLocaleString()} poin/kg</p>
                            </div>
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={weight || ""}
                                onChange={(e) => updateWeight(wasteType, parseFloat(e.target.value) || 0)}
                                className="w-20 px-2 py-2 border border-gray-200 rounded-lg text-center text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                placeholder="kg"
                              />
                              <span className="text-sm text-gray-500">kg</span>
                            </div>
                            <div className="w-16 text-right">
                              <p className="text-sm font-semibold text-green-600">
                                +{points.toLocaleString()}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total */}
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">Total Berat</span>
                      <span className="font-semibold">{totalWeight.toFixed(1)} kg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Total Poin yang Didapat</span>
                      <span className="text-2xl font-bold text-green-600">
                        {totalPoints.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Catatan */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Catatan (Opsional)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                      placeholder="Catatan tambahan untuk agen..."
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    disabled={submitting || totalWeight === 0 || !isOpen}
                    className="w-full py-6 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : !isOpen ? (
                      openStatusMessage || "Agent Sedang Tutup"
                    ) : (
                      <>
                        <Truck className="w-5 h-5 mr-2" />
                        Ajukan Penjemputan
                      </>
                    )}
                  </Button>

                  {/* Info tambahan */}
                  <div className="bg-blue-50 rounded-xl p-3">
                    <div className="flex items-start gap-2">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div className="text-xs text-blue-700">
                        <p>Poin akan masuk ke akun Anda setelah agen menimbang sampah.</p>
                        <p className="mt-1 text-blue-600">Estimasi waktu penjemputan: 1-2 jam setelah dikonfirmasi.</p>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type PageProps = {
  params: Promise<{ id: string }>;
};