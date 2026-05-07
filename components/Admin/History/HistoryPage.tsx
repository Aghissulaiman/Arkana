"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Truck,
  User,
  Recycle,
  Coins,
  ShieldCheck,
} from "lucide-react";

const HISTORY = [
  {
    id: "LOG-001",
    actor: "Admin",
    action: "Menyetujui permintaan",
    target: "REQ-012 · Budi Santoso",
    category: "Permintaan",
    time: "07 Mei 2026, 10:15",
    status: "Berhasil",
  },
  {
    id: "LOG-002",
    actor: "Sistem",
    action: "Assign driver otomatis",
    target: "SHP-034 · Pak Joko",
    category: "Pengiriman",
    time: "07 Mei 2026, 09:50",
    status: "Berhasil",
  },
  {
    id: "LOG-003",
    actor: "Admin",
    action: "Menolak verifikasi",
    target: "VRF-004 · Rina Dewi",
    category: "Verifikasi",
    time: "06 Mei 2026, 16:30",
    status: "Berhasil",
  },
  {
    id: "LOG-004",
    actor: "User",
    action: "Menukar poin",
    target: "Voucher GoFood · Siti Rahayu",
    category: "Tukar Poin",
    time: "06 Mei 2026, 14:05",
    status: "Berhasil",
  },
  {
    id: "LOG-005",
    actor: "Sistem",
    action: "Pengiriman gagal",
    target: "SHP-031 · Pak Andi",
    category: "Pengiriman",
    time: "05 Mei 2026, 11:00",
    status: "Gagal",
  },
  {
    id: "LOG-006",
    actor: "Admin",
    action: "Nonaktifkan akun",
    target: "Ahmad Fauzi",
    category: "User",
    time: "05 Mei 2026, 09:20",
    status: "Berhasil",
  },
  {
    id: "LOG-007",
    actor: "User",
    action: "Daftar akun baru",
    target: "Hendra Saputra",
    category: "User",
    time: "04 Mei 2026, 18:45",
    status: "Berhasil",
  },
];

const CATEGORY_STYLE: Record<string, { color: string; icon: React.ReactNode }> = {
  Permintaan: { color: "bg-blue-50 text-blue-600 border-blue-200", icon: <AlertCircle className="w-3 h-3" /> },
  Pengiriman: { color: "bg-orange-50 text-orange-600 border-orange-200", icon: <Truck className="w-3 h-3" /> },
  Verifikasi: { color: "bg-purple-50 text-purple-600 border-purple-200", icon: <ShieldCheck className="w-3 h-3" /> },
  "Tukar Poin": { color: "bg-yellow-50 text-yellow-600 border-yellow-200", icon: <Coins className="w-3 h-3" /> },
  User: { color: "bg-primary/10 text-primary border-primary/20", icon: <User className="w-3 h-3" /> },
  Sampah: { color: "bg-green-50 text-green-600 border-green-200", icon: <Recycle className="w-3 h-3" /> },
};

const ACTOR_COLOR: Record<string, string> = {
  Admin: "bg-primary/10 text-primary",
  Sistem: "bg-gray-100 text-gray-600",
  User: "bg-blue-50 text-blue-600",
};

export default function HistoryPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Riwayat Aktivitas</h1>
          <p className="text-sm text-muted-foreground">Log semua aktivitas yang terjadi di sistem Arkana</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Filter className="w-4 h-4" /> Export Log
        </Button>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari aktivitas, user, ID..." className="pl-9 h-9" />
            </div>
            <div className="flex gap-2">
              {["Semua", "Permintaan", "Pengiriman", "Verifikasi", "User"].map((f) => (
                <Button
                  key={f}
                  variant={f === "Semua" ? "default" : "outline"}
                  size="sm"
                  className="text-xs h-9"
                >
                  {f}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          {/* Timeline List */}
          <div className="divide-y">
            {HISTORY.map((log, i) => {
              const cat = CATEGORY_STYLE[log.category] ?? CATEGORY_STYLE["User"];
              const isSuccess = log.status === "Berhasil";
              return (
                <div key={log.id} className="px-4 py-4 hover:bg-muted/20 transition-colors flex items-start gap-4">

                  {/* Timeline dot */}
                  <div className="flex flex-col items-center pt-1">
                    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${isSuccess ? "bg-primary" : "bg-red-500"}`} />
                    {i < HISTORY.length - 1 && <div className="w-px flex-1 bg-border mt-1.5 min-h-[20px]" />}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ACTOR_COLOR[log.actor] ?? "bg-gray-100 text-gray-600"}`}>
                        {log.actor}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full border ${cat.color}`}
                      >
                        {cat.icon} {log.category}
                      </span>
                      <span className={`text-[11px] font-medium ${isSuccess ? "text-green-600" : "text-red-500"}`}>
                        {isSuccess ? "✓ Berhasil" : "✗ Gagal"}
                      </span>
                    </div>

                    <p className="text-sm font-medium">{log.action}</p>
                    <p className="text-xs text-muted-foreground">{log.target}</p>
                  </div>

                  {/* Time */}
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground whitespace-nowrap">{log.time}</p>
                    <p className="text-[10px] font-mono text-muted-foreground/60 mt-0.5">{log.id}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="px-4 py-3 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>Menampilkan 7 dari 1.420 aktivitas</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-7 text-xs">Sebelumnya</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">Berikutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
