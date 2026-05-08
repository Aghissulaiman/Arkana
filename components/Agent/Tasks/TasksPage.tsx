"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, CheckCircle2, Search, Filter, XCircle } from "lucide-react";
import { Input } from "@/components/ui/input";

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
      type: "Organik & Anorganik",
      weight_est: "5-10 kg",
    },
    {
      id: "REQ-002",
      customer: "Siti Rahma",
      address: "Komplek Harmoni Blok B/12, Jakarta Barat",
      distance: "5.1 km",
      time: "13:00 - 15:00",
      status: "pending",
      type: "Anorganik",
      weight_est: "> 10 kg",
    },
    {
      id: "REQ-003",
      customer: "Dodi Pratama",
      address: "Jl. Sudirman No. 88, Jakarta Pusat",
      distance: "7.2 km",
      time: "15:30 - 17:00",
      status: "progress",
      type: "Organik",
      weight_est: "< 5 kg",
    },
  ];

  const filteredTasks = filter === "Semua" 
    ? tasks 
    : tasks.filter(t => filter === "Berjalan" ? t.status === "progress" : t.status === "pending");

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-end">
        <div>
          <h1 className="text-2xl font-semibold">Tugas Penjemputan</h1>
          <p className="text-sm text-muted-foreground">Kelola jadwal dan rute penjemputan Anda</p>
        </div>
        <div className="flex gap-2">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Cari ID atau Nama..." className="pl-9 h-9" />
          </div>
          <Button variant="outline" size="sm" className="h-9 shrink-0">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      <div className="flex gap-2 border-b overflow-x-auto pb-px">
        {["Semua", "Berjalan", "Menunggu"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
              filter === tab
                ? "border-green-600 text-green-600"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <Card key={task.id} className={`overflow-hidden ${task.status === "progress" ? "border-green-500 shadow-sm" : ""}`}>
            {task.status === "progress" && (
              <div className="bg-green-600 text-white text-[10px] uppercase font-bold text-center py-1 tracking-wider">
                Sedang Berjalan
              </div>
            )}
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{task.id}</span>
                    <Badge variant="secondary" className="text-[10px] bg-green-50 text-green-700 hover:bg-green-100 border-none">{task.type}</Badge>
                  </div>
                  <h3 className="font-medium text-lg leading-tight">{task.customer}</h3>
                </div>
              </div>

              <div className="space-y-2 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-foreground/70" />
                  <span className="line-clamp-2">{task.address}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-foreground/70" />
                    {task.time}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-foreground/70" />
                    {task.distance}
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Navigation className="w-4 h-4 mr-2" />
                    Rute
                  </Button>
                  {task.status === "progress" ? (
                    <Button variant="outline" className="w-full border-green-600 text-green-600 hover:bg-green-50">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Selesai
                    </Button>
                  ) : (
                    <Button variant="outline" className="w-full">
                      Mulai
                    </Button>
                  )}
                </div>
                {task.status === "pending" && (
                  <Button variant="outline" className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200">
                    <XCircle className="w-4 h-4 mr-2" />
                    Tolak Penjemputan
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
