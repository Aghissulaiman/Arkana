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
  Mail,
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
    <div className="max-w-5xl mx-auto px-4 py-8 font-sans">
      <Toaster position="top-right" richColors />

      {/* Breadcrumb & Navigation */}
      <div className="mb-8 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-all font-medium text-sm"
        >
          <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50 transition-all">
            <ArrowLeft className="w-4 h-4" />
          </div>
          Kembali ke Daftar
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status:</span>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-24 bg-emerald-500/5 -z-0" />
            
            <div className="relative z-10">
              <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <Building2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h2 className="text-xl font-black text-slate-800 leading-tight">
                {application.agent_name}
              </h2>
              <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-2">Calon Mitra Agen</p>
              
              <div className="mt-8 pt-8 border-t border-slate-50 space-y-4 text-left">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Email Akun</p>
                    <p className="text-xs font-medium text-slate-700">{application.user_email || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Phone className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Nomor WhatsApp</p>
                    <p className="text-xs font-medium text-slate-700">{application.phone || "-"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">Terdaftar Pada</p>
                    <p className="text-xs font-medium text-slate-700">
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
          </div>

          {/* Action Summary Card if approved/rejected */}
          {application.status !== "pending" && (
            <div className={`rounded-3xl p-6 border text-center ${
              application.status === "approved" 
                ? "bg-emerald-50 border-emerald-100 text-emerald-700" 
                : "bg-rose-50 border-rose-100 text-rose-700"
            }`}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 bg-white/50">
                {application.status === "approved" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
              </div>
              <p className="text-sm font-bold">
                {application.status === "approved"
                  ? "Pendaftaran Telah Disetujui"
                  : "Pendaftaran Telah Ditolak"}
              </p>
              <p className="text-xs mt-1 opacity-80">
                Keputusan dibuat oleh Admin pada sistem Arkana.
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Details Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Operational Details Card */}
          <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
              <h3 className="text-lg font-bold text-slate-800">Detail Operasional</h3>
              <p className="text-xs font-medium text-slate-400">Informasi cakupan wilayah dan jenis layanan</p>
            </div>
            
            <div className="p-8 grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Wilayah Layanan</label>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-sm font-bold text-slate-700">{application.service_area || "Tidak dispesifikasikan"}</p>
                    <p className="text-[10px] text-slate-400 mt-1 italic">Radius operasional penjemputan sampah</p>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <MapPin className="w-4 h-4 text-emerald-500" />
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alamat Lengkap</label>
                  </div>
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-sm font-medium text-slate-600 leading-relaxed">
                      {application.address || "Alamat belum diisi"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Package className="w-4 h-4 text-emerald-500" />
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Jenis Sampah Diterima</label>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {application.waste_categories?.length > 0 ? (
                      application.waste_categories.map((w) => (
                        <div
                          key={w}
                          className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold border border-emerald-100 flex items-center gap-2"
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          {WASTE_LABELS[w] || w}
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic">Tidak ada kategori yang dipilih</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Section (Pending Only) */}
          {application.status === "pending" && (
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleApprove}
                disabled={processing}
                className="flex-1 py-4 bg-emerald-500 text-white rounded-[20px] font-black text-sm hover:bg-emerald-600 shadow-xl shadow-emerald-200 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {processing ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                Terima Sebagai Mitra
              </button>
              <button
                onClick={handleReject}
                disabled={processing}
                className="flex-1 py-4 bg-white text-rose-600 border-2 border-rose-100 rounded-[20px] font-black text-sm hover:bg-rose-50 transition-all disabled:opacity-50 flex items-center justify-center gap-3"
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
        </div>
      </div>
    </div>
  );
}
