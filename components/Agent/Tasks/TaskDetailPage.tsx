"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Package,
  Calendar,
  User,
  Phone,
  Weight,
  Tag,
  AlertCircle,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Toaster, toast } from "sonner";

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

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  pending: {
    label: "Menunggu",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    icon: Clock,
  },
  accepted: {
    label: "Diproses",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: Truck,
  },
  picked_up: {
    label: "Dijemput",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    icon: Package,
  },
  completed: {
    label: "Selesai",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle,
  },
  cancelled: {
    label: "Dibatalkan",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
  rejected: {
    label: "Ditolak",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
  },
};

export default function AgentTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<any>(null);
  const [customerProfile, setCustomerProfile] = useState<any>(null);
  const [completing, setCompleting] = useState(false);
  const [actualWeight, setActualWeight] = useState("");
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const id = params?.id as string;

  useEffect(() => {
    if (id) fetchTask();
  }, [id]);

  const fetchTask = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: agentData } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", user.id)
        .single();

      const { data: taskData, error } = await supabase
        .from("pickup_requests")
        .select("*")
        .eq("id", id)
        .eq("agent_id", agentData?.id)
        .single();

      if (error || !taskData) {
        toast.error("Tugas tidak ditemukan");
        router.back();
        return;
      }

      setTask(taskData);

      // Get customer profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, address")
        .eq("user_id", taskData.user_id)
        .single();

      setCustomerProfile(profile);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    const weight = parseFloat(actualWeight);
    if (isNaN(weight) || weight <= 0) {
      toast.error("Masukkan berat aktual yang valid");
      return;
    }

    setCompleting(true);
    try {
      // Get price per kg for this waste type
      const { data: priceData } = await supabase
        .from("price_catalog")
        .select("price_per_kg")
        .eq("waste_type", task.waste_type)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      const pointsPerKg = priceData?.price_per_kg || 100;
      const totalPoints = Math.floor(weight * pointsPerKg);

      // 1. Update pickup request
      const { error: updateError } = await supabase
        .from("pickup_requests")
        .update({
          status: "completed",
          actual_weight: weight,
          total_points: totalPoints,
          completed_at: new Date().toISOString(),
        })
        .eq("id", task.id);

      if (updateError) throw updateError;

      // 2. Add points to user's balance
      const { data: userProfile } = await supabase
        .from("profiles")
        .select("balance_points")
        .eq("user_id", task.user_id)
        .single();

      const currentPoints = userProfile?.balance_points || 0;
      await supabase
        .from("profiles")
        .update({ balance_points: currentPoints + totalPoints })
        .eq("user_id", task.user_id);

      // 3. Create notification for user
      await supabase.from("notifications").insert({
        user_id: task.user_id,
        type: "pickup_completed",
        title: "Penjemputan Selesai! ✅",
        message: `Penjemputan sampah ${WASTE_LABELS[task.waste_type] || task.waste_type} seberat ${weight} kg telah selesai. Anda mendapat +${totalPoints.toLocaleString()} poin!`,
        metadata: {
          pickup_request_id: task.id,
          points_earned: totalPoints,
          weight: weight,
        },
        is_read: false,
      });

      toast.success(
        `Tugas selesai! User mendapat +${totalPoints.toLocaleString()} poin`
      );
      setShowCompleteModal(false);
      await fetchTask();
    } catch (err: any) {
      toast.error("Gagal menyelesaikan tugas: " + err?.message);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!task) return null;

  const statusConfig = STATUS_CONFIG[task.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const date = new Date(task.created_at);
  const wasteLabel = WASTE_LABELS[task.waste_type] || task.waste_type;

  let estimatedWeight = task.estimated_weight;
  if (typeof estimatedWeight === "object") {
    estimatedWeight = Object.values(estimatedWeight as Record<string, number>).reduce(
      (a: number, b: number) => a + b,
      0
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      <Toaster position="top-right" richColors />

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Daftar Tugas
      </button>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Detail Tugas</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            #{task.id?.slice(0, 12)}
          </p>
        </div>
        <Badge
          className={`${statusConfig.bg} ${statusConfig.color} border px-3 py-1`}
        >
          <StatusIcon className="w-3.5 h-3.5 mr-1" />
          {statusConfig.label}
        </Badge>
      </div>

      {/* Status Banner */}
      <div
        className={`rounded-2xl p-4 border ${statusConfig.bg} flex items-center gap-3`}
      >
        <StatusIcon className={`w-5 h-5 ${statusConfig.color} shrink-0`} />
        <p className={`text-sm ${statusConfig.color}`}>
          {task.status === "pending" && "Menunggu tindakan Anda"}
          {task.status === "accepted" && "Dalam proses penjemputan"}
          {task.status === "completed" && "Tugas telah selesai"}
          {task.status === "rejected" && `Ditolak: ${task.rejection_reason || "-"}`}
          {task.status === "cancelled" && "Tugas dibatalkan"}
        </p>
      </div>

      {/* Customer Info */}
      {customerProfile && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Informasi Pelanggan
          </h3>
          <div className="space-y-2">
            <div className="flex justify-between py-2 border-b text-sm">
              <span className="text-gray-500">Nama</span>
              <span className="font-semibold text-gray-800">
                {customerProfile.full_name || "Tidak diketahui"}
              </span>
            </div>
            {customerProfile.phone && (
              <div className="flex justify-between py-2 border-b text-sm">
                <span className="text-gray-500 flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" /> Telepon
                </span>
                <a
                  href={`tel:${customerProfile.phone}`}
                  className="font-semibold text-primary hover:underline"
                >
                  {customerProfile.phone}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Waste & Location */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
        <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-2">
          <Package className="w-4 h-4 text-primary" />
          Detail Penjemputan
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between py-2 border-b text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Jenis Sampah
            </span>
            <span className="font-semibold text-gray-800">{wasteLabel}</span>
          </div>
          <div className="flex justify-between py-2 border-b text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              <Weight className="w-3.5 h-3.5" /> Estimasi Berat
            </span>
            <span className="font-semibold text-gray-800">
              {typeof estimatedWeight === "number"
                ? `${estimatedWeight} kg`
                : "-"}
            </span>
          </div>
          {task.actual_weight && (
            <div className="flex justify-between py-2 border-b text-sm">
              <span className="text-gray-500">Berat Aktual</span>
              <span className="font-bold text-primary">
                {task.actual_weight} kg
              </span>
            </div>
          )}
          <div className="py-2 border-b text-sm">
            <p className="text-gray-500 flex items-center gap-1 mb-1">
              <MapPin className="w-3.5 h-3.5" /> Alamat Penjemputan
            </p>
            <p className="font-semibold text-gray-800 mt-1">
              {task.pickup_address}
            </p>
          </div>
          {task.notes && (
            <div className="py-2 border-b text-sm">
              <p className="text-gray-500 mb-1">Catatan</p>
              <p className="text-gray-800">{task.notes}</p>
            </div>
          )}
          <div className="flex justify-between py-2 text-sm">
            <span className="text-gray-500 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Waktu Dibuat
            </span>
            <span className="text-gray-700">
              {date.toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}{" "}
              {date.toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Points earned on complete */}
      {task.status === "completed" && task.total_points && (
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-5 text-white">
          <p className="text-white/70 text-sm mb-1">Poin Diberikan ke User</p>
          <p className="text-3xl font-bold">
            +{task.total_points.toLocaleString()} poin
          </p>
        </div>
      )}

      {/* Action: Complete Task */}
      {task.status === "accepted" && (
        <button
          onClick={() => setShowCompleteModal(true)}
          className="w-full py-3.5 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5" />
          Selesaikan Tugas
        </button>
      )}

      {/* Complete Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Selesaikan Tugas</h3>
              <button
                onClick={() => setShowCompleteModal(false)}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-sm text-gray-600 mb-4">
              Masukkan berat aktual sampah yang dijemput untuk menghitung poin
              yang akan diberikan ke pelanggan.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Berat Aktual (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={actualWeight}
                  onChange={(e) => setActualWeight(e.target.value)}
                  className="w-full px-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  placeholder="Contoh: 2.5"
                  autoFocus
                />
              </div>

              {actualWeight && parseFloat(actualWeight) > 0 && (
                <div className="bg-primary/5 rounded-xl p-3 text-sm">
                  <p className="text-primary font-semibold">
                    Estimasi Poin: ~{Math.floor(parseFloat(actualWeight) * 100).toLocaleString()} pts
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    (Berdasarkan harga katalog)
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowCompleteModal(false)}
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleComplete}
                disabled={completing || !actualWeight || parseFloat(actualWeight) <= 0}
                className="flex-1 px-4 py-2.5 bg-primary text-white rounded-xl text-sm hover:bg-primary/90 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {completing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    Konfirmasi Selesai
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
