"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Loader2,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function AgentDetailPage({ params }: PageProps) {
  // Solusi untuk error: params is a Promise
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const { data: app, error } = await supabase
          .from("agent_applications")
          .select(
            `
            *,
            users (
              email,
              full_name
            )
          `,
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setData(app);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-emerald-500 mb-2" size={32} />
        <p className="text-slate-500 text-sm font-medium">
          Memuat detail pengajuan...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-montserrat p-4 md:p-8">
      {/* Tombol Kembali */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-emerald-600 transition-all"
      >
        <ArrowLeft
          size={18}
          className="group-hover:-translate-x-1 transition-transform"
        />
        Kembali ke Daftar
      </button>

      <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
        {/* Header Visual */}
        <div className="h-32 bg-gradient-to-r from-emerald-500 to-teal-600 p-8 flex items-end">
          <div className="bg-white p-4 rounded-2xl shadow-xl translate-y-12">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center font-bold text-xl">
              {data?.agent_name?.charAt(0)}
            </div>
          </div>
        </div>

        <div className="pt-16 p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight">
              {data?.agent_name}
            </h1>
            <div className="flex flex-wrap gap-4 mt-3">
              <span className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                <Mail size={14} /> {data?.users?.email}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                <MapPin size={14} /> {data?.service_area}
              </span>
              <span className="flex items-center gap-1.5 text-slate-500 text-sm font-medium">
                <Calendar size={14} />{" "}
                {new Date(data?.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Status Verifikasi
              </label>
              <div className="mt-1">
                <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold border border-amber-200 uppercase">
                  {data?.status}
                </span>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                ID Pengajuan
              </label>
              <p className="mt-1 text-sm font-mono text-slate-600">{id}</p>
            </div>
          </div>

          {/* Tombol Aksi */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <button
              disabled={isProcessing}
              className="flex-1 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-emerald-200 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle size={20} /> Setujui Kemitraan
            </button>
            <button
              disabled={isProcessing}
              className="flex-1 h-14 bg-white border-2 border-rose-100 text-rose-600 hover:bg-rose-50 rounded-2xl font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <XCircle size={20} /> Tolak Pengajuan
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
