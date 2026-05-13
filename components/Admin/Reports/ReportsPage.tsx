"use client";

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
  CalendarDays,
  Award,
  ChevronRight,
} from "lucide-react";

// Data tetap sama
const MONTHLY_DATA = [
  { month: "Jan", sampah: 320, transaksi: 95, user: 40 },
  { month: "Feb", sampah: 410, transaksi: 110, user: 55 },
  { month: "Mar", sampah: 390, transaksi: 102, user: 48 },
  { month: "Apr", sampah: 500, transaksi: 135, user: 70 },
  { month: "Mei", sampah: 480, transaksi: 128, user: 65 },
];

const MAX_SAMPAH = 500;

const TOP_USERS = [
  { rank: 1, name: "Rina Dewi", points: 5200, sampah: "18 kg", transaksi: 12 },
  { rank: 2, name: "Siti Rahayu", points: 3400, sampah: "12 kg", transaksi: 8 },
  { rank: 3, name: "Budi Santoso", points: 1250, sampah: "6 kg", transaksi: 5 },
  { rank: 4, name: "Ahmad Fauzi", points: 800, sampah: "4 kg", transaksi: 3 },
  {
    rank: 5,
    name: "Hendra Saputra",
    points: 950,
    sampah: "5 kg",
    transaksi: 4,
  },
];

const SUMMARY_STATS = [
  {
    label: "Total Sampah",
    value: "4.820 kg",
    change: "+15%",
    icon: Recycle,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    up: true,
  },
  {
    label: "Pengguna Aktif",
    value: "1.284",
    change: "+24",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-50",
    up: true,
  },
  {
    label: "Total Pengiriman",
    value: "538",
    change: "+38",
    icon: Truck,
    color: "text-amber-600",
    bg: "bg-amber-50",
    up: true,
  },
  {
    label: "Poin Diredeem",
    value: "89.500",
    change: "-1.2k",
    icon: Coins,
    color: "text-purple-600",
    bg: "bg-purple-50",
    up: false,
  },
];

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-0">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Laporan Analitik
          </h1>
          <p className="text-muted-foreground mt-1">
            Pantau performa pengelolaan sampah dan partisipasi pengguna Arkana.
          </p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none justify-start font-medium border-slate-200"
          >
            <CalendarDays className="mr-2 h-4 w-4 text-slate-500" />
            Mei 2026
          </Button>
          <Button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-200">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SUMMARY_STATS.map((s, i) => {
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
                  Volume Sampah Bulanan
                </CardTitle>
                <CardDescription>
                  Visualisasi pertumbuhan pengumpulan sampah (kg)
                </CardDescription>
              </div>
              <Badge variant="outline" className="rounded-md">
                Jan - Mei 2026
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {MONTHLY_DATA.map((d) => (
                  <div key={d.month} className="group">
                    <div className="flex justify-between items-end mb-2">
                      <div>
                        <span className="text-sm font-bold text-slate-700">
                          {d.month}
                        </span>
                        <span className="ml-2 text-[11px] text-slate-400 font-medium uppercase tracking-wider group-hover:text-emerald-600 transition-colors">
                          {d.transaksi} Transaksi · {d.user} User Baru
                        </span>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        {d.sampah} kg
                      </span>
                    </div>
                    <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-full bg-linear-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(16,185,129,0.3)]"
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
                    <span className="text-xs font-medium text-slate-500 text-nowrap">
                      Volume Sampah
                    </span>
                  </div>
                  <div className="text-xs">
                    <span className="text-slate-400 uppercase tracking-tighter mr-2">
                      Total
                    </span>
                    <span className="font-bold text-slate-800">2.100 kg</span>
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
                {TOP_USERS.map((user) => (
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
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Metrics Card */}
          <Card className="bg-slate-900 text-white border-none shadow-lg shadow-slate-200">
            <CardContent className="p-6">
              <h3 className="font-bold text-sm text-slate-400 uppercase tracking-widest mb-4">
                Efisiensi Sistem
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-300">
                    Rata-rata/Transaksi
                  </span>
                  <span className="text-sm font-bold">3,9 kg</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[70%]" />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-slate-300">
                    Waktu Respon Agent
                  </span>
                  <span className="text-sm font-bold">~2.4 Jam</span>
                </div>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 w-[85%]" />
                </div>
                <Button className="w-full mt-4 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-tighter h-9">
                  Buka Analitik Lanjutan
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
