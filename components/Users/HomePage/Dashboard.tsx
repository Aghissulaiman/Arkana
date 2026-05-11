"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Star,
  CheckCircle2,
  Bell,
  ChevronRight,
  Recycle,
  Zap,
  FileText,
  Droplets,
  Monitor,
} from "lucide-react";
import Link from "next/link";

type Agent = {
  id: string;
  name: string;
  distance_km: number;
  rating: number;
  review_count: number;
  is_verified: boolean;
  is_open: boolean;
  waste_types: string[];
  points_per_kg: number;
  banner_bg: string;
  icon_bg: string;
  Icon: React.ElementType;
  icon_color: string;
};

const MOCK_AGENTS: Agent[] = [
  {
    id: "1",
    name: "Hijau Bersama",
    distance_km: 1.2,
    rating: 4.9,
    review_count: 128,
    is_verified: true,
    is_open: true,
    waste_types: ["Organik", "Plastik", "Kertas"],
    points_per_kg: 50,
    banner_bg: "bg-gradient-to-br from-emerald-200/50 to-emerald-50",
    icon_bg: "bg-emerald-100",
    Icon: Recycle,
    icon_color: "text-emerald-600",
  },
  {
    id: "2",
    name: "EcoPoint Beji",
    distance_km: 2.4,
    rating: 4.7,
    review_count: 89,
    is_verified: true,
    is_open: true,
    waste_types: ["Elektronik", "Logam"],
    points_per_kg: 120,
    banner_bg: "bg-gradient-to-br from-blue-200/50 to-blue-50",
    icon_bg: "bg-blue-100",
    Icon: Zap,
    icon_color: "text-blue-600",
  },
  {
    id: "3",
    name: "Kertas Mas Jaya",
    distance_km: 3.1,
    rating: 4.6,
    review_count: 54,
    is_verified: false,
    is_open: true,
    waste_types: ["Kertas", "Kardus"],
    points_per_kg: 30,
    banner_bg: "bg-gradient-to-br from-amber-200/50 to-amber-50",
    icon_bg: "bg-amber-100",
    Icon: FileText,
    icon_color: "text-amber-600",
  },
  {
    id: "4",
    name: "Plastik Lestari",
    distance_km: 3.8,
    rating: 4.5,
    review_count: 41,
    is_verified: false,
    is_open: false,
    waste_types: ["Plastik", "PET"],
    points_per_kg: 45,
    banner_bg: "bg-gradient-to-br from-rose-200/50 to-rose-50",
    icon_bg: "bg-rose-100",
    Icon: Droplets,
    icon_color: "text-rose-500",
  },
  {
    id: "5",
    name: "ReTech Daur Ulang",
    distance_km: 4.5,
    rating: 4.3,
    review_count: 33,
    is_verified: true,
    is_open: true,
    waste_types: ["Elektronik", "Baterai"],
    points_per_kg: 200,
    banner_bg: "bg-gradient-to-br from-violet-200/50 to-violet-50",
    icon_bg: "bg-violet-100",
    Icon: Monitor,
    icon_color: "text-violet-500",
  },
];

const WASTE_CHIPS = [
  "Semua",
  "Terdekat",
  "Plastik",
  "Kertas",
  "Elektronik",
  "Logam",
  "Kaca",
];

const TAG_COLORS: Record<string, string> = {
  Organik: "bg-emerald-100/80 text-emerald-800",
  Plastik: "bg-blue-100/80 text-blue-800",
  Kertas: "bg-amber-100/80 text-amber-800",
  Kardus: "bg-orange-100/80 text-orange-800",
  Elektronik: "bg-pink-100/80 text-pink-800",
  Logam: "bg-slate-200/80 text-slate-800",
  PET: "bg-cyan-100/80 text-cyan-800",
  Baterai: "bg-violet-100/80 text-violet-800",
};

export default function HomeDashboard() {
  const [search, setSearch] = useState("");
  const [activeChip, setActiveChip] = useState("Semua");

  const filteredAgents = MOCK_AGENTS.filter((a) => {
    const matchSearch =
      search === "" ||
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.waste_types.some((w) => w.toLowerCase().includes(search.toLowerCase()));
    const matchChip =
      activeChip === "Semua" ||
      activeChip === "Terdekat" ||
      a.waste_types.some((w) =>
        w.toLowerCase().includes(activeChip.toLowerCase()),
      );
    return matchSearch && matchChip;
  });

  const featuredAgents = filteredAgents.filter((a) => a.is_verified);

  return (
    <div className="w-full min-h-screen bg-slate-50 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-10 space-y-12">
        {/* HEADING & NOTIFICATION */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary mb-1 uppercase tracking-wider">
              Lokasi Saat Ini
            </p>
            <div className="flex items-center gap-2">
              <MapPin className="w-7 h-7 text-slate-800" />
              <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Depok
              </h1>
            </div>
          </div>
          <Link href="/user/notification">
            <Button
              variant="outline"
              size="icon"
              className="w-12 h-12 rounded-full shadow-sm bg-white border-slate-200 text-slate-600 hover:bg-slate-100 transition-all"
            >
              <Bell className="w-5 h-5" />
            </Button>
          </Link>
        </div>

        {/* HERO SEARCH SECTION */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-slate-400" />
            </div>
            <Input
              className="pl-14 pr-6 py-7 rounded-2xl bg-slate-50 border-transparent text-lg focus-visible:ring-2 focus-visible:ring-primary focus-visible:bg-white transition-all w-full shadow-inner"
              placeholder="Cari agen atau jenis sampah..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Button className="h-[60px] px-8 rounded-2xl gap-3 text-base font-semibold shadow-md bg-primary hover:bg-primary/90 transition-all text-white w-full md:w-auto">
            <SlidersHorizontal className="w-5 h-5" />
            Filter
          </Button>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-800">Kategori Sampah</h2>
          <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 md:mx-0 md:px-0">
            {WASTE_CHIPS.map((chip) => {
              const isActive = activeChip === chip;
              return (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`shrink-0 px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/30 transform scale-105"
                      : "bg-white text-slate-600 shadow-sm border border-slate-200 hover:border-primary/50 hover:bg-slate-50"
                  }`}
                >
                  {chip}
                </button>
              );
            })}
          </div>
        </div>

        {/* FEATURED AGENTS */}
        {featuredAgents.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Agen Unggulan
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAgents.map((agent) => {
                const { Icon } = agent;
                return (
                  <Link
                    key={agent.id}
                    href={`/dashboard/agen/${agent.id}`}
                    className="block group"
                  >
                    <Card className="overflow-hidden rounded-[2rem] border-0 shadow-md bg-white hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full flex flex-col">
                      <div
                        className={`${agent.banner_bg} h-36 flex items-center justify-center relative p-6 transition-colors duration-500 group-hover:opacity-90`}
                      >
                        <div className="absolute top-4 right-4">
                          {agent.is_verified && (
                            <div className="bg-white/95 backdrop-blur-md text-emerald-600 text-xs px-3 py-1.5 rounded-full flex items-center gap-1.5 font-bold shadow-sm">
                              <CheckCircle2 className="w-4 h-4" />
                              Terverifikasi
                            </div>
                          )}
                        </div>
                        <div
                          className={`${agent.icon_bg} w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-500`}
                        >
                          <Icon className={`w-10 h-10 ${agent.icon_color}`} />
                        </div>
                      </div>
                      <CardContent className="p-7 flex flex-col flex-1">
                        <div className="mb-4">
                          <h3 className="font-extrabold text-xl text-slate-900 mb-1 line-clamp-1">
                            {agent.name}
                          </h3>
                          <div className="flex items-center gap-2 text-slate-500 font-medium text-sm">
                            <MapPin className="w-4 h-4 text-primary" />
                            {agent.distance_km} km dari lokasi Anda
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                          {agent.waste_types.map((w) => (
                            <span
                              key={w}
                              className={`text-xs px-3 py-1.5 rounded-lg font-bold ${TAG_COLORS[w] ?? "bg-slate-100 text-slate-600"}`}
                            >
                              {w}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto pt-5 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">
                              Harga Tukar
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-black text-primary">
                                {agent.points_per_kg}
                              </span>
                              <span className="text-sm font-semibold text-slate-500">
                                poin/kg
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">
                              Rating
                            </span>
                            <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg">
                              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                              <span className="text-sm font-bold text-amber-700">
                                {agent.rating}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ALL AGENTS */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Semua Agen Terdekat
            </h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary hover:bg-primary/10 font-bold text-sm px-4 h-10 rounded-xl transition-colors"
            >
              Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>

          {filteredAgents.length === 0 ? (
            <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm">
              <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-10 h-10 text-slate-300" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 mb-3">
                Tidak Ada Agen Ditemukan
              </h3>
              <p className="text-slate-500 max-w-md mx-auto text-lg">
                Coba sesuaikan kata kunci pencarian atau ubah filter untuk
                menemukan agen yang tepat.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredAgents.map((agent) => {
                const { Icon } = agent;
                return (
                  <Link
                    key={agent.id}
                    href={`/dashboard/agen/${agent.id}`}
                    className="block group"
                  >
                    <Card className="p-5 rounded-3xl border border-slate-100 shadow-sm bg-white hover:shadow-xl hover:border-primary/20 transition-all duration-300 flex items-center gap-5">
                      <div
                        className={`${agent.icon_bg} w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}
                      >
                        <Icon className={`w-7 h-7 ${agent.icon_color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-extrabold text-lg text-slate-900 truncate pr-2">
                            {agent.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`px-3 py-1 text-xs font-bold border-0 rounded-lg shrink-0 ${
                              agent.is_open
                                ? "text-emerald-700 bg-emerald-100"
                                : "text-rose-700 bg-rose-100"
                            }`}
                          >
                            {agent.is_open ? "Buka" : "Tutup"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-500 font-medium mb-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-4 h-4 text-primary/70" />{" "}
                            {agent.distance_km} km
                          </span>
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />{" "}
                            {agent.rating}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-slate-400 font-medium truncate max-w-[120px]">
                            {agent.waste_types.slice(0, 2).join(", ")}
                          </div>
                          <span className="text-sm font-black text-primary">
                            {agent.points_per_kg}{" "}
                            <span className="text-xs font-semibold text-slate-400">
                              poin/kg
                            </span>
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
