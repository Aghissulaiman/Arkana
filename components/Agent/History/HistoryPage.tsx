"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Weight, Loader2 } from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: requests, error } = await supabase
        .from("requests")
        .select(`
          id,
          pickup_address,
          estimated_weights,
          created_at,
          user_id
        `)
        .eq("agent_id", user.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching history:", error);
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

        const formattedHistory = requests.map(req => {
          const weights = req.estimated_weights as Record<string, number> || {};
          const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
          const date = new Date(req.created_at);

          return {
            id: `REQ-${String(req.id).padStart(3, '0')}`,
            customer: profileMap.get(req.user_id) || "Pengguna",
            address: req.pickup_address,
            date: date.toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' }) + `, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
            weight: `${totalWeight} kg`,
          };
        });

        setHistory(formattedHistory);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("q")?.toLowerCase() || "";

  const filteredHistory = useMemo(() => {
    if (!searchQuery) return history;
    return history.filter(item =>
      item.customer.toLowerCase().includes(searchQuery) ||
      item.id.toLowerCase().includes(searchQuery) ||
      item.address.toLowerCase().includes(searchQuery)
    );
  }, [searchQuery, history]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8 pt-8">
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Card key={item.id} className="overflow-hidden border-0 rounded-2xl shadow-sm bg-background hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">{item.customer}</h3>
                    <Badge variant="outline" className="text-[9px] font-bold text-muted-foreground/70 bg-muted/30 border-border/50 px-1.5 py-0">{item.id}</Badge>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground line-clamp-1">{item.address}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground/90 pt-1">
                    <span className="flex items-center gap-1 bg-muted/30 px-1.5 py-0.5 rounded border border-border/50">
                      <Calendar className="w-3 h-3 text-muted-foreground/70" />
                      {item.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold bg-muted/30 px-3 py-2 rounded-lg border border-border/50 text-foreground/80">
                    <Weight className="w-3.5 h-3.5 text-primary" />
                    {item.weight}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredHistory.length === 0 && (
          <div className="col-span-full text-center py-12 text-muted-foreground bg-muted/20 rounded-xl border border-dashed border-border">
            <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
            <p className="font-medium">Tidak ada riwayat penjemputan</p>
          </div>
        )}
      </div>
    </div>
  );
}
