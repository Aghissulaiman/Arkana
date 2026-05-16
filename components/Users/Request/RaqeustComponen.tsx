"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { 
  Loader2, 
  MapPin, 
  Star, 
  Phone, 
  Building2,
  Package,
  Leaf,
  Recycle,
  Truck,
  Calendar,
  Clock,
  Send,
  CheckCircle,
  XCircle,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Agent = {
  id: string;
  user_id: string;
  agent_name: string;
  phone: string;
  address: string;
  service_area: string;
  waste_categories: string[];
  is_active: boolean;
  rating: number;
};

type PriceCatalog = {
  waste_type: string;
  price_per_kg: number;
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

export default function RequestPickupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const agentId = searchParams.get("agentId");
  const supabase = createClientSupabaseClient();
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [prices, setPrices] = useState<PriceCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userAddress, setUserAddress] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userName, setUserName] = useState("");
  const [selectedWaste, setSelectedWaste] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [pickupTime, setPickupTime] = useState("");

  useEffect(() => {
    if (!agentId) {
      console.warn("Client-side redirect suppressed; missing agentId param");
      return;
    }
    fetchData();
  }, [agentId]);

  const fetchData = async () => {
    setLoading(true);
    
    // Ambil data user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.warn("Client-side login redirect suppressed; middleware enforces auth");
      setLoading(false);
      return;
    }

    // Ambil profile user
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

    setAgent({
      ...agentData,
      rating: +(4 + Math.random() * 0.9).toFixed(1),
    });

    // Ambil harga dari price_catalog
    const { data: priceData } = await supabase
      .from("price_catalog")
      .select("waste_type, price_per_kg");

    setPrices(priceData || []);

    // Initialize selected waste
    const initialSelected: Record<string, number> = {};
    agentData.waste_categories?.forEach((w: string) => {
      initialSelected[w] = 0;
    });
    setSelectedWaste(initialSelected);

    setLoading(false);
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

    if (!pickupDate) {
      toast.error("Pilih tanggal penjemputan");
      return;
    }

    setSubmitting(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    // Buat request pickup
    const { data: request, error: requestError } = await supabase
      .from("pickup_requests")
      .insert({
        user_id: user?.id,
        agent_id: agentId,
        waste_type: Object.keys(selectedWaste).filter(w => selectedWaste[w] > 0)[0] || "mixed",
        estimated_weight: totalWeight,
        pickup_address: userAddress,
        notes: notes,
        status: "pending",
        pickup_date: pickupDate,
      })
      .select()
      .single();

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
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Kembali</span>
        </button>

        {/* Agent Info Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-xl font-bold text-white">{agent.agent_name}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm text-white">{agent.rating}</span>
                  </div>
                  <span className="text-white/50">|</span>
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <MapPin className="w-3 h-3" />
                    {agent.service_area}
                  </div>
                </div>
              </div>
              <Badge className="bg-green-400 text-white">
                {agent.is_active ? "Buka" : "Tutup"}
              </Badge>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Nomor Telepon</p>
                <p className="font-medium">{agent.phone || "-"}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Alamat Lengkap</p>
                <p className="font-medium">{agent.address || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Price List Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-lg">💰 Daftar Harga Sampah</h2>
            <p className="text-sm text-gray-500">Harga per kilogram (kg)</p>
          </div>
          <div className="divide-y divide-gray-100">
            {agent.waste_categories?.map((wasteType) => {
              const Icon = WASTE_ICONS[wasteType] || Package;
              const price = getPricePerKg(wasteType);
              return (
                <div key={wasteType} className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${WASTE_COLORS[wasteType]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">{WASTE_LABELS[wasteType] || wasteType}</p>
                      <p className="text-xs text-gray-400">per kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600">
                      {price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">poin</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Request Form */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-bold text-lg">📝 Form Penjemputan</h2>
            <p className="text-sm text-gray-500">Isi data sampah yang akan dijemput</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            {/* User Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Penjemputan <span className="text-red-500">*</span>
              </label>
              <div className="flex items-start gap-2">
                <textarea
                  required
                  rows={2}
                  value={userAddress}
                  onChange={(e) => setUserAddress(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Jl. Contoh No. 123, RT 01/RW 02"
                />
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {!userAddress && "⚠️ Lengkapi alamat di profil untuk penjemputan"}
              </p>
            </div>

            {/* Waste Items */}
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
                    <div key={wasteType} className="flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1 min-w-[100px]">
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
                          className="w-24 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder="kg"
                        />
                        <span className="text-sm text-gray-500">kg</span>
                      </div>
                      <div className="w-24 text-right">
                        <p className="text-sm font-semibold text-green-600">
                          +{points.toLocaleString()}
                        </p>
                        <p className="text-[10px] text-gray-400">poin</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Total Points */}
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

            {/* Pickup Schedule */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Penjemputan <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="date"
                    required
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Catatan (Opsional)
                </label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Catatan tambahan..."
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting || totalWeight === 0}
              className={`w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
                totalWeight > 0
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Truck className="w-5 h-5" />
              )}
              {submitting ? "Memproses..." : "Ajukan Penjemputan"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}