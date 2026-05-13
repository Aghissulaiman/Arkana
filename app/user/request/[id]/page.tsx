"use client";

import { useState, useEffect, use } from "react"; // ← tambahkan use
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
  Calendar,
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";

// params adalah Promise di Next.js 16
type PageProps = {
  params: Promise<{ id: string }>;
};

type Agent = {
  id: string;
  agent_name: string;
  phone: string;
  address: string;
  service_area: string;
  waste_categories: string[];
  is_active: boolean;
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
  plastic: "bg-blue-100 text-blue-800",
  paper: "bg-amber-100 text-amber-800",
  cardboard: "bg-orange-100 text-orange-800",
  glass: "bg-emerald-100 text-emerald-800",
  aluminium: "bg-slate-100 text-slate-800",
  metal: "bg-gray-100 text-gray-800",
  electronic: "bg-purple-100 text-purple-800",
  mixed: "bg-slate-100 text-slate-800",
};

export default function RequestPickupPage({ params }: PageProps) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  
  // UNWRAP params dengan use()
  const { id: agentId } = use(params);
  
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

  useEffect(() => {
    if (!agentId) return;
    fetchData();
  }, [agentId]);

  const fetchData = async () => {
    if (!agentId) return;
    
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
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

    const { data: agentData, error: agentError } = await supabase
      .from("agents")
      .select("*")
      .eq("id", agentId)
      .single();

    if (agentError || !agentData) {
      toast.error("Agent tidak ditemukan");
      router.push("/user/home");
      return;
    }

    setAgent(agentData);

    const initialSelected: Record<string, number> = {};
    agentData.waste_categories?.forEach((w: string) => {
      initialSelected[w] = 0;
    });
    setSelectedWaste(initialSelected);

    const { data: priceData } = await supabase
      .from("price_catalog")
      .select("waste_type, price_per_kg");

    setPrices(priceData || []);
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
    
    const { error: requestError } = await supabase
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
  const rating = (4 + Math.random() * 0.9).toFixed(1);
  const distance = (Math.random() * 5 + 0.5).toFixed(1);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Kembali</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-100">
          <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-5">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white">{agent.agent_name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm text-white font-medium">{rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {agent.service_area}
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    📍 {distance} km
                  </div>
                </div>
              </div>
              <Badge className={agent.is_active ? "bg-green-400 text-white px-3 py-1" : "bg-gray-400 text-white px-3 py-1"}>
                {agent.is_active ? "🟢 Buka" : "🔴 Tutup"}
              </Badge>
            </div>
          </div>
          
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-xs text-gray-400">Nomor Telepon Agent</p>
                <p className="font-medium text-gray-800">{agent.phone || "Belum tersedia"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="font-bold text-lg text-gray-800">💰 Daftar Harga Sampah</h2>
            <p className="text-sm text-gray-500">Harga per kilogram (kg)</p>
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
                      <p className="text-xs text-gray-400">per kg</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      {price.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-400">poin</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h2 className="font-bold text-lg text-gray-800">📝 Form Penjemputan</h2>
            <p className="text-sm text-gray-500">Isi data sampah yang akan dijemput</p>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat Penjemputan <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                rows={2}
                value={userAddress}
                onChange={(e) => setUserAddress(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Jl. Contoh No. 123, RT 01/RW 02"
              />
            </div>

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
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Catatan tambahan untuk agen..."
              />
            </div>

            <Button
              type="submit"
              disabled={submitting || totalWeight === 0}
              className="w-full py-6 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Truck className="w-5 h-5" />
              )}
              {submitting ? "Memproses..." : "Ajukan Penjemputan"}
            </Button>
          </form>
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mt-6 border border-blue-100">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">💡 Informasi</p>
              <p className="text-xs text-blue-700 mt-1">
                Poin akan masuk ke akun Anda setelah agen mengonfirmasi dan menimbang sampah.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}