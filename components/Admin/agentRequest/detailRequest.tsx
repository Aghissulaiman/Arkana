"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import {
  Loader2,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Building2,
  MapPin,
  Phone,
  Package,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner";

interface AgentApplication {
  id: string;
  user_id: string;
  agent_name: string;
  phone: string;
  address: string;
  service_area: string;
  waste_categories: string[];
  status: string;
  created_at: string;
  user_email?: string;
}

interface Props {
  id: string; // ← terima id sebagai props, bukan dari params
}

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Disetujui", color: "bg-green-100 text-green-700" },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-700" },
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

export default function AgentDetailPage({ id }: Props) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [application, setApplication] = useState<AgentApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("agent_applications")
      .select(
        `
        *,
        users!agent_applications_user_id_fkey (email)
      `,
      )
      .eq("id", id)
      .single();

    if (error || !data) {
      toast.error("Data tidak ditemukan");
      router.push("/admin/agent-applications");
      return;
    }

    setApplication({
      ...data,
      user_email: data.users?.email,
    });

    setLoading(false);
  };

  const handleApprove = async () => {
    if (!application) return;

    setProcessing(true);

    // Update status application
    await supabase
      .from("agent_applications")
      .update({ status: "approved", reviewed_at: new Date().toISOString() })
      .eq("id", application.id);

    // Update role user menjadi agent
    await supabase
      .from("users")
      .update({ role: "agent" })
      .eq("id", application.user_id);

    // Insert ke tabel agents
    await supabase.from("agents").insert({
      user_id: application.user_id,
      agent_name: application.agent_name,
      phone: application.phone,
      address: application.address,
      service_area: application.service_area,
      waste_categories: application.waste_categories,
      balance_income: 0,
      is_active: true,
    });

    toast.success("Pendaftaran agen disetujui!");
    setProcessing(false);
    router.push("/admin/agent-applications");
  };

  const handleReject = async () => {
    if (!application) return;

    setProcessing(true);

    await supabase
      .from("agent_applications")
      .update({ status: "rejected", reviewed_at: new Date().toISOString() })
      .eq("id", application.id);

    toast.success("Pendaftaran agen ditolak");
    setProcessing(false);
    router.push("/admin/agent-applications");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!application) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">Data tidak ditemukan</p>
        <Link
          href="/admin/agent-applications"
          className="mt-4 text-green-600 hover:underline"
        >
          Kembali
        </Link>
      </div>
    );
  }

  const statusInfo = STATUS_LABELS[application.status] || {
    label: application.status,
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Toaster position="top-right" richColors />

      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali</span>
      </button>

      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
        <div className="bg-linear-to-r from-green-600 to-green-500 px-6 py-4">
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-bold text-white">
              {application.agent_name}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
            >
              {statusInfo.label}
            </span>
          </div>
          <p className="text-green-100 text-sm mt-1">Pendaftaran Agen</p>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Nama Agen</p>
              <p className="font-medium">{application.agent_name}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Nomor Telepon</p>
              <p className="font-medium">{application.phone || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Alamat</p>
              <p className="font-medium">{application.address || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Wilayah Layanan</p>
              <p className="font-medium">{application.service_area || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Package className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Jenis Sampah</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {application.waste_categories?.map((w) => (
                  <span
                    key={w}
                    className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                  >
                    {WASTE_LABELS[w] || w}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
            <div>
              <p className="text-sm text-gray-500">Tanggal Daftar</p>
              <p className="font-medium">
                {new Date(application.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons (only for pending) */}
      {application.status === "pending" && (
        <div className="flex gap-4">
          <button
            onClick={handleApprove}
            disabled={processing}
            className="flex-1 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle className="w-5 h-5" />
            )}
            Setujui Pendaftaran
          </button>
          <button
            onClick={handleReject}
            disabled={processing}
            className="flex-1 py-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {processing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            Tolak Pendaftaran
          </button>
        </div>
      )}

      {/* Info for approved/rejected */}
      {application.status !== "pending" && (
        <div className="bg-gray-50 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">
            {application.status === "approved"
              ? "✅ Pendaftaran ini telah disetujui. Pengguna sekarang dapat login sebagai agen."
              : "❌ Pendaftaran ini telah ditolak."}
          </p>
        </div>
      )}
    </div>
  );
}
