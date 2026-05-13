"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, CheckCircle2, Loader2, Truck } from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import Link from "next/link";

export default function AgentDashboard() {
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [recentPickups, setRecentPickups] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();

    // Setup Supabase Realtime agar dashboard langsung update saat ada request baru
    let channel: any;
    const setupRealtime = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      channel = supabase
        .channel('agent-dashboard-updates')
        .on(
          'postgres_changes',
          {
            event: '*', 
            schema: 'public',
            table: 'pickup_requests',
            filter: `agent_id=eq.${user.id}`, 
          },
          (payload) => {
            fetchDashboardData(); 
          }
        )
        .subscribe();
    };
    
    setupRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const fetchDashboardData = async () => {
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
          total_points,
          created_at,
          user_id
        `)
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error);
        return;
      }

      if (requests && requests.length > 0) {
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

        const formattedRequests = requests.map(req => {
          const totalWeight = req.estimated_weight || 0;
          const date = new Date(req.created_at);
          const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
          const dateStr = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });

          return {
            id: `REQ-${req.id.slice(0, 8)}`,
            dbId: req.id,
            customer: profileMap.get(req.user_id) || "Pengguna",
            address: req.pickup_address,
            distance: "- km",
            time: timeStr,
            date: dateStr,
            status: req.status,
            weight: `${totalWeight} kg`,
            points: `+${req.total_points ? req.total_points : totalWeight * 10}`,
          };
        });

        setActiveTasks(formattedRequests.filter(r => ["pending", "accepted"].includes(r.status)));
        setRecentPickups(formattedRequests.filter(r => r.status === "completed").slice(0, 5));
      } else {
        setActiveTasks([]);
        setRecentPickups([]);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
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
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  if (loading && activeTasks.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2 border-0 shadow-sm bg-background">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
          <CardTitle className="text-lg font-bold text-foreground">Tugas Penjemputan</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-bold">
            {activeTasks.length} Tugas Aktif
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {activeTasks.map((task) => (
            <div key={task.id} className={`p-5 rounded-xl border transition-all duration-300 ${task.status === 'accepted' ? 'border-primary shadow-sm bg-primary/5' : 'border-border/60 bg-card hover:bg-muted/30'}`}>
              <div className="flex flex-col sm:flex-row justify-between gap-5">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold text-muted-foreground bg-muted/50 border-border px-2 py-0.5">{task.id}</Badge>
                    {task.status === "accepted" && (
                      <Badge className="bg-primary/20 text-primary border-none text-[10px] hover:bg-primary/30">Sedang Berjalan</Badge>
                    )}
                    {task.status === "pending" && (
                      <Badge className="bg-yellow-500/20 text-yellow-700 border-none text-[10px]">Menunggu</Badge>
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground text-lg leading-tight">{task.customer}</h3>
                    <div className="flex items-start gap-2 text-sm text-muted-foreground mt-1.5">
                      <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-primary/70" />
                      <span className="leading-relaxed">{task.address}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-semibold text-muted-foreground pt-1">
                    <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                      <Clock className="w-3.5 h-3.5 text-foreground/60" />
                      {task.time}
                    </div>
                    <div className="flex items-center gap-1.5 bg-muted/50 px-2 py-1 rounded-md border border-border/50">
                      <Navigation className="w-3.5 h-3.5 text-foreground/60" />
                      {task.distance}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0 sm:w-36 justify-center">
                  <Button size="sm" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm" onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(task.address)}`, '_blank')}>
                    <MapPin className="w-4 h-4 mr-2" />
                    Navigasi
                  </Button>
                  {task.status === "accepted" ? (
                    <Button size="sm" variant="outline" className="w-full font-bold border-primary text-primary hover:bg-primary/10" onClick={() => updateTaskStatus(task.dbId, 'completed')}>
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Selesai
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full font-bold border-border text-foreground hover:bg-muted" onClick={() => updateTaskStatus(task.dbId, 'accepted')}>
                      Terima
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {activeTasks.length === 0 && (
            <div className="text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
              <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="font-medium">Tidak ada tugas penjemputan saat ini</p>
              <p className="text-sm text-muted-foreground mt-1">Tunggu permintaan dari user</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm bg-background">
        <CardHeader className="border-b border-border/50 pb-4">
          <CardTitle className="text-lg font-bold text-foreground">Riwayat Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-6">
          {recentPickups.map((pickup) => (
            <div key={pickup.id} className="flex items-start gap-4 pb-4 border-b border-border/50 last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                <Truck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-foreground truncate">{pickup.customer}</p>
                <p className="text-xs text-muted-foreground mt-0.5">{pickup.date}, {pickup.time}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-[10px] font-bold bg-muted/50 border-border/50">
                    {pickup.weight}
                  </Badge>
                  <span className="text-xs font-bold text-primary">{pickup.points} pts</span>
                </div>
              </div>
            </div>
          ))}
          {recentPickups.length === 0 && (
            <div className="text-center py-6 text-sm text-muted-foreground">
              Belum ada riwayat penjemputan.
            </div>
          )}
          {recentPickups.length > 0 && (
            <Link href="/agent/tasks">
              <Button variant="ghost" className="w-full text-xs font-bold text-primary hover:text-primary hover:bg-primary/10 mt-2">
                Lihat Semua Tugas
              </Button>
            </Link>
          )}
        </CardContent>
      </Card>
    </div>
  );
}