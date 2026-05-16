"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Search,
  ChevronRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  ArrowRight,
  Loader2,
  Users,
  Package,
  TrendingUp,
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";

type StatusType = "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
type AgentApplication = {
  id: string;
  agent_name: string;
  service_area: string;
  waste_categories: string[];
  status: string;
  created_at: string;
  user_email?: string;
};

type PickupRequest = {
  id: string;
  request_code: string;
  user_name?: string;
  agent_name?: string;
  waste_type: string;
  estimated_weight: number;
  status: string;
  created_at: string;
};

type AgentStats = {
  id: string;
  agent_name: string;
  total_pickups: number;
  avg_rating: number;
};

const STATUS_STYLE: Record<
  StatusType,
  { label: string; color: string; icon: React.ReactNode }
> = {
  Menunggu: {
    label: "Pending",
    color: "text-amber-500 bg-amber-50 border-amber-100",
    icon: <Clock className="w-3 h-3" />,
  },
  Diproses: {
    label: "Proses",
    color: "text-blue-500 bg-blue-50 border-blue-100",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  Selesai: {
    label: "Success",
    color: "text-emerald-500 bg-emerald-50 border-emerald-100",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Ditolak: {
    label: "Reject",
    color: "text-rose-500 bg-rose-50 border-rose-100",
    icon: <XCircle className="w-3 h-3" />,
  },
};

const WASTE_LABELS: Record<string, string> = {
  plastic: "Plastik & Botol",
  paper: "Kertas & Kardus",
  cardboard: "Kardus",
  glass: "Kaca",
  aluminium: "Aluminium",
  metal: "Logam",
  electronic: "Elektronik",
  mixed: "Campuran",
};

const CATEGORIES = [
  "Semua",
  "Plastik & Botol",
  "Kertas & Kardus",
  "Logam",
  "Elektronik",
];

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [applications, setApplications] = useState<AgentApplication[]>([]);
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [topAgents, setTopAgents] = useState<AgentStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Semua");
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalPickups: 0,
    totalPoints: 0,
    pendingPickups: 0,
  });

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (userData?.role !== "admin") {
        router.push("/user/home");
        return;
      }

      // 1. Ambil pending agent applications
      const { data: appData } = await supabase
        .from("agent_applications")
        .select(
          `
          *,
          users!agent_applications_user_id_fkey (email)
        `,
        )
        .eq("status", "pending")
        .order("created_at", { ascending: false })
        .limit(5);

      const formattedApps = (appData || []).map((app: any) => ({
        id: app.id,
        agent_name: app.agent_name,
        service_area: app.service_area,
        waste_categories: app.waste_categories,
        status: app.status,
        created_at: app.created_at,
        user_email: app.users?.email,
      }));
      setApplications(formattedApps);

      // 2. Ambil recent activities (Pickup, Redeem, Topup)
      const [pickupRes, redeemRes, topupRes] = await Promise.all([
        supabase
          .from("pickup_requests")
          .select(
            `*, users!pickup_requests_user_id_fkey (email), agents!pickup_requests_agent_id_fkey (agent_name)`,
          )
          .order("created_at", { ascending: false })
          .limit(10),
        supabase
          .from("redeem_requests")
          .select(`*, users!redeem_requests_user_id_fkey (email)`)
          .order("created_at", { ascending: false })
          .limit(5),
        supabase
          .from("topup_requests")
          .select(`*, users!topup_requests_user_id_fkey (email)`)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      const mergedActivities = [
        ...(pickupRes.data || []).map((p: any) => ({
          id: p.id,
          request_code: p.request_code,
          user_name: p.users?.email?.split("@")[0] || "User",
          agent_name: p.agents?.agent_name || "-",
          waste_type: WASTE_LABELS[p.waste_type] || p.waste_type,
          estimated_weight: p.estimated_weight,
          status: p.status,
          type: "pickup",
          created_at: p.created_at,
        })),
        ...(redeemRes.data || []).map((r: any) => ({
          id: r.id,
          request_code: r.id.slice(0, 8),
          user_name: r.users?.email?.split("@")[0] || "User",
          agent_name: "Arkana Reward",
          waste_type: r.reward_name,
          estimated_weight: 0,
          status: r.status,
          type: "redeem",
          created_at: r.created_at,
        })),
        ...(topupRes.data || []).map((t: any) => ({
          id: t.id,
          request_code: t.id.slice(0, 8),
          user_name: t.users?.email?.split("@")[0] || "User",
          agent_name: "Arkana Wallet",
          waste_type: "Top Up Poin",
          estimated_weight: 0,
          status: t.status,
          type: "topup",
          created_at: t.created_at,
        })),
      ]
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
        )
        .slice(0, 15);

      setPickups(mergedActivities);

      // 3. Ambil top agents (Produktifitas berdasarkan jumlah pickup sukses)
      const { data: agentsData } = await supabase
        .from("agents")
        .select("id, agent_name, avg_rating")
        .limit(10);

      const topAgentsWithStats = await Promise.all(
        (agentsData || []).map(async (agent) => {
          const { count } = await supabase
            .from("pickup_requests")
            .select("*", { count: "exact", head: true })
            .eq("agent_id", agent.id)
            .eq("status", "completed");

          return {
            id: agent.id,
            agent_name: agent.agent_name,
            total_pickups: count || 0,
            avg_rating: agent.avg_rating || 0,
          };
        }),
      );

      // Sort manually by pickups, then rating
      const sortedAgents = topAgentsWithStats
        .sort(
          (a, b) =>
            b.total_pickups - a.total_pickups || b.avg_rating - a.avg_rating,
        )
        .slice(0, 3);

      setTopAgents(sortedAgents);

      // 4. Ambil statistik
      const { count: totalAgents } = await supabase
        .from("agents")
        .select("*", { count: "exact", head: true });

      const [totalPickupRes, totalRedeemRes, totalTopupRes] = await Promise.all(
        [
          supabase.from("pickup_requests").select("status, total_points"),
          supabase.from("redeem_requests").select("points_spent"),
          supabase.from("topup_requests").select("amount"),
        ],
      );

      const totalPickups = totalPickupRes.data?.length || 0;
      const totalPointsGiven =
        totalPickupRes.data?.reduce(
          (sum, p) => sum + (p.total_points || 0),
          0,
        ) || 0;
      const pendingPickups =
        totalPickupRes.data?.filter((p) => p.status === "pending").length || 0;

      setStats({
        totalAgents: totalAgents || 0,
        totalPickups,
        totalPoints: totalPointsGiven,
        pendingPickups,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Gagal memuat data dashboard");
    } finally {
      setLoading(false);
    }
  };

  const getStatusType = (status: string): StatusType => {
    switch (status) {
      case "pending":
        return "Menunggu";
      case "accepted":
        return "Diproses";
      case "completed":
        return "Selesai";
      case "rejected":
        return "Ditolak";
      default:
        return "Menunggu";
    }
  };

  const filteredPickups = pickups.filter((p) => {
    if (
      searchQuery &&
      !p.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !p.agent_name?.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    if (categoryFilter !== "Semua" && p.waste_type !== categoryFilter) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-6 mx-auto min-h-screen font-sans">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-slate-200 pb-8">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              TrashFlow System
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Selamat datang kembali, berikut pantauan sirkular ekonomi hari ini.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            onClick={() => router.push("/admin/agent-applications")}
            className="flex-1 md:flex-none rounded-xl border-slate-200 text-slate-600 font-bold px-6 h-11"
          >
            Lihat Pendaftaran
          </Button>
          <Button
            onClick={fetchAllData}
            className="flex-1 md:flex-none bg-emerald-600 text-white rounded-xl px-6 h-11 font-bold shadow-xs shadow-emerald-100 transition-all hover:bg-emerald-700"
          >
            Refresh Data
          </Button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Agent</p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.totalAgents}
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Penjemputan</p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.totalPickups}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Total Poin Diberikan</p>
              <p className="text-3xl font-bold text-slate-800">
                {stats.totalPoints.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Menunggu Konfirmasi</p>
              <p className="text-3xl font-bold text-amber-600">
                {stats.pendingPickups}
              </p>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
          </div>
        </div>
      </div>

      {/* AGENT VERIFICATION SECTION */}
      <div className="grid lg:grid-cols-3 gap-10 pt-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                Verifikasi Agent
                <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-full font-bold">
                  {applications.length} New Request
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Periksa kelengkapan dokumen calon mitra pengepul.
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={() => router.push("/admin/agent-applications")}
              className="text-emerald-600 text-sm font-bold hover:bg-emerald-50 rounded-xl"
            >
              Lihat Semua <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            {applications.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                Tidak ada permintaan verifikasi agent baru
              </div>
            ) : (
              applications.map((app, i) => (
                <div
                  key={app.id}
                  className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                        <ShieldCheck className="w-6 h-6 text-emerald-600" />
                      </div>
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                        {app.agent_name}
                      </h4>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-[11px] text-slate-400 font-medium">
                          {app.service_area}
                        </p>
                        <span className="text-slate-200 text-[10px]">|</span>
                        <p className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                          {app.waste_categories?.length || 0} Jenis Sampah
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 items-center justify-end">
                    <Button
                      variant="outline"
                      onClick={() =>
                        router.push(`/admin/agent-applications/${app.id}`)
                      }
                      className="h-10 px-5 rounded-xl border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100"
                    >
                      Detail
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* TOP PERFORMANCE */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">
              Top Performance
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Agent dengan produktivitas tertinggi bulan ini.
            </p>
          </div>

          <div className="space-y-3">
            {topAgents.length === 0 ? (
              <div className="bg-white rounded-3xl p-6 text-center border border-slate-100">
                <p className="text-sm text-slate-400">Belum ada data agent</p>
              </div>
            ) : (
              topAgents.map((agent, i) => (
                <div
                  key={agent.id}
                  className="group p-5 bg-white rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg transition-all cursor-default"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`px-3 py-1 rounded-full font-black text-[10px] border uppercase tracking-widest ${
                        i === 0
                          ? "text-amber-500 bg-amber-50 border-amber-100"
                          : i === 1
                            ? "text-emerald-500 bg-emerald-50 border-emerald-100"
                            : "text-blue-500 bg-blue-50 border-blue-100"
                      }`}
                    >
                      Rank #{i + 1}
                    </div>
                    <div className="flex items-center gap-1 text-xs font-black text-slate-700">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      {agent.avg_rating.toFixed(1)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                        {agent.agent_name}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                        {agent.total_pickups} Sukses Penjemputan
                      </p>
                    </div>
                    <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                      <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ACTIVITY MONITORING */}
      <div className="space-y-6">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">
          Aktivitas Terkini
        </h2>

        {/* Card Utama Wrapping Search, Filter, dan List */}
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-sm overflow-hidden">
          {/* Header Dalam Card (Search & Filter) */}
          <div className="p-6 border-b border-slate-50 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              {/* Search Bar */}
              <div className="relative grow md:max-w-sm">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Cari transaksi atau user..."
                  className="pl-11 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white h-11 transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Filter Categories */}
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar items-center">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-5 py-2.5 rounded-2xl text-[11px] font-bold transition-all whitespace-nowrap border ${
                      categoryFilter === cat
                        ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100"
                        : "bg-white border-slate-100 text-slate-500 hover:bg-slate-50"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Body Dalam Card (List) */}
          <div className="p-6">
            <div className="grid gap-3">
              {filteredPickups.length === 0 ? (
                <div className="py-20 text-center">
                  <p className="text-sm font-bold text-slate-300">
                    Tidak ada aktivitas ditemukan
                  </p>
                </div>
              ) : (
                filteredPickups.map((trx) => {
                  const statusType = getStatusType(trx.status);
                  const s = STATUS_STYLE[statusType];
                  const timeAgo = new Date(trx.created_at).toLocaleTimeString(
                    "id-ID",
                    { hour: "2-digit", minute: "2-digit" },
                  );

                  return (
                    <div
                      key={trx.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-3xl border border-transparent hover:border-emerald-100 hover:bg-emerald-50/30 transition-all cursor-pointer group gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s.color} bg-opacity-10 transition-all group-hover:scale-105 border border-current/20`}
                        >
                          {s.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                              {trx.request_code?.slice(0, 8) ||
                                trx.id.slice(0, 8)}
                            </span>
                            <span
                              className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase border ${s.color}`}
                            >
                              {s.label}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-700 leading-none">
                            {trx.user_name}{" "}
                            <span className="text-slate-400 font-medium mx-0.5">
                              →
                            </span>{" "}
                            {trx.agent_name}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-bold mt-1 uppercase tracking-tight">
                            {trx.waste_type} •{" "}
                            <span className="text-emerald-600">
                              {trx.estimated_weight} kg
                            </span>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end sm:gap-6">
                        <div className="text-left sm:text-right">
                          <p className="text-[10px] font-black text-slate-400">
                            {timeAgo}
                          </p>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:translate-x-1">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
