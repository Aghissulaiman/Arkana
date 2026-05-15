"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
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
  AlertCircle,
  Filter,
  Eye
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

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

const STATUS_STYLES: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  pending: { 
    label: "Menunggu", 
    bg: "bg-yellow-50", 
    text: "text-yellow-700",
    icon: Clock
  },
  accepted: { 
    label: "Diproses", 
    bg: "bg-blue-50", 
    text: "text-blue-700",
    icon: Truck
  },
  picked_up: { 
    label: "Dijemput", 
    bg: "bg-purple-50", 
    text: "text-purple-700",
    icon: Package
  },
  completed: { 
    label: "Selesai", 
    bg: "bg-green-50", 
    text: "text-green-700",
    icon: CheckCircle
  },
  cancelled: { 
    label: "Dibatalkan", 
    bg: "bg-red-50", 
    text: "text-red-700",
    icon: XCircle
  },
  processed: { 
    label: "Diproses", 
    bg: "bg-blue-50", 
    text: "text-blue-700",
    icon: Clock
  },
};

export default function RiwayatPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [activeTab, setActiveTab] = useState("semua");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
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

    const { data: pickupData, error: pickupError } = await supabase
      .from("pickup_requests")
      .select(`
        *,
        agents (agent_name)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!pickupError) {
      const formattedPickups = (pickupData || []).map((p: any) => ({
        ...p,
        agent_name: p.agents?.agent_name,
        points_earned: p.points_earned || 0,
      }));
      setPickups(formattedPickups);
    }

    const { data: redeemData } = await supabase
      .from("redeem_requests")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setRedeems(redeemData || []);
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
      code: p.request_code || p.id.slice(0, 8),
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
      status: r.status === "pending" ? "processed" : r.status,
      code: r.id.slice(0, 8),
      isEarn: false,
    }));

    return [...pickupTransactions, ...redeemTransactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  };

  const transactions = getAllTransactions();
  
  const filteredTransactions = transactions.filter(t => {
    if (activeTab !== "semua" && t.type !== activeTab) return false;
    if (statusFilter !== "semua" && t.status !== statusFilter) return false;
    if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const groupedTransactions = {
    pending: filteredTransactions.filter(t => t.status === "pending" || t.status === "accepted" || t.status === "picked_up"),
    completed: filteredTransactions.filter(t => t.status === "completed"),
    cancelled: filteredTransactions.filter(t => t.status === "cancelled"),
  };

  const tabs = [
    { id: "semua", label: "Semua", icon: Clock, count: transactions.length },
    { id: "penjemputan", label: "Penjemputan", icon: Truck, count: pickups.length },
    { id: "tukar poin", label: "Tukar Poin", icon: Gift, count: redeems.length },
  ];

  const statusOptions = [
    { value: "semua", label: "Semua Status" },
    { value: "pending", label: "Menunggu" },
    { value: "accepted", label: "Diproses" },
    { value: "completed", label: "Selesai" },
    { value: "cancelled", label: "Dibatalkan" },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Riwayat Transaksi</h1>
          <p className="text-sm text-gray-500 mt-1">Semua aktivitas penjemputan dan penukaran poin Anda</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari transaksi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-white text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <Filter className="w-4 h-4 text-gray-500" />
            Filter
            {statusFilter !== "semua" && (
              <span className="w-2 h-2 bg-green-500 rounded-full" />
            )}
          </button>
        </div>

        {/* Filter Dropdown */}
        {showFilter && (
          <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5 shadow-sm">
            <p className="text-xs font-semibold text-gray-500 mb-2">Filter Status</p>
            <div className="flex flex-wrap gap-2">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    statusFilter === opt.value
                      ? "bg-green-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-all ${
                  isActive
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                    isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Grouped Transactions - TABLE VIEW */}
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">Tidak ada transaksi</h3>
            <p className="text-sm text-gray-400">
              {activeTab === "penjemputan" 
                ? "Belum ada penjemputan sampah" 
                : activeTab === "tukar poin" 
                   ? "Belum ada penukaran poin"
                   : "Belum ada aktivitas"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Transaksi</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Detail</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tanggal</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                    <th className="px-6 py-4 text-right text-[10px] font-bold text-gray-400 uppercase tracking-widest">Poin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredTransactions.map((item) => {
                    const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
                    const StatusIcon = statusStyle.icon;
                    const date = new Date(item.date);
                    
                    return (
                      <tr 
                        key={`${item.type}-${item.id}`}
                        className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                        onClick={() => router.push(`/user/history/${item.id}`)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${item.type === "penjemputan" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}>
                              {item.type === "penjemputan" ? <Truck className="w-4 h-4" /> : <Gift className="w-4 h-4" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-800">{item.title}</p>
                              <p className="text-[10px] text-gray-400 font-mono">#{item.code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-600">{item.subtitle}</p>
                          {item.details && <p className="text-[10px] text-gray-400">{item.details}</p>}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-xs text-gray-700">
                            {date.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${statusStyle.bg} ${statusStyle.text}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusStyle.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <p className={`text-sm font-black ${item.isEarn ? "text-green-600" : "text-orange-600"}`}>
                            {item.points || "0"}
                          </p>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Stats Summary */}
        {transactions.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-5 text-white">
            <p className="text-green-100 text-xs mb-3">📊 Ringkasan Aktivitas</p>
            <div className="flex justify-between items-center">
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">{pickups.filter(p => p.status === "completed").length}</p>
                <p className="text-green-100 text-xs">Penjemputan</p>
              </div>
              <div className="w-px h-10 bg-green-500" />
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">{pickups.reduce((sum, p) => sum + (p.points_earned || 0), 0).toLocaleString()}</p>
                <p className="text-green-100 text-xs">Poin Didapat</p>
              </div>
              <div className="w-px h-10 bg-green-500" />
              <div className="text-center flex-1">
                <p className="text-2xl font-bold">{redeems.reduce((sum, r) => sum + r.points_spent, 0).toLocaleString()}</p>
                <p className="text-green-100 text-xs">Poin Ditukar</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Komponen Card Transaksi
function TransactionCard({ item }: { item: any }) {
  const statusStyle = STATUS_STYLES[item.status] || STATUS_STYLES.pending;
  const StatusIcon = statusStyle.icon;
  const date = new Date(item.date);

  return (
    <Link href={`/user/history/${item.id}`} className="block">
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md hover:border-primary/20 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Header with status badge */}
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-sm font-semibold text-gray-800">
                {item.title}
              </span>
              <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                <StatusIcon className="w-3 h-3" />
                {statusStyle.label}
              </span>
            </div>
            
            {/* Subtitle */}
            <p className="text-xs text-gray-500 mb-1">{item.subtitle}</p>
            
            {/* Details */}
            {item.details && (
              <p className="text-xs text-gray-400">{item.details}</p>
            )}
            
            {/* Date & Code */}
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
              <span>{date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</span>
              <span>•</span>
              <span>{date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}</span>
              <span className="font-mono">#{item.code}</span>
            </div>
          </div>

          {/* Points + chevron */}
          <div className="text-right ml-4 flex flex-col items-end gap-2">
            {item.points && (
              <p className={`text-lg font-bold ${item.isEarn ? "text-green-600" : "text-orange-600"}`}>
                {item.points}
              </p>
            )}
            {item.isEarn && item.pointsValue === 0 && (
              <p className="text-xs text-gray-400">Menunggu</p>
            )}
            <ChevronRight className="w-4 h-4 text-gray-300" />
          </div>
        </div>
      </div>
    </Link>
  );
}