"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
  ArrowLeft,
  CheckCircle
} from "lucide-react";
import { Toaster, toast } from "sonner";

type Agent = {
  id: string;
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

export default function AgentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const agentId = params.id;
  const supabase = createClientSupabaseClient();
  
  const [agent, setAgent] = useState<Agent | null>(null);
  const [prices, setPrices] = useState<PriceCatalog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!agentId) {
      router.push("/user/home");
      return;
    }
    fetchData();
  }, [agentId]);

  const fetchData = async () => {
    setLoading(true);
    
    // Ambil data agent
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

    setAgent({
      ...agentData,
      rating: +(4 + Math.random() * 0.9).toFixed(1),
    });

    // Ambil harga
    const { data: priceData } = await supabase
      .from("price_catalog")
      .select("waste_type, price_per_kg");

    setPrices(priceData || []);
    setLoading(false);
  };

  const getPricePerKg = (wasteType: string) => {
    return prices.find(p => p.waste_type === wasteType)?.price_per_kg || 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!agent) {
    return null;
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

        {/* Action Button */}
        <Link href={`/user/request?agentId=${agent.id}`}>
          <button className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2">
            <Truck className="w-5 h-5" />
            Ajukan Penjemputan
          </button>
        </Link>
      </div>
    </div>
  );
}