"use client";

import { useState, useEffect } from "react";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Search,
  Calendar,
  Truck,
  Gift,
  Loader2,
  AlertCircle
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";

type PickupRequest = {
  id: string;
  request_code: string;
  waste_type: string;
  estimated_weight: number;
  actual_weight: number;
  status: string;
  points_earned: number;
  created_at: string;
  updated_at: string;
  agent_name?: string;
};

type RedeemRequest = {
  id: string;
  reward_name: string;
  points_spent: number;
  status: string;
  created_at: string;
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

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-700" },
  accepted: { label: "Diterima", color: "bg-blue-100 text-blue-700" },
  picked_up: { label: "Dijemput", color: "bg-purple-100 text-purple-700" },
  completed: { label: "Selesai", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-700" },
  processed: { label: "Diproses", color: "bg-blue-100 text-blue-700" },
};

export default function RiwayatPage() {
  const supabase = createClientSupabaseClient();
  const [activeTab, setActiveTab] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [pickups, setPickups] = useState<PickupRequest[]>([]);
  const [redeems, setRedeems] = useState<RedeemRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return;
    }

    // Ambil riwayat penjemputan
    const { data: pickupData, error: pickupError } = await supabase
      .from("pickup_requests")
      .select(`
        *,
        agents (agent_name)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (pickupError) {
      console.error("Error fetching pickups:", pickupError);
    } else {
      const formattedPickups = (pickupData || []).map((p: any) => ({
        ...p,
        agent_name: p.agents?.agent_name,
        points_earned: p.points_earned || 0,
      }));
      setPickups(formattedPickups);
    }

    // Ambil riwayat penukaran poin
    const { data: redeemData, error: redeemError } = await supabase
      .from("redeem_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (redeemError) {
      console.error("Error fetching redeems:", redeemError);
    } else {
      setRedeems(redeemData || []);
    }

    setLoading(false);
  };

  const getAllTransactions = () => {
    const pickupTransactions = pickups.map(p => ({
      id: p.id,
      type: "penjemputan",
      title: WASTE_LABELS[p.waste_type] || p.waste_type,
      subtitle: p.agent_name ? `Agen: ${p.agent_name}` : "Penjemputan Sampah",
      details: `Berat: ${(p.actual_weight || p.estimated_weight || 0).toFixed(1)} kg`,
      points: p.points_earned > 0 ? `+${p.points_earned.toLocaleString()}` : null,
      pointsValue: p.points_earned,
      date: p.created_at,
      status: p.status,
      code: p.request_code,
      isEarn: true,
    }));

    const redeemTransactions = redeems.map(r => ({
      id: r.id,
      type: "tukar poin",
      title: r.reward_name,
      subtitle: "Penukaran Poin",
      details: null,
      points: `-${r.points_spent.toLocaleString()}`,
      pointsValue: -r.points_spent,
      date: r.created_at,
      status: r.status,
      code: r.id.slice(0, 8),
      isEarn: false,
    }));

    return [...pickupTransactions, ...redeemTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const getStatusBadge = (status: string) => {
    const statusInfo = STATUS_LABELS[status];
    if (!statusInfo) {
      return <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">{status}</span>;
    }
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const transactions = getAllTransactions();
  
  const filteredTransactions = transactions.filter(t => {
    if (activeTab !== "semua" && t.type !== activeTab) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { id: "semua", label: "Semua", icon: Clock },
    { id: "penjemputan", label: "Penjemputan", icon: Truck },
    { id: "tukar poin", label: "Tukar Poin", icon: Gift },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat</h1>
        <p className="text-sm text-gray-500 mt-1">Riwayat penjemputan dan penukaran poin Anda</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-gray-100 mb-5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 text-sm font-medium transition-all ${
                isActive
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Transactions List */}
      {filteredTransactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <AlertCircle className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">Tidak ada riwayat transaksi</p>
          <p className="text-sm text-gray-400 mt-1">
            {activeTab === "penjemputan" 
              ? "Belum ada penjemputan sampah. Yuk, jual sampah sekarang!" 
              : activeTab === "tukar poin" 
                ? "Belum ada penukaran poin. Kumpulkan poin untuk dapat hadiah!"
                : "Belum ada aktivitas"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTransactions.map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-semibold text-gray-800">
                      {item.title}
                    </span>
                    {getStatusBadge(item.status)}
                  </div>
                  
                  {/* Subtitle */}
                  <p className="text-xs text-gray-500 mb-1">{item.subtitle}</p>
                  
                  {/* Details */}
                  {item.details && (
                    <p className="text-xs text-gray-400">{item.details}</p>
                  )}
                  
                  {/* Date & Code */}
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatDate(item.date)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {formatTime(item.date)}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400 font-mono">
                      #{item.code}
                    </span>
                  </div>
                </div>

                {/* Points */}
                <div className="text-right">
                  {item.points && (
                    <p className={`text-base font-bold ${item.isEarn ? "text-green-600" : "text-red-600"}`}>
                      {item.points}
                    </p>
                  )}
                  {item.isEarn && item.pointsValue === 0 && (
                    <p className="text-xs text-gray-400">Menunggu konfirmasi</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats Summary */}
      {transactions.length > 0 && (
        <div className="mt-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-xs text-gray-500">Total Penjemputan</p>
              <p className="text-lg font-bold text-gray-800">
                {pickups.filter(p => p.status === "completed").length}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-500">Total Poin Didapat</p>
              <p className="text-lg font-bold text-green-600">
                {pickups.reduce((sum, p) => sum + (p.points_earned || 0), 0).toLocaleString()}
              </p>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <p className="text-xs text-gray-500">Total Poin Ditukar</p>
              <p className="text-lg font-bold text-orange-600">
                {redeems.reduce((sum, r) => sum + r.points_spent, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 