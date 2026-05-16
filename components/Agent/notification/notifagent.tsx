"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import {
  Bell,
  Truck,
  Gift,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  Package,
  Trash2,
  CheckCheck,
  RefreshCw,
  Loader2,
  X,
  Eye,
  User,
  Phone,
  Calendar,
  DollarSign,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import Link from "next/link";

type Notification = {
  id: string;
  type: "pickup" | "reward";
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  metadata: any;
};

type PickupRequest = {
  id: string;
  request_code: string;
  user_id: string;
  agent_id: string | null;
  waste_type: string;
  estimated_weight: number;
  actual_weight: number | null;
  pickup_address: string;
  notes: string | null;
  status: string;
  created_at: string;
  user?: {
    email: string;
    profile?: {
      full_name: string;
      phone: string;
    };
  };
};

type RewardRedemption = {
  id: string;
  redemption_code: string;
  user_id: string;
  reward_id: string;
  agent_id: string | null;
  points_spent: number;
  status: string;
  notes: string | null;
  created_at: string;
  reward?: {
    name: string;
    description: string;
    points_required: number;
    image_url: string;
  };
  user?: {
    email: string;
    profile?: {
      full_name: string;
      phone: string;
    };
  };
};

const getNotificationStyle = (type: string) => {
  if (type === "pickup") {
    return {
      icon: Truck,
      bg: "bg-orange-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      border: "border-orange-200",
      dot: "bg-orange-500",
    };
  } else {
    return {
      icon: Gift,
      bg: "bg-purple-500",
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      border: "border-purple-200",
      dot: "bg-purple-500",
    };
  }
};

const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) return "Baru saja";
  if (diffMinutes < 60) return `${diffMinutes}m lalu`;
  if (diffHours < 24) return `${diffHours}j lalu`;
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays}h lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}mgg lalu`;
  return `${Math.floor(diffDays / 30)}bln lalu`;
};

const getStatusBadge = (status: string) => {
  const statusConfig: Record<string, any> = {
    pending: {
      color: "bg-yellow-100 text-yellow-700",
      icon: Clock,
      text: "Menunggu",
    },
    accepted: {
      color: "bg-blue-100 text-blue-700",
      icon: CheckCircle,
      text: "Diterima",
    },
    picked_up: {
      color: "bg-indigo-100 text-indigo-700",
      icon: Truck,
      text: "Dijemput",
    },
    completed: {
      color: "bg-green-100 text-green-700",
      icon: CheckCircle,
      text: "Selesai",
    },
    cancelled: {
      color: "bg-red-100 text-red-700",
      icon: XCircle,
      text: "Dibatalkan",
    },
    processing: {
      color: "bg-blue-100 text-blue-700",
      icon: Clock,
      text: "Diproses",
    },
    ready: {
      color: "bg-green-100 text-green-700",
      icon: Gift,
      text: "Siap Diambil",
    },
    taken: {
      color: "bg-gray-100 text-gray-700",
      icon: CheckCircle,
      text: "Sudah Diambil",
    },
  };
  return statusConfig[status] || statusConfig.pending;
};

export default function AgentNotificationsPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread" | "pickup" | "reward">(
    "all",
  );
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [agentUser, setAgentUser] = useState<any>(null);
  const [isAgent, setIsAgent] = useState<boolean | null>(null);
  const [agentData, setAgentData] = useState<any>(null);

  // Data untuk ditampilkan
  const [myPickups, setMyPickups] = useState<PickupRequest[]>([]);
  const [myRewards, setMyRewards] = useState<RewardRedemption[]>([]);

  // Cek role agent dari tabel USERS dan AGENTS
  useEffect(() => {
    const checkAgent = async () => {
      try {
        setLoading(true);

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          console.error("User not found:", userError);
          router.push("/login");
          return;
        }

        setAgentUser(user);

        // Cek role dari tabel USERS
        const { data: userData, error: userDataError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!userDataError && userData?.role === "agent") {
          setIsAgent(true);

          // Ambil data agent berdasarkan user_id
          const { data: agentInfo, error: agentError } = await supabase
            .from("agents")
            .select("*")
            .eq("user_id", user.id)
            .single();

          if (agentError) {
            console.error("Error fetching agent data:", agentError);
            toast.error("Data agent tidak ditemukan");
          } else {
            setAgentData(agentInfo);
            console.log("Agent data loaded:", agentInfo);
          }
        } else {
          console.warn("User is not agent. Role:", userData?.role);
          toast.error("Akses ditolak. Halaman ini khusus agent.");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking agent:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAgent();
  }, [supabase, router]);

  // Fetch data untuk agent berdasarkan ID agent
  const fetchNotificationsForAgent = useCallback(async () => {
    if (!agentUser || !agentData) {
      console.log("Waiting for agent data...");
      return;
    }

    try {
      console.log("Fetching notifications for agent ID:", agentData.id);

      // 1. Ambil pickup requests yang assigned ke agent ini (agent_id = agentData.id)
      const { data: pickups, error: pickupError } = await supabase
        .from("pickup_requests")
        .select(
          `
          *,
          user:users (
            email,
            profile:profiles (
              full_name,
              phone
            )
          )
        `,
        )
        .eq("agent_id", agentData.id)
        .in("status", ["pending", "accepted", "picked_up", "completed"])
        .order("created_at", { ascending: false });

      if (pickupError) {
        console.error("Error fetching pickups:", pickupError);
      } else {
        console.log(
          `Found ${pickups?.length || 0} pickup requests for agent ${agentData.id}`,
        );
        setMyPickups(pickups || []);
      }

      // 2. Ambil reward redemptions yang assigned ke agent ini
      const { data: rewards, error: rewardError } = await supabase
        .from("reward_redemptions")
        .select(
          `
          *,
          reward:rewards (
            name,
            description,
            points_required,
            image_url
          ),
          user:users (
            email,
            profile:profiles (
              full_name,
              phone
            )
          )
        `,
        )
        .eq("agent_id", agentData.id)
        .in("status", ["pending", "processing", "ready"])
        .order("created_at", { ascending: false });

      if (rewardError) {
        console.error("Error fetching rewards:", rewardError);
      } else {
        console.log(
          `Found ${rewards?.length || 0} reward redemptions for agent ${agentData.id}`,
        );
        setMyRewards(rewards || []);
      }

      // 3. Konversi ke format notifikasi
      const formattedNotifs: Notification[] = [];

      // Notifikasi pickup requests
      (pickups || []).forEach((pickup: any) => {
        const userName =
          pickup.user?.profile?.full_name || pickup.user?.email || "Pengguna";

        let message = "";
        let title = "";

        if (pickup.status === "pending") {
          title = "Permintaan Pickup Baru";
          message = `Permintaan pickup baru dari ${userName} untuk ${pickup.waste_type} (${pickup.estimated_weight} kg)`;
        } else if (pickup.status === "accepted") {
          title = "Pickup Diterima";
          message = `Pickup #${pickup.request_code} sudah Anda terima. Segera lakukan penjemputan.`;
        } else if (pickup.status === "picked_up") {
          title = "Pickup Selesai Dijemput";
          message = `Anda telah menjemput sampah ${pickup.waste_type} (${pickup.actual_weight} kg). Konfirmasi penyelesaian.`;
        } else if (pickup.status === "completed") {
          title = "Pickup Selesai";
          message = `Pickup #${pickup.request_code} telah selesai. Poin sudah diberikan ke user.`;
        }

        formattedNotifs.push({
          id: `pickup-${pickup.id}`,
          type: "pickup",
          title: title,
          message: message,
          metadata: {
            pickup_id: pickup.id,
            request_code: pickup.request_code,
            waste_type: pickup.waste_type,
            estimated_weight: pickup.estimated_weight,
            actual_weight: pickup.actual_weight,
            pickup_address: pickup.pickup_address,
            user_name: userName,
            user_phone: pickup.user?.profile?.phone,
            user_email: pickup.user?.email,
            status: pickup.status,
            notes: pickup.notes,
          },
          is_read: false,
          created_at: pickup.created_at,
        });
      });

      // Notifikasi reward redemptions
      (rewards || []).forEach((reward: any) => {
        const userName =
          reward.user?.profile?.full_name || reward.user?.email || "Pengguna";
        const rewardName = reward.reward?.name || "Reward";

        let message = "";
        let title = "";

        if (reward.status === "pending") {
          title = "Pesanan Reward Baru";
          message = `${userName} memesan ${rewardName} (${reward.points_spent} poin). Segera proses pesanan.`;
        } else if (reward.status === "processing") {
          title = "Pesanan Reward Diproses";
          message = `Pesanan ${rewardName} sedang diproses. Siapkan untuk pengambilan.`;
        } else if (reward.status === "ready") {
          title = "Pesanan Reward Siap Diambil";
          message = `Pesanan ${rewardName} sudah siap. Silakan siapkan untuk diambil oleh ${userName}.`;
        }

        formattedNotifs.push({
          id: `reward-${reward.id}`,
          type: "reward",
          title: title,
          message: message,
          metadata: {
            redemption_id: reward.id,
            redemption_code: reward.redemption_code,
            reward_id: reward.reward_id,
            reward_name: rewardName,
            points_spent: reward.points_spent,
            user_name: userName,
            user_phone: reward.user?.profile?.phone,
            user_email: reward.user?.email,
            status: reward.status,
            notes: reward.notes,
            created_at: reward.created_at,
          },
          is_read: false,
          created_at: reward.created_at,
        });
      });

      // Sort by created_at descending
      formattedNotifs.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setNotifications(formattedNotifs);
      console.log(`Total notifications: ${formattedNotifs.length}`);
    } catch (error) {
      console.error("Error in fetchNotificationsForAgent:", error);
      toast.error("Gagal memuat notifikasi");
    }
  }, [supabase, agentUser, agentData]);

  useEffect(() => {
    if (agentUser && isAgent && agentData) {
      fetchNotificationsForAgent();
    }
  }, [agentUser, isAgent, agentData, fetchNotificationsForAgent]);

  // Subscribe ke perubahan realtime yang berkaitan dengan agent ini
  useEffect(() => {
    if (!agentUser || !isAgent || !agentData) return;

    // Subscribe ke pickup_requests yang agent_id-nya sama
    const pickupChannel = supabase
      .channel(`agent-pickups-${agentData.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pickup_requests",
          filter: `agent_id=eq.${agentData.id}`,
        },
        async (payload) => {
          console.log("Pickup request change for agent:", payload);

          // Refresh data untuk agent ini
          fetchNotificationsForAgent();

          // Tampilkan toast notifikasi
          if (payload.eventType === "INSERT") {
            toast.info("Ada permintaan pickup baru untuk Anda!", {
              duration: 5000,
              action: {
                label: "Lihat",
                onClick: () => setFilter("pickup"),
              },
            });
          } else if (payload.eventType === "UPDATE") {
            const newStatus = (payload.new as any).status;
            if (newStatus === "accepted") {
              toast.success("Pickup berhasil diterima");
            } else if (newStatus === "picked_up") {
              toast.info("Pickup sudah dijemput, konfirmasi penyelesaian");
            } else if (newStatus === "completed") {
              toast.success("Pickup selesai! Poin sudah diberikan ke user");
            }
          }
        },
      )
      .subscribe();

    // Subscribe ke reward_redemptions yang agent_id-nya sama
    const rewardChannel = supabase
      .channel(`agent-rewards-${agentData.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "reward_redemptions",
          filter: `agent_id=eq.${agentData.id}`,
        },
        async (payload) => {
          console.log("Reward redemption change for agent:", payload);

          // Refresh data
          fetchNotificationsForAgent();

          // Tampilkan toast
          if (payload.eventType === "INSERT") {
            toast.info("Ada pesanan reward baru untuk Anda!", {
              duration: 5000,
              action: {
                label: "Lihat",
                onClick: () => setFilter("reward"),
              },
            });
          } else if (payload.eventType === "UPDATE") {
            const newStatus = (payload.new as any).status;
            if (newStatus === "processing") {
              toast.info("Pesanan reward sedang diproses");
            } else if (newStatus === "ready") {
              toast.success("Pesanan reward sudah siap diambil!");
            }
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(pickupChannel);
      supabase.removeChannel(rewardChannel);
    };
  }, [supabase, agentUser, isAgent, agentData, fetchNotificationsForAgent]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
    toast.success("Notifikasi ditandai sudah dibaca");
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success("Semua notifikasi ditandai sudah dibaca");
  };

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notifikasi dihapus");
  };

  const handleNotificationClick = (notif: Notification) => {
    setSelectedNotif(notif);
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
  };

  // Update status pickup
  const updatePickupStatus = async (pickupId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("pickup_requests")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", pickupId)
        .eq("agent_id", agentData.id); // Pastikan hanya update miliknya

      if (error) throw error;

      toast.success(`Status pickup berhasil diupdate menjadi ${status}`);
      fetchNotificationsForAgent();
    } catch (error) {
      console.error("Error updating pickup:", error);
      toast.error("Gagal mengupdate status pickup");
    }
  };

  // Update status reward
  const updateRewardStatus = async (redemptionId: string, status: string) => {
    try {
      const { error } = await supabase
        .from("reward_redemptions")
        .update({
          status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", redemptionId)
        .eq("agent_id", agentData.id); // Pastikan hanya update miliknya

      if (error) throw error;

      toast.success(`Status reward berhasil diupdate menjadi ${status}`);
      fetchNotificationsForAgent();
    } catch (error) {
      console.error("Error updating reward:", error);
      toast.error("Gagal mengupdate status reward");
    }
  };

  // Loading state
  if (loading || isAgent === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!isAgent) {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const pickupCount = notifications.filter((n) => n.type === "pickup").length;
  const rewardCount = notifications.filter((n) => n.type === "reward").length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.is_read;
    if (filter === "pickup") return n.type === "pickup";
    if (filter === "reward") return n.type === "reward";
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <div className="max-w-4xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Notifikasi Agent
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                  {unreadCount} baru
                </span>
              )}
              <button
                onClick={fetchNotificationsForAgent}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Notifikasi permintaan pickup dan pesanan reward untuk Anda
          </p>
          {agentData && (
            <div className="mt-2 text-xs text-gray-400 bg-gray-100 p-2 rounded-lg">
              <div className="flex gap-4">
                <span>ID Agent: {agentData.id}</span>
                <span>Nama Agent: {agentData.agent_name}</span>
                <span>Area: {agentData.service_area || "Semua area"}</span>
              </div>
            </div>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === "all"
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === "unread"
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Belum Dibaca
            {unreadCount > 0 && (
              <span className="ml-2 bg-white/30 text-white px-1.5 py-0.5 rounded-full text-xs">
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("pickup")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === "pickup"
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Truck className="w-4 h-4 inline mr-1" />
            Pickup
            {pickupCount > 0 && (
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  filter === "pickup"
                    ? "bg-white/30 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {pickupCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter("reward")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === "reward"
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <Gift className="w-4 h-4 inline mr-1" />
            Reward
            {rewardCount > 0 && (
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  filter === "reward"
                    ? "bg-white/30 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {rewardCount}
              </span>
            )}
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Pickup Saya</p>
                <p className="text-3xl font-bold">{myPickups.length}</p>
              </div>
              <Truck className="w-10 h-10 opacity-50" />
            </div>
            <p className="text-orange-100 text-xs mt-2">
              {myPickups.filter((p) => p.status === "pending").length} pending,
              {myPickups.filter((p) => p.status === "accepted").length}{" "}
              diterima,
              {myPickups.filter((p) => p.status === "picked_up").length}{" "}
              dijemput
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Pesanan Reward</p>
                <p className="text-3xl font-bold">{myRewards.length}</p>
              </div>
              <Gift className="w-10 h-10 opacity-50" />
            </div>
            <p className="text-purple-100 text-xs mt-2">
              {myRewards.filter((r) => r.status === "pending").length} baru,
              {myRewards.filter((r) => r.status === "ready").length} siap
              diambil
            </p>
          </div>
        </div>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bell className="w-10 h-10 text-gray-300" />
            </div>
            <p className="text-gray-500 font-medium">
              {filter === "unread"
                ? "Tidak ada notifikasi belum dibaca"
                : filter === "pickup"
                  ? "Tidak ada notifikasi pickup"
                  : filter === "reward"
                    ? "Tidak ada notifikasi reward"
                    : "Belum ada notifikasi"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Notifikasi akan muncul di sini saat ada permintaan pickup atau
              pesanan reward untuk Anda
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredNotifications.map((notif) => {
              const style = getNotificationStyle(notif.type);
              const Icon = style.icon;
              const isUnread = !notif.is_read;
              const time = formatRelativeTime(notif.created_at);

              return (
                <div
                  key={notif.id}
                  className={`group bg-white rounded-xl transition-all duration-200 hover:shadow-md ${
                    isUnread
                      ? "border-l-4 border-l-green-500"
                      : "border border-gray-100"
                  }`}
                >
                  <div className="p-4 flex items-start gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${style.iconColor}`} />
                    </div>

                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3
                          className={`text-sm font-semibold ${isUnread ? "text-gray-900" : "text-gray-600"}`}
                        >
                          {notif.title}
                        </h3>
                        {isUnread && (
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        )}
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full ${
                            notif.type === "pickup"
                              ? "bg-orange-100 text-orange-600"
                              : "bg-purple-100 text-purple-600"
                          }`}
                        >
                          {notif.type === "pickup" ? "Pickup" : "Reward"}
                        </span>
                        <span className="text-xs text-gray-400 ml-auto">
                          {time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>

                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isUnread && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(notif.id);
                          }}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          title="Tandai sudah dibaca"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        title="Hapus"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Action Buttons untuk Pickup yang pending */}
        {filter === "pickup" &&
          myPickups.filter((p) => p.status === "pending").length > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">
                Aksi Cepat
              </h4>
              <div className="space-y-2">
                {myPickups
                  .filter((p) => p.status === "pending")
                  .map((pickup) => (
                    <div
                      key={pickup.id}
                      className="flex items-center justify-between"
                    >
                      <div className="text-sm">
                        <span className="font-medium">
                          {pickup.request_code}
                        </span>
                        <span className="text-gray-600 ml-2">
                          {pickup.waste_type}
                        </span>
                      </div>
                      <button
                        onClick={() =>
                          updatePickupStatus(pickup.id, "accepted")
                        }
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
                      >
                        Terima Pickup
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}

        {/* Mark All Read Button */}
        {unreadCount > 0 && (
          <div className="mt-6 text-center">
            <button
              onClick={markAllAsRead}
              className="text-xs text-gray-500 hover:text-green-600 transition-colors flex items-center gap-1 mx-auto"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Tandai semua sudah dibaca
            </button>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {selectedNotif && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedNotif(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full max-h-[85vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-800">
                Detail Notifikasi
              </h2>
              <button
                onClick={() => setSelectedNotif(null)}
                className="p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[60vh]">
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-12 h-12 rounded-xl ${getNotificationStyle(selectedNotif.type).iconBg} flex items-center justify-center`}
                >
                  {(() => {
                    const Icon = getNotificationStyle(selectedNotif.type).icon;
                    const color = getNotificationStyle(
                      selectedNotif.type,
                    ).iconColor;
                    return <Icon className={`w-6 h-6 ${color}`} />;
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">
                    {selectedNotif.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(selectedNotif.created_at).toLocaleString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-700 leading-relaxed">
                  {selectedNotif.message}
                </p>
              </div>

              {selectedNotif.metadata && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-500">
                    Informasi Lengkap
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                    {selectedNotif.type === "pickup" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Kode Request</span>
                          <span className="font-medium text-gray-700">
                            {selectedNotif.metadata.request_code}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Jenis Sampah</span>
                          <span className="font-medium text-gray-700">
                            {selectedNotif.metadata.waste_type}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Berat Estimasi</span>
                          <span className="font-medium text-gray-700">
                            {selectedNotif.metadata.estimated_weight} kg
                          </span>
                        </div>
                        {selectedNotif.metadata.actual_weight && (
                          <div className="flex justify-between">
                            <span className="text-gray-500">Berat Aktual</span>
                            <span className="font-medium text-gray-700">
                              {selectedNotif.metadata.actual_weight} kg
                            </span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-500">Alamat Pickup</span>
                          <span className="font-medium text-gray-700 text-right max-w-[60%]">
                            {selectedNotif.metadata.pickup_address}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nama Pengguna</span>
                          <span className="font-medium text-gray-700">
                            {selectedNotif.metadata.user_name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              getStatusBadge(selectedNotif.metadata.status)
                                .color
                            }`}
                          >
                            {getStatusBadge(selectedNotif.metadata.status).text}
                          </span>
                        </div>
                        {selectedNotif.metadata.status === "pending" && (
                          <button
                            onClick={() =>
                              updatePickupStatus(
                                selectedNotif.metadata.pickup_id,
                                "accepted",
                              )
                            }
                            className="w-full mt-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Terima Pickup
                          </button>
                        )}
                        {selectedNotif.metadata.status === "accepted" && (
                          <button
                            onClick={() =>
                              updatePickupStatus(
                                selectedNotif.metadata.pickup_id,
                                "picked_up",
                              )
                            }
                            className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Konfirmasi Penjemputan
                          </button>
                        )}
                      </>
                    )}

                    {selectedNotif.type === "reward" && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Kode Redemption</span>
                          <span className="font-medium text-gray-700">
                            {selectedNotif.metadata.redemption_code}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nama Reward</span>
                          <span className="font-medium text-gray-700">
                            {selectedNotif.metadata.reward_name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Poin Digunakan</span>
                          <span className="font-medium text-gray-700">
                            {selectedNotif.metadata.points_spent}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Nama Pengguna</span>
                          <span className="font-medium text-gray-700">
                            {selectedNotif.metadata.user_name}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs ${
                              getStatusBadge(selectedNotif.metadata.status)
                                .color
                            }`}
                          >
                            {getStatusBadge(selectedNotif.metadata.status).text}
                          </span>
                        </div>
                        {selectedNotif.metadata.status === "pending" && (
                          <button
                            onClick={() =>
                              updateRewardStatus(
                                selectedNotif.metadata.redemption_id,
                                "processing",
                              )
                            }
                            className="w-full mt-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Proses Pesanan
                          </button>
                        )}
                        {selectedNotif.metadata.status === "processing" && (
                          <button
                            onClick={() =>
                              updateRewardStatus(
                                selectedNotif.metadata.redemption_id,
                                "ready",
                              )
                            }
                            className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                          >
                            Tandai Siap Diambil
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setSelectedNotif(null)}
                className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
