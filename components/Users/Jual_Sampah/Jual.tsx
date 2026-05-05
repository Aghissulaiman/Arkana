"use client";

import { useState } from "react";
import { Clock, MapPin, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Jual() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    { id: "plastic", name: "Plastik", poin: 500, unit: "kg" },
    { id: "paper", name: "Kertas", poin: 350, unit: "kg" },
    { id: "glass", name: "Kaca", poin: 200, unit: "kg" },
    { id: "metal", name: "Logam", poin: 1200, unit: "kg" },
    { id: "battery", name: "Baterai", poin: 800, unit: "kg" },
    { id: "electronic", name: "Elektronik", poin: 1500, unit: "kg" },
  ];

  const recentOrders = [
    { id: 1, type: "Plastik", status: "menunggu_jemput", date: "2 jam lalu" },
    { id: 2, type: "Kertas", status: "diproses", date: "Kemarin" },
    { id: 3, type: "Logam", status: "selesai", date: "2 hari lalu" },
  ];

  const getStatusText = (status: string) => {
    switch(status) {
      case "menunggu_jemput": return "Menunggu Jemput";
      case "diproses": return "Diproses";
      case "selesai": return "Selesai";
      default: return status;
    }
  };

  return (
    <div className="space-y-8">
      {/* Kategori Sampah */}
      <div>
        <h2 className="text-sm font-medium text-foreground mb-4">Kategori Sampah</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Card
              key={cat.id}
              className={`p-4 text-center cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === cat.id ? "border-primary" : ""
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <h3 className="font-medium text-foreground text-sm">{cat.name}</h3>
              <p className="text-primary font-semibold text-sm mt-2">
                {cat.poin} poin
              </p>
              <p className="text-xs text-muted-foreground">/{cat.unit}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Form */}
      {selectedCategory && (
        <Card className="p-5">
          {(() => {
            const cat = categories.find(c => c.id === selectedCategory);
            if (!cat) return null;
            return (
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-border">
                  <div>
                    <h4 className="font-medium text-foreground">{cat.name}</h4>
                    <p className="text-xs text-muted-foreground">{cat.poin} poin / {cat.unit}</p>
                  </div>
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className="text-xs text-muted-foreground hover:text-primary transition-colors"
                  >
                    Batal
                  </button>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground block mb-1">Catatan</label>
                  <textarea
                    placeholder="Contoh: Sampah sudah dipilah dalam karung"
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Alamat</label>
                    <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border bg-background">
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-foreground">Jl. Contoh No. 123</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground block mb-1">Jadwal</label>
                    <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-border bg-background">
                      <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                      <span className="text-xs text-foreground">Besok, 09:00 - 12:00</span>
                    </div>
                  </div>
                </div>

                <Button className="w-full">Ajukan</Button>

                <p className="text-xs text-muted-foreground text-center">
                  *Berat akan ditimbang agen saat penjemputan
                </p>
              </div>
            );
          })()}
        </Card>
      )}

      {/* Aktivitas */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-medium text-foreground">Aktivitas Terbaru</h2>
          <button className="text-xs text-primary hover:underline">Lihat semua</button>
        </div>
        <div className="space-y-3">
          {recentOrders.map((order) => (
            <div key={order.id} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-foreground">{order.type}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              <Badge variant={order.status === "selesai" ? "primary" : "secondary"} className="text-xs">
                {getStatusText(order.status)}
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="flex items-center gap-2 pt-2">
        <Clock className="w-4 h-4 text-primary" />
        <p className="text-xs text-muted-foreground">
          Pisahkan sampah basah & kering. Cuci plastik/kaca sebelum dijual.
        </p>
      </div>
    </div>
  );
}