"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle2, 
  Calendar, 
  Weight, 
  Loader2, 
  MapPin, 
  User, 
  Search,
  Filter,
  Package,
  TrendingUp,
  Clock
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

type HistoryItem = {
  id: string;
  customer: string;
  address: string;
  date: string;
  time: string;
  weight: string;
  status: string;
  points: number;
  waste_type: string;
};

const WASTE_LABELS: Record<string, string> = {
  plastic: "Plastik",
  paper: "Kertas",
  cardboard: "Kardus",
  glass: "Kaca",
  aluminium: "Aluminium",
  metal: "Logam",
  electronic: "Elektronik",
  mixed: "Campuran",
};

export default function AgentHistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalPickups: 0, totalWeight: 0, totalPoints: 0 });
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const supabase = createClientSupabaseClient();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Ambil data agent
      const { data: agentData } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!agentData) {
        setLoading(false);
        return;
      }

      // Ambil semua pickup requests yang sudah completed
      const { data: requests, error } = await supabase
        .from("pickup_requests")
        .select(`
          id,
          pickup_address,
          estimated_weight,
          total_points,
          waste_type,
          created_at,
          updated_at,
          status,
          user_id
        `)
        .eq("agent_id", agentData.id)
        .eq("status", "completed")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching history:", error);
        return;
      }

      if (requests && requests.length > 0) {
        // Ambil nama customer
        const userIds = [...new Set(requests.map(r => r.user_id))];
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, full_name")
          .in("user_id", userIds);

        const profileMap = new Map();
        profiles?.forEach(p => profileMap.set(p.user_id, p.full_name));

        let totalWeight = 0;
        let totalPoints = 0;

        const formattedHistory: HistoryItem[] = requests.map(req => {
          const weight = req.estimated_weight || 0;
          const points = req.total_points || 0;
          const date = new Date(req.created_at);
          
          totalWeight += weight;
          totalPoints += points;

          return {
            id: req.id.slice(0, 8),
            customer: profileMap.get(req.user_id) || "Pengguna",
            address: req.pickup_address,
            date: date.toLocaleDateString("id-ID", { day: '2-digit', month: 'long', year: 'numeric' }),
            time: date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit' }),
            weight: `${weight} kg`,
            status: "completed",
            points: points,
            waste_type: WASTE_LABELS[req.waste_type] || req.waste_type,
          };
        });

        setHistory(formattedHistory);
        setStats({
          totalPickups: formattedHistory.length,
          totalWeight: totalWeight,
          totalPoints: totalPoints,
        });
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredHistory = useMemo(() => {
    let filtered = history;
    
    if (searchQuery) {
      filtered = filtered.filter(item =>
        item.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered;
  }, [searchQuery, history]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Riwayat Penjemputan</h1>
            <p className="text-sm text-gray-500 mt-1">Semua riwayat penjemputan yang telah selesai</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchHistory}
              className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Loader2 className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Total Penjemputan</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalPickups}</p>
              </div>
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Total Berat</p>
                <p className="text-2xl font-bold text-gray-800">{stats.totalWeight.toFixed(1)} kg</p>
              </div>
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Weight className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400">Total Poin Diberikan</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalPoints.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama customer, ID, atau alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2.5 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* History List */}
        {filteredHistory.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Belum ada riwayat</h3>
            <p className="text-sm text-gray-400">Penjemputan yang selesai akan muncul di sini</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredHistory.map((item) => (
              <Card key={item.id} className="overflow-hidden border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <CardContent className="p-5">
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-gray-800">{item.customer}</h3>
                        <Badge className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5">
                          Selesai
                        </Badge>
                        <span className="text-xs text-gray-400 font-mono">#{item.id}</span>
                      </div>
                      
                      <div className="flex items-start gap-1 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                        <span className="line-clamp-1">{item.address}</span>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {item.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Weight className="w-3.5 h-3.5 text-green-600" />
                          <span className="font-medium text-gray-700">{item.weight}</span>
                        </span>
                        <Badge variant="outline" className="text-[10px] bg-gray-50">
                          {item.waste_type}
                        </Badge>
                      </div>
                    </div>

                    {/* Points */}
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-400">Poin diberikan</p>
                      <p className="text-xl font-bold text-green-600">+{item.points.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer Note */}
        {history.length > 0 && (
          <div className="text-center text-xs text-gray-400 pt-4 border-t border-gray-100">
            Menampilkan {filteredHistory.length} dari {history.length} riwayat penjemputan
          </div>
        )}
      </div>
    </div>
  );
}