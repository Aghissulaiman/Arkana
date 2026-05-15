"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Clock,
  CheckCircle2,
  Loader2,
  Truck,
  Eye,
  Search,
  Calendar,
  Package,
  X,
  Check,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner";

type Task = {
  id: string;
  dbId: string;
  type: "pickup" | "order";
  customer: string;
  address: string;
  time: string;
  date: string;
  status: string;
  weight: string;
  waste_type: string;
  phone?: string;
};

const REJECTION_REASONS = [
  { value: "agent_busy", label: "Agent sedang sibuk / penuh", icon: "🚚" },
  { value: "out_of_area", label: "Lokasi di luar area layanan", icon: "📍" },
  { value: "vehicle_issue", label: "Kendaraan sedang bermasalah", icon: "🔧" },
  { value: "no_worker", label: "Tidak ada petugas", icon: "👥" },
  { value: "other", label: "Alasan lain", icon: "📝" },
];

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

export default function AgentTasksPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "pending" | "accepted" | "completed" | "rejected"
  >("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [popupTask, setPopupTask] = useState<Task | null>(null);
  const [popupAction, setPopupAction] = useState<"accept" | "reject" | null>(
    null,
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectionNote, setRejectionNote] = useState("");
  const [processing, setProcessing] = useState(false);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data: agentData } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!agentData) {
        toast.error("Anda tidak terdaftar sebagai agent");
        setLoading(false);
        return;
      }

      // 1. Fetch Pickup Requests
      const { data: pickupRequests } = await supabase
        .from("pickup_requests")
        .select(`*, users!pickup_requests_user_id_fkey (email)`)
        .eq("agent_id", agentData.id)
        .order("created_at", { ascending: false });

      // 2. Fetch Redeem Requests (Product Orders)
      // Note: We'll include these as "orders" if there's no specific agent_id in redeem_requests, 
      // but usually agents only manage their own products if they exist. 
      // For now, we'll fetch all pending redeems as "Product Orders" for the agent.
      const { data: redeemRequests } = await supabase
        .from("redeem_requests")
        .select(`*, users!redeem_requests_user_id_fkey (email)`)
        .order("created_at", { ascending: false });

      const userIds = [
        ...new Set([
          ...(pickupRequests || []).map(r => r.user_id),
          ...(redeemRequests || []).map(r => r.user_id)
        ])
      ];

      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone")
        .in("user_id", userIds);

      const profileMap = new Map();
      profiles?.forEach(p => profileMap.set(p.user_id, { name: p.full_name, phone: p.phone }));

      // Format Pickup Tasks
      const formattedPickups: Task[] = (pickupRequests || []).map((req) => {
        const date = new Date(req.created_at);
        const profile = profileMap.get(req.user_id);
        return {
          id: req.id.slice(0, 8),
          dbId: req.id,
          type: "pickup",
          customer: profile?.name || req.users?.email?.split("@")[0] || "Pengguna",
          phone: profile?.phone || "-",
          address: req.pickup_address,
          date: date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
          time: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          status: req.status,
          weight: `${req.estimated_weight} kg`,
          waste_type: WASTE_LABELS[req.waste_type] || req.waste_type,
        };
      });

      // Format Redeem Tasks (Product Orders)
      const formattedRedeems: Task[] = (redeemRequests || []).map((req) => {
        const date = new Date(req.created_at);
        const profile = profileMap.get(req.user_id);
        return {
          id: req.id.slice(0, 8),
          dbId: req.id,
          type: "order",
          customer: profile?.name || req.users?.email?.split("@")[0] || "Pengguna",
          phone: profile?.phone || "-",
          address: "Ambil di Lokasi Agen / Kirim",
          date: date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" }),
          time: date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
          status: req.status, // pending, completed, rejected
          weight: req.reward_name, // Gunakan field weight untuk nama produk
          waste_type: "Pesanan Produk",
        };
      });

      setTasks([...formattedPickups, ...formattedRedeems]);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  // Fungsi acceptTask yang sudah diperbarui
  const acceptTask = async (task: Task) => {
    setProcessing(true);

    // 1. Ambil user_id dari pickup request
    const { data: request } = await supabase
      .from("pickup_requests")
      .select("user_id")
      .eq("id", task.dbId)
      .single();

    // 2. Update status pickup request
    const { error } = await supabase
      .from("pickup_requests")
      .update({ status: "accepted" })
      .eq("id", task.dbId);

    if (error) {
      toast.error("Gagal menerima tugas: " + error.message);
    } else {
      // 3. Buat notifikasi untuk user
      await supabase.from("notifications").insert({
        user_id: request?.user_id,
        type: "pickup_accepted",
        title: "Penjemputan Diterima 🚚",
        message: `Pengajuan penjemputan sampah Anda telah diterima. Mitra akan segera mengambil barang ke alamat Anda.`,
        metadata: {
          pickup_request_id: task.dbId,
          agent_name: task.customer, // atau nama agent
        },
        is_read: false,
      });

      toast.success(`Tugas dari ${task.customer} diterima!`);
      setPopupTask(null);
      setPopupAction(null);
      fetchTasks();
    }
    setProcessing(false);
  };

  // Fungsi rejectTask yang sudah diperbarui
  const rejectTask = async (task: Task) => {
    if (!rejectionReason) {
      toast.error("Pilih alasan penolakan");
      return;
    }

    setProcessing(true);

    // 1. Ambil user_id dari pickup request
    const { data: request } = await supabase
      .from("pickup_requests")
      .select("user_id")
      .eq("id", task.dbId)
      .single();

    const reasonText =
      REJECTION_REASONS.find((r) => r.value === rejectionReason)?.label ||
      rejectionReason;
    const fullReason = `${reasonText}${rejectionNote ? `: ${rejectionNote}` : ""}`;

    // 2. Update status pickup request
    const { error } = await supabase
      .from("pickup_requests")
      .update({
        status: "rejected",
        rejection_reason: fullReason,
        rejected_at: new Date().toISOString(),
      })
      .eq("id", task.dbId);

    if (error) {
      toast.error("Gagal menolak tugas: " + error.message);
    } else {
      // 3. Buat notifikasi untuk user
      await supabase.from("notifications").insert({
        user_id: request?.user_id,
        type: "pickup_rejected",
        title: "Penjemputan Ditolak ❌",
        message: `Pengajuan penjemputan sampah Anda ditolak. Alasan: ${fullReason}. Silakan ajukan kembali.`,
        metadata: {
          pickup_request_id: task.dbId,
          rejection_reason: fullReason,
        },
        is_read: false,
      });

      toast.info(`Tugas dari ${task.customer} ditolak`);
      setPopupTask(null);
      setPopupAction(null);
      setRejectionReason("");
      setRejectionNote("");
      fetchTasks();
    }
    setProcessing(false);
  };

  const openPopup = (task: Task, action: "accept" | "reject") => {
    setPopupTask(task);
    setPopupAction(action);
    if (action === "reject") {
      setRejectionReason("");
      setRejectionNote("");
    }
  };

  const closePopup = () => {
    setPopupTask(null);
    setPopupAction(null);
    setRejectionReason("");
    setRejectionNote("");
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    if (task.status !== activeTab) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        task.customer.toLowerCase().includes(query) ||
        task.id.toLowerCase().includes(query) ||
        task.address.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const stats = {
    pending: tasks.filter((t) => t.status === "pending").length,
    accepted: tasks.filter((t) => t.status === "accepted").length,
    completed: tasks.filter((t) => t.status === "completed").length,
    rejected: tasks.filter((t) => t.status === "rejected").length,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Permintaan & Pesanan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola penjemputan sampah dan pesanan produk
            </p>
          </div>
          <Button
            variant="outline"
            onClick={fetchTasks}
            size="sm"
            className="gap-2"
          >
            <Loader2 className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <p className="text-xs text-gray-400">Menunggu</p>
            <p className="text-xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <p className="text-xs text-gray-400">Diproses</p>
            <p className="text-xl font-bold text-blue-600">{stats.accepted}</p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <p className="text-xs text-gray-400">Selesai</p>
            <p className="text-xl font-bold text-green-600">
              {stats.completed}
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <p className="text-xs text-gray-400">Ditolak</p>
            <p className="text-xl font-bold text-red-500">{stats.rejected}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-gray-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 text-sm font-medium transition-all shrink-0 ${
              activeTab === "pending"
                ? "text-yellow-600 border-b-2 border-yellow-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Menunggu
            {stats.pending > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-yellow-500 text-white rounded-full">
                {stats.pending}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`px-4 py-2 text-sm font-medium transition-all shrink-0 ${
              activeTab === "accepted"
                ? "text-blue-600 border-b-2 border-blue-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Diproses
            {stats.accepted > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-blue-500 text-white rounded-full">
                {stats.accepted}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("completed")}
            className={`px-4 py-2 text-sm font-medium transition-all shrink-0 ${
              activeTab === "completed"
                ? "text-green-600 border-b-2 border-green-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Selesai
            {stats.completed > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-green-500 text-white rounded-full">
                {stats.completed}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-4 py-2 text-sm font-medium transition-all shrink-0 ${
              activeTab === "rejected"
                ? "text-red-600 border-b-2 border-red-500"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Ditolak
            {stats.rejected > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">
                {stats.rejected}
              </span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, ID, atau alamat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* Tasks List */}
        {filteredTasks.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-700 mb-1">
              {activeTab === "pending" && "Tidak ada tugas menunggu"}
              {activeTab === "accepted" && "Tidak ada tugas diproses"}
              {activeTab === "completed" && "Tidak ada riwayat selesai"}
              {activeTab === "rejected" && "Tidak ada tugas ditolak"}
            </h3>
            <p className="text-sm text-gray-400">
              {activeTab === "pending" &&
                "Belum ada permintaan penjemputan baru"}
              {activeTab === "accepted" && "Semua tugas sudah diproses"}
              {activeTab === "completed" &&
                "Riwayat akan muncul setelah tugas selesai"}
              {activeTab === "rejected" &&
                "Semua permintaan berhasil diterima"}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <Card
                key={task.id}
                className="overflow-hidden hover:shadow-md transition-all"
              >
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                        task.status === "pending"
                          ? "bg-yellow-100"
                          : task.status === "accepted"
                            ? "bg-blue-100"
                            : task.status === "rejected"
                              ? "bg-red-100"
                              : "bg-green-100"
                      }`}
                    >
                      {task.status === "pending" && (
                        <Clock className="w-6 h-6 text-yellow-600" />
                      )}
                      {task.status === "accepted" && (
                        <Truck className="w-6 h-6 text-blue-600" />
                      )}
                      {task.status === "completed" && (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      )}
                      {task.status === "rejected" && (
                        <XCircle className="w-6 h-6 text-red-500" />
                      )}
                    </div>

                    <div className="flex-1 space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-gray-800">
                          {task.customer}
                        </span>
                        <span className="text-xs text-gray-400 font-mono">
                          #{task.id}
                        </span>
                      </div>

                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-gray-400" />
                        <span className="line-clamp-1">{task.address}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {task.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {task.time}
                        </span>
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-gray-50"
                        >
                          {task.weight}
                        </Badge>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    {task.status === "accepted" && (
                      <Link href={`/agent/tasks/${task.dbId}`}>
                        <Button size="sm" variant="outline" className="gap-2">
                          <Eye className="w-4 h-4" />
                          Detail
                        </Button>
                      </Link>
                    )}

                    {task.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-white"
                          onClick={() => openPopup(task, "accept")}
                        >
                          <Check className="w-4 h-4" />
                          Terima
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="gap-2 border-red-300 text-red-600 hover:bg-red-50"
                          onClick={() => openPopup(task, "reject")}
                        >
                          <XCircle className="w-4 h-4" />
                          Tolak
                        </Button>
                      </div>
                    )}

                    {task.status === "completed" && (
                      <Badge className="bg-green-100 text-green-700">
                        Selesai
                      </Badge>
                    )}
                    {task.status === "rejected" && (
                      <Badge className="bg-red-100 text-red-700">
                        Ditolak
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Popup Terima Tugas */}
      {popupTask && popupAction === "accept" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Terima Tugas?</h3>
              <button
                onClick={closePopup}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="bg-yellow-50 p-3 rounded-lg">
                <p className="text-sm text-yellow-800">
                  Anda akan menerima tugas dari:
                </p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">{popupTask.customer}</p>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5" />
                  <span>{popupTask.address}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>Berat: {popupTask.weight}</span>
                  <span>•</span>
                  <span>Jenis: {popupTask.waste_type}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closePopup}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => acceptTask(popupTask)}
                disabled={processing}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {processing ? "Memproses..." : "Ya, Terima"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Tolak Tugas */}
      {popupTask && popupAction === "reject" && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Tolak Tugas</h3>
              <button
                onClick={closePopup}
                className="p-1 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="bg-red-50 p-3 rounded-lg">
                <p className="text-sm text-red-800">
                  Anda akan menolak tugas dari:
                </p>
                <p className="font-semibold mt-1">{popupTask.customer}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Alasan Penolakan
                </label>
                <div className="space-y-2">
                  {REJECTION_REASONS.map((reason) => (
                    <label
                      key={reason.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${
                        rejectionReason === reason.value
                          ? "border-green-500 bg-green-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="rejectionReason"
                        value={reason.value}
                        checked={rejectionReason === reason.value}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-lg">{reason.icon}</span>
                      <span className="text-sm">{reason.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Catatan Tambahan (Opsional)
                </label>
                <textarea
                  rows={2}
                  value={rejectionNote}
                  onChange={(e) => setRejectionNote(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Berikan penjelasan tambahan..."
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={closePopup}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={() => rejectTask(popupTask)}
                disabled={processing || !rejectionReason}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {processing ? "Memproses..." : "Ya, Tolak"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
