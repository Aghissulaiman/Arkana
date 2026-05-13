"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  RefreshCw,
  Loader2,
  ShieldAlert,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

interface AgentApplication {
  id: string;
  agent_name: string;
  service_area: string;
  created_at: string;
  status: string;
  users: {
    email: string;
  } | null;
}

export default function AgentVerificationList() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("agent_applications")
        .select(
          `
          id,
          agent_name,
          service_area,
          created_at,
          status,
          users!agent_applications_user_id_fkey (email)
        `,
        ) // Tambahkan alias fkey jika relasi ambigu
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) throw error;

      setApplications((data as any) || []);
    } catch (err: any) {
      console.error("Fetch Error:", err.message);
      setErrorMsg("Gagal mengambil data. Pastikan koneksi stabil.");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    let isMounted = true;

    const checkAdmin = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        if (isMounted) router.push("/login");
        return;
      }

      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (isMounted) {
        if (error || userData?.role !== "admin") {
          setIsAdmin(false);
          setLoading(false);
        } else {
          setIsAdmin(true);
          fetchApplications();
        }
      }
    };

    checkAdmin();
    return () => {
      isMounted = false;
    };
  }, [supabase, router, fetchApplications]);

  const filteredApps = applications.filter(
    (app) =>
      app.agent_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.users?.email?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isAdmin === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6">
        <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-4">
          <ShieldAlert size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800">Akses Terbatas</h2>
        <p className="text-slate-500 mt-2">
          Halaman ini khusus untuk Administrator.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
            Verifikasi Agen
          </h2>
          <p className="text-sm text-slate-500">
            {loading
              ? "Memperbarui data..."
              : `Terdapat ${applications.length} pengajuan yang menunggu.`}
          </p>
        </div>
        <button
          onClick={fetchApplications}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50 shadow-sm"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />{" "}
          Refresh
        </button>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-600 text-sm font-medium">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 bg-slate-50/30">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari agen atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Pendaftar
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Wilayah
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Tanggal
                </th>
                <th className="px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading && applications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-emerald-500" />
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-20 text-center text-slate-400 text-sm font-medium"
                  >
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">
                          {app.agent_name}
                        </span>
                        <span className="text-xs text-slate-500">
                          {app.users?.email || "Email tidak tersedia"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg text-[11px] font-bold border border-emerald-100 uppercase italic">
                        {app.service_area}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(app.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/admin/agent-applications/${app.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all active:scale-95 shadow-sm"
                      >
                        <Eye size={14} /> Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
