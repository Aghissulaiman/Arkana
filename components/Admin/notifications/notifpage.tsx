"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import {
  Bell,
  CheckCircle,
  Truck,
  XCircle,
  Star,
  Trash2,
  CheckCheck,
  RefreshCw,
  Loader2,
  X,
  UserPlus,
  ShieldCheck,
  Users,
  FileText,
  DollarSign,
  AlertCircle,
  Eye,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import Link from "next/link";

type Notification = {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message: string;
  metadata: any;
  is_read: boolean;
  created_at: string;
};

type AgentApplication = {
  id: string;
  user_id: string;
  agent_name: string;
  phone: string;
  address: string;
  service_area: string;
  waste_categories: string[];
  status: string;
  created_at: string;
};

type PickupRequest = {
  id: string;
  request_code: string;
  user_id: string;
  waste_type: string;
  estimated_weight: number;
  pickup_address: string;
  status: string;
  created_at: string;
};

type UserData = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

const getNotificationStyle = (type: string) => {
  const styles: Record<string, any> = {
    new_agent_registration: {
      icon: UserPlus,
      bg: "bg-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      border: "border-green-200",
      dot: "bg-green-500",
    },
    agent_approved: {
      icon: ShieldCheck,
      bg: "bg-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      border: "border-green-200",
      dot: "bg-green-500",
    },
    agent_rejected: {
      icon: XCircle,
      bg: "bg-red-500",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    new_user_registration: {
      icon: Users,
      bg: "bg-blue-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    new_pickup_request: {
      icon: Truck,
      bg: "bg-orange-500",
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600",
      border: "border-orange-200",
      dot: "bg-orange-500",
    },
    pickup_completed: {
      icon: CheckCircle,
      bg: "bg-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      border: "border-green-200",
      dot: "bg-green-500",
    },
    new_transaction: {
      icon: DollarSign,
      bg: "bg-emerald-500",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
      border: "border-emerald-200",
      dot: "bg-emerald-500",
    },
    weekly_report_ready: {
      icon: FileText,
      bg: "bg-indigo-500",
      iconBg: "bg-indigo-100",
      iconColor: "text-indigo-600",
      border: "border-indigo-200",
      dot: "bg-indigo-500",
    },
    system_alert: {
      icon: AlertCircle,
      bg: "bg-red-500",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    points_earned: {
      icon: Star,
      bg: "bg-amber-500",
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      border: "border-amber-200",
      dot: "bg-amber-500",
    },
  };
  return (
    styles[type] || {
      icon: Bell,
      bg: "bg-gray-500",
      iconBg: "bg-gray-100",
      iconColor: "text-gray-600",
      border: "border-gray-200",
      dot: "bg-gray-500",
    }
  );
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

export default function AdminNotificationsPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "unread" | "agent" | "pickup" | "user"
  >("all");
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);
  const [adminUser, setAdminUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  // State untuk menyimpan data mentah
  const [pendingAgents, setPendingAgents] = useState<AgentApplication[]>([]);
  const [pendingPickups, setPendingPickups] = useState<PickupRequest[]>([]);
  const [newUsers, setNewUsers] = useState<UserData[]>([]);

  // Cek role admin dari tabel USERS
  useEffect(() => {
    const checkAdmin = async () => {
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

        setAdminUser(user);

        // Cek role dari tabel USERS
        const { data: userData, error: userDataError } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!userDataError && userData?.role === "admin") {
          setIsAdmin(true);
        } else {
          console.warn("User is not admin. Role:", userData?.role);
          toast.error("Akses ditolak. Halaman ini khusus admin.");
          router.push("/dashboard");
        }
      } catch (error) {
        console.error("Error checking admin:", error);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [supabase, router]);

  // Fungsi untuk mengambil data dari berbagai tabel
  const fetchAllNotifications = useCallback(async () => {
    if (!adminUser) return;

    try {
      console.log("Fetching notifications...");

      // 1. Ambil agent applications dengan status pending
      const { data: agentApps, error: agentError } = await supabase
        .from("agent_applications")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (agentError) {
        console.error("Error fetching agent_applications:", agentError);
      } else {
        console.log(`Found ${agentApps?.length || 0} pending agents`);
        setPendingAgents(agentApps || []);
      }

      // 2. Ambil pickup requests dengan status pending
      const { data: pickups, error: pickupError } = await supabase
        .from("pickup_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (pickupError) {
        console.error("Error fetching pickup_requests:", pickupError);
      } else {
        console.log(`Found ${pickups?.length || 0} pending pickups`);
        setPendingPickups(pickups || []);
      }

      // 3. Ambil user registrations (24 jam terakhir)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);

      const { data: users, error: userError } = await supabase
        .from("users")
        .select("*")
        .gte("created_at", oneDayAgo.toISOString())
        .order("created_at", { ascending: false });

      if (userError) {
        console.error("Error fetching users:", userError);
      } else {
        console.log(`Found ${users?.length || 0} new users`);
        // Filter out admin sendiri
        const filteredUsers = (users || []).filter(
          (u) => u.id !== adminUser.id,
        );
        setNewUsers(filteredUsers);
      }

      // 4. Konversi ke format notifikasi
      const formattedNotifs: Notification[] = [];

      // Notifikasi dari agent applications
      (agentApps || []).forEach((app: AgentApplication) => {
        formattedNotifs.push({
          id: `agent-${app.id}`,
          user_id: adminUser.id,
          type: "new_agent_registration",
          title: "Pendaftaran Agent Baru",
          message: `${app.agent_name} mendaftar sebagai agent. Segera review pendaftaran.`,
          metadata: {
            application_id: app.id,
            agent_name: app.agent_name,
            phone: app.phone,
            service_area: app.service_area,
            waste_categories: app.waste_categories,
          },
          is_read: false,
          created_at: app.created_at,
        });
      });

      // Notifikasi dari pickup requests
      (pickups || []).forEach((pickup: PickupRequest) => {
        formattedNotifs.push({
          id: `pickup-${pickup.id}`,
          user_id: adminUser.id,
          type: "new_pickup_request",
          title: "Permintaan Pickup Baru",
          message: `Permintaan pickup ${pickup.waste_type} dengan estimasi berat ${pickup.estimated_weight} kg.`,
          metadata: {
            pickup_id: pickup.id,
            request_code: pickup.request_code,
            waste_type: pickup.waste_type,
            estimated_weight: pickup.estimated_weight,
            pickup_address: pickup.pickup_address,
          },
          is_read: false,
          created_at: pickup.created_at,
        });
      });

      // Notifikasi dari user registrations
      (users || []).forEach((user: UserData) => {
        if (user.id !== adminUser.id) {
          formattedNotifs.push({
            id: `user-${user.id}`,
            user_id: adminUser.id,
            type: "new_user_registration",
            title: "Pengguna Baru Terdaftar",
            message: `${user.email} baru saja bergabung sebagai ${user.role}.`,
            metadata: {
              user_id: user.id,
              email: user.email,
              role: user.role,
            },
            is_read: false,
            created_at: user.created_at,
          });
        }
      });

      // Sort by created_at descending
      formattedNotifs.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );

      setNotifications(formattedNotifs);
      console.log(`Total notifications: ${formattedNotifs.length}`);
    } catch (error) {
      console.error("Error in fetchAllNotifications:", error);
      toast.error("Gagal memuat notifikasi");
    }
  }, [supabase, adminUser]);

  useEffect(() => {
    if (adminUser && isAdmin) {
      fetchAllNotifications();
    }
  }, [adminUser, isAdmin, fetchAllNotifications]);

  // Subscribe ke perubahan realtime
  useEffect(() => {
    if (!adminUser || !isAdmin) return;

    // Subscribe ke agent_applications
    const agentChannel = supabase
      .channel("agent-applications-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "agent_applications",
        },
        async (payload) => {
          console.log("New agent application:", payload);
          const newApp = payload.new as AgentApplication;

          if (newApp.status === "pending") {
            const newNotification: Notification = {
              id: `agent-${newApp.id}`,
              user_id: adminUser.id,
              type: "new_agent_registration",
              title: "Pendaftaran Agent Baru",
              message: `${newApp.agent_name} mendaftar sebagai agent. Segera review pendaftaran.`,
              metadata: {
                application_id: newApp.id,
                agent_name: newApp.agent_name,
                phone: newApp.phone,
                service_area: newApp.service_area,
              },
              is_read: false,
              created_at: newApp.created_at,
            };

            setNotifications((prev) => [newNotification, ...prev]);
            toast.info(`Pendaftaran agent baru: ${newApp.agent_name}`);
          }
        },
      )
      .subscribe();

    // Subscribe ke pickup_requests
    const pickupChannel = supabase
      .channel("pickup-requests-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "pickup_requests",
        },
        async (payload) => {
          console.log("New pickup request:", payload);
          const newPickup = payload.new as PickupRequest;

          if (newPickup.status === "pending") {
            const newNotification: Notification = {
              id: `pickup-${newPickup.id}`,
              user_id: adminUser.id,
              type: "new_pickup_request",
              title: "Permintaan Pickup Baru",
              message: `Permintaan pickup ${newPickup.waste_type} dengan estimasi berat ${newPickup.estimated_weight} kg.`,
              metadata: {
                pickup_id: newPickup.id,
                request_code: newPickup.request_code,
                waste_type: newPickup.waste_type,
                estimated_weight: newPickup.estimated_weight,
                pickup_address: newPickup.pickup_address,
              },
              is_read: false,
              created_at: newPickup.created_at,
            };

            setNotifications((prev) => [newNotification, ...prev]);
            toast.info(`Pickup request baru: ${newPickup.request_code}`);
          }
        },
      )
      .subscribe();

    // Subscribe ke users
    const userChannel = supabase
      .channel("users-channel")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "users",
        },
        async (payload) => {
          console.log("New user registration:", payload);
          const newUser = payload.new as UserData;

          if (newUser.id !== adminUser.id) {
            const newNotification: Notification = {
              id: `user-${newUser.id}`,
              user_id: adminUser.id,
              type: "new_user_registration",
              title: "Pengguna Baru Terdaftar",
              message: `${newUser.email} baru saja bergabung sebagai ${newUser.role}.`,
              metadata: {
                user_id: newUser.id,
                email: newUser.email,
                role: newUser.role,
              },
              is_read: false,
              created_at: newUser.created_at,
            };

            setNotifications((prev) => [newNotification, ...prev]);
            toast.success(`Pengguna baru: ${newUser.email}`);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(agentChannel);
      supabase.removeChannel(pickupChannel);
      supabase.removeChannel(userChannel);
    };
  }, [supabase, adminUser, isAdmin]);

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

  // Loading state
  if (loading || isAdmin === null) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const filteredNotifications = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "unread") return !n.is_read;
    if (filter === "agent") return n.type.includes("agent");
    if (filter === "pickup") return n.type.includes("pickup");
    if (filter === "user") return n.type.includes("user");
    return true;
  });

  const agentCount = notifications.filter((n) =>
    n.type.includes("agent"),
  ).length;
  const pickupCount = notifications.filter((n) =>
    n.type.includes("pickup"),
  ).length;
  const userCount = notifications.filter((n) => n.type.includes("user")).length;

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />

      <div className="max-w-4xl mx-auto md:p-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">
                Notifikasi Admin
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                  {unreadCount} baru
                </span>
              )}
              <button
                onClick={fetchAllNotifications}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Refresh"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Notifikasi sistem, pendaftaran agent, dan aktivitas pengguna
          </p>
          <div className="mt-2 text-xs text-gray-400">
            Status: {pendingAgents.length} pending agent,{" "}
            {pendingPickups.length} pending pickup, {newUsers.length} user baru
          </div>
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
            onClick={() => setFilter("agent")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === "agent"
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Pendaftaran Agent
            {agentCount > 0 && (
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  filter === "agent"
                    ? "bg-white/30 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {agentCount}
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
            onClick={() => setFilter("user")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
              filter === "user"
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Pengguna Baru
            {userCount > 0 && (
              <span
                className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${
                  filter === "user"
                    ? "bg-white/30 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {userCount}
              </span>
            )}
          </button>
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
                : filter === "agent"
                  ? "Tidak ada notifikasi pendaftaran agent"
                  : filter === "pickup"
                    ? "Tidak ada notifikasi pickup"
                    : filter === "user"
                      ? "Tidak ada notifikasi pengguna baru"
                      : "Belum ada notifikasi"}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Notifikasi akan muncul di sini saat ada aktivitas
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
                            notif.type.includes("agent")
                              ? "bg-purple-100 text-purple-600"
                              : notif.type.includes("pickup")
                                ? "bg-orange-100 text-orange-600"
                                : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {notif.type.includes("agent")
                            ? "Agent"
                            : notif.type.includes("pickup")
                              ? "Pickup"
                              : "Sistem"}
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

              {selectedNotif.metadata &&
                Object.keys(selectedNotif.metadata).length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-gray-500">
                      Informasi Tambahan
                    </p>
                    <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                      {Object.entries(selectedNotif.metadata).map(
                        ([key, value]) => {
                          if (!value) return null;
                          return (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-500 capitalize">
                                {key.replace(/_/g, " ")}
                              </span>
                              <span className="font-medium text-gray-700">
                                {typeof value === "object"
                                  ? JSON.stringify(value)
                                  : String(value)}
                              </span>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}

              {selectedNotif.type === "new_agent_registration" &&
                selectedNotif.metadata?.application_id && (
                  <Link
                    href={`/admin/agent-applications/${selectedNotif.metadata.application_id}`}
                    onClick={() => setSelectedNotif(null)}
                    className="mt-4 w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    Review Pendaftaran Agent
                  </Link>
                )}

              {selectedNotif.type === "new_pickup_request" &&
                selectedNotif.metadata?.pickup_id && (
                  <Link
                    href={`/admin/pickup-requests/${selectedNotif.metadata.pickup_id}`}
                    onClick={() => setSelectedNotif(null)}
                    className="mt-4 w-full py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    Lihat Detail Pickup
                  </Link>
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
