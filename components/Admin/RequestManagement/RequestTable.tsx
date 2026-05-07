"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  MapPin,
  Eye,
} from "lucide-react";
import React from "react";

const REQUESTS = [
  { id: "REQ-001", user: "Budi Santoso", type: "Plastik & Botol", weight: "3,2 kg", location: "Kec. Menteng", date: "07 Mei 2026, 09:00", status: "Menunggu" },
  { id: "REQ-002", user: "Siti Rahayu", type: "Kertas & Kardus", weight: "5 kg", location: "Kec. Kebayoran", date: "07 Mei 2026, 11:30", status: "Diproses" },
  { id: "REQ-003", user: "Ahmad Fauzi", type: "Logam", weight: "1,8 kg", location: "Kec. Tebet", date: "06 Mei 2026, 14:00", status: "Selesai" },
  { id: "REQ-004", user: "Rina Dewi", type: "Elektronik", weight: "2,5 kg", location: "Kec. Cempaka Putih", date: "06 Mei 2026, 16:15", status: "Ditolak" },
  { id: "REQ-005", user: "Hendra Saputra", type: "Plastik", weight: "4,1 kg", location: "Kec. Gambir", date: "05 Mei 2026, 10:00", status: "Selesai" },
];

const STATUS_MAP: Record<string, { color: string; icon: React.ReactNode }> = {
  Menunggu: { color: "bg-yellow-50 text-yellow-600 border-yellow-200", icon: <Clock className="w-3 h-3" /> },
  Diproses: { color: "bg-blue-50 text-blue-600 border-blue-200", icon: <AlertCircle className="w-3 h-3" /> },
  Selesai: { color: "bg-green-50 text-green-600 border-green-200", icon: <CheckCircle2 className="w-3 h-3" /> },
  Ditolak: { color: "bg-red-50 text-red-500 border-red-200", icon: <XCircle className="w-3 h-3" /> },
};

export default function RequestTable() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Permintaan Penjemputan</h1>
          <p className="text-sm text-muted-foreground">Kelola dan tindaklanjuti semua permintaan dari user</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari ID, nama user..." className="pl-9 h-9" />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> Filter Status
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">ID</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">User</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Jenis & Berat</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Lokasi</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Waktu</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {REQUESTS.map((req) => {
                  const s = STATUS_MAP[req.status];
                  return (
                    <tr key={req.id} className="border-b hover:bg-muted/20 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{req.id}</td>
                      <td className="px-4 py-3 font-medium">{req.user}</td>
                      <td className="px-4 py-3">
                        <p>{req.type}</p>
                        <p className="text-xs text-muted-foreground">{req.weight}</p>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                          <span className="text-xs text-muted-foreground">{req.location}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{req.date}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${s.color}`}
                        >
                          {s.icon} {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1 justify-end">
                          <Button variant="ghost" size="icon" className="w-7 h-7">
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          {req.status === "Menunggu" && (
                            <>
                              <Button variant="ghost" size="icon" className="w-7 h-7 text-primary">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              </Button>
                              <Button variant="ghost" size="icon" className="w-7 h-7 text-red-500">
                                <XCircle className="w-3.5 h-3.5" />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>Menampilkan 5 dari 142 permintaan</span>
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
