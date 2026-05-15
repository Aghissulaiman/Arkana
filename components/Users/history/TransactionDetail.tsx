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
  Gift,
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

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: any; description: string }
> = {
  pending: {
    label: "Menunggu",
    color: "text-yellow-700",
    bg: "bg-yellow-50 border-yellow-200",
    icon: Clock,
    description: "Permintaan sedang menunggu konfirmasi dari agen",
  },
  accepted: {
    label: "Diterima",
    color: "text-blue-700",
    bg: "bg-blue-50 border-blue-200",
    icon: Truck,
    description: "Agen sedang dalam perjalanan ke lokasi Anda",
  },
  picked_up: {
    label: "Dijemput",
    color: "text-purple-700",
    bg: "bg-purple-50 border-purple-200",
    icon: Package,
    description: "Sampah sedang dalam proses pengangkutan",
  },
  completed: {
    label: "Selesai",
    color: "text-green-700",
    bg: "bg-green-50 border-green-200",
    icon: CheckCircle,
    description: "Penjemputan sampah telah selesai",
  },
  cancelled: {
    label: "Dibatalkan",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    description: "Penjemputan ini telah dibatalkan",
  },
  rejected: {
    label: "Ditolak",
    color: "text-red-700",
    bg: "bg-red-50 border-red-200",
    icon: XCircle,
    description: "Permintaan penjemputan ditolak oleh agen",
  },
};

const TIMELINE = [
  { status: "pending", label: "Permintaan Dibuat" },
  { status: "accepted", label: "Diterima Agen" },
  { status: "picked_up", label: "Sampah Dijemput" },
  { status: "completed", label: "Selesai" },
];

export default function TransactionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [transaction, setTransaction] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const id = params?.id as string;

  useEffect(() => {
    if (id) fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Check if it's a pickup request
      const { data: pickupData, error: pickupError } = await supabase
        .from("pickup_requests")
        .select(
          `
          *,
          agents (agent_name, area_operational)
        `
        )
        .eq("id", id)
        .single();

      if (pickupData && !pickupError) {
        // Get agent profile info
        let agentProfile = null;
        if (pickupData.agent_id) {
          const { data: agentUser } = await supabase
            .from("agents")
            .select("user_id, agent_name")
            .eq("id", pickupData.agent_id)
            .single();

          if (agentUser?.user_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("full_name, phone")
              .eq("user_id", agentUser.user_id)
              .single();
            agentProfile = profile;
          }
        }

        setTransaction({
          type: "pickup",
          ...pickupData,
          agent_profile: agentProfile,
          agent_name:
            pickupData.agents?.agent_name ||
            agentProfile?.full_name ||
            "Agen tidak diketahui",
          agent_phone: agentProfile?.phone || "-",
        });
        setLoading(false);
        return;
      }

      // Check if it's a redeem request
      const { data: redeemData, error: redeemError } = await supabase
        .from("redeem_requests")
        .select("*")
        .eq("id", id)
        .single();

      if (redeemData && !redeemError) {
        setTransaction({ type: "redeem", ...redeemData });
        setLoading(false);
        return;
      }

      setError("Transaksi tidak ditemukan");
    } catch (err) {
      console.error(err);
      setError("Terjadi kesalahan saat memuat data");
    } finally {
      setLoading(false);
    }
  };

  const getTimelineStep = (status: string) => {
    const steps = ["pending", "accepted", "picked_up", "completed"];
    return steps.indexOf(status);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !transaction) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-700 mb-2">
          {error || "Transaksi tidak ditemukan"}
        </h2>
        <button
          onClick={() => router.back()}
          className="mt-4 px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90"
        >
          Kembali
        </button>
      </div>
    );
  }

  const statusConfig =
    STATUS_CONFIG[transaction.status] || STATUS_CONFIG.pending;
  const StatusIcon = statusConfig.icon;
  const date = new Date(transaction.created_at);
  const updatedDate = transaction.updated_at
    ? new Date(transaction.updated_at)
    : null;
  const currentStep = getTimelineStep(transaction.status);

  if (transaction.type === "redeem") {
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        {/* Status Banner */}
        <div
          className={`rounded-2xl p-5 border ${statusConfig.bg} flex items-start gap-4`}
        >
          <div className="w-12 h-12 rounded-full bg-white/70 flex items-center justify-center shrink-0">
            <Gift className={`w-6 h-6 ${statusConfig.color}`} />
          </div>
          <div>
            <p className={`font-bold text-lg ${statusConfig.color}`}>
              Penukaran Poin
            </p>
            <p className={`text-sm ${statusConfig.color} opacity-80`}>
              Status: {statusConfig.label}
            </p>
          </div>
        </div>

        {/* Reward Info */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <h3 className="font-bold text-gray-800 text-lg">Detail Penukaran</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-500">Hadiah</span>
              <span className="text-sm font-semibold text-gray-800">
                {transaction.reward_name}
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-500">Poin Digunakan</span>
              <span className="text-sm font-bold text-orange-600">
                -{transaction.points_spent?.toLocaleString()} pts
              </span>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-500">Status</span>
              <Badge
                className={`${statusConfig.bg} ${statusConfig.color} border-0`}
              >
                {statusConfig.label}
              </Badge>
            </div>
            <div className="flex justify-between py-2 border-b">
              <span className="text-sm text-gray-500">Tanggal</span>
              <span className="text-sm text-gray-700">
                {date.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-sm text-gray-500">ID Transaksi</span>
              <span className="text-xs font-mono text-gray-500">
                #{transaction.id?.slice(0, 12)}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Pickup request detail
  const wasteType = transaction.waste_type;
  const wasteLabel = WASTE_LABELS[wasteType] || wasteType;
  const weight =
    transaction.actual_weight ||
    (typeof transaction.estimated_weight === "object"
      ? Object.values(transaction.estimated_weight as Record<string, number>).reduce(
          (a: number, b: number) => a + b,
          0
        )
      : transaction.estimated_weight) ||
    0;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 space-y-5">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Kembali ke Riwayat
      </button>

      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Detail Penjemputan</h1>
          <p className="text-xs text-gray-400 font-mono mt-1">
            #{transaction.id?.slice(0, 12)}
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
        className={`rounded-2xl p-4 border ${statusConfig.bg} flex items-start gap-3`}
      >
        <StatusIcon className={`w-5 h-5 ${statusConfig.color} mt-0.5 shrink-0`} />
        <p className={`text-sm ${statusConfig.color}`}>
          {statusConfig.description}
          {transaction.rejection_reason && (
            <span className="block mt-1 font-medium">
              Alasan: {transaction.rejection_reason}
            </span>
          )}
        </p>
      </div>

      {/* Timeline */}
      {transaction.status !== "rejected" &&
        transaction.status !== "cancelled" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="font-semibold text-gray-800 mb-4 text-sm">
              Progress Penjemputan
            </h3>
            <div className="relative">
              <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-100" />
              {TIMELINE.map((step, idx) => {
                const isDone = currentStep >= idx;
                const isCurrent = currentStep === idx;
                return (
                  <div
                    key={step.status}
                    className="flex items-center gap-4 mb-4 last:mb-0"
                  >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-2 shrink-0 ${
                        isDone
                          ? isCurrent
                            ? "bg-primary border-primary text-white"
                            : "bg-primary/20 border-primary text-primary"
                          : "bg-white border-gray-200 text-gray-300"
                      }`}
                    >
                      {isDone ? (
                        isCurrent ? (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        ) : (
                          <CheckCircle className="w-5 h-5" />
                        )
                      ) : (
                        <div className="w-3 h-3 bg-gray-200 rounded-full" />
                      )}
                    </div>
                    <div>
                      <p
                        className={`text-sm font-semibold ${
                          isDone ? "text-gray-800" : "text-gray-400"
                        }`}
                      >
                        {step.label}
                      </p>
                      {isDone && isCurrent && (
                        <p className="text-xs text-primary">Sedang berlangsung</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      {/* Waste & Location Info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
        <h3 className="font-semibold text-gray-800 text-sm">
          Informasi Sampah
        </h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3 py-2 border-b">
            <Tag className="w-4 h-4 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Jenis Sampah</p>
              <p className="text-sm font-semibold text-gray-800">{wasteLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2 border-b">
            <Weight className="w-4 h-4 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">
                {transaction.actual_weight
                  ? "Berat Aktual"
                  : "Estimasi Berat"}
              </p>
              <p className="text-sm font-semibold text-gray-800">
                {typeof weight === "number" ? weight.toFixed(1) : weight} kg
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 py-2 border-b">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Alamat Penjemputan</p>
              <p className="text-sm font-semibold text-gray-800">
                {transaction.pickup_address}
              </p>
            </div>
          </div>
          {transaction.notes && (
            <div className="flex items-start gap-3 py-2 border-b">
              <Package className="w-4 h-4 text-gray-400 mt-0.5" />
              <div className="flex-1">
                <p className="text-xs text-gray-400">Catatan</p>
                <p className="text-sm text-gray-800">{transaction.notes}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-3 py-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <div className="flex-1">
              <p className="text-xs text-gray-400">Tanggal Permintaan</p>
              <p className="text-sm font-semibold text-gray-800">
                {date.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}{" "}
                •{" "}
                {date.toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Info */}
      {transaction.agent_name && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
          <h3 className="font-semibold text-gray-800 text-sm">
            Informasi Agen
          </h3>
          <div className="flex items-center gap-3 py-2 border-b">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Nama Agen</p>
              <p className="text-sm font-semibold text-gray-800">
                {transaction.agent_name}
              </p>
            </div>
          </div>
          {transaction.agent_phone && transaction.agent_phone !== "-" && (
            <div className="flex items-center gap-3 py-2">
              <Phone className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-xs text-gray-400">Nomor Telepon</p>
                <p className="text-sm font-semibold text-gray-800">
                  {transaction.agent_phone}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Points Earned */}
      {transaction.status === "completed" && (
        <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-5 text-white">
          <p className="text-white/70 text-sm mb-1">Poin Yang Didapatkan</p>
          <p className="text-3xl font-bold">
            +{(transaction.points_earned || transaction.total_points || 0).toLocaleString()}{" "}
            poin
          </p>
          <p className="text-white/60 text-xs mt-1">
            Poin telah ditambahkan ke akun Anda
          </p>
        </div>
      )}

      {/* Timestamps */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Dibuat: {date.toLocaleString("id-ID")}</span>
          {updatedDate && (
            <span>Diperbarui: {updatedDate.toLocaleString("id-ID")}</span>
          )}
        </div>
      </div>
    </div>
  );
}
