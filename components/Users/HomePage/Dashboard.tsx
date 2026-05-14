// "use client";

// import React, { useState, Suspense, useEffect } from "react";
// import { Card, CardContent } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import {
//   MapPin,
//   Star,
//   CheckCircle2,
//   ChevronRight,
//   Recycle,
//   Search,
//   Loader2,
//   Package,
//   Leaf,
//   Building2,
// } from "lucide-react";
// import Link from "next/link";
// import { useSearchParams } from "next/navigation";
// import { createClientSupabaseClient } from "@/lib/supabaseClient";

// type Agent = {
//   id: string;
//   user_id: string;
//   agent_name: string;
//   phone: string;
//   address: string;
//   service_area: string;
//   waste_categories: string[];
//   is_active: boolean;
//   rating?: number;
//   distance_km?: number;
//   price_per_kg?: number;
// };

// type PriceCatalog = {
//   waste_type: string;
//   price_per_kg: number;
// };

// const WASTE_CHIPS = [
//   "Semua",
//   "Terdekat",
//   "plastic",
//   "paper",
//   "cardboard",
//   "glass",
//   "aluminium",
//   "metal",
//   "electronic",
//   "mixed",
// ];

// const WASTE_LABELS: Record<string, string> = {
//   plastic: "Plastik",
//   paper: "Kertas",
//   cardboard: "Kardus",
//   glass: "Kaca",
//   aluminium: "Aluminium",
//   metal: "Logam",
//   electronic: "Elektronik",
//   mixed: "Campuran",
// };

// const TAG_COLORS: Record<string, string> = {
//   plastic: "bg-blue-100/80 text-blue-800",
//   paper: "bg-amber-100/80 text-amber-800",
//   cardboard: "bg-orange-100/80 text-orange-800",
//   glass: "bg-emerald-100/80 text-emerald-800",
//   aluminium: "bg-slate-200/80 text-slate-800",
//   metal: "bg-gray-200/80 text-gray-800",
//   electronic: "bg-purple-100/80 text-purple-800",
//   mixed: "bg-slate-100/80 text-slate-700",
// };

// function getIconForWaste(wasteType: string) {
//   const icons: Record<string, any> = {
//     plastic: Package,
//     paper: Leaf,
//     cardboard: Package,
//     glass: Package,
//     aluminium: Package,
//     metal: Recycle,
//     electronic: Recycle,
//     mixed: Building2,
//   };
//   return icons[wasteType] || Recycle;
// }

// function getRandomRating() {
//   return +(4 + Math.random() * 0.9).toFixed(1);
// }

// function DashboardContent() {
//   const searchParams = useSearchParams();
//   const supabase = createClientSupabaseClient();
//   const search = searchParams?.get("q") || "";
//   const [activeChip, setActiveChip] = useState("Semua");
//   const [agents, setAgents] = useState<Agent[]>([]);
//   const [prices, setPrices] = useState<PriceCatalog[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [userLocation, setUserLocation] = useState("Depok");

//   useEffect(() => {
//     const fetchUserLocation = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) {
//         const { data: profile } = await supabase
//           .from("profiles")
//           .select("address")
//           .eq("user_id", user.id)
//           .single();

//         if (profile?.address) {
//           const city = profile.address.split(",").slice(-2)[0]?.trim() || "Lokasi Anda";
//           setUserLocation(city);
//         }
//       }
//     };
//     fetchUserLocation();
//   }, []);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);

//       // Ambil agent
//       const { data: agentsData, error: agentsError } = await supabase
//         .from("agents")
//         .select("*")
//         .eq("is_active", true);

//       if (agentsError) {
//         console.error("Error fetching agents:", agentsError);
//       }

//       // Ambil harga
//       const { data: priceData } = await supabase
//         .from("price_catalog")
//         .select("waste_type, price_per_kg");

//       if (priceData) setPrices(priceData);

//       // Proses agent dengan rating random & jarak random
//       const processedAgents = (agentsData || []).map(agent => ({
//         ...agent,
//         rating: getRandomRating(),
//         distance_km: +(Math.random() * 5 + 0.5).toFixed(1),
//         price_per_kg: agent.waste_categories?.[0]
//           ? priceData?.find(p => p.waste_type === agent.waste_categories[0])?.price_per_kg || 500
//           : 500
//       }));

//       // Urutkan berdasarkan jarak terdekat
//       processedAgents.sort((a, b) => (a.distance_km || 999) - (b.distance_km || 999));

//       setAgents(processedAgents);
//       setLoading(false);
//     };

//     fetchData();
//   }, []);

//   // Filter agent
//   const filteredAgents = agents.filter((agent) => {
//     const matchSearch =
//       search === "" ||
//       agent.agent_name.toLowerCase().includes(search.toLowerCase()) ||
//       agent.service_area?.toLowerCase().includes(search.toLowerCase()) ||
//       agent.waste_categories?.some((w) => w.toLowerCase().includes(search.toLowerCase()));

//     const matchChip =
//       activeChip === "Semua" ||
//       activeChip === "Terdekat" ||
//       agent.waste_categories?.some((w) => w.toLowerCase() === activeChip.toLowerCase());

//     return matchSearch && matchChip;
//   });

//   // Urutkan: Terdekat di atas/awal
//   const sortedAgents = [...filteredAgents].sort((a, b) => {
//     if (activeChip === "Terdekat") {
//       return (a.distance_km || 999) - (b.distance_km || 999);
//     }
//     return (a.distance_km || 999) - (b.distance_km || 999);
//   });

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   return (
//     <div className="w-full min-h-screen bg-slate-50 font-sans">
//       <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-12 py-6 md:py-8 space-y-8">

//         {/* HEADING */}
//         <div className="flex items-center justify-between">
//           <div>
//             <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">
//               Lokasi Saat Ini
//             </p>
//             <div className="flex items-center gap-2">
//               <MapPin className="w-5 h-5 text-slate-800" />
//               <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
//                 {userLocation}
//               </h1>
//             </div>
//           </div>
//           <div className="text-sm text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm">
//             {sortedAgents.length} Agen Tersedia
//           </div>
//         </div>

//         {/* CATEGORY CHIPS */}
//         <div className="space-y-3">
//           <h2 className="text-sm font-bold text-slate-800">Filter Sampah</h2>
//           <div className="flex gap-2 overflow-x-auto pb-2">
//             {WASTE_CHIPS.map((chip) => {
//               const isActive = activeChip === chip;
//               const displayLabel = WASTE_LABELS[chip] || chip;
//               return (
//                 <button
//                   key={chip}
//                   onClick={() => setActiveChip(chip)}
//                   className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
//                     isActive
//                       ? "bg-primary text-white shadow-md shadow-primary/30"
//                       : "bg-white text-slate-600 shadow-sm border border-slate-200 hover:border-primary/50"
//                   }`}
//                 >
//                   {displayLabel}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* ALL AGENTS (1 Grid, Terdekat di Atas) */}
//         <section className="space-y-4">
//           <div className="flex items-center justify-between">
//             <h2 className="text-lg font-extrabold text-slate-900">
//               Agen Terdekat
//             </h2>
//             <Button variant="ghost" size="sm" className="text-primary text-xs">
//               Lihat Semua <ChevronRight className="w-3 h-3 ml-1" />
//             </Button>
//           </div>

//           {sortedAgents.length === 0 ? (
//             <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center">
//               <Search className="w-10 h-10 text-slate-300 mx-auto mb-3" />
//               <h3 className="text-lg font-bold text-slate-800 mb-2">
//                 Tidak Ada Agen Ditemukan
//               </h3>
//               <p className="text-slate-500 text-sm">
//                 Coba sesuaikan kata kunci atau filter.
//               </p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//               {sortedAgents.map((agent, idx) => {
//                 const Icon = getIconForWaste(agent.waste_categories?.[0] || "mixed");
//                 const isTopRated = (agent.rating || 0) >= 4.8;
//                 const isNearest = idx < 3;

//                 return (
//                   <Link
//                     key={agent.id}
//                     href={`/user/request/${agent.id}`}
//                     className="block group"
//                   >
//                     <Card className="overflow-hidden rounded-2xl border border-slate-100 shadow-sm bg-white hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
//                       {/* Banner with distance badge */}
//                       <div className="relative h-24 bg-gradient-to-r from-primary/20 to-primary/5 flex items-center justify-center">
//                         <div className="absolute top-2 left-2 flex gap-1">
//                           {isNearest && (
//                             <Badge className="bg-blue-500 text-white text-[10px] px-2 py-0.5">
//                               📍 Terdekat
//                             </Badge>
//                           )}
//                           {isTopRated && (
//                             <Badge className="bg-amber-500 text-white text-[10px] px-2 py-0.5">
//                               ⭐ Unggulan
//                             </Badge>
//                           )}
//                           {agent.is_active && (
//                             <Badge className="bg-green-500 text-white text-[10px] px-2 py-0.5">
//                               ✓ Aktif
//                             </Badge>
//                           )}
//                         </div>
//                         <div className="bg-white/80 rounded-full p-2 shadow-md">
//                           <Icon className="w-8 h-8 text-primary" />
//                         </div>
//                       </div>

//                       <CardContent className="p-4">
//                         <div className="flex justify-between items-start mb-2">
//                           <h3 className="font-bold text-slate-900 truncate">
//                             {agent.agent_name}
//                           </h3>
//                           <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
//                             <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
//                             <span className="text-xs font-bold text-amber-700">{agent.rating}</span>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
//                           <MapPin className="w-3 h-3 text-primary" />
//                           {agent.distance_km} km - {agent.service_area}
//                         </div>

//                         <div className="flex flex-wrap gap-1 mb-3">
//                           {agent.waste_categories?.slice(0, 3).map((w) => (
//                             <span
//                               key={w}
//                               className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${TAG_COLORS[w] || "bg-slate-100 text-slate-600"}`}
//                             >
//                               {WASTE_LABELS[w] || w}
//                             </span>
//                           ))}
//                           {(agent.waste_categories?.length || 0) > 3 && (
//                             <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
//                               +{(agent.waste_categories?.length || 0) - 3}
//                             </span>
//                           )}
//                         </div>

//                         <div className="flex items-center justify-between pt-2 border-t border-slate-100">
//                           <span className="text-xs text-slate-500">Poin/kg</span>
//                           <span className="text-lg font-black text-primary">
//                             {agent.price_per_kg?.toLocaleString()}
//                             <span className="text-xs font-normal text-slate-400"> poin</span>
//                           </span>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </Link>
//                 );
//               })}
//             </div>
//           )}
//         </section>
//       </div>
//     </div>
//   );
// }

// export default function HomeDashboard() {
//   return (
//     <Suspense fallback={
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     }>
//       <DashboardContent />
//     </Suspense>
//   );
// }

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
  Filter,
  Navigation,
  Recycle,
  Globe,
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
        .select("waste_type, price_per_kg");

      const processedAgents = (agentsData || []).map((agent) => ({
        ...agent,
        rating: getRandomRating(),
        distance_km: +(Math.random() * 5 + 0.5).toFixed(1),
        price_per_kg: agent.waste_categories?.[0]
          ? priceData?.find((p) => p.waste_type === agent.waste_categories[0])
              ?.price_per_kg || 500
          : 500,
      }));

      processedAgents.sort(
        (a, b) => (a.distance_km || 999) - (b.distance_km || 999),
      );
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
        (w) => w.toLowerCase() === activeChip.toLowerCase(),
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

        {/* AGENTS GRID */}
        <section className="space-y-1">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <Leaf className="w-4 h-4 text-emerald-500" />
              <h2 className="text-sm font-bold tracking-tight text-slate-800 uppercase">
                Rekomendasi Terdekat
              </h2>
            </div>
            <Button
              variant="ghost"
              className="text-emerald-600 hover:bg-emerald-50 font-bold text-[11px] h-8 px-3"
            >
              Semua Agen <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
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
                  <Card className="h-full overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white shadow-sm group-hover:shadow-md group-hover:border-emerald-100 transition-all duration-300 flex flex-col">
                    {/* Gambar Toko / Agent */}
                    <div className="relative h-40 w-full bg-slate-100 overflow-hidden">
                      <img
                        src={dummy}
                        alt={agent.agent_name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-3 left-3 flex gap-2">
                        {agent.rating && agent.rating >= 4.8 && (
                          <Badge className="bg-amber-400 text-white text-[9px] border-none px-2 py-0.5">
                            <Star className="w-2.5 h-2.5 fill-white mr-1" />{" "}
                            Unggulan
                          </Badge>
                        )}
                        <Badge className="bg-emerald-600 text-white text-[9px] border-none px-2 py-0.5">
                          ✓ Aktif
                        </Badge>
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
                        <div className="bg-emerald-50 text-emerald-600 p-2 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </section>
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
