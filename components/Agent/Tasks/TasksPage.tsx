"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, CheckCircle2, Filter, XCircle } from "lucide-react";

export default function TasksPage() {
  const [filter, setFilter] = useState("Semua");

  const tasks = [
    {
      id: "REQ-001",
      customer: "Ahmad Santoso",
      address: "Jl. Merdeka No. 45, Jakarta Selatan",
      distance: "2.4 km",
      time: "10:00 - 12:00",
      status: "pending",
      weight_est: "5-10 kg",
    },
    {
      id: "REQ-002",
      customer: "Siti Rahma",
      address: "Komplek Harmoni Blok B/12, Jakarta Barat",
      distance: "5.1 km",
      time: "13:00 - 15:00",
      status: "pending",
      weight_est: "> 10 kg",
    },
    {
      id: "REQ-003",
      customer: "Dodi Pratama",
      address: "Jl. Sudirman No. 88, Jakarta Pusat",
      distance: "7.2 km",
      time: "15:30 - 17:00",
      status: "progress", 
      weight_est: "< 5 kg",
    },
  ];

  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("q")?.toLowerCase() || "";

  const filteredTasks = useMemo(() => {
    let tasksToFilter = tasks;
    
    if (searchQuery) {
      tasksToFilter = tasksToFilter.filter(t => 
        t.customer.toLowerCase().includes(searchQuery) || 
        t.id.toLowerCase().includes(searchQuery) ||
        t.address.toLowerCase().includes(searchQuery)
      );
    }
    
    return filter === "Semua" 
      ? tasksToFilter 
      : tasksToFilter.filter(t => filter === "Berjalan" ? t.status === "progress" : t.status === "pending");
  }, [filter, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pt-8">

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["Semua", "Berjalan", "Menunggu"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all duration-300 ${
              filter === tab
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25 scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className={`overflow-hidden border-0 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${task.status === "progress" ? "ring-2 ring-primary shadow-primary/10 bg-gradient-to-b from-primary/5 to-background" : "shadow-sm bg-background"}`}>
            {task.status === "progress" && (
              <div className="bg-primary text-primary-foreground text-[10px] uppercase font-bold text-center py-1.5 tracking-widest flex items-center justify-center gap-1.5 shadow-sm">Sedang Berjalan</div>
            )}
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold text-muted-foreground/70 text-xs tracking-wider">{task.id}</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground leading-tight">{task.customer}</h3>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5 bg-muted/30 p-2.5 rounded-xl border border-border/50">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground leading-relaxed pt-1">{task.address}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-border/50">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{task.time}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-border/50">
                    <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <Navigation className="w-3.5 h-3.5 text-secondary-foreground" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{task.distance}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-lg h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm shadow-primary/20 text-xs">
                    <Navigation className="w-3.5 h-3.5 mr-1.5" />
                    Rute
                  </Button>
                  {task.status === "progress" ? (
                    <Button variant="outline" className="flex-1 rounded-lg h-9 border-primary text-primary font-bold hover:bg-primary/5 hover:text-primary text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Selesai
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1 rounded-lg h-9 font-bold border-border text-foreground hover:bg-muted/50 text-xs">
                      Terima Penjemputan
                    </Button>
                  )}
                </div>
                {task.status === "pending" && (
                  <Button variant="outline" className="w-full h-9 text-destructive font-bold hover:text-destructive hover:bg-destructive/10 rounded-lg text-xs">
                    <XCircle className="w-3.5 h-3.5 mr-1.5" /> Tolak Penjemputan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed">
            <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p>Tidak ada tugas penjemputan dengan filter ini</p>
          </div>
        )}
      </div>
    </div>
  );
}
