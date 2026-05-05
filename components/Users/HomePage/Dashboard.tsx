"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ChevronRight } from "lucide-react";

const STATS_DATA = [
  { label: "Total Poin", value: "1.250", change: "+12%" },
  { label: "Total Transaksi", value: "12", change: "+3" },
  { label: "Sampah Terkumpul", value: "87,5", unit: "kg", change: "+15%" },
  { label: "Poin Bulan Ini", value: "450", change: "+8%" },
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

const WASTE_TIPS = [
  "Pisahkan sampah organik dan anorganik sejak dari dapur.",
  "Pastikan botol plastik dalam keadaan kosong dan kering.",
  "Lipat kardus hingga pipih untuk menghemat ruang.",
  "Simpan sampah kertas di tempat yang teduh agar tidak lembap.",
];

export default function HomeDashboard() {
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      
      {/* Header - Teks Foreground yang lebih soft */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard Arkana</h1>
          <p className="text-sm text-muted-foreground font-medium">Halo, Aghis! Mari kelola sampahmu hari ini.</p>
        </div>
        <Button className="w-full md:w-auto gap-2 shadow-sm font-bold bg-primary text-white rounded-xl">
          <Plus className="w-4 h-4" /> Ajukan Penjemputan
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_DATA.map((stat, idx) => (
          <Card key={idx} className="border border-border shadow-sm bg-card">
            <CardContent className="p-4">
              <div className="flex items-center justify-end mb-2">
                <div className="flex items-center text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> {stat.change}
                </div>
              </div>
              <div className="space-y-0.5">
                <h3 className="text-2xl font-black tracking-tight text-foreground">
                  {stat.value}<span className="text-sm font-medium ml-0.5 opacity-60">{stat.unit || ""}</span>
                </h3>
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri & Tengah */}
        <div className="lg:col-span-2 space-y-6">
          <section>
            <div className="flex items-center gap-2 mb-4 px-1">
              <h2 className="text-lg font-bold text-foreground">Jadwal Penjemputan</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {UPCOMING_PICKUPS.map((pickup) => (
                <Card key={pickup.id} className="relative overflow-hidden border-l-4 border-l-primary shadow-sm bg-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-sm font-bold text-foreground">{pickup.type}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">{pickup.date}</p>
                      </div>
                      <Badge variant="secondary" className="text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold bg-muted text-muted-foreground border-none">
                        {pickup.status}
                      </Badge>
                    </div>
                    <div className="text-[11px] text-foreground/70 bg-muted/50 p-2 rounded-lg font-bold border border-border">
                      {pickup.time}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Tips Card */}
          <div className="bg-primary text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 opacity-90">Tips Edukasi Arkana</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {WASTE_TIPS.map((tip, idx) => (
                  <li key={idx} className="text-[11px] font-medium leading-relaxed flex items-start gap-2">
                    <span className="opacity-60">•</span>
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
          </div>
        </div>

        {/* Kolom Kanan (History) */}
        <section className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-lg font-bold text-foreground">Aktivitas</h2>
            <Button variant="ghost" size="sm" className="text-xs text-primary font-bold hover:bg-transparent p-0 h-auto">
              Semua <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          <div className="space-y-3">
            {RECENT_PICKUPS.map((pickup) => (
              <Card key={pickup.id} className="border-none shadow-sm bg-card hover:bg-muted/30 transition-colors cursor-pointer">
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-bold text-foreground">{pickup.type}</p>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-tighter">
                      <span>{pickup.weight}</span>
                      <span className="opacity-30">|</span>
                      <span>{pickup.date}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-primary">{pickup.points}</p>
                    <p className="text-[9px] text-muted-foreground uppercase font-bold tracking-widest opacity-60">Poin</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}