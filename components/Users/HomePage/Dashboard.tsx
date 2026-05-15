"use client";

import React, { useState, Suspense, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Star,
  ChevronRight,
  Search,
  Loader2,
  Package,
  Leaf,
  ArrowRight,
  Navigation,
  Recycle,
  Globe,
  Clock,
  Coffee,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

type Agent = {
  id: string;
  user_id: string;
  agent_name: string;
  phone: string;
  address: string;
  service_area: string;
  waste_categories: string[];
  is_active: boolean;
  rating?: number;
  distance_km?: number;
  price_per_kg?: number;
  is_open?: boolean;
  open_status?: "open" | "closed" | "break";
  open_message?: string;
};

type PriceCatalog = {
  waste_type: string;
  price_per_kg: number;
};

type AgentSchedule = {
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  break_start: string | null;
  break_end: string | null;
};

const WASTE_CHIPS = [
  "Semua",
  "Terdekat",
  "plastic",
  "paper",
  "cardboard",
  "glass",
  "aluminium",
  "metal",
  "electronic",
  "mixed",
];

const WASTE_LABELS: Record<string, string> = {
  plastic: "Plastik",
  paper: "Kertas",
  cardboard: "Kardus",
  glass: "Kaca",
  aluminium: "Aluminium",
  metal: "Logam",
  electronic: "Elektronik",
  mixed: "Campuran",
};

const dummy =
  "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format";

function getRandomRating() {
  return +(4 + Math.random() * 0.9).toFixed(1);
}

function checkAgentOpenStatus(schedules: AgentSchedule[]): { is_open: boolean; status: "open" | "closed" | "break"; message: string } {
  const now = new Date();
  const dayOfWeek = now.getDay(); // 0=Minggu, 1=Senin, ...
  // Konversi ke 0=Senin, 6=Minggu
  const dayIndex = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  const todaySchedule = schedules.find(s => s.day_of_week === dayIndex);
  
  if (!todaySchedule || !todaySchedule.is_open) {
    return {
      is_open: false,
      status: "closed",
      message: "Tutup hari ini",
    };
  }
  
  const currentTime = now.getHours() * 60 + now.getMinutes();
  const openTime = parseTimeToMinutes(todaySchedule.open_time);
  const closeTime = parseTimeToMinutes(todaySchedule.close_time);
  
  if (currentTime < openTime) {
    return {
      is_open: false,
      status: "closed",
      message: `Buka pukul ${todaySchedule.open_time}`,
    };
  }
  
  if (currentTime > closeTime) {
    return {
      is_open: false,
      status: "closed",
      message: `Tutup pukul ${todaySchedule.close_time}`,
    };
  }
  
  // Cek jam istirahat
  if (todaySchedule.break_start && todaySchedule.break_end) {
    const breakStart = parseTimeToMinutes(todaySchedule.break_start);
    const breakEnd = parseTimeToMinutes(todaySchedule.break_end);
    
    if (currentTime >= breakStart && currentTime <= breakEnd) {
      return {
        is_open: false,
        status: "break",
        message: `Istirahat ${todaySchedule.break_start} - ${todaySchedule.break_end}`,
      };
    }
  }
  
  return {
    is_open: true,
    status: "open",
    message: "Buka",
  };
}

function parseTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const supabase = createClientSupabaseClient();
  const search = searchParams?.get("q") || "";
  const [activeChip, setActiveChip] = useState("Semua");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState("Depok");

  useEffect(() => {
    const fetchUserLocation = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("address")
          .eq("user_id", user.id)
          .single();

        if (profile?.address) {
          const city = profile.address.split(",").slice(-2)[0]?.trim() || "Lokasi Anda";
          setUserLocation(city);
        }
      }
    };
    fetchUserLocation();
  }, [supabase]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      
      // Ambil agent
      const { data: agentsData } = await supabase
        .from("agents")
        .select("*")
        .eq("is_active", true);

      // Ambil harga
      const { data: priceData } = await supabase
        .from("price_catalog")
        .select("waste_type, price_per_kg")
        .is("agent_id", null); // Ambil harga global

      // Ambil jadwal untuk semua agent
      const agentIds = agentsData?.map(a => a.id) || [];
      const { data: schedulesData } = await supabase
        .from("agent_schedules")
        .select("*")
        .in("agent_id", agentIds);

      // Group schedules by agent_id
      const schedulesByAgent = new Map<string, AgentSchedule[]>();
      schedulesData?.forEach(s => {
        if (!schedulesByAgent.has(s.agent_id)) {
          schedulesByAgent.set(s.agent_id, []);
        }
        schedulesByAgent.get(s.agent_id)!.push(s);
      });

      // Proses agent
      const processedAgents = (agentsData || []).map(agent => {
        const schedules = schedulesByAgent.get(agent.id) || [];
        const openStatus = checkAgentOpenStatus(schedules);
        
        return {
          ...agent,
          rating: getRandomRating(),
          distance_km: +(Math.random() * 5 + 0.5).toFixed(1),
          price_per_kg: agent.waste_categories?.[0]
            ? priceData?.find(p => p.waste_type === agent.waste_categories[0])?.price_per_kg || 500
            : 500,
          is_open: openStatus.is_open,
          open_status: openStatus.status,
          open_message: openStatus.message,
        };
      });

      processedAgents.sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999));
      setAgents(processedAgents);
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const filteredAgents = agents.filter((agent) => {
    const matchSearch =
      search === "" ||
      agent.agent_name.toLowerCase().includes(search.toLowerCase()) ||
      agent.service_area?.toLowerCase().includes(search.toLowerCase());

    const matchChip =
      activeChip === "Semua" ||
      activeChip === "Terdekat" ||
      agent.waste_categories?.some(
        (w) => w.toLowerCase() === activeChip.toLowerCase()
      );

    return matchSearch && matchChip;
  });

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        <p className="text-[10px] font-bold tracking-widest text-emerald-800/40 uppercase">
          Memuat Agen Arkana...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FBFDFB] font-sans text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-10">
        {/* HEADER SECTION */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-emerald-600 font-bold tracking-widest uppercase text-[10px]">
              <Navigation className="w-3 h-3" />
              <span>Lokasi Penjemputan</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-800">
              {userLocation}
              <span className="text-emerald-500">.</span>
            </h1>
            <p className="text-slate-500 text-sm">
              Mari kelola sampahmu bersama agen terdekat.
            </p>
          </div>

          <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-emerald-50 shadow-sm">
            <div className="bg-emerald-50 p-2 rounded-xl">
              <Globe className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="pr-4">
              <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">
                Total Agen
              </p>
              <p className="text-sm font-bold text-slate-700">
                {agents.length} Tersedia
              </p>
            </div>
          </div>
        </header>

        {/* FILTER SECTION */}
        <div className="flex gap-2.5 overflow-x-auto pb-4 scrollbar-hide">
          {WASTE_CHIPS.map((chip) => {
            const isActive = activeChip === chip;
            return (
              <button
                key={chip}
                onClick={() => setActiveChip(chip)}
                className={`shrink-0 px-5 py-2 rounded-full text-[11px] font-bold transition-all duration-300 border ${
                  isActive
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-md shadow-emerald-100"
                    : "bg-white border-slate-200 text-slate-500 hover:border-emerald-300 hover:text-emerald-600"
                }`}
              >
                {WASTE_LABELS[chip] || chip}
              </button>
            );
          })}
        </div>

        {/* AGENTS GRID */}
        {filteredAgents.length === 0 ? (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-100">
            <Search className="w-10 h-10 text-slate-200 mx-auto mb-3" />
            <p className="text-xs font-bold text-slate-400">
              Agen tidak ditemukan.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAgents.map((agent) => (
              <Link
                key={agent.id}
                href={agent.is_open ? `/user/request/${agent.id}` : "#"}
                className={`group ${!agent.is_open ? "cursor-not-allowed opacity-70" : ""}`}
                onClick={(e) => {
                  if (!agent.is_open) {
                    e.preventDefault();
                  }
                }}
              >
                <Card className="h-full overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-sm group-hover:shadow-md group-hover:border-emerald-100 transition-all duration-300 flex flex-col">
                  {/* Gambar Toko / Agent */}
                  <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={dummy}
                      alt={agent.agent_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    
                    {/* Status Badge (Open/Closed/Break) */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {agent.open_status === "open" && (
                        <Badge className="bg-green-500 text-white text-[9px] border-none px-2 py-0.5">
                          <Clock className="w-2.5 h-2.5 mr-1" />
                          Buka
                        </Badge>
                      )}
                      {agent.open_status === "closed" && (
                        <Badge className="bg-red-500 text-white text-[9px] border-none px-2 py-0.5">
                          <XCircle className="w-2.5 h-2.5 mr-1" />
                          Tutup
                        </Badge>
                      )}
                      {agent.open_status === "break" && (
                        <Badge className="bg-amber-500 text-white text-[9px] border-none px-2 py-0.5">
                          <Coffee className="w-2.5 h-2.5 mr-1" />
                          Istirahat
                        </Badge>
                      )}
                      
                      {agent.rating && agent.rating >= 4.8 && (
                        <Badge className="bg-amber-400 text-white text-[9px] border-none px-2 py-0.5">
                          <Star className="w-2.5 h-2.5 fill-white mr-1" /> Unggulan
                        </Badge>
                      )}
                    </div>
                    
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg shadow-sm">
                        <p className="text-[10px] font-black text-emerald-700">
                          {agent.distance_km} KM
                        </p>
                      </div>
                    </div>
                    
                    {/* Overlay if closed */}
                    {!agent.is_open && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-3 py-1.5 text-center">
                          <p className="text-[10px] font-bold text-red-600">
                            {agent.open_message}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-5 flex flex-col flex-grow">
                    <div className="mb-4">
                      <h3 className="text-base font-bold text-slate-800 truncate mb-1">
                        {agent.agent_name}
                      </h3>
                      <div className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3 h-3 text-emerald-500" />
                        <span className="text-[10px] font-medium truncate">
                          {agent.service_area}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-6">
                      {agent.waste_categories?.slice(0, 3).map((w) => (
                        <span
                          key={w}
                          className="text-[9px] px-2.5 py-0.5 rounded-md font-bold bg-slate-50 text-slate-500 border border-slate-100 uppercase"
                        >
                          {WASTE_LABELS[w] || w}
                        </span>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                          Potensi Poin
                        </p>
                        <p className="text-lg font-extrabold text-emerald-600 tracking-tight">
                          {agent.price_per_kg?.toLocaleString()}
                          <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase">
                            pts/kg
                          </span>
                        </p>
                      </div>
                      <div className={`p-2 rounded-lg transition-all duration-300 ${
                        agent.is_open 
                          ? "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white" 
                          : "bg-gray-100 text-gray-400"
                      }`}>
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                    
                    {/* Info jadwal jika tutup */}
                    {!agent.is_open && agent.open_message && (
                      <p className="text-[9px] text-red-500 mt-2 text-center">
                        {agent.open_message}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function HomeDashboard() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}