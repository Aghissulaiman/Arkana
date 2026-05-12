"use client";

import React, { useState, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
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
  Search
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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

function DashboardContent() {
  const searchParams = useSearchParams();
  const search = searchParams?.get("q") || "";
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
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-8 space-y-10">
        {/* HEADING & NOTIFICATION */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
              Lokasi Saat Ini
            </p>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-slate-800" />
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Depok
              </h1>
            </div>
          </div>
        </div>

        {/* CATEGORY CHIPS */}
        <div className="space-y-4">
          <h2 className="text-base font-bold text-slate-800">Kategori Sampah</h2>
          <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
            {WASTE_CHIPS.map((chip) => {
              const isActive = activeChip === chip;
              return (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-white shadow-md shadow-primary/30 transform scale-105"
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
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                Agen Unggulan
              </h2>
            </div>
            {/* Reduced Grid gaps and card sizes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {featuredAgents.map((agent) => {
                const { Icon } = agent;
                return (
                  <Link
                    key={agent.id}
                    href={`/user/request?agentId=${agent.id}`}
                    className="block group"
                  >
                    <Card className="overflow-hidden rounded-2xl border-0 shadow-sm bg-white hover:shadow-lg transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                      <div
                        className={`${agent.banner_bg} h-24 flex items-center justify-center relative p-4 transition-colors duration-300 group-hover:opacity-90`}
                      >
                        <div className="absolute top-2 right-2">
                          {agent.is_verified && (
                            <div className="bg-white/95 backdrop-blur-md text-emerald-600 text-[10px] px-2 py-1 rounded-full flex items-center gap-1 font-bold shadow-sm">
                              <CheckCircle2 className="w-3 h-3" />
                              Terverifikasi
                            </div>
                          )}
                        </div>
                        <div
                          className={`${agent.icon_bg} w-12 h-12 rounded-xl flex items-center justify-center shadow-sm transform group-hover:scale-110 transition-transform duration-300`}
                        >
                          <Icon className={`w-6 h-6 ${agent.icon_color}`} />
                        </div>
                      </div>
                      <CardContent className="p-4 flex flex-col flex-1">
                        <div className="mb-3">
                          <h3 className="font-bold text-base text-slate-900 mb-1 line-clamp-1">
                            {agent.name}
                          </h3>
                          <div className="flex items-center gap-1.5 text-slate-500 font-medium text-xs">
                            <MapPin className="w-3.5 h-3.5 text-primary" />
                            {agent.distance_km} km dari lokasi
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {agent.waste_types.map((w) => (
                            <span
                              key={w}
                              className={`text-[10px] px-2 py-1 rounded-md font-bold ${TAG_COLORS[w] ?? "bg-slate-100 text-slate-600"}`}
                            >
                              {w}
                            </span>
                          ))}
                        </div>

                        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
                          <div className="flex flex-col">
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">
                              Harga Tukar
                            </span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-lg font-black text-primary">
                                {agent.points_per_kg}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">
                                poin/kg
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mb-0.5">
                              Rating
                            </span>
                            <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md">
                              <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span className="text-xs font-bold text-amber-700">
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
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              Semua Agen Terdekat
            </h2>
            <Button
              variant="ghost"
              className="text-primary hover:text-primary hover:bg-primary/10 font-bold text-xs px-3 h-8 rounded-lg transition-colors"
            >
              Lihat Semua <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>

          {filteredAgents.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center shadow-sm">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                Tidak Ada Agen Ditemukan
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto">
                Coba sesuaikan kata kunci pencarian atau ubah filter untuk menemukan agen yang tepat.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAgents.map((agent) => {
                const { Icon } = agent;
                return (
                  <Link
                    key={agent.id}
                    href={`/user/request?agentId=${agent.id}`}
                    className="block group"
                  >
                    <Card className="p-4 rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-md hover:border-primary/20 transition-all duration-300 flex items-center gap-4">
                      <div
                        className={`${agent.icon_bg} w-12 h-12 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-300`}
                      >
                        <Icon className={`w-6 h-6 ${agent.icon_color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <h3 className="font-bold text-sm text-slate-900 truncate pr-2">
                            {agent.name}
                          </h3>
                          <Badge
                            variant="outline"
                            className={`px-2 py-0.5 text-[10px] font-bold border-0 rounded-md shrink-0 ${
                              agent.is_open
                                ? "text-emerald-700 bg-emerald-100"
                                : "text-rose-700 bg-rose-100"
                            }`}
                          >
                            {agent.is_open ? "Buka" : "Tutup"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500 font-medium mb-1.5">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-primary/70" />{" "}
                            {agent.distance_km} km
                          </span>
                          <span className="w-1 h-1 rounded-full bg-slate-300" />
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />{" "}
                            {agent.rating}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">
                            {agent.waste_types.slice(0, 2).join(", ")}
                          </div>
                          <span className="text-xs font-black text-primary">
                            {agent.points_per_kg}{" "}
                            <span className="text-[10px] font-semibold text-slate-400">
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

export default function HomeDashboard() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}
