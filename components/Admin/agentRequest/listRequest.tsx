"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Eye,
  RefreshCw,
  Loader2,
  ShieldAlert,
  AlertCircle,
  Clock,
  ArrowUpDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
        )
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
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 font-sans">
        <div className="w-20 h-20 bg-rose-50 text-rose-600 rounded-[28px] flex items-center justify-center mb-6 shadow-sm">
          <ShieldAlert size={38} />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Akses Terbatas
        </h2>
        <p className="text-slate-500 mt-2 max-w-xs font-medium">
          Halaman ini khusus untuk Administrator. Silakan hubungi tim IT jika
          terjadi kesalahan.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Verifikasi Agen
          </h1>
          <p className="text-slate-500 text-sm font-medium">
            {loading
              ? "Sinkronisasi data pengajuan..."
              : `Terdapat ${applications.length} pengajuan pendaftaran agen yang perlu ditinjau.`}
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={fetchApplications}
            disabled={loading}
            className="flex-1 md:flex-none gap-2 px-6 py-6 rounded-2xl font-bold border-slate-200"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />{" "}
            Refresh
          </Button>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-center gap-3 text-rose-600 text-sm font-bold animate-in slide-in-from-top-2">
          <AlertCircle size={18} /> {errorMsg}
        </div>
      )}

      {/* Main Table Card */}
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="px-5 py-4 flex flex-col md:flex-row gap-4 items-center justify-between border-b border-slate-50">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder="Cari nama agen atau email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all font-medium"
            />
          </div>

          <div className="hidden md:flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest px-4">
            <Clock size={14} className="text-emerald-500" /> Pengajuan Terbaru
          </div>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Profil Agen
                  </th>
                  <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Wilayah Layanan
                  </th>
                  <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Tanggal Masuk
                  </th>
                  <th className="px-8 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Opsi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading && applications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-emerald-500 w-8 h-8" />
                        <p className="text-sm font-bold text-slate-400">
                          Memuat data...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : filteredApps.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-8 py-20 text-center text-slate-400 font-medium"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <Search size={32} className="opacity-20 mb-2" />
                        <p>Tidak ada pengajuan yang ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApps.map((app) => (
                    <tr
                      key={app.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-base">
                            {app.agent_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-sm tracking-tight">
                              {app.agent_name}
                            </p>
                            <p className="text-xs text-slate-400 font-bold">
                              {app.users?.email || "Email tidak terdaftar"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <Badge className="rounded-lg px-2.5 py-1 font-black text-[10px] uppercase shadow-none border-none bg-emerald-50 text-emerald-700">
                          {app.service_area}
                        </Badge>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 text-sm">
                            {new Date(app.created_at).toLocaleDateString(
                              "id-ID",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                          <span className="text-[10px] font-bold text-slate-300 uppercase">
                            WIB
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-end">
                          <Button
                            asChild
                            className="bg-slate-900 hover:bg-emerald-600 text-white gap-2 px-6 py-5 rounded-2xl font-black text-xs transition-all active:scale-95 shadow-sm"
                          >
                            <Link href={`/admin/agent-applications/${app.id}`}>
                              Tinjau Detail
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer Card */}
          <div className="p-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/20">
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <ArrowUpDown size={12} /> Menampilkan {filteredApps.length}{" "}
              Pengajuan Pending
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
