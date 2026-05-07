"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
} from "lucide-react";

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
  { rank: 5, name: "Hendra Saputra", points: 950, sampah: "5 kg", transaksi: 4 },
];

const SUMMARY_STATS = [
  { label: "Total Sampah Terkumpul", value: "4.820 kg", change: "+15%", icon: Recycle, color: "text-primary", bg: "bg-primary/10", up: true },
  { label: "Total Pengguna Aktif", value: "1.284", change: "+24", icon: Users, color: "text-blue-500", bg: "bg-blue-50", up: true },
  { label: "Total Pengiriman", value: "538", change: "+38", icon: Truck, color: "text-orange-500", bg: "bg-orange-50", up: true },
  { label: "Poin Diredeem", value: "89.500", change: "-1.2k", icon: Coins, color: "text-yellow-500", bg: "bg-yellow-50", up: false },
];

export default function ReportsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Laporan</h1>
          <p className="text-sm text-muted-foreground">Rekap data dan performa sistem Arkana</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <CalendarDays className="w-4 h-4" /> Mei 2026
          </Button>
          <Button size="sm" className="gap-2">
            <Download className="w-4 h-4" /> Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {SUMMARY_STATS.map((s, i) => {
          const Icon = s.icon;
          return (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${s.color}`} />
                  </div>
                  <span className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${s.up ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"}`}>
                    {s.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {s.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mb-1">{s.label}</p>
                <h3 className="text-xl font-bold">{s.value}</h3>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Bar Chart - Sampah per Bulan */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-semibold">Sampah Terkumpul per Bulan</CardTitle>
                <Badge variant="outline" className="text-xs font-normal">2026</Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <div className="space-y-3">
                {MONTHLY_DATA.map((d) => (
                  <div key={d.month} className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="w-8">{d.month}</span>
                      <span>{d.sampah} kg · {d.transaksi} transaksi · {d.user} user baru</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full transition-all duration-500"
                          style={{ width: `${(d.sampah / MAX_SAMPAH) * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold w-14 text-right">{d.sampah} kg</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Legend */}
              <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 bg-primary rounded-sm" />
                  <span>Volume Sampah</span>
                </div>
                <span>Total 5 bulan: <strong className="text-foreground">2.100 kg</strong></span>
                <span>Rata-rata: <strong className="text-foreground">420 kg/bulan</strong></span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Users */}
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">Top 5 Pengguna Aktif</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {TOP_USERS.map((user) => (
                <div key={user.rank} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    user.rank === 1 ? "bg-yellow-100 text-yellow-600"
                    : user.rank === 2 ? "bg-gray-100 text-gray-500"
                    : user.rank === 3 ? "bg-orange-100 text-orange-600"
                    : "bg-muted text-muted-foreground"
                  }`}>
                    {user.rank}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-[11px] text-muted-foreground">{user.sampah} · {user.transaksi}x transaksi</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-primary">{user.points.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">poin</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Summary Card */}
          <Card className="mt-4 bg-primary text-white">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-sm">Rata-rata per Transaksi</h3>
              <div className="space-y-1.5 text-xs text-white/80">
                <div className="flex justify-between">
                  <span>Berat sampah</span>
                  <span className="font-semibold text-white">3,9 kg</span>
                </div>
                <div className="flex justify-between">
                  <span>Poin diberikan</span>
                  <span className="font-semibold text-white">1.560</span>
                </div>
                <div className="flex justify-between">
                  <span>Waktu proses</span>
                  <span className="font-semibold text-white">~2 jam</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
