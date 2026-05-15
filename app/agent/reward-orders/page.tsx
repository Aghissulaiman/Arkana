"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";
import {
  Loader2,
  Search,
  Eye,
  Package,
  User,
  Calendar,
  Coins,
  RefreshCw,
  Clock,
  CheckCircle,
  XCircle,
  Truck,
  Send,
  Box,
  Check,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Order = {
  id: string;
  order_code: string;
  user_id: string;
  reward_name: string;
  reward_image: string;
  points_spent: number;
  quantity: number;
  status: string;
  tracking_number?: string;
  courier?: string;
  created_at: string;
  user_name?: string;
  user_address?: string;
  user_phone?: string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; nextStatus?: string; nextLabel?: string }> = {
  pending: { label: "Menunggu", color: "bg-yellow-100 text-yellow-700", icon: Clock, nextStatus: "packing", nextLabel: "Proses ke Dikemas" },
  packing: { label: "Dikemas", color: "bg-blue-100 text-blue-700", icon: Package, nextStatus: "shipping", nextLabel: "Kirim Pesanan" },
  shipping: { label: "Dikirim", color: "bg-purple-100 text-purple-700", icon: Truck, nextStatus: "delivered", nextLabel: "Tandai Sampai" },
  delivered: { label: "Tiba di Tujuan", color: "bg-indigo-100 text-indigo-700", icon: CheckCircle, nextStatus: "completed", nextLabel: "Selesai" },
  completed: { label: "Selesai", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Dibatalkan", color: "bg-red-100 text-red-700", icon: XCircle },
};

export default function AgentRewardOrdersPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showShippingModal, setShowShippingModal] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [courier, setCourier] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    checkAgentAndFetch();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, orders]);

  const checkAgentAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "agent") {
      router.push("/user/home");
      return;
    }

    await fetchOrders();
  };

  const fetchOrders = async () => {
    setLoading(true);
    
    try {
      // Ambil dari redeem_requests
      const { data: redeemData, error } = await supabase
        .from("redeem_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        setLoading(false);
        return;
      }

      if (!redeemData || redeemData.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      // Ambil data user dari profiles
      const userIds = [...new Set(redeemData.map(r => r.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone, address")
        .in("user_id", userIds);

      const profileMap = new Map();
      profiles?.forEach(p => {
        profileMap.set(p.user_id, {
          name: p.full_name,
          phone: p.phone,
          address: p.address,
        });
      });

      // Ambil data reward
      const rewardIds = [...new Set(redeemData.map(r => r.reward_id).filter(Boolean))];
      const { data: rewards } = await supabase
        .from("rewards")
        .select("id, name, image_url")
        .in("id", rewardIds);

      const rewardMap = new Map();
      rewards?.forEach(r => {
        rewardMap.set(r.id, { name: r.name, image: r.image_url });
      });

      const formattedOrders = redeemData.map((r: any) => {
        let status = "pending";
        if (r.status === "processed") status = "packing";
        else if (r.status === "shipping") status = "shipping";
        else if (r.status === "delivered") status = "delivered";
        else if (r.status === "completed") status = "completed";
        else if (r.status === "cancelled") status = "cancelled";
        else status = r.status || "pending";

        const profile = profileMap.get(r.user_id);
        const reward = rewardMap.get(r.reward_id);

        return {
          id: r.id,
          order_code: `RDM-${r.id.slice(0, 8)}`,
          user_id: r.user_id,
          reward_name: r.reward_name || reward?.name || "-",
          reward_image: reward?.image || null,
          points_spent: r.points_spent || 0,
          quantity: 1,
          status: status,
          created_at: r.created_at,
          user_name: profile?.name,
          user_phone: profile?.phone,
          user_address: profile?.address,
          tracking_number: r.tracking_number,
          courier: r.courier,
        };
      });

      setOrders(formattedOrders);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const addCommissionToAgent = async (pointsSpent: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return false;

    // Cari agent berdasarkan user_id
    const { data: agentData, error: agentError } = await supabase
      .from("agents")
      .select("id, balance_income")
      .eq("user_id", user.id)
      .single();

    if (agentError || !agentData) {
      console.error("Agent not found:", agentError);
      return false;
    }

    const newBalance = (agentData.balance_income || 0) + pointsSpent;

    const { error: updateError } = await supabase
      .from("agents")
      .update({ balance_income: newBalance, updated_at: new Date().toISOString() })
      .eq("id", agentData.id);

    if (updateError) {
      console.error("Error updating agent balance:", updateError);
      return false;
    }

    return true;
  };

  const updateOrderStatus = async (orderId: string, newStatus: string, trackingData?: { tracking_number: string; courier: string }) => {
    setProcessing(true);
    
    // Ambil data order terlebih dahulu untuk mengetahui points_spent
    const { data: order, error: orderError } = await supabase
      .from("redeem_requests")
      .select("user_id, points_spent, reward_name")
      .eq("id", orderId)
      .single();

    if (orderError) {
      toast.error("Gagal mengambil data pesanan");
      setProcessing(false);
      return;
    }

    // Jika status menjadi "completed", tambahkan komisi ke agent
    if (newStatus === "completed" && order) {
      const success = await addCommissionToAgent(order.points_spent);
      if (success) {
        toast.success(`Pendapatan +${order.points_spent.toLocaleString()} poin!`);
      } else {
        toast.error("Gagal menambahkan pendapatan");
      }
    }

    // Update status pesanan
    if (newStatus === "shipping" && trackingData) {
      const { error } = await supabase
        .from("redeem_requests")
        .update({ 
          status: "shipping",
          tracking_number: trackingData.tracking_number,
          courier: trackingData.courier,
          shipped_at: new Date().toISOString()
        })
        .eq("id", orderId);

      if (error) {
        toast.error("Gagal mengupdate status: " + error.message);
      } else {
        toast.success(`Pesanan dikirim dengan resi: ${trackingData.tracking_number}`);
        setShowShippingModal(null);
        setTrackingNumber("");
        setCourier("");
        fetchOrders();
      }
    } else {
      const updateStatus = newStatus === "packing" ? "processed" : newStatus;
      const { error } = await supabase
        .from("redeem_requests")
        .update({ status: updateStatus })
        .eq("id", orderId);

      if (error) {
        toast.error("Gagal mengupdate status: " + error.message);
      } else {
        toast.success(`Status berhasil diupdate menjadi ${STATUS_CONFIG[newStatus]?.label || newStatus}`);
        fetchOrders();
      }
    }
    
    setProcessing(false);
  };

  const applyFilters = () => {
    let filtered = [...orders];
    
    if (searchQuery) {
      filtered = filtered.filter(o => 
        o.order_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.reward_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.user_name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (statusFilter !== "all") {
      filtered = filtered.filter(o => o.status === statusFilter);
    }
    
    setFilteredOrders(filtered);
  };

  const getStatusLabel = (status: string) => {
    return STATUS_CONFIG[status]?.label || status;
  };

  const getStatusColor = (status: string) => {
    return STATUS_CONFIG[status]?.color || "bg-gray-100 text-gray-700";
  };

  const getStatusIcon = (status: string) => {
    const Icon = STATUS_CONFIG[status]?.icon;
    return Icon ? <Icon className="w-4 h-4" /> : <Clock className="w-4 h-4" />;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === "pending").length,
    packing: orders.filter(o => o.status === "packing").length,
    shipping: orders.filter(o => o.status === "shipping").length,
    completed: orders.filter(o => o.status === "delivered" || o.status === "completed").length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pesanan Reward</h1>
            <p className="text-sm text-gray-500 mt-1">Kelola pesanan penukaran poin dari pengguna</p>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400">Total Pesanan</p>
              <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400">Menunggu</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400">Diproses</p>
              <p className="text-2xl font-bold text-blue-600">{stats.packing + stats.shipping}</p>
            </CardContent>
          </Card>
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-4">
              <p className="text-xs text-gray-400">Selesai</p>
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari pesanan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {["all", "pending", "packing", "shipping", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                statusFilter === status 
                  ? status === "pending" ? "bg-yellow-500 text-white" 
                    : status === "packing" ? "bg-blue-500 text-white"
                    : status === "shipping" ? "bg-purple-500 text-white"
                    : status === "completed" ? "bg-green-500 text-white"
                    : "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {status === "all" ? "Semua" : STATUS_CONFIG[status]?.label || status}
              {status !== "all" && (
                <span className="ml-1">
                  ({status === "pending" ? stats.pending : 
                    status === "packing" ? stats.packing :
                    status === "shipping" ? stats.shipping :
                    status === "completed" ? stats.completed : 0})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center border border-gray-100">
            <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">Tidak ada pesanan</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const config = STATUS_CONFIG[order.status];
              const canUpdate = order.status !== "completed" && order.status !== "cancelled";
              
              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardContent className="p-5">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-xl overflow-hidden relative shrink-0">
                        {order.reward_image ? (
                          <Image
                            src={order.reward_image}
                            alt={order.reward_name}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-300" />
                          </div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <h3 className="font-semibold text-gray-800">{order.reward_name}</h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {getStatusLabel(order.status)}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-500 mb-1">
                          Kode: <span className="font-mono">{order.order_code}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-1">
                          Pemesan: {order.user_name || "-"}
                        </p>
                        <p className="text-sm font-medium text-green-600">
                          {order.points_spent.toLocaleString()} poin
                        </p>

                        {/* Tracking Info */}
                        {order.tracking_number && order.status === "shipping" && (
                          <div className="mt-2 text-xs text-gray-500 bg-gray-50 p-2 rounded-lg inline-block">
                            <span className="font-medium">No. Resi:</span> {order.tracking_number}
                            {order.courier && <span> ({order.courier})</span>}
                          </div>
                        )}

                        {/* Action Buttons */}
                        {canUpdate && config.nextStatus && (
                          <div className="mt-3">
                            {order.status === "packing" ? (
                              <Button
                                size="sm"
                                onClick={() => setShowShippingModal(order)}
                                className="gap-2"
                              >
                                <Send className="w-4 h-4" />
                                {config.nextLabel}
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => updateOrderStatus(order.id, config.nextStatus!)}
                                disabled={processing}
                                className="gap-2"
                              >
                                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                                {config.nextLabel}
                              </Button>
                            )}
                          </div>
                        )}

                        <button
                          onClick={() => {
                            setSelectedOrder(order);
                            setShowDetailModal(true);
                          }}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-700"
                        >
                          Lihat Detail →
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDetailModal(false)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Detail Pesanan</h2>
              <button onClick={() => setShowDetailModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <XCircle className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Kode Pesanan</span>
                <span className="font-mono font-medium">{selectedOrder.order_code}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                  {getStatusIcon(selectedOrder.status)}
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Pemesan</span>
                <span className="font-medium">{selectedOrder.user_name || "-"}</span>
              </div>
              {selectedOrder.user_phone && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Telepon</span>
                  <span>{selectedOrder.user_phone}</span>
                </div>
              )}
              {selectedOrder.user_address && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Alamat</span>
                  <span className="text-sm">{selectedOrder.user_address}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Reward</span>
                <span className="font-medium">{selectedOrder.reward_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Poin</span>
                <span className="font-bold text-green-600">{selectedOrder.points_spent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Tanggal Pesan</span>
                <span>{formatDate(selectedOrder.created_at)}</span>
              </div>
              {selectedOrder.tracking_number && (
                <div className="flex justify-between">
                  <span className="text-gray-500">No. Resi</span>
                  <span className="font-mono">{selectedOrder.tracking_number}</span>
                </div>
              )}
              {selectedOrder.courier && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Kurir</span>
                  <span>{selectedOrder.courier}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowDetailModal(false)}
              className="w-full mt-6 py-2 bg-primary text-white rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Shipping Modal (Input Resi) */}
      {showShippingModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowShippingModal(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-xl font-bold mb-4">Input Nomor Resi</h2>
            <p className="text-sm text-gray-600 mb-4">
              Masukkan nomor resi untuk pesanan <strong>{showShippingModal.reward_name}</strong>
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Kurir</label>
                <select
                  value={courier}
                  onChange={(e) => setCourier(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Pilih Kurir</option>
                  <option value="JNE">JNE</option>
                  <option value="J&T">J&T Express</option>
                  <option value="SiCepat">SiCepat</option>
                  <option value="Anteraja">Anteraja</option>
                  <option value="POS Indonesia">POS Indonesia</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nomor Resi</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="Contoh: JNE123456789"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowShippingModal(null)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  if (!trackingNumber) {
                    toast.error("Masukkan nomor resi");
                    return;
                  }
                  if (!courier) {
                    toast.error("Pilih kurir");
                    return;
                  }
                  updateOrderStatus(showShippingModal.id, "shipping", { tracking_number: trackingNumber, courier });
                }}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-primary text-white rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Kirim Pesanan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}