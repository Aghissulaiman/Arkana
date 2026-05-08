"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Search, Calendar, Weight, Coins, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const history = [
    {
      id: "REQ-000",
      customer: "Budi Jaya",
      address: "Jl. Sudirman No. 1, Jakarta Pusat",
      date: "07 Mei 2026, 08:30",
      weight: "15 kg",
      points: "+150",
      type: "Organik",
    },
    {
      id: "REQ-999",
      customer: "Warung Bu Ani",
      address: "Jl. Thamrin No. 4, Jakarta Pusat",
      date: "06 Mei 2026, 14:15",
      weight: "22 kg",
      points: "+220",
      type: "Campuran",
    },
    {
      id: "REQ-998",
      customer: "Klinik Sehat",
      address: "Jl. Diponegoro 10, Jakarta",
      date: "06 Mei 2026, 10:00",
      weight: "8 kg",
      points: "+80",
      type: "Anorganik",
    },
    {
      id: "REQ-997",
      customer: "SMA N 1 Jakarta",
      address: "Jl. Budi Utomo No. 7",
      date: "05 Mei 2026, 11:30",
      weight: "45 kg",
      points: "+450",
      type: "Kertas & Plastik",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold">Riwayat Penjemputan</h1>
          <p className="text-sm text-muted-foreground">Catatan tugas yang sudah Anda selesaikan</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari Riwayat..." className="pl-9 h-9" />
          </div>
          <Button variant="outline" size="sm" className="h-9 shrink-0">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {history.map((item) => (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:items-center hover:bg-muted/30 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-600/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base">{item.customer}</h3>
                    <Badge variant="outline" className="text-[10px]">{item.id}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-1">{item.address}</p>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Badge variant="secondary" className="font-normal bg-green-50 text-green-700">{item.type}</Badge>
                    </span>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end gap-3 sm:gap-1 mt-2 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0">
                  <div className="flex items-center gap-1.5 text-sm font-medium">
                    <Weight className="w-4 h-4 text-muted-foreground" />
                    {item.weight}
                  </div>
                  <div className="flex items-center gap-1.5 text-sm font-bold text-green-600">
                    <Coins className="w-4 h-4" />
                    {item.points} pts
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
