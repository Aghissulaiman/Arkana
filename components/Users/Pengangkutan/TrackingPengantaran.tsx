"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Truck,
  User,
  Phone,
  Calendar,
  Navigation
} from "lucide-react";

interface TrackingData {
  id: string;
  status: "menunggu" | "dijemput" | "dalam_perjalanan" | "sampai_agent" | "selesai";
  wasteType: string;
  estimatedWeight: string;
  actualWeight?: string;
  pickupDate: string;
  pickupTime: string;
  address: string;
  driver?: {
    name: string;
    phone: string;
    vehicle: string;
    plateNumber: string;
  };
  timeline: {
    title: string;
    time: string;
    description: string;
    completed: boolean;
  }[];
}

// Mock data tracking
const TRACKING_DATA: TrackingData = {
  id: "ARK-001",
  status: "dalam_perjalanan",
  wasteType: "Plastik & Botol",
  estimatedWeight: "2,5 kg",
  actualWeight: "2,8 kg",
  pickupDate: "15 Mei 2026",
  pickupTime: "09:00 - 12:00",
  address: "Jl. Contoh No. 123, Jakarta Selatan",
  driver: {
    name: "Bambang Suprianto",
    phone: "0812-3456-7890",
    vehicle: "Motor Roda Tiga",
    plateNumber: "B 1234 ABC"
  },
  timeline: [
    {
      title: "Pengajuan Diterima",
      time: "14 Mei 2026, 08:30",
      description: "Pengajuan penjemputan telah diterima sistem",
      completed: true
    },
    {
      title: "Petugas Menuju Lokasi",
      time: "15 Mei 2026, 08:45",
      description: "Petugas sedang dalam perjalanan menuju lokasi Anda",
      completed: true
    },
    {
      title: "Sampah Dijemput",
      time: "Sedang berlangsung",
      description: "Petugas sedang menuju lokasi penjemputan",
      completed: false
    },
    {
      title: "Sampai di Agen",
      time: "-",
      description: "Sampah akan disortir dan ditimbang di agen",
      completed: false
    },
    {
      title: "Selesai & Poin Masuk",
      time: "-",
      description: "Poin akan masuk ke akun Anda",
      completed: false
    }
  ]
};

const STATUS_CONFIG = {
  menunggu: { label: "Menunggu Konfirmasi", color: "bg-yellow-500/10 text-yellow-600 border-yellow-200", icon: Clock },
  dijemput: { label: "Sedang Dijemput", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Truck },
  dalam_perjalanan: { label: "Dalam Perjalanan ke Agen", color: "bg-blue-500/10 text-blue-600 border-blue-200", icon: Navigation },
  sampai_agent: { label: "Sampai di Agen", color: "bg-purple-500/10 text-purple-600 border-purple-200", icon: MapPin },
  selesai: { label: "Selesai", color: "bg-green-500/10 text-green-600 border-green-200", icon: CheckCircle }
};

export default function TrackingPengantaran() {
  const [tracking] = useState<TrackingData>(TRACKING_DATA);
  const status = STATUS_CONFIG[tracking.status];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Lacak Penjemputan</h1>
        <p className="text-sm text-muted-foreground">Pantau status penjemputan sampah Anda</p>
      </div>

      {/* Status Card */}
      <Card className="p-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${status.color.split(" ")[0]} flex items-center justify-center`}>
              <status.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Kode Pengajuan</p>
              <p className="text-xl font-bold text-foreground">{tracking.id}</p>
            </div>
          </div>
          <Badge className={`${status.color} text-sm px-4 py-1.5 border`}>
            {status.label}
          </Badge>
        </div>
      </Card>

      {/* Detail Penjemputan */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Detail Sampah */}
        <Card className="p-4 lg:col-span-2">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            Detail Sampah
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Jenis Sampah</span>
              <span className="text-sm font-medium text-foreground">{tracking.wasteType}</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Estimasi Berat</span>
              <span className="text-sm font-medium text-foreground">{tracking.estimatedWeight}</span>
            </div>
            {tracking.actualWeight && (
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-sm text-muted-foreground">Berat Aktual</span>
                <span className="text-sm font-semibold text-primary">{tracking.actualWeight}</span>
              </div>
            )}
            <div className="flex justify-between items-center pb-2 border-b border-border">
              <span className="text-sm text-muted-foreground">Jadwal Penjemputan</span>
              <span className="text-sm font-medium text-foreground">{tracking.pickupDate}, {tracking.pickupTime}</span>
            </div>
            <div className="flex items-start gap-2 pt-1">
              <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <span className="text-sm text-foreground">{tracking.address}</span>
            </div>
          </div>
        </Card>

        {/* Info Driver */}
        <Card className="p-4">
          <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Informasi Petugas
          </h3>
          {tracking.driver ? (
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Nama Petugas</p>
                <p className="text-sm font-medium text-foreground">{tracking.driver.name}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nomor Telepon</p>
                <div className="flex items-center gap-2">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  <p className="text-sm font-medium text-foreground">{tracking.driver.phone}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Kendaraan</p>
                <p className="text-sm font-medium text-foreground">{tracking.driver.vehicle}</p>
                <p className="text-xs text-muted-foreground">{tracking.driver.plateNumber}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full mt-2 gap-2">
                <Phone className="w-3 h-3" />
                Hubungi Petugas
              </Button>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">
              Petugas sedang ditugaskan
            </p>
          )}
        </Card>
      </div>

      {/* Timeline */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Clock className="w-4 h-4 text-primary" />
          Timeline Penjemputan
        </h3>
        <div className="relative">
          {/* Timeline vertical line */}
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border hidden md:block" />
          
          <div className="space-y-6">
            {tracking.timeline.map((item, index) => (
              <div key={index} className="flex gap-4">
                {/* Icon */}
                <div className="relative z-10">
                  {item.completed ? (
                    <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground" />
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 pb-4">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                    <p className={`text-sm font-medium ${
                      item.completed ? "text-foreground" : "text-muted-foreground"
                    }`}>
                      {item.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground">{item.time}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Action Button */}
      {tracking.status !== "selesai" && (
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1">
            Hubungi Dukungan
          </Button>
          <Button variant="outline" className="flex-1">
            Batalkan Penjemputan
          </Button>
        </div>
      )}
    </div>
  );
}