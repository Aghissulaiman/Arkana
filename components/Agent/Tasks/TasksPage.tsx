"use client";

import { useState, useEffect } from "react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, CheckCircle2, Loader2, Truck } from "lucide-react";

export default function AgentTasksPage() {
  const supabase = createClientSupabaseClient();
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log("User tidak login");
        setLoading(false);
        return;
      }

      // Cari agent_id
      const { data: agentData } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!agentData) {
        console.log("Bukan agent");
        setLoading(false);
        return;
      }

      // Ambil SEMUA request tanpa filter apapun
      const { data: requests, error } = await supabase
        .from("pickup_requests")
        .select("*")
        .eq("agent_id", agentData.id);

      console.log("=== HASIL QUERY ===");
      console.log("Agent ID:", agentData.id);
      console.log("Total request:", requests?.length);
      console.log("Detail:", requests?.map(r => ({ id: r.id.slice(0,8), status: r.status, berat: r.estimated_weight })));

      if (error) {
        console.error("Error:", error);
      }

      setTasks(requests || []);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="bg-blue-50 p-3 rounded mb-4 text-sm">
        <p><strong>Debug Info:</strong></p>
        <p>Total request di database untuk agent ini: <strong>{tasks.length}</strong></p>
        <p>Detail: {tasks.map(t => `${t.status}(${t.estimated_weight}kg)`).join(', ') || '-'}</p>
      </div>

      <h1 className="text-2xl font-bold mb-4">Tugas Penjemputan</h1>
      
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Truck className="w-12 h-12 mx-auto mb-2 opacity-30" />
          <p>Tidak ada tugas penjemputan</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task) => (
            <Card key={task.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px]">
                        {task.id.slice(0, 8)}
                      </Badge>
                      {task.status === "pending" && (
                        <Badge className="bg-yellow-100 text-yellow-700">Menunggu</Badge>
                      )}
                      {task.status === "accepted" && (
                        <Badge className="bg-green-100 text-green-700">Diproses</Badge>
                      )}
                      {task.status === "completed" && (
                        <Badge className="bg-blue-100 text-blue-700">Selesai</Badge>
                      )}
                    </div>
                    <div className="flex items-start gap-2 text-sm mt-2">
                      <MapPin className="w-4 h-4 mt-0.5 text-muted-foreground" />
                      <span>{task.pickup_address}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                      <Clock className="w-3 h-3" />
                      {new Date(task.created_at).toLocaleString()}
                    </div>
                    <p className="text-sm mt-2">
                      Berat: <strong>{task.estimated_weight} kg</strong>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    {task.status === "pending" && (
                      <Button size="sm">Terima</Button>
                    )}
                    {task.status === "accepted" && (
                      <Button size="sm" variant="outline">Selesai</Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Button variant="outline" className="mt-4" onClick={fetchTasks}>
        Refresh
      </Button>
    </div>
  );
}