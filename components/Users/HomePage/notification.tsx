"use client";

import { useState, useEffect, useCallback } from "react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import {
  Bell,
  CheckCircle,
  Truck,
  XCircle,
  Star,
  Calendar,
  Trash2,
  CheckCheck,
  RefreshCw,
  Loader2,
  X,
  Clock,
  MapPin,
  User,
  Package,
  TrendingUp,
  AlertCircle,
  ChevronRight,
} from "lucide-react";
import { Toaster, toast } from "sonner";

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

const getNotificationStyle = (type: string) => {
  const styles: Record<string, any> = {
    pickup_accepted: {
      icon: Truck,
      bg: "bg-blue-500",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      border: "border-blue-200",
      dot: "bg-blue-500",
    },
    pickup_rejected: {
      icon: XCircle,
      bg: "bg-red-500",
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      border: "border-red-200",
      dot: "bg-red-500",
    },
    pickup_completed: {
      icon: CheckCircle,
      bg: "bg-green-500",
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      border: "border-green-200",
      dot: "bg-green-500",
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

export default function NotificationsPage() {
  const supabase = createClientSupabaseClient();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const [selectedNotif, setSelectedNotif] = useState<Notification | null>(null);

  // MEMOIZATION: Membungkus fetch dengan useCallback agar dependency array di useEffect aman dari infinite loop
  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setNotifications(data || []);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchNotifications();

    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          const newNotif = payload.new as Notification;
          setNotifications((prev) => [newNotif, ...prev]);
          toast.custom((t) => (
            <div className="bg-white rounded-xl shadow-lg p-3 max-w-sm border-l-4 border-green-500">
              <p className="text-sm font-semibold">{newNotif.title}</p>
              <p className="text-xs text-gray-500">{newNotif.message}</p>
            </div>
          ));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, fetchNotifications]); // FIX: Dependency array yang lengkap mencegah memory leak & stale data

  const markAsRead = async (id: string) => {
    await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)),
    );
  };

  const markAllAsRead = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    toast.success("Semua notifikasi ditandai sudah dibaca");
  };

  const deleteNotification = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    toast.success("Notifikasi dihapus");
  };

  // UX FIX: Fungsi jembatan agar ketika card di-klik, modal terbuka SEKALIGUS menembak fungsi markAsRead database
  const handleNotificationClick = (notif: Notification) => {
    setSelectedNotif(notif);
    if (!notif.is_read) {
      markAsRead(notif.id);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const filteredNotifications = notifications.filter(
    (n) => filter === "all" || !n.is_read,
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-200">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800">Notifikasi</h1>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full">
                  {unreadCount} baru
                </span>
              )}
              <button
                onClick={fetchNotifications}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            Pemberitahuan terbaru untuk Anda
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setFilter("all")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === "all"
                ? "bg-green-600 text-white shadow-md shadow-green-200"
                : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-5 py-2 rounded-xl text-sm font-medium transition-all ${
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
                    {/* Icon */}
                    <div
                      className={`w-10 h-10 rounded-xl ${style.iconBg} flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-5 h-5 ${style.iconColor}`} />
                    </div>

                    {/* Content */}
                    {/* FIX: onClick diganti ke handleNotificationClick agar status 'is_read' terupdate otomatis saat buka modal */}
                    <div
                      className="flex-1 min-w-0 cursor-pointer"
                      onClick={() => handleNotificationClick(notif)}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3
                          className={`text-sm font-semibold ${isUnread ? "text-gray-900" : "text-gray-600"}`}
                        >
                          {notif.title}
                        </h3>
                        {isUnread && (
                          <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                        )}
                        <span className="text-xs text-gray-400 ml-auto">
                          {time}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 line-clamp-2">
                        {notif.message}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isUnread && (
                        <button
                          onClick={() => markAsRead(notif.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 transition-colors"
                          title="Tandai sudah dibaca"
                        >
                          <CheckCheck className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notif.id)}
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

        {/* Mark All Read */}
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
            {/* Header */}
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

            {/* Content */}
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
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-gray-500">
                    Informasi Tambahan
                  </p>
                  <div className="bg-gray-50 rounded-xl p-3 space-y-2 text-sm">
                    {Object.entries(selectedNotif.metadata).map(
                      ([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-gray-500 capitalize">
                            {key.replace(/_/g, " ")}
                          </span>
                          <span className="font-medium text-gray-700">
                            {String(value)}
                          </span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
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
