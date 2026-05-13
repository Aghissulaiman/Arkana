"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

export default function TasksPage() {
  const [filter, setFilter] = useState("Semua");
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: requests, error } = await supabase
        .from("pickup_requests")
        .select(`
          id,
          status,
          pickup_address,
          estimated_weight,
          created_at,
          user_id
        `)
        .eq("agent_id", user.id)
        .in("status", ["pending", "accepted"])
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
        return;
      }

      if (requests) {
        const userIds = [...new Set(requests.map(r => r.user_id))];
        let profiles: any[] | null = null;
        if (userIds.length > 0) {
          const { data } = await supabase
            .from("profiles")
            .select("user_id, full_name")
            .in("user_id", userIds);
          profiles = data;
        }

        const profileMap = new Map();
        if (profiles) {
          profiles.forEach(p => profileMap.set(p.user_id, p.full_name));
        }

        const formattedTasks = requests.map(req => {
          const weights = req.estimated_weight as Record<string, number> || {};
          const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
          const date = new Date(req.created_at);

          return {
            id: `REQ-${String(req.id).padStart(3, '0')}`,
            dbId: req.id,
            customer: profileMap.get(req.user_id) || "Pengguna",
            address: req.pickup_address,
            distance: "- km",
            time: `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
            status: req.status,
            weight_est: `${totalWeight} kg`,
          };
        });

        setTasks(formattedTasks);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("pickup_requests")
        .update({ status: newStatus })
        .eq("id", id);

      if (!error) {
        fetchTasks();
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

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
      : tasksToFilter.filter(t => filter === "Berjalan" ? t.status === "accepted" : t.status === "pending");
  }, [filter, searchQuery, tasks]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pt-8">

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["Semua", "Berjalan", "Menunggu"].map((tab) => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all duration-300 ${filter === tab
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
          <Card key={task.id} className={`overflow-hidden border-0 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${task.status === "accepted" ? "ring-2 ring-primary shadow-primary/10 bg-gradient-to-b from-primary/5 to-background" : "shadow-sm bg-background border border-border/50"}`}>
            {task.status === "accepted" && (
              <div className="bg-primary text-primary-foreground text-[10px] uppercase font-bold text-center py-1.5 tracking-widest flex items-center justify-center gap-1.5 shadow-sm">Sedang Berjalan</div>
            )}
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold text-muted-foreground/70 text-xs tracking-wider bg-muted/50 px-2 py-0.5 rounded border border-border/50">{task.id}</span>
                  </div>
                  <h3 className="font-bold text-lg text-foreground leading-tight">{task.customer}</h3>
                </div>
                <div className="bg-muted px-2 py-1 rounded text-xs font-bold text-muted-foreground whitespace-nowrap">
                  {task.weight_est}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-2.5 bg-muted/30 p-2.5 rounded-xl border border-border/50">
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground leading-relaxed pt-1">{task.address}</span>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-border/50">
                    <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0 border border-border/50">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{task.time}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-muted/30 p-2 rounded-xl border border-border/50">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                      <Navigation className="w-3.5 h-3.5 text-primary" />
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{task.distance}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex flex-col gap-2">
                <div className="flex gap-2">
                  <Button className="flex-1 rounded-lg h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm shadow-primary/20 text-xs" onClick={() => window.open(`https://maps.google.com/?q=${task.address}`, '_blank')}>
                    <Navigation className="w-3.5 h-3.5 mr-1.5" />
                    Rute
                  </Button>
                  {task.status === "accepted" ? (
                    <Button variant="outline" className="flex-1 rounded-lg h-9 border-primary text-primary font-bold hover:bg-primary/5 text-xs" onClick={() => updateTaskStatus(task.dbId, 'completed')}>
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                      Selesai
                    </Button>
                  ) : (
                    <Button variant="outline" className="flex-1 rounded-lg h-9 font-bold border-border text-foreground hover:bg-muted/50 text-xs" onClick={() => updateTaskStatus(task.dbId, 'accepted')}>
                      Terima
                    </Button>
                  )}
                </div>
                {task.status === "pending" && (
                  <Button variant="outline" className="w-full h-9 text-destructive font-bold hover:text-destructive hover:bg-destructive/10 rounded-lg text-xs border-destructive/20" onClick={() => updateTaskStatus(task.dbId, 'cancelled')}>
                    <XCircle className="w-3.5 h-3.5 mr-1.5" /> Tolak Penjemputan
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredTasks.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
            <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-medium">Tidak ada tugas penjemputan dengan filter ini</p>
          </div>
        )}
      </div>
    </div>
  );
}
