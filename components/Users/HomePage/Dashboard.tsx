"use client";

import React, { useState, Suspense, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Star,
  Search,
  Loader2,
  ArrowRight,
  Navigation,
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

function DashboardContent() {
  const searchParams = useSearchParams();
  const supabase = createClientSupabaseClient();
  const search = searchParams?.get("q") || "";
  const [activeChip, setActiveChip] = useState("Semua");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState("Depok");
  const [searchQuery, setSearchQuery] = useState(search);

  useEffect(() => {
    const handler = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      if (searchQuery) {
        params.set("q", searchQuery);
      } else {
        params.delete("q");
      }
      window.history.replaceState(null, "", `?${params.toString()}`);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    const fetchUserLocation = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("address")
          .eq("user_id", user.id)
          .single();
        if (profile?.address) {
          const city =
            profile.address.split(",").slice(-2)[0]?.trim() || "Lokasi Anda";
          setUserLocation(city);
        }
      }
    };
    fetchUserLocation();
  }, [supabase]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      const { data: agentsData } = await supabase
        .from("agents")
        .select("*")
        .eq("is_active", true);

      const { data: priceData } = await supabase
        .from("price_catalog")
        .select("waste_type, price_per_kg")
        .is("agent_id", null);

      const processedAgents = (agentsData || []).map((agent) => {
        return {
          ...agent,
          rating: getRandomRating(),
          distance_km: +(Math.random() * 5 + 0.5).toFixed(1),
          price_per_kg: agent.waste_categories?.[0]
            ? priceData?.find((p) => p.waste_type === agent.waste_categories[0])
                ?.price_per_kg || 500
            : 500,
          // 🔥 SEMUA AGENT DIANGGAP BUKA
          is_open: true,
          open_status: "open" as const,
          open_message: "Buka",
        };
      });

      processedAgents.sort(
        (a, b) => (a.distance_km || 999) - (b.distance_km || 999)
      );
      setAgents(processedAgents);
      setLoading(false);
    };

    fetchData();
  }, [supabase]);

  const filteredAgents = agents.filter((agent) => {
    const matchSearch =
      searchQuery === "" ||
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
          Memuat Agen...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#FBFDFB] font-sans text-slate-900 pb-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-10 space-y-8">
        {/* HEADER SECTION */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-emerald-600 font-bold tracking-widest uppercase text-[10px]">
            <Navigation className="w-3 h-3" />
            <span>Lokasi Penjemputan Anda</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-800">
            {userLocation}
            <span className="text-emerald-500">.</span>
          </h1>
        </div>

        {/* BIG SEARCH BAR */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="w-6 h-6 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
            </div>
            <input
              className="pl-14 pr-6 py-3 rounded-2xl bg-white border border-slate-200 text-lg focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all w-full shadow-sm placeholder:text-slate-400 font-medium"
              placeholder="Cari agen terdekat..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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
                href={`/user/request/${agent.id}`}
                className="group"
              >
                <Card className="h-full overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-sm group-hover:shadow-md group-hover:border-emerald-100 transition-all duration-300 flex flex-col cursor-pointer">
                  {/* Gambar Toko / Agent */}
                  <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={dummy}
                      alt={agent.agent_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Status Badge - SELALU BUKA */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      <Badge className="bg-green-500 text-white text-[9px] border-none px-2 py-0.5">
                        <Clock className="w-2.5 h-2.5 mr-1" />
                        Buka
                      </Badge>

                      {agent.rating && agent.rating >= 4.8 && (
                        <Badge className="bg-amber-400 text-white text-[9px] border-none px-2 py-0.5">
                          <Star className="w-2.5 h-2.5 fill-white mr-1" />{" "}
                          Unggulan
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
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
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