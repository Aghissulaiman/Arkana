"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import {
  Loader2,
  ArrowLeft,
  Star,
  MapPin,
  Phone,
  Package,
  CheckCircle,
  Clock,
  Truck,
  Award,
  MessageCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

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

export default function AgentPublicProfilePage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [agent, setAgent] = useState<any>(null);
  const [agentProfile, setAgentProfile] = useState<any>(null);
  const [stats, setStats] = useState({
    totalCompleted: 0,
    avgRating: 4.8,
    totalKg: 0,
    responseTime: "< 1 jam",
  });
  const [priceCatalog, setPriceCatalog] = useState<any[]>([]);

  const agentId = params?.agentId as string;

  useEffect(() => {
    if (agentId) fetchAgentProfile();
  }, [agentId]);

  const fetchAgentProfile = async () => {
    setLoading(true);
    try {
      // Fetch agent data
      const { data: agentData, error } = await supabase
        .from("agents")
        .select("*")
        .eq("id", agentId)
        .single();

      if (error || !agentData) {
        setLoading(false);
        return;
      }

      setAgent(agentData);

      // Fetch agent's user profile
      if (agentData.user_id) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone, address")
          .eq("user_id", agentData.user_id)
          .single();

        setAgentProfile(profile);
      }

      // Fetch completed pickups stats
      const { data: completedPickups, error: statsError } = await supabase
        .from("pickup_requests")
        .select("estimated_weight, actual_weight")
        .eq("agent_id", agentId)
        .eq("status", "completed");

      if (!statsError && completedPickups) {
        let totalKg = 0;
        completedPickups.forEach((p) => {
          const w = p.actual_weight || p.estimated_weight;
          if (typeof w === "number") totalKg += w;
          else if (typeof w === "object") {
            totalKg += Object.values(w as Record<string, number>).reduce(
              (a: number, b: number) => a + b,
              0
            );
          }
        });

        setStats((prev) => ({
          ...prev,
          totalCompleted: completedPickups.length,
          totalKg: Math.round(totalKg),
        }));
      }

      // Fetch price catalog for this agent
      const { data: prices } = await supabase
        .from("price_catalog")
        .select("waste_type, price_per_kg")
        .or(`agent_id.eq.${agentId},agent_id.is.null`)
        .order("price_per_kg", { ascending: false });

      if (prices) {
        // Deduplicate - prefer agent-specific prices
        const merged: Record<string, any> = {};
        prices.forEach((p) => {
          if (!merged[p.waste_type] || p.agent_id) {
            merged[p.waste_type] = p;
          }
        });
        setPriceCatalog(Object.values(merged).slice(0, 8));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-400">Profil agen tidak ditemukan</p>
        <button
          onClick={() => router.back()}
          className="mt-4 text-primary hover:underline text-sm"
        >
          Kembali
        </button>
      </div>
    );
  }

  const displayName =
    agent.agent_name || agentProfile?.full_name || "Agen";
  const phone = agentProfile?.phone || agent.phone || "-";
  const area = agent.area_operational || agentProfile?.address || "Area tidak diset";

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali
      </button>

      {/* Agent Header Card */}
      <div className="bg-gradient-to-br from-primary to-primary/70 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-20 h-20 bg-white/20 rounded-2xl flex items-center justify-center text-3xl font-black">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{displayName}</h1>
            <div className="flex items-center gap-1.5 mt-1">
              <Star className="w-4 h-4 text-amber-300 fill-amber-300" />
              <span className="text-white/90 text-sm font-semibold">
                {stats.avgRating}
              </span>
              <span className="text-white/60 text-xs">rating</span>
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <MapPin className="w-3.5 h-3.5 text-white/60" />
              <span className="text-white/80 text-sm">{area}</span>
            </div>
          </div>
          <Badge className="bg-white/20 text-white border-0">
            ✅ Aktif
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle className="w-5 h-5 text-primary" />
          </div>
          <p className="text-2xl font-bold text-gray-800">
            {stats.totalCompleted}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Penjemputan</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Package className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-800">{stats.totalKg}</p>
          <p className="text-xs text-gray-400 mt-0.5">kg Sampah</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-2">
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <p className="text-lg font-bold text-gray-800">{stats.responseTime}</p>
          <p className="text-xs text-gray-400 mt-0.5">Respons</p>
        </div>
      </div>

      {/* Contact Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h2 className="font-semibold text-gray-800 text-sm">
          Informasi Kontak
        </h2>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
              <Phone className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Nomor Telepon</p>
              <p className="text-sm font-semibold text-gray-800">{phone}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-gray-500" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Area Layanan</p>
              <p className="text-sm font-semibold text-gray-800">{area}</p>
            </div>
          </div>
          {agent.vehicle_plate && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gray-50 rounded-lg flex items-center justify-center">
                <Truck className="w-4 h-4 text-gray-500" />
              </div>
              <div>
                <p className="text-xs text-gray-400">Plat Kendaraan</p>
                <p className="text-sm font-semibold text-gray-800">
                  {agent.vehicle_plate}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Price Catalog */}
      {priceCatalog.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h2 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <Award className="w-4 h-4 text-primary" />
            Daftar Harga Sampah
          </h2>
          <div className="space-y-2">
            {priceCatalog.map((price) => (
              <div
                key={price.waste_type}
                className="flex justify-between items-center py-2 border-b last:border-0"
              >
                <span className="text-sm text-gray-700">
                  {WASTE_LABELS[price.waste_type] || price.waste_type}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-bold text-primary">
                    {price.price_per_kg.toLocaleString("id-ID")}
                  </span>
                  <span className="text-xs text-gray-400">poin/kg</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Button */}
      <button
        onClick={() => router.push(`/user/request/${agentId}`)}
        className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
      >
        <Truck className="w-5 h-5" />
        Ajukan Penjemputan ke Agen Ini
      </button>
    </div>
  );
}
