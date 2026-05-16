"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation, Loader2 } from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

interface Agent {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  phone?: string;
  distance: string;
}

export default function AgentMap() {
  const [selected, setSelected] = useState<Agent | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const mapElRef = useRef<HTMLDivElement>(null);
  const supabase = createClientSupabaseClient();

  // Hitung jarak
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const formatDistance = (distance: number): string => {
    if (distance < 1) return `${Math.round(distance * 1000)} m`;
    return `${distance.toFixed(1)} km`;
  };

  // Ambil lokasi user
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Location error:", error);
          setUserLocation({ lat: -6.3948, lng: 106.8229 }); // Default Depok
        }
      );
    } else {
      setUserLocation({ lat: -6.3948, lng: 106.8229 });
    }
  }, []);

  // Ambil data agent
  useEffect(() => {
    const fetchAgents = async () => {
      if (!userLocation) return;
      
      setLoading(true);
      setError(null);
      
      console.log("Fetching agents...");
      
      // Query sederhana dulu untuk test
      const { data: agentsData, error } = await supabase
        .from("agents")
        .select("*")
        .eq("is_active", true);

      console.log("Query result:", { agentsData, error });

      if (error) {
        console.error("Error fetching agents:", error);
        setError(`Error: ${error.message}`);
        setLoading(false);
        return;
      }

      if (!agentsData || agentsData.length === 0) {
        console.log("No agents found");
        setError("Belum ada agent terdaftar. Silahkan daftar sebagai agent terlebih dahulu.");
        setLoading(false);
        return;
      }

      console.log(`Found ${agentsData.length} agents`);

      // Transform data
      const agentsList: Agent[] = agentsData.map((agent: any) => {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          agent.lat || -6.3948,
          agent.lng || 106.8229
        );
        
        return {
          id: agent.id,
          name: agent.agent_name || "Agent",
          address: agent.address || "Alamat tidak tersedia",
          lat: agent.lat || -6.3948,
          lng: agent.lng || 106.8229,
          phone: agent.phone,
          distance: formatDistance(distance),
          rawDistance: distance,
        };
      });

      // Urutkan berdasarkan jarak terdekat
      agentsList.sort((a: any, b: any) => (a.rawDistance || 999) - (b.rawDistance || 999));
      
      setAgents(agentsList);
      setLoading(false);
    };

    if (userLocation) {
      fetchAgents();
    }
  }, [supabase, userLocation]);

  // Inisialisasi map
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!mapElRef.current || mapRef.current) return;
    if (agents.length === 0) return;

    const initMap = () => {
      const L = (window as any).L;
      
      const centerLat = userLocation?.lat || agents[0]?.lat || -6.3948;
      const centerLng = userLocation?.lng || agents[0]?.lng || 106.8229;

      const map = L.map(mapElRef.current).setView([centerLat, centerLng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap',
        maxZoom: 19,
      }).addTo(map);

      // Marker untuk setiap agent
      agents.forEach((agent) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:12px;height:12px;background:#16a34a;border:2px solid #fff;border-radius:50%;cursor:pointer;"></div>`,
          iconAnchor: [6, 6],
        });
        
        const marker = L.marker([agent.lat, agent.lng], { icon })
          .addTo(map)
          .bindPopup(`<b>${agent.name}</b><br/>${agent.address}<br/><small>${agent.distance}</small>`);
        
        marker.on("click", () => setSelected(agent));
        markersRef.current.push(marker);
      });

      // Marker lokasi user
      if (userLocation) {
        const userIcon = L.divIcon({
          className: "",
          html: `<div style="width:12px;height:12px;background:#3b82f6;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 2px rgba(59,130,246,0.5);"></div>`,
          iconAnchor: [6, 6],
        });
        L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
          .addTo(map)
          .bindPopup("<b>Lokasi Anda</b>");
      }

      mapRef.current = map;
    };

    if (!(window as any).L) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = initMap;
      document.head.appendChild(script);
    } else {
      initMap();
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markersRef.current = [];
    };
  }, [agents, userLocation]);

  if (loading) {
    return (
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-500">Memuat data agen...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
            <MapPin className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-gray-600">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg text-sm"
            >
              Coba Lagi
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (agents.length === 0) {
    return (
      <section className="py-14 bg-white">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
            <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">Belum ada agen terdaftar di sistem.</p>
            <p className="text-sm text-gray-400 mt-1">Silahkan daftar sebagai agent terlebih dahulu.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 leading-tight">
            Temukan <span className="text-green-600">Agen Depok</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            {agents.length} agen siap melayani Anda
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* List Agen */}
          <div className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto" style={{ maxHeight: "480px" }}>
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelected(agent)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === agent.id
                    ? "border-green-500 bg-green-50/50 ring-1 ring-green-500"
                    : "border-gray-100 bg-white hover:border-green-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    selected?.id === agent.id ? "bg-green-600 text-white" : "bg-green-100 text-green-600"
                  }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">{agent.name}</p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[11px] text-gray-500 truncate">{agent.address.split(",")[0]}</p>
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded ml-2 shrink-0">
                        {agent.distance}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Peta */}
          <div className="lg:col-span-8 rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
            <div ref={mapElRef} className="h-[400px] w-full bg-gray-50" />

            <div className="px-5 py-4 flex items-center justify-between gap-4 bg-white">
              {selected ? (
                <>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{selected.name}</p>
                    <p className="text-xs text-gray-500 truncate">{selected.address}</p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    <Navigation className="w-3 h-3" />
                    NAVIGASI
                  </a>
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">Pilih agen dari daftar...</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}