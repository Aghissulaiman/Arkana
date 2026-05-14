"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  TrendingUp,
  TrendingDown,
  Recycle,
  Users,
  Truck,
  Coins,
  Award,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";

type MonthlyData = {
  month: string;
  sampah: number;
  transaksi: number;
  user: number;
};

type TopUser = {
  rank: number;
  name: string;
  points: number;
  sampah: string;
  transaksi: number;
};

type SummaryStat = {
  label: string;
  value: string;
  change: string;
  icon: any;
  color: string;
  bg: string;
  up: boolean;
};

export default function ReportsPage() {
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [topUsers, setTopUsers] = useState<TopUser[]>([]);
  const [summaryStats, setSummaryStats] = useState<SummaryStat[]>([]);
  const [totalWaste, setTotalWaste] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7),
  );

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Ambil data pickup requests untuk chart bulanan
      const startDate = new Date(selectedMonth + "-01");
      const endDate = new Date(startDate);
      endDate.setMonth(endDate.getMonth() + 1);

      const { data: pickups } = await supabase
        .from("pickup_requests")
        .select("created_at, estimated_weight, status")
        .gte("created_at", startDate.toISOString())
        .lt("created_at", endDate.toISOString());

      // 2. Ambil data user baru per bulan
      const { data: newUsers } = await supabase
        .from("users")
        .select("created_at")
        .gte("created_at", startDate.toISOString())
        .lt("created_at", endDate.toISOString());

      // 3. Hitung data bulanan
      const totalWeight =
        pickups?.reduce((sum, p) => sum + (p.estimated_weight || 0), 0) || 0;
      const totalTransactions = pickups?.length || 0;
      const newUsersCount = newUsers?.length || 0;

      setMonthlyData([
        {
          month: new Date(selectedMonth).toLocaleDateString("id-ID", {
            month: "short",
            year: "numeric",
          }),
          sampah: totalWeight,
          transaksi: totalTransactions,
          user: newUsersCount,
        },
      ]);

      setTotalWaste(totalWeight);

      // 4. Ambil top users berdasarkan poin
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, balance_points")
        .order("balance_points", { ascending: false })
        .limit(5);

      const topUsersData = await Promise.all(
        (profiles || []).map(async (profile, idx) => {
          const { data: userPickups } = await supabase
            .from("pickup_requests")
            .select("id, estimated_weight")
            .eq("user_id", profile.user_id)
            .eq("status", "completed");

          const totalWeight =
            userPickups?.reduce(
              (sum, p) => sum + (p.estimated_weight || 0),
              0,
            ) || 0;
          const transactionCount = userPickups?.length || 0;

          return {
            rank: idx + 1,
            name: profile.full_name || "User",
            points: profile.balance_points || 0,
            sampah: `${totalWeight} kg`,
            transaksi: transactionCount,
          };
        }),
      );

      setTopUsers(topUsersData);

      // 5. Ambil summary stats
      const { data: allPickups } = await supabase
        .from("pickup_requests")
        .select("estimated_weight, status");

      const { count: activeUsers } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true });

      const { data: redeemedPoints } = await supabase
        .from("redeem_requests")
        .select("points_spent");

      const totalRedeemed =
        redeemedPoints?.reduce((sum, r) => sum + r.points_spent, 0) || 0;
      const totalPickups = allPickups?.length || 0;
      const completedPickups =
        allPickups?.filter((p) => p.status === "completed").length || 0;
      const efficiencyRate =
        totalPickups > 0 ? (completedPickups / totalPickups) * 100 : 0;
      const totalWasteAll =
        allPickups?.reduce((sum, p) => sum + (p.estimated_weight || 0), 0) || 0;

      setSummaryStats([
        {
          label: "Total Sampah",
          value: `${totalWasteAll.toFixed(0)} kg`,
          change: "+15%",
          icon: Recycle,
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          up: true,
        },
        {
          label: "Pengguna Aktif",
          value: `${activeUsers || 0}`,
          change: "+24",
          icon: Users,
          color: "text-blue-600",
          bg: "bg-blue-50",
          up: true,
        },
        {
          label: "Efisiensi Sistem",
          value: `${efficiencyRate.toFixed(1)}%`,
          change: "Optimal",
          icon: Truck,
          color: "text-amber-600",
          bg: "bg-amber-50",
          up: true,
        },
        {
          label: "Poin Diredeem",
          value: `${totalRedeemed.toLocaleString()}`,
          change: "-1.2k",
          icon: Coins,
          color: "text-purple-600",
          bg: "bg-purple-50",
          up: false,
        },
      ]);
    } catch (error) {
      console.error("Error fetching report data:", error);
      toast.error("Gagal memuat data laporan");
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    const headers = ["Bulan", "Total Sampah (kg)", "Transaksi", "User Baru"];
    const rows = monthlyData.map((d) => [
      d.month,
      d.sampah,
      d.transaksi,
      d.user,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan_${selectedMonth}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Laporan berhasil diexport");
  };

  const MAX_SAMPAH = Math.max(...monthlyData.map((d) => d.sampah), 1000);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-0">
      <Toaster position="top-right" richColors />

      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            Laporan Analitik
          </h1>
          <p className="text-muted-foreground mt-1">
            Pantau performa pengelolaan sampah dan partisipasi pengguna.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="flex-1 md:flex-none px-4 py-2 border border-slate-200 rounded-lg text-sm"
          />
          <Button
            onClick={exportToCSV}
            className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200"
          >
            <Download className="mr-2 h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryStats.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card
              key={i}
              className="relative overflow-hidden border-none shadow-sm ring-1 ring-slate-200 hover:shadow-md transition-all"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-2.5 ${s.bg} rounded-lg`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <Badge
                    variant="secondary"
                    className={`${s.up ? "text-emerald-700 bg-emerald-50" : "text-rose-700 bg-rose-50"} border-none font-bold`}
                  >
                    {s.up ? (
                      <TrendingUp className="w-3 h-3 mr-1" />
                    ) : (
                      <TrendingDown className="w-3 h-3 mr-1" />
                    )}
                    {s.change}
                  </Badge>
                </div>
                <div className="mt-4">
                  <p className="text-sm font-medium text-slate-500">
                    {s.label}
                  </p>
                  <h3 className="text-2xl font-bold text-slate-900 mt-1">
                    {s.value}
                  </h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart Section */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-slate-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-8">
              <div className="space-y-1">
                <CardTitle className="text-lg font-bold text-slate-800">
                  Volume Sampah{" "}
                  {new Date(selectedMonth).toLocaleDateString("id-ID", {
                    month: "long",
                    year: "numeric",
                  })}
                </CardTitle>
                <CardDescription>
                  Data pengumpulan sampah periode ini
                </CardDescription>
              </div>
              <Badge variant="outline" className="rounded-md">
                {monthlyData[0]?.month || "-"}
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {monthlyData.map((d) => (
                  <div key={d.month} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-sm font-bold text-slate-700">
                          {d.month}
                        </span>
                        <span className="ml-2 text-[11px] text-slate-400 font-medium uppercase tracking-wider">
                          {d.transaksi} Transaksi · {d.user} User Baru
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {d.sampah.toFixed(1)} kg
                      </span>
                    </div>
                    <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                        style={{ width: `${(d.sampah / MAX_SAMPAH) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-medium text-slate-500">
                      Volume Sampah
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-400 uppercase tracking-tighter mr-2">
                      Total
                    </span>
                    <span className="font-bold text-slate-800">
                      {totalWaste.toFixed(1)} kg
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 font-bold"
                >
                  Lihat Detail <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-500" />
                <CardTitle className="text-lg font-bold text-slate-800 uppercase tracking-tight">
                  Leaderboard
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {topUsers.length === 0 ? (
                  <div className="p-6 text-center text-slate-400">
                    Belum ada data pengguna
                  </div>
                ) : (
                  topUsers.map((user) => (
                    <div
                      key={user.rank}
                      className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div className="relative">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm ${
                            user.rank === 1
                              ? "bg-amber-400 text-white"
                              : user.rank === 2
                                ? "bg-slate-300 text-slate-700"
                                : user.rank === 3
                                  ? "bg-orange-300 text-orange-900"
                                  : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {user.rank}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {user.name}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <Badge
                            variant="outline"
                            className="px-1.5 py-0 text-[10px] h-4 bg-white font-medium text-slate-500 border-slate-200 uppercase tracking-tighter"
                          >
                            {user.sampah}
                          </Badge>
                          <span className="text-[11px] text-slate-400">
                            {user.transaksi}x Transaksi
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-emerald-600">
                          {user.points.toLocaleString()}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          Poin
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
