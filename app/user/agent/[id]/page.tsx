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
  Building2,
  Package,
  Leaf,
  Recycle,
  Truck,
  ArrowLeft,
  Clock,
  CheckCircle,
  Store,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "sonner";

// Next.js 15+ params adalah Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

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

export default function AgentDetailPage({ params }: PageProps) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [agent, setAgent] = useState<Agent | null>(null);
  const [prices, setPrices] = useState<PriceCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [rating] = useState((4 + Math.random() * 0.9).toFixed(1));
  const [distance] = useState((Math.random() * 5 + 0.5).toFixed(1));

  useEffect(() => {
    // Resolve params Promise
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

    setAgent(agentData);

    // Ambil harga
    const { data: priceData } = await supabase
      .from("price_catalog")
      .select("waste_type, price_per_kg");

    setPrices(priceData || []);
    setLoading(false);
  };

  const getPricePerKg = (wasteType: string) => {
    return prices.find((p) => p.waste_type === wasteType)?.price_per_kg || 0;
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

  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <Toaster position="top-right" richColors />

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Kembali</span>
        </button>

        {/* Agent Info Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-6 border border-gray-100">
          {/* Header Banner */}
          <div className="bg-linear-to-r from-green-600 to-green-500 px-6 py-5">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Store className="w-5 h-5 text-white/80" />
                  <span className="text-white/80 text-xs font-medium">
                    Agen Bank Sampah
                  </span>
                </div>
                <h1 className="text-2xl font-bold text-white">
                  {agent.agent_name}
                </h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-0.5">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span className="text-sm text-white font-medium">
                      {rating}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <MapPin className="w-3.5 h-3.5" />
                    {agent.service_area}
                  </div>
                  <div className="flex items-center gap-1 text-white/80 text-sm">
                    <Clock className="w-3.5 h-3.5" />
                    {distance} km dari Anda
                  </div>
                </div>
              </div>
              <Badge
                className={
                  agent.is_active
                    ? "bg-green-400 text-white px-3 py-1"
                    : "bg-gray-400 text-white px-3 py-1"
                }
              >
                {agent.is_active ? "🟢 Buka" : "🔴 Tutup"}
              </Badge>
            </div>
          </div>

          {/* Contact Info */}
          <div className="p-6 border-b border-gray-100 bg-gray-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Nomor Telepon</p>
                  <p className="font-medium text-gray-800">
                    {agent.phone || "Belum tersedia"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400">Alamat Lengkap</p>
                  <p className="font-medium text-gray-800">
                    {agent.address || "Belum tersedia"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Price List Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6 border border-gray-100">
          <div className="px-6 py-4 border-b border-gray-100 bg-linear-to-r from-gray-50 to-white">
            <h2 className="font-bold text-lg text-gray-800">
              💰 Daftar Harga Sampah
            </h2>
            <p className="text-sm text-gray-500">
              Harga per kilogram (kg) yang berlaku
            </p>
          </div>
          <div className="divide-y divide-gray-100">
            {agent.waste_categories?.map((wasteType) => {
              const Icon = WASTE_ICONS[wasteType] || Package;
              const price = getPricePerKg(wasteType);
              return (
                <div
                  key={wasteType}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-xl ${WASTE_COLORS[wasteType]}`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {WASTE_LABELS[wasteType] || wasteType}
                      </p>
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

        {/* Info Card */}
        <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl p-4 mb-6 border border-blue-100">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800">
                💡 Cara Penjemputan
              </p>
              <p className="text-xs text-blue-700 mt-1">
                1. Pilih jenis sampah dan masukkan perkiraan berat
                <br />
                2. Pilih tanggal penjemputan
                <br />
                3. Agen akan menghubungi Anda untuk konfirmasi
                <br />
                4. Poin akan masuk setelah sampah ditimbang
              </p>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/user/request/${agent.id}`}>
          <Button className="w-full py-6 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            <Truck className="w-5 h-5" />
            Ajukan Penjemputan
          </Button>
        </Link>

        {/* Disclaimer */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Pastikan data alamat Anda sudah benar sebelum mengajukan penjemputan
        </p>
      </div>
    </div>
  );
}
