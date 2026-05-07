"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Eye, Truck, CheckCircle2, MapPin } from "lucide-react";

const SHIPMENTS = [
  { id: "SHP-001", driver: "Pak Joko", user: "Budi Santoso", address: "Jl. Menteng No.12", type: "Plastik", weight: "3,2 kg", pickup: "07 Mei 2026, 09:00", status: "Dalam Perjalanan" },
  { id: "SHP-002", driver: "Pak Andi", user: "Siti Rahayu", address: "Jl. Kebayoran No.5", type: "Kertas", weight: "5 kg", pickup: "07 Mei 2026, 11:30", status: "Terjadwal" },
  { id: "SHP-003", driver: "Pak Bowo", user: "Ahmad Fauzi", address: "Jl. Tebet No.20", type: "Logam", weight: "1,8 kg", pickup: "06 Mei 2026, 14:00", status: "Selesai" },
  { id: "SHP-004", driver: "-", user: "Rina Dewi", address: "Jl. Cempaka Putih No.7", type: "Elektronik", weight: "2,5 kg", pickup: "06 Mei 2026, 16:00", status: "Menunggu Driver" },
];

const STATUS_STYLE: Record<string, string> = {
  "Dalam Perjalanan": "border-blue-200 bg-blue-50 text-blue-600",
  "Terjadwal": "border-yellow-200 bg-yellow-50 text-yellow-600",
  "Selesai": "border-green-200 bg-green-50 text-green-600",
  "Menunggu Driver": "border-orange-200 bg-orange-50 text-orange-600",
};

export default function ShipmentTable() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen Pengiriman</h1>
          <p className="text-sm text-muted-foreground">Pantau status pengiriman dan tugaskan driver</p>
        </div>
        <Button size="sm">Assign Driver</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari ID, driver, user..." className="pl-9 h-9" />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">ID</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Driver</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">User</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Alamat</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Sampah</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Jadwal</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {SHIPMENTS.map((s) => (
                  <tr key={s.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.id}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <Truck className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="text-sm">{s.driver}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{s.user}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-muted-foreground shrink-0" />
                        <span className="text-xs text-muted-foreground">{s.address}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-sm">{s.type}</p>
                      <p className="text-xs text-muted-foreground">{s.weight}</p>
                    </td>
                    <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{s.pickup}</td>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className={`text-[11px] ${STATUS_STYLE[s.status] ?? ""}`}>
                        {s.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="w-7 h-7">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        {s.status === "Terjadwal" && (
                          <Button variant="ghost" size="icon" className="w-7 h-7 text-primary">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>Menampilkan 4 dari 38 pengiriman aktif</span>
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
