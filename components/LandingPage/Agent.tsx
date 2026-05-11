// "use client";

// import { useState } from "react";
// import { MapPin, Navigation } from "lucide-react";

// interface Agent {
//   id: number;
//   name: string;
//   location: string;
//   distance: string;
//   address: string;
//   lat: number;
//   lng: number;
// }

// const agents: Agent[] = [
//   {
//     id: 1,
//     name: "Agen Makmur",
//     location: "Jakarta Selatan",
//     distance: "1.2 km",
//     address: "Jl. Ciputat Raya No.45, Pondok Pinang",
//     lat: -6.2689,
//     lng: 106.7772,
//   },
//   {
//     id: 2,
//     name: "Agen Berkah",
//     location: "Jakarta Timur",
//     distance: "2.5 km",
//     address: "Jl. Raya Bogor Km.24, Ciracas",
//     lat: -6.3241,
//     lng: 106.8754,
//   },
//   {
//     id: 3,
//     name: "Agen Lestari",
//     location: "Jakarta Barat",
//     distance: "3.8 km",
//     address: "Jl. Daan Mogot No.12, Grogol",
//     lat: -6.1675,
//     lng: 106.7897,
//   },
//   {
//     id: 4,
//     name: "Agen Hijau",
//     location: "Jakarta Utara",
//     distance: "4.2 km",
//     address: "Jl. Pluit Selatan Raya, Pluit",
//     lat: -6.1234,
//     lng: 106.7934,
//   },
//   {
//     id: 5,
//     name: "Agen Bersih",
//     location: "Jakarta Pusat",
//     distance: "1.8 km",
//     address: "Jl. Kramat Raya No.78, Senen",
//     lat: -6.1862,
//     lng: 106.8456,
//   },
// ];

// export default function AgentMap() {
//   const [selected, setSelected] = useState<Agent | null>(null);

//   return (
//     <section className="py-16 md:py-24 bg-white">
//       <div className="max-w-6xl mx-auto px-6">
//         <div className="mb-8">
//           <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
//             Temukan <span className="text-green-600">Agen Terdekat</span> Anda.
//           </h2>
//           <p className="text-gray-500 text-sm mt-3 max-w-lg leading-relaxed">
//             Pilih agen dari daftar atau klik di peta untuk melihat detail
//             lokasi.
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-5 gap-5 items-start">
//           <div className="lg:col-span-2 flex flex-col gap-2">
//             {agents.map((agent) => (
//               <button
//                 key={agent.id}
//                 onClick={() => setSelected(agent)}
//                 className={`w-full text-left p-4 rounded-xl border transition-all ${
//                   selected?.id === agent.id
//                     ? "border-green-500 bg-green-50"
//                     : "border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/40"
//                 }`}
//               >
//                 <div className="flex items-start gap-3">
//                   <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
//                     <MapPin
//                       className="w-3.5 h-3.5 text-green-600"
//                       strokeWidth={2.5}
//                     />
//                   </div>
//                   <div className="min-w-0 flex-1">
//                     <p className="text-sm font-semibold text-gray-900 truncate mb-0.5">
//                       {agent.name}
//                     </p>
//                     <p className="text-xs text-gray-400">{agent.location}</p>
//                     <p className="text-xs font-medium text-green-600 mt-0.5">
//                       {agent.distance}
//                     </p>
//                   </div>
//                 </div>
//               </button>
//             ))}
//           </div>

//           {/* Panel peta & detail */}
//           <div className="lg:col-span-3 rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-white">
//             <div className="relative h-72 bg-gray-50 border-b border-gray-100">
//               {selected ? (
//                 <>
//                   {/* Grid pattern simulasi peta */}
//                   <div
//                     className="absolute inset-0 opacity-40"
//                     style={{
//                       backgroundImage:
//                         "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
//                       backgroundSize: "32px 32px",
//                     }}
//                   />
//                   {/* Titik lokasi */}
//                   <div className="absolute inset-0 flex items-center justify-center">
//                     <div className="flex flex-col items-center gap-2">
//                       <div className="relative">
//                         <div className="w-5 h-5 bg-green-600 rounded-full border-2 border-white shadow-md" />
//                         <div className="absolute inset-0 w-5 h-5 bg-green-600 rounded-full animate-ping opacity-30" />
//                       </div>
//                       <span className="text-xs font-semibold text-gray-700 bg-white px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm">
//                         {selected.name}
//                       </span>
//                     </div>
//                   </div>
//                   {/* Label simulasi */}
//                   <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 bg-white/80 px-2 py-1 rounded border border-gray-100">
//                     Lokasi
//                   </div>
//                 </>
//               ) : (
//                 <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
//                   <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
//                     <MapPin
//                       className="w-5 h-5 text-green-500"
//                       strokeWidth={2}
//                     />
//                   </div>
//                   <p className="text-sm text-gray-400">
//                     Pilih agen dari daftar
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Detail agen terpilih */}
//             {selected ? (
//               <div className="px-5 py-4 flex items-start justify-between gap-4">
//                 <div>
//                   <p className="text-sm font-bold text-gray-900 mb-1">
//                     {selected.name}
//                   </p>
//                   <p className="text-xs text-gray-400">{selected.address}</p>
//                   <p className="text-xs font-medium text-green-600 mt-0.5">
//                     {selected.distance}
//                   </p>
//                 </div>
//                 <button className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition">
//                   <Navigation className="w-3 h-3" />
//                   Pilih Agen
//                 </button>
//               </div>
//             ) : (
//               <div className="px-5 py-4">
//                 <p className="text-xs text-gray-300">
//                   Detail agen akan muncul di sini
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";

interface Agent {
  id: number;
  name: string;
  location: string;
  distance: string;
  address: string;
  lat: number;
  lng: number;
}

const agents: Agent[] = [
  {
    id: 1,
    name: "Agen Maju Beji",
    location: "Kec. Beji",
    distance: "0.8 km",
    address: "Jl. Margonda Raya No.10, Beji, Depok",
    lat: -6.3686,
    lng: 106.8331,
  },
  {
    id: 2,
    name: "Toko Berkah Panmas",
    location: "Kec. Pancoran Mas",
    distance: "2.1 km",
    address: "Jl. Raya Sawangan No.45, Pancoran Mas, Depok",
    lat: -6.3948,
    lng: 106.8,
  },
  {
    id: 3,
    name: "Mitra Tani Cimanggis",
    location: "Kec. Cimanggis",
    distance: "4.5 km",
    address: "Jl. Radar Auri No.15, Cimanggis, Depok",
    lat: -6.3711,
    lng: 106.8722,
  },
  {
    id: 4,
    name: "Agen Sejahtera Sukmajaya",
    location: "Kec. Sukmajaya",
    distance: "3.2 km",
    address: "Jl. Merdeka Raya No.1, Sukmajaya, Depok",
    lat: -6.3846,
    lng: 106.8425,
  },
  {
    id: 5,
    name: "Toko Hijau Cinere",
    location: "Kec. Cinere",
    distance: "6.7 km",
    address: "Jl. Cinere Raya No.12, Cinere, Depok",
    lat: -6.3451,
    lng: 106.7794,
  },
  {
    id: 6,
    name: "Agen Sawangan Lestari",
    location: "Kec. Sawangan",
    distance: "8.4 km",
    address: "Jl. Raya Muchtar No.91, Sawangan, Depok",
    lat: -6.4025,
    lng: 106.7667,
  },
  {
    id: 7,
    name: "Mitra Cilodong Jaya",
    location: "Kec. Cilodong",
    distance: "5.1 km",
    address: "Jl. M. Nasir No.88, Cilodong, Depok",
    lat: -6.425,
    lng: 106.835,
  },
];

export default function AgentMap() {
  const [selected, setSelected] = useState<Agent | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const mapElRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const init = () => {
      if (!mapElRef.current || mapRef.current) return;
      const L = (window as any).L;

      const map = L.map(mapElRef.current, { zoomControl: true }).setView(
        [-6.3948, 106.8229],
        12,
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors",
        maxZoom: 19,
      }).addTo(map);

      agents.forEach((a) => {
        const icon = L.divIcon({
          className: "",
          html: `<div style="width:10px;height:10px;background:#16a34a;border:2px solid #fff;border-radius:50%;cursor:pointer;"></div>`,
          iconAnchor: [5, 5],
        });
        L.marker([a.lat, a.lng], { icon })
          .addTo(map)
          .on("click", () => setSelected(a));
      });

      mapRef.current = map;
    };

    // Load Leaflet dynamically
    if (!(window as any).L) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      document.head.appendChild(link);

      const script = document.createElement("script");
      script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
      script.onload = init;
      document.head.appendChild(script);
    } else {
      init();
    }
  }, []);

  useEffect(() => {
    if (!mapRef.current || !selected) return;
    const L = (window as any).L;
    mapRef.current.setView([selected.lat, selected.lng], 15);

    if (markerRef.current) markerRef.current.remove();

    const icon = L.divIcon({
      className: "",
      html: `<div style="width:14px;height:14px;background:#16a34a;border:2px solid #fff;border-radius:50%;box-shadow:0 0 0 4px rgba(22,163,74,.25)"></div>`,
      iconAnchor: [7, 7],
    });

    markerRef.current = L.marker([selected.lat, selected.lng], { icon })
      .addTo(mapRef.current)
      .bindPopup(`<b>${selected.name}</b>`)
      .openPopup();
  }, [selected]);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-8">
          <h2 className="text-3xl font-black text-gray-900 leading-tight">
            Temukan <span className="text-green-600">Agen Depok</span>
          </h2>
          <p className="text-gray-500 text-sm mt-2">
            Pilih agen resmi untuk layanan di wilayah Anda.
          </p>
        </div>

        {/* CSS INLINE UNTUK SEMBUNYIKAN SCROLLBAR */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        `,
          }}
        />

        <div className="grid lg:grid-cols-12 gap-6 items-start">
          {/* Sisi Kiri: List Agen (Lebih kecil/ramping) */}
          <div
            className="lg:col-span-4 flex flex-col gap-3 overflow-y-auto no-scrollbar"
            style={{ maxHeight: "480px" }}
          >
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelected(agent)}
                className={`w-full text-left p-4 rounded-xl border transition-all shrink-0 ${
                  selected?.id === agent.id
                    ? "border-green-500 bg-green-50/50 ring-1 ring-green-500"
                    : "border-gray-100 bg-white hover:border-green-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${selected?.id === agent.id ? "bg-green-600 text-white" : "bg-green-100 text-green-600"}`}
                  >
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {agent.name}
                    </p>
                    <div className="flex items-center justify-between mt-0.5">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wide">
                        {agent.location}
                      </p>
                      <span className="text-[10px] font-bold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                        {agent.distance}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Sisi Kanan: Peta (Lebih luas) */}
          <div className="lg:col-span-8 rounded-2xl border border-gray-100 overflow-hidden shadow-sm bg-white">
            <div
              ref={mapElRef}
              className="h-[400px] w-full bg-gray-50 shadow-inner"
            />

            <div className="px-5 py-4 flex items-center justify-between gap-4 bg-white">
              {selected ? (
                <>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">
                      {selected.name}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {selected.address}
                    </p>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-lg transition"
                  >
                    <Navigation className="w-3 h-3" />
                    NAVIGASI
                  </a>
                </>
              ) : (
                <p className="text-xs text-gray-400 italic">
                  Silakan pilih salah satu agen di daftar kiri...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
