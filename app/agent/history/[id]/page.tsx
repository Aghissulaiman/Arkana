"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Weight,
  Package,
  User,
  Phone,
  CheckCircle2,
  Truck,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toaster } from "sonner";

type PickupDetail = {
  id: string;
  request_code: string;
  user_name: string;
  user_phone: string;
  user_address: string;
  waste_type: string;
  estimated_weight: number;
  actual_weight: number;
  points_earned: number;
  status: string;
  notes: string;
  created_at: string;
  completed_at: string;
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

const STATUS_STYLES: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  accepted: { label: "Diproses", color: "bg-blue-100 text-blue-700", icon: Truck },
  picked_up: { label: "Dijemput", color: "bg-purple-100 text-purple-700", icon: Package },
  completed: { label: "Selesai", color: "bg-green-100 text-green-700", icon: CheckCircle2 },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function AgentHistoryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [pickup, setPickup] = useState<PickupDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setError(true);
        setLoading(false);
        return;
      }

      const { data: pickupData, error: pickupError } = await supabase
        .from("pickup_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (pickupError || !pickupData) {
        setError(true);
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("user_id", pickupData.user_id)
        .single();

      setPickup({
        id: pickupData.id,
        request_code: pickupData.request_code || pickupData.id.slice(0, 8),
        user_name: profile?.full_name || "Pengguna",
        user_phone: profile?.phone || "-",
        user_address: pickupData.pickup_address || profile?.address || "-",
        waste_type: pickupData.waste_type,
        estimated_weight: pickupData.estimated_weight || 0,
        actual_weight: pickupData.actual_weight || 0,
        points_earned: pickupData.points_earned || 0,
        status: pickupData.status,
        notes: pickupData.notes || "-",
        created_at: pickupData.created_at,
        completed_at: pickupData.completed_at,
      });
    } catch (error) {
      console.error("Failed to fetch detail:", error);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (error || !pickup) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          Data Tidak Ditemukan
        </h2>
        <p className="text-gray-400 mb-4">
          Riwayat penjemputan tidak tersedia
        </p>
        <Link
          href="/agent/history"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Kembali ke Riwayat
        </Link>
      </div>
    );
  }

  const statusStyle = STATUS_STYLES[pickup.status] || STATUS_STYLES.pending;
  const StatusIcon = statusStyle.icon;

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Detail Penjemputan
            </h1>
            <p className="text-xs text-gray-500 font-mono">
              ID: {pickup.request_code}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${statusStyle.color}`}>
              <StatusIcon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Status Penjemputan</p>
              <p className="text-lg font-semibold text-gray-800">
                {statusStyle.label}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-4 h-4 text-green-600" />
              Informasi Pelanggan
            </h2>
          </div>
          <div className="p-5 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {pickup.user_name}
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Phone className="w-3 h-3" />
                  {pickup.user_phone}
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
              <p className="text-sm text-gray-600 flex-1">{pickup.user_address}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <Package className="w-4 h-4 text-green-600" />
              Detail Penjemputan
            </h2>
          </div>
          <div className="divide-y divide-gray-100">
            <div className="flex justify-between items-center p-5">
              <span className="text-sm text-gray-500">Jenis Sampah</span>
              <Badge variant="outline" className="text-sm">
                {WASTE_LABELS[pickup.waste_type] || pickup.waste_type}
              </Badge>
            </div>
            <div className="flex justify-between items-center p-5">
              <span className="text-sm text-gray-500">Estimasi Berat</span>
              <span className="font-medium text-gray-800">
                {pickup.estimated_weight.toFixed(1)} kg
              </span>
            </div>
            {pickup.status === "completed" && (
              <>
                <div className="flex justify-between items-center p-5">
                  <span className="text-sm text-gray-500">Berat Aktual</span>
                  <span className="font-medium text-green-600">
                    {pickup.actual_weight.toFixed(1)} kg
                  </span>
                </div>
                <div className="flex justify-between items-center p-5">
                  <span className="text-sm text-gray-500">Poin Diberikan</span>
                  <span className="text-lg font-bold text-green-600">
                    +{pickup.points_earned.toLocaleString()}
                  </span>
                </div>
              </>
            )}
            <div className="flex justify-between items-center p-5">
              <span className="text-sm text-gray-500">Tanggal Permintaan</span>
              <div className="text-right">
                <p className="text-sm text-gray-800">{formatDate(pickup.created_at)}</p>
                <p className="text-xs text-gray-400">{formatTime(pickup.created_at)}</p>
              </div>
            </div>
            {pickup.completed_at && (
              <div className="flex justify-between items-center p-5">
                <span className="text-sm text-gray-500">Tanggal Selesai</span>
                <div className="text-right">
                  <p className="text-sm text-gray-800">{formatDate(pickup.completed_at)}</p>
                  <p className="text-xs text-gray-400">{formatTime(pickup.completed_at)}</p>
                </div>
              </div>
            )}
            {pickup.notes && pickup.notes !== "-" && (
              <div className="p-5">
                <span className="text-sm text-gray-500 block mb-2">Catatan</span>
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                  {pickup.notes}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-center pt-4">
          <Link href="/agent/history">
            <Button variant="outline" className="gap-2">
              <ArrowLeft className="w-4 h-4" />
              Kembali ke Riwayat
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}