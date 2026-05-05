"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ChevronRight } from "lucide-react";
import Link from "next/link";

const STATS_DATA = [
  { label: "Total Poin", value: "1.250", change: "+12%" },
  { label: "Transaksi", value: "12", change: "+3" },
  { label: "Sampah", value: "87,5", unit: "kg", change: "+15%" },
  { label: "Bulan Ini", value: "450", change: "+8%" },
];

const UPCOMING_PICKUPS = [
  { id: 1, type: "Plastik & Botol", date: "Besok", time: "09:00 - 12:00", status: "Waiting" },
  { id: 2, type: "Kertas Kardus", date: "15 Mei 2026", time: "14:00 - 16:00", status: "Scheduled" },
];

const RECENT_PICKUPS = [
  { id: 1, type: "Plastik", weight: "2,5 kg", points: "+1.250", date: "2 hari lalu" },
  { id: 2, type: "Kertas", weight: "5 kg", points: "+1.750", date: "5 hari lalu" },
  { id: 3, type: "Logam", weight: "1,2 kg", points: "+1.440", date: "1 minggu lalu" },
];

export default function HomeDashboard() {
  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Kelola aktivitas sampah kamu dengan mudah</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-md">
          <Plus className="w-4 h-4" /> Penjemputan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_DATA.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span className="text-xs text-primary flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {stat.change}
                </span>
              </div>
              <h2 className="text-xl font-bold">
                {stat.value}
                <span className="text-sm ml-1 text-muted-foreground">{stat.unit}</span>
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left */}
        <div className="lg:col-span-2 space-y-6">

          {/* Jadwal */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Jadwal Penjemputan</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {UPCOMING_PICKUPS.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition">
                  <CardContent className="p-4 space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{item.type}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                      <Badge variant="outline">{item.status}</Badge>
                    </div>
                    <div className="text-xs bg-muted px-2 py-1 rounded">
                      {item.time}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Tips */}
          <Card className="bg-primary text-white">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold">Tips Pengelolaan Sampah</h3>
              <ul className="text-sm space-y-1 list-disc ml-4">
                <li>Pisahkan sampah organik & anorganik</li>
                <li>Pastikan botol bersih & kering</li>
                <li>Lipat kardus agar hemat tempat</li>
                <li>Simpan kertas di tempat kering</li>
              </ul>
            </CardContent>
          </Card>

        </div>

        {/* Right */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Aktivitas</h2>
            <Link href="/dashboard/riwayat">
            <Button variant="ghost" size="sm" className="text-primary">
              Semua <ChevronRight className="w-4 h-4" />
            </Button>
            </Link>
          </div>

          {RECENT_PICKUPS.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition cursor-pointer">
              <CardContent className="p-4 flex justify-between">
                <div>
                  <p className="font-medium">{item.type}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.weight} • {item.date}
                  </p>
                </div>
                <p className="text-primary font-semibold">{item.points}</p>
              </CardContent>
            </Card>
          ))}
        </div>

      </div>
    </div>
  );
}
