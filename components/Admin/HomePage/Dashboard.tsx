"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MapPin,
  User,
} from "lucide-react";
import Link from "next/link";

const RECENT_REQUESTS = [
  {
    id: "REQ-001",
    user: "Budi Santoso",
    type: "Plastik & Botol",
    weight: "3,2 kg",
    location: "Kec. Menteng, Jakarta",
    date: "Hari ini, 09:00",
    status: "Menunggu",
  },
  {
    id: "REQ-002",
    user: "Siti Rahayu",
    type: "Kertas & Kardus",
    weight: "5 kg",
    location: "Kec. Kebayoran, Jakarta",
    date: "Hari ini, 11:30",
    status: "Diproses",
  },
  {
    id: "REQ-003",
    user: "Ahmad Fauzi",
    type: "Logam",
    weight: "1,8 kg",
    location: "Kec. Tebet, Jakarta",
    date: "Kemarin, 14:00",
    status: "Selesai",
  },
  {
    id: "REQ-004",
    user: "Rina Dewi",
    type: "Elektronik",
    weight: "2,5 kg",
    location: "Kec. Cempaka Putih, Jakarta",
    date: "Kemarin, 16:15",
    status: "Ditolak",
  },
];

const RECENT_USERS = [
  { name: "Budi Santoso", email: "budi@email.com", joined: "2 jam lalu", points: 1250 },
  { name: "Siti Rahayu", email: "siti@email.com", joined: "1 hari lalu", points: 3400 },
  { name: "Ahmad Fauzi", email: "ahmad@email.com", joined: "2 hari lalu", points: 800 },
  { name: "Rina Dewi", email: "rina@email.com", joined: "3 hari lalu", points: 5200 },
];

const STATUS_STYLE: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
  Menunggu: {
    label: "Menunggu",
    color: "bg-yellow-50 text-yellow-600 border-yellow-200",
    icon: <Clock className="w-3 h-3" />,
  },
  Diproses: {
    label: "Diproses",
    color: "bg-blue-50 text-blue-600 border-blue-200",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  Selesai: {
    label: "Selesai",
    color: "bg-green-50 text-green-600 border-green-200",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Ditolak: {
    label: "Ditolak",
    color: "bg-red-50 text-red-500 border-red-200",
    icon: <XCircle className="w-3 h-3" />,
  },
};

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard Admin</h1>
          <p className="text-sm text-muted-foreground">Pantau dan kelola semua aktivitas sistem Arkana</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">Export Laporan</Button>
          <Button size="sm">Tambah Admin</Button>
        </div>
      </div>

      {/* Grid utama */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Permintaan terbaru - 2/3 */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold">Permintaan Terbaru</h2>
            <Link href="/admin/requests">
              <Button variant="ghost" size="sm" className="text-primary text-xs">
                Lihat Semua <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {RECENT_REQUESTS.map((req) => {
              const s = STATUS_STYLE[req.status];
              return (
                <Card key={req.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs text-muted-foreground font-mono">{req.id}</span>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.color}`}
                          >
                            {s.icon} {s.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                          <p className="text-sm font-medium truncate">{req.user}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {req.type} · {req.weight}
                        </p>
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                          <p className="text-xs text-muted-foreground truncate">{req.location}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground whitespace-nowrap">{req.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* User terbaru - 1/3 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-semibold">User Terbaru</h2>
            <Link href="/admin/users">
              <Button variant="ghost" size="sm" className="text-primary text-xs">
                Semua <ChevronRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>

          <div className="space-y-3">
            {RECENT_USERS.map((user, i) => (
              <Card key={i} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-primary">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    <p className="text-[10px] text-muted-foreground">{user.joined}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold text-primary">{user.points.toLocaleString()}</p>
                    <p className="text-[10px] text-muted-foreground">poin</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary card */}
          <Card className="bg-primary text-white mt-4">
            <CardContent className="p-4 space-y-2">
              <h3 className="font-semibold text-sm">Ringkasan Bulan Ini</h3>
              <div className="space-y-1 text-xs text-white/80">
                <div className="flex justify-between">
                  <span>Total Permintaan</span>
                  <span className="font-semibold text-white">142</span>
                </div>
                <div className="flex justify-between">
                  <span>Berhasil</span>
                  <span className="font-semibold text-white">128</span>
                </div>
                <div className="flex justify-between">
                  <span>Ditolak</span>
                  <span className="font-semibold text-white">14</span>
                </div>
                <div className="w-full h-1.5 bg-white/20 rounded-full mt-2">
                  <div className="h-full bg-white rounded-full" style={{ width: "90%" }} />
                </div>
                <p className="text-center text-[10px] text-white/70">90% tingkat keberhasilan</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
