// "use client";

// import { useState } from "react";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// interface Agent {
//   id: number;
//   name: string;
//   location: string;
//   distance: string;
//   address: string;
// }

// export default function AgentMap() {
//   const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

//   const agents: Agent[] = [
//     { id: 1, name: "Agen Makmur", location: "Jakarta Selatan", distance: "1.2 km", address: "Jl. Ciputat Raya No.45, Pondok Pinang" },
//     { id: 2, name: "Agen Berkah", location: "Jakarta Timur", distance: "2.5 km", address: "Jl. Raya Bogor Km.24, Ciracas" },
//     { id: 3, name: "Agen Lestari", location: "Jakarta Barat", distance: "3.8 km", address: "Jl. Daan Mogot No.12, Grogol" },
//     { id: 4, name: "Agen Hijau", location: "Jakarta Utara", distance: "4.2 km", address: "Jl. Pluit Selatan Raya, Pluit" },
//     { id: 5, name: "Agen Bersih", location: "Jakarta Pusat", distance: "1.8 km", address: "Jl. Kramat Raya No.78, Senen" },
//   ];

//   return (
//     <section className="py-16 bg-background">
//       <div className="max-w-6xl mx-auto px-4">
//         <div className="mb-8">
//           <h2 className="text-xl font-semibold text-foreground mb-1">Lokasi Agen</h2>
//           <p className="text-sm text-muted-foreground">Pilih agen terdekat dari lokasi Anda</p>
//         </div>

//         <div className="grid lg:grid-cols-5 gap-6">
//           {/* Daftar Agen */}
//           <div className="lg:col-span-2">
//             <div className="space-y-2">
//               {agents.map((agent) => (
//                 <button
//                   key={agent.id}
//                   onClick={() => setSelectedAgent(agent)}
//                   className={`w-full text-left p-4 rounded-lg border transition-all ${
//                     selectedAgent?.id === agent.id
//                       ? "border-primary bg-primary/5"
//                       : "border-border bg-card hover:border-primary/30"
//                   }`}
//                 >
//                   <div className="font-medium text-foreground text-sm mb-1">{agent.name}</div>
//                   <div className="text-xs text-muted-foreground">{agent.location}</div>
//                   <div className="text-xs text-primary mt-1">{agent.distance}</div>
//                 </button>
//               ))}
//             </div>
//           </div>

//           {/* Peta & Detail */}
//           <div className="lg:col-span-3">
//             <Card className="p-5">
//               {selectedAgent ? (
//                 <div>
//                   <div className="mb-4">
//                     <h3 className="font-semibold text-foreground mb-1">{selectedAgent.name}</h3>
//                     <p className="text-sm text-muted-foreground">{selectedAgent.address}</p>
//                     <p className="text-sm text-primary mt-1">Jarak: {selectedAgent.distance}</p>
//                   </div>

//                   {/* Simulasi Peta */}
//                   <div className="bg-muted rounded-lg h-64 w-full relative border border-border">
//                     <div className="absolute inset-0 flex items-center justify-center">
//                       <div className="text-center">
//                         <div className="w-3 h-3 bg-primary rounded-full animate-pulse mx-auto mb-2" />
//                         <p className="text-xs text-muted-foreground">{selectedAgent.name}</p>
//                       </div>
//                     </div>
//                     <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded border border-border">
//                       Simulasi lokasi
//                     </div>
//                   </div>

//                   <button className="w-full mt-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition">
//                     Pilih Agen Ini
//                   </button>
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <p className="text-sm text-muted-foreground">Pilih agen dari daftar</p>
//                 </div>
//               )}
//             </Card>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
"use client";

import { useState } from "react";
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
    name: "Agen Makmur",
    location: "Jakarta Selatan",
    distance: "1.2 km",
    address: "Jl. Ciputat Raya No.45, Pondok Pinang",
    lat: -6.2689,
    lng: 106.7772,
  },
  {
    id: 2,
    name: "Agen Berkah",
    location: "Jakarta Timur",
    distance: "2.5 km",
    address: "Jl. Raya Bogor Km.24, Ciracas",
    lat: -6.3241,
    lng: 106.8754,
  },
  {
    id: 3,
    name: "Agen Lestari",
    location: "Jakarta Barat",
    distance: "3.8 km",
    address: "Jl. Daan Mogot No.12, Grogol",
    lat: -6.1675,
    lng: 106.7897,
  },
  {
    id: 4,
    name: "Agen Hijau",
    location: "Jakarta Utara",
    distance: "4.2 km",
    address: "Jl. Pluit Selatan Raya, Pluit",
    lat: -6.1234,
    lng: 106.7934,
  },
  {
    id: 5,
    name: "Agen Bersih",
    location: "Jakarta Pusat",
    distance: "1.8 km",
    address: "Jl. Kramat Raya No.78, Senen",
    lat: -6.1862,
    lng: 106.8456,
  },
];

export default function AgentMap() {
  const [selected, setSelected] = useState<Agent | null>(null);

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight">
            Temukan <span className="text-green-600">Agen Terdekat</span> Anda.
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-lg leading-relaxed">
            Pilih agen dari daftar atau klik di peta untuk melihat detail
            lokasi.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-5 items-start">
          {/* List agen */}
          <div className="lg:col-span-2 flex flex-col gap-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelected(agent)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selected?.id === agent.id
                    ? "border-green-500 bg-green-50"
                    : "border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/40"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <MapPin
                      className="w-3.5 h-3.5 text-green-600"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-gray-900 truncate mb-0.5">
                      {agent.name}
                    </p>
                    <p className="text-xs text-gray-400">{agent.location}</p>
                    <p className="text-xs font-medium text-green-600 mt-0.5">
                      {agent.distance}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Panel peta & detail */}
          <div className="lg:col-span-3 rounded-xl border border-gray-100 overflow-hidden shadow-sm bg-white">
            {/* Area peta simulasi */}
            <div className="relative h-72 bg-gray-50 border-b border-gray-100">
              {selected ? (
                <>
                  {/* Grid pattern simulasi peta */}
                  <div
                    className="absolute inset-0 opacity-40"
                    style={{
                      backgroundImage:
                        "linear-gradient(#e5e7eb 1px, transparent 1px), linear-gradient(90deg, #e5e7eb 1px, transparent 1px)",
                      backgroundSize: "32px 32px",
                    }}
                  />
                  {/* Titik lokasi */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="relative">
                        <div className="w-5 h-5 bg-green-600 rounded-full border-2 border-white shadow-md" />
                        <div className="absolute inset-0 w-5 h-5 bg-green-600 rounded-full animate-ping opacity-30" />
                      </div>
                      <span className="text-xs font-semibold text-gray-700 bg-white px-2.5 py-1 rounded-lg border border-gray-100 shadow-sm">
                        {selected.name}
                      </span>
                    </div>
                  </div>
                  {/* Label simulasi */}
                  <div className="absolute bottom-3 right-3 text-[10px] text-gray-400 bg-white/80 px-2 py-1 rounded border border-gray-100">
                    Simulasi lokasi
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin
                      className="w-5 h-5 text-green-500"
                      strokeWidth={2}
                    />
                  </div>
                  <p className="text-sm text-gray-400">
                    Pilih agen dari daftar
                  </p>
                </div>
              )}
            </div>

            {/* Detail agen terpilih */}
            {selected ? (
              <div className="px-5 py-4 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-bold text-gray-900 mb-1">
                    {selected.name}
                  </p>
                  <p className="text-xs text-gray-400">{selected.address}</p>
                  <p className="text-xs font-medium text-green-600 mt-0.5">
                    {selected.distance}
                  </p>
                </div>
                <button className="shrink-0 flex items-center gap-1.5 px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition">
                  <Navigation className="w-3 h-3" />
                  Pilih Agen
                </button>
              </div>
            ) : (
              <div className="px-5 py-4">
                <p className="text-xs text-gray-300">
                  Detail agen akan muncul di sini
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
