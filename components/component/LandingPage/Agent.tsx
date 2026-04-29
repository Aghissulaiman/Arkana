"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-foreground mb-1">Lokasi Agen</h2>
          <p className="text-sm text-muted-foreground">Pilih agen terdekat dari lokasi Anda</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Daftar Agen */}
          <div className="lg:col-span-2">
            <div className="space-y-2">
              {agents.map((agent) => (
                <button
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedAgent?.id === agent.id
                      ? "border-primary bg-primary/5"
                      : "border-border bg-card hover:border-primary/30"
                  }`}
                >
                  <div className="font-medium text-foreground text-sm mb-1">{agent.name}</div>
                  <div className="text-xs text-muted-foreground">{agent.location}</div>
                  <div className="text-xs text-primary mt-1">{agent.distance}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Peta & Detail */}
          <div className="lg:col-span-3">
            <Card className="p-5">
              {selectedAgent ? (
                <div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-foreground mb-1">{selectedAgent.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedAgent.address}</p>
                    <p className="text-sm text-primary mt-1">Jarak: {selectedAgent.distance}</p>
                  </div>

                  {/* Simulasi Peta */}
                  <div className="bg-muted rounded-lg h-64 w-full relative border border-border">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-3 h-3 bg-primary rounded-full animate-pulse mx-auto mb-2" />
                        <p className="text-xs text-muted-foreground">{selectedAgent.name}</p>
                      </div>
                    </div>
                    <div className="absolute bottom-3 right-3 text-[10px] text-muted-foreground bg-background/80 px-2 py-1 rounded border border-border">
                      Simulasi lokasi
                    </div>
                  </div>

                  <button className="w-full mt-4 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 transition">
                    Pilih Agen Ini
                  </button>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-sm text-muted-foreground">Pilih agen dari daftar</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}