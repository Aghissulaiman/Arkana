"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";

interface Agent {
  id: number;
  name: string;
  location: string;
  distance: string;
  address: string;
}

export default function AgentMap() {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const agents: Agent[] = [
    { id: 1, name: "Agen Makmur", location: "Jakarta Selatan", distance: "1.2 km", address: "Jl. Ciputat Raya No.45, Pondok Pinang" },
    { id: 2, name: "Agen Berkah", location: "Jakarta Timur", distance: "2.5 km", address: "Jl. Raya Bogor Km.24, Ciracas" },
    { id: 3, name: "Agen Lestari", location: "Jakarta Barat", distance: "3.8 km", address: "Jl. Daan Mogot No.12, Grogol" },
    { id: 4, name: "Agen Hijau", location: "Jakarta Utara", distance: "4.2 km", address: "Jl. Pluit Selatan Raya, Pluit" },
    { id: 5, name: "Agen Bersih", location: "Jakarta Pusat", distance: "1.8 km", address: "Jl. Kramat Raya No.78, Senen" },
  ];

  return (
    <section className="bg-transparent">
      <div className="grid lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2">
          <div className="space-y-2 max-h-[350px] overflow-y-auto pr-2">
            {agents.map((agent) => (
              <button
                key={agent.id}
                onClick={() => setSelectedAgent(agent)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  selectedAgent?.id === agent.id
                    ? "border-emerald-500 bg-emerald-50 shadow-sm"
                    : "border-slate-100 bg-white hover:border-emerald-200"
                }`}
              >
                <div className="font-semibold text-slate-800 text-sm mb-1">{agent.name}</div>
                <div className="text-xs text-slate-500">{agent.location}</div>
                <div className="text-xs font-medium text-emerald-600 mt-1">{agent.distance}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-5 border-slate-100 shadow-sm h-full flex flex-col">
            {selectedAgent ? (
              <div className="flex flex-col h-full">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-800 mb-1">{selectedAgent.name}</h3>
                  <p className="text-sm text-slate-500">{selectedAgent.address}</p>
                  <p className="text-sm font-medium text-emerald-600 mt-1">Jarak: {selectedAgent.distance}</p>
                </div>

                {/* Simulasi Peta */}
                <div className="bg-slate-50 rounded-xl flex-grow min-h-[200px] relative border border-slate-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-4 h-4 bg-emerald-500 rounded-full animate-pulse mx-auto mb-2 shadow-lg shadow-emerald-500/50" />
                      <p className="text-xs font-medium text-slate-500">{selectedAgent.name}</p>
                    </div>
                  </div>
                  <div className="absolute bottom-3 right-3 text-[10px] text-slate-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded border border-slate-100">
                    Simulasi lokasi
                  </div>
                </div>

                <button className="w-full mt-4 py-3 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20">
                  Pilih Agen Ini
                </button>
              </div>
            ) : (
              <div className="text-center py-16 flex-grow flex flex-col items-center justify-center">
                <p className="text-sm font-medium text-slate-500">Pilih agen dari daftar di samping</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}
