"use client";

import { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, CheckCircle2, XCircle, Loader2, Truck } from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";

type Task = {
  id: string;
  dbId: string;
  customer: string;
  address: string;
  distance: string;
  time: string;
  status: string;
  weight_est: string;
  notes?: string;
  phone?: string;
};

export default function TasksPage() {
  const [filter, setFilter] = useState("Semua");
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      // Ambil semua pickup request untuk agent ini
      const { data: requests, error } = await supabase
        .from("pickup_requests")
        .select(`
          id,
          status,
          pickup_address,
          estimated_weight,
          created_at,
          notes,
          user_id
        `)
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching tasks:", error);
        toast.error("Gagal memuat data");
        return;
      }

      if (requests && requests.length > 0) {
        // Ambil data user (customer)
        const userIds = [...new Set(requests.map(r => r.user_id))];
        let profiles: any[] | null = null;
        
        if (userIds.length > 0) {
          const { data } = await supabase
            .from("profiles")
            .select("user_id, full_name, phone")
            .in("user_id", userIds);
          profiles = data;
        }

        const profileMap = new Map();
        const phoneMap = new Map();
        if (profiles) {
          profiles.forEach(p => {
            profileMap.set(p.user_id, p.full_name);
            phoneMap.set(p.user_id, p.phone);
          });
        }

        const formattedTasks: Task[] = requests.map(req => {
          const totalWeight = req.estimated_weight || 0;
          const date = new Date(req.created_at);
          const timeStr = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

          // Tentukan status display
          let displayStatus = req.status;
          if (req.status === "pending") displayStatus = "pending";
          if (req.status === "accepted") displayStatus = "accepted";
          if (req.status === "completed") displayStatus = "completed";
          if (req.status === "cancelled") displayStatus = "cancelled";

          return {
            id: `REQ-${req.id.slice(0, 8)}`,
            dbId: req.id,
            customer: profileMap.get(req.user_id) || "Pengguna",
            phone: phoneMap.get(req.user_id) || "-",
            address: req.pickup_address,
            distance: "- km",
            time: timeStr,
            status: displayStatus,
            weight_est: `${totalWeight} kg`,
            notes: req.notes || "",
          };
        });

        setTasks(formattedTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error("Failed to fetch tasks:", error);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (dbId: string, newStatus: string, actionName: string) => {
    setProcessingId(dbId);
    try {
      const { error } = await supabase
        .from("pickup_requests")
        .update({ status: newStatus })
        .eq("id", dbId);

      if (error) {
        toast.error(`Gagal ${actionName}: ${error.message}`);
      } else {
        toast.success(`Berhasil ${actionName} penjemputan!`);
        await fetchTasks();
      }
    } catch (err) {
      console.error("Error updating task:", err);
      toast.error(`Gagal ${actionName}`);
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Menunggu</Badge>;
      case "accepted":
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">Diproses</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Selesai</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-700 border-red-200">Dibatalkan</Badge>;
      default:
        return <Badge>{status}</Badge>;
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

    if (filter === "Semua") {
      return tasksToFilter;
    } else if (filter === "Berjalan") {
      return tasksToFilter.filter(t => t.status === "accepted");
    } else if (filter === "Menunggu") {
      return tasksToFilter.filter(t => t.status === "pending");
    } else if (filter === "Selesai") {
      return tasksToFilter.filter(t => t.status === "completed");
    }
    return tasksToFilter;
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
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tugas Penjemputan</h1>
          <p className="text-sm text-muted-foreground">Kelola permintaan penjemputan sampah</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={fetchTasks}
            className="gap-2"
          >
            <Loader2 className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["Semua", "Menunggu", "Berjalan", "Selesai"].map((tab) => (
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
            {tab === "Menunggu" && tasks.filter(t => t.status === "pending").length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">
                {tasks.filter(t => t.status === "pending").length}
              </span>
            )}
            {tab === "Berjalan" && tasks.filter(t => t.status === "accepted").length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-blue-500 text-white rounded-full">
                {tasks.filter(t => t.status === "accepted").length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tasks Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTasks.map((task) => (
          <Card 
            key={task.id} 
            className={`overflow-hidden border-0 rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
              task.status === "accepted" 
                ? "ring-2 ring-primary shadow-primary/10 bg-gradient-to-b from-primary/5 to-background" 
                : "shadow-sm bg-background border border-border/50"
            }`}
          >
            {task.status === "accepted" && (
              <div className="bg-primary text-primary-foreground text-[10px] uppercase font-bold text-center py-1.5 tracking-widest flex items-center justify-center gap-1.5 shadow-sm">
                <Truck className="w-3 h-3" />
                Sedang Berjalan
              </div>
            )}
            {task.status === "pending" && (
              <div className="bg-yellow-500 text-white text-[10px] uppercase font-bold text-center py-1.5 tracking-widest flex items-center justify-center gap-1.5 shadow-sm">
                <Clock className="w-3 h-3" />
                Menunggu Konfirmasi
              </div>
            )}
            {task.status === "completed" && (
              <div className="bg-green-500 text-white text-[10px] uppercase font-bold text-center py-1.5 tracking-widest flex items-center justify-center gap-1.5 shadow-sm">
                <CheckCircle2 className="w-3 h-3" />
                Selesai
              </div>
            )}
            
            <CardContent className="p-5 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-bold text-muted-foreground/70 text-xs tracking-wider bg-muted/50 px-2 py-0.5 rounded border border-border/50">
                      {task.id}
                    </span>
                    {getStatusBadge(task.status)}
                  </div>
                  <h3 className="font-bold text-lg text-foreground leading-tight">{task.customer}</h3>
                  {task.phone && task.phone !== "-" && (
                    <p className="text-xs text-muted-foreground mt-0.5">📞 {task.phone}</p>
                  )}
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
                  <span className="text-xs font-medium text-muted-foreground leading-relaxed pt-1">
                    {task.address}
                  </span>
                </div>

                {task.notes && (
                  <div className="flex items-start gap-2.5 bg-yellow-50/50 p-2.5 rounded-xl border border-yellow-100">
                    <span className="text-xs text-yellow-600">📝</span>
                    <span className="text-xs text-yellow-700">{task.notes}</span>
                  </div>
                )}

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

              {/* Action Buttons */}
              <div className="pt-3 flex flex-col gap-2">
                {task.status !== "completed" && task.status !== "cancelled" && (
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 rounded-lg h-9 bg-primary hover:bg-primary/90 text-primary-foreground font-bold shadow-sm shadow-primary/20 text-xs" 
                      onClick={() => window.open(`https://maps.google.com/?q=${encodeURIComponent(task.address)}`, '_blank')}
                    >
                      <Navigation className="w-3.5 h-3.5 mr-1.5" />
                      Rute
                    </Button>
                    {task.status === "accepted" ? (
                      <Button 
                        variant="outline" 
                        className="flex-1 rounded-lg h-9 border-green-500 text-green-600 font-bold hover:bg-green-50 text-xs" 
                        onClick={() => updateTaskStatus(task.dbId, 'completed', 'menyelesaikan')}
                        disabled={processingId === task.dbId}
                      >
                        {processingId === task.dbId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Selesai
                      </Button>
                    ) : (
                      <Button 
                        className="flex-1 rounded-lg h-9 bg-blue-500 hover:bg-blue-600 text-white font-bold text-xs" 
                        onClick={() => updateTaskStatus(task.dbId, 'accepted', 'menerima')}
                        disabled={processingId === task.dbId}
                      >
                        {processingId === task.dbId ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />
                        )}
                        Terima
                      </Button>
                    )}
                  </div>
                )}
                
                {task.status === "pending" && (
                  <Button 
                    variant="outline" 
                    className="w-full h-9 text-red-500 font-bold hover:text-red-600 hover:bg-red-50 rounded-lg text-xs border-red-200" 
                    onClick={() => updateTaskStatus(task.dbId, 'cancelled', 'menolak')}
                    disabled={processingId === task.dbId}
                  >
                    {processingId === task.dbId ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Tolak Penjemputan
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
            <p className="text-sm text-muted-foreground mt-1">Tunggu permintaan penjemputan dari user</p>
          </div>
        )}
      </div>
    </div>
  );
}