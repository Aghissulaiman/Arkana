"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  Package,
  CheckCircle,
  Truck,
  XCircle,
  DollarSign,
  Star,
  Calendar,
  ChevronRight,
  Trash2,
  CheckCheck,
  RefreshCw,
} from "lucide-react";

// ============================================
// TYPE DEFINITIONS (Sesuai dengan backend nanti)
// ============================================

type NotificationType =
  | "pickup" // Penjemputan
  | "points" // Poin
  | "payment" // Pembayaran
  | "completed" // Selesai
  | "rejected" // Ditolak
  | "promo"; // Promo

type NotificationStatus = "unread" | "read";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  createdAt: string; // ISO date string
  readAt: string | null;
  actionUrl?: string;
  metadata?: {
    requestId?: string;
    points?: number;
    amount?: number;
    weight?: number;
  };
}

// ============================================
// DUMMY DATA (Untuk development)
// ============================================

const dummyNotifications: Notification[] = [
  {
    id: "notif_001",
    type: "pickup",
    title: "Penjemputan Dijadwalkan",
    message: "Penjemputan sampah Anda akan dilakukan besok, 09:00 - 12:00",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 menit lalu
    readAt: null,
    actionUrl: "/user/requests",
    metadata: { requestId: "req_001" },
  },
  {
    id: "notif_002",
    type: "points",
    title: "Poin Berhasil Ditambahkan",
    message:
      "Anda mendapatkan +1.250 poin dari penjemputan sampah plastik (2,5 kg)",
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 jam lalu
    readAt: null,
    actionUrl: "/user/transactions",
    metadata: { points: 1250, weight: 2.5 },
  },
  {
    id: "notif_003",
    type: "payment",
    title: "Pembayaran Diterima",
    message:
      "Pembayaran Rp 45.000 telah diterima untuk penjemputan tanggal 7 Mei 2026",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5 jam lalu
    readAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    actionUrl: "/user/transactions",
    metadata: { amount: 45000 },
  },
  {
    id: "notif_004",
    type: "completed",
    title: "Penjemputan Selesai",
    message:
      "Penjemputan sampah Anda telah selesai. Terima kasih sudah berkontribusi!",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // Kemarin
    readAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    actionUrl: "/user/requests",
  },
  {
    id: "notif_005",
    type: "rejected",
    title: "Penjemputan Dibatalkan",
    message:
      "Penjemputan sampah Anda dibatalkan karena berat tidak sesuai. Silakan ajukan ulang.",
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 hari lalu
    readAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: "/user/requests",
  },
  {
    id: "notif_006",
    type: "promo",
    title: "Promo Spesial untuk Anda!",
    message:
      "Dapatkan bonus poin 2x lipat untuk setiap penjemputan minggu ini!",
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 hari lalu
    readAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: "/promo",
  },
  {
    id: "notif_007",
    type: "pickup",
    title: "Mitra dalam Perjalanan",
    message: "Mitra Anda sedang dalam perjalanan untuk penjemputan sampah.",
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), // 1 minggu lalu
    readAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    actionUrl: "/user/requests",
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

const formatTimeDisplay = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const diffDays = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
  );
  const diffHours = Math.floor(
    (now.getTime() - date.getTime()) / (1000 * 60 * 60),
  );
  const diffMins = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  // Same day (Today)
  if (date >= today) {
    if (diffMins < 1) return "Baru saja";
    if (diffMins < 60) return `${diffMins} menit lalu`;
    return `${diffHours} jam lalu`;
  }

  // Yesterday
  if (date >= yesterday && date < today) {
    return "Kemarin";
  }

  // Within 7 days (This week)
  if (diffDays < 7) {
    return `${diffDays} hari lalu`;
  }

  // Within 14 days (Last week)
  if (diffDays < 14) {
    return "1 minggu lalu";
  }

  // More than 14 days
  const weeks = Math.floor(diffDays / 7);
  if (weeks < 4) {
    return `${weeks} minggu lalu`;
  }

  // More than a month
  const months = Math.floor(diffDays / 30);
  if (months < 12) {
    return `${months} bulan lalu`;
  }

  // More than a year
  const years = Math.floor(diffDays / 365);
  return `${years} tahun lalu`;
};

const getNotificationIcon = (type: NotificationType) => {
  const icons = {
    pickup: { icon: Truck, bg: "bg-blue-50", text: "text-blue-600" },
    points: { icon: Star, bg: "bg-yellow-50", text: "text-yellow-600" },
    payment: { icon: DollarSign, bg: "bg-green-50", text: "text-green-600" },
    completed: {
      icon: CheckCircle,
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    rejected: { icon: XCircle, bg: "bg-red-50", text: "text-red-600" },
    promo: { icon: Calendar, bg: "bg-purple-50", text: "text-purple-600" },
  };
  return (
    icons[type] || { icon: Bell, bg: "bg-slate-50", text: "text-slate-600" }
  );
};

// ============================================
// NOTIFICATION CARD COMPONENT (Reusable)
// ============================================

interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  const { icon: Icon, bg, text } = getNotificationIcon(notification.type);
  const isUnread = notification.readAt === null;
  const timeDisplay = formatTimeDisplay(notification.createdAt);

  return (
    <div
      className={`group rounded-2xl bg-white border border-slate-100 transition-all duration-200 hover:shadow-md ${
        isUnread ? "bg-emerald-50/30" : ""
      }`}
    >
      <div className="p-5 flex gap-4">
        {/* Icon Section */}
        <div className="flex-shrink-0">
          <div
            className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}
          >
            <Icon className={`w-5 h-5 ${text}`} />
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <h3
              className={`text-sm font-bold ${
                isUnread ? "text-slate-900" : "text-slate-600"
              }`}
            >
              {notification.title}
              {isUnread && (
                <span className="ml-2 inline-block w-2 h-2 bg-emerald-500 rounded-full" />
              )}
            </h3>
            <span className="text-[10px] text-slate-400 whitespace-nowrap">
              {timeDisplay}
            </span>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            {notification.message}
          </p>

          {/* Action Link */}
          {notification.actionUrl && (
            <button
              onClick={() => (window.location.href = notification.actionUrl!)}
              className="inline-flex items-center gap-1 mt-3 text-emerald-600 text-xs font-medium hover:underline"
            >
              Lihat Detail
              <ChevronRight className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex flex-col gap-1">
          {isUnread && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transition"
              title="Tandai sudah dibaca"
            >
              <CheckCheck className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            onClick={() => onDelete(notification.id)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition"
            title="Hapus notifikasi"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<Notification[]>(dummyNotifications);
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [isLoading, setIsLoading] = useState(false);

  const unreadCount = notifications.filter((n) => n.readAt === null).length;

  // Group notifications by date
  const groupNotificationsByDate = (notifs: Notification[]) => {
    const groups: { [key: string]: Notification[] } = {};

    notifs.forEach((notif) => {
      const date = new Date(notif.createdAt);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      let groupKey = "";

      if (date >= new Date(today.setHours(0, 0, 0, 0))) {
        groupKey = "Hari Ini";
      } else if (date >= new Date(yesterday.setHours(0, 0, 0, 0))) {
        groupKey = "Kemarin";
      } else {
        const diffDays = Math.floor(
          (today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24),
        );
        if (diffDays < 7) {
          groupKey = "Minggu Ini";
        } else if (diffDays < 14) {
          groupKey = "Minggu Lalu";
        } else {
          groupKey = "Lebih Lama";
        }
      }

      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(notif);
    });

    return groups;
  };

  // Mark single notification as read
  const markAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.id === id && n.readAt === null
          ? { ...n, readAt: new Date().toISOString() }
          : n,
      ),
    );
  };

  // Mark all notifications as read
  const markAllAsRead = async () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, readAt: new Date().toISOString() })),
    );
  };

  // Delete notification
  const deleteNotification = async (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Refresh notifications
  const refreshNotifications = async () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  // Filter notifications
  const filteredNotifications = notifications.filter((n) => {
    if (filter === "unread") return n.readAt === null;
    if (filter === "read") return n.readAt !== null;
    return true;
  });

  const groupedNotifications = groupNotificationsByDate(filteredNotifications);
  const groupOrder = [
    "Hari Ini",
    "Kemarin",
    "Minggu Ini",
    "Minggu Lalu",
    "Lebih Lama",
  ];

  return (
    <div className="max-w-4xl mx-auto my-8 space-y-6">
      {/* Header Card */}
      <div className="relative rounded-3xl bg-white border border-slate-100 p-6 md:p-8 overflow-hidden">
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-100">
                <Bell className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-slate-900">
                  Notifikasi
                </h1>
                <p className="text-slate-400 text-xs mt-0.5">
                  Informasi aktivitas dan transaksi kamu
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <Badge className="bg-emerald-100 text-emerald-700 border-none px-3 py-1 text-xs font-bold">
                  {unreadCount} belum dibaca
                </Badge>
              )}
              <Button
                onClick={refreshNotifications}
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0 rounded-lg border-slate-200"
                disabled={isLoading}
              >
                <RefreshCw
                  className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Filter & Action Bar */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        {/* Filter Tabs */}
        <div className="flex gap-1 p-1 bg-slate-50 rounded-xl w-full sm:w-auto">
          {[
            { key: "all", label: "Semua" },
            { key: "unread", label: "Belum Dibaca" },
            { key: "read", label: "Sudah Dibaca" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filter === tab.key
                  ? "bg-white text-emerald-600 shadow-sm"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab.label}
              {tab.key === "unread" &&
                unreadCount > 0 &&
                filter !== "unread" && (
                  <span className="ml-1.5 w-2 h-2 bg-emerald-500 rounded-full inline-block" />
                )}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        {unreadCount > 0 && (
          <Button
            onClick={markAllAsRead}
            variant="outline"
            className="h-9 px-3 rounded-lg text-xs font-bold border-slate-200 text-slate-500 hover:bg-slate-50"
          >
            <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
            Baca Semua
          </Button>
        )}
      </div>

      {/* Notifications List with Date Grouping */}
      <div className="space-y-6">
        {isLoading ? (
          // Loading skeleton
          <>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl bg-white border border-slate-100 p-5 animate-pulse"
              >
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-xl bg-slate-100" />
                  <div className="flex-1">
                    <div className="h-4 bg-slate-100 rounded w-1/3 mb-2" />
                    <div className="h-3 bg-slate-100 rounded w-2/3" />
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : filteredNotifications.length === 0 ? (
          // Empty state
          <div className="rounded-3xl bg-white border border-slate-100 p-12 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <div>
                <p className="text-slate-400 font-medium">
                  Tidak ada notifikasi
                </p>
                <p className="text-slate-300 text-xs mt-1">
                  {filter === "unread"
                    ? "Semua notifikasi sudah dibaca"
                    : "Notifikasi akan muncul di sini"}
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Grouped notifications
          groupOrder.map((group) => {
            const groupNotifications = groupedNotifications[group];
            if (!groupNotifications || groupNotifications.length === 0)
              return null;

            return (
              <div key={group} className="space-y-3">
                <h2 className="text-sm font-semibold text-slate-500 px-2">
                  {group}
                </h2>
                {groupNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={markAsRead}
                    onDelete={deleteNotification}
                  />
                ))}
              </div>
            );
          })
        )}
      </div>

      {/* Footer */}
      {filteredNotifications.length > 0 && (
        <div className="text-center py-4">
          <p className="text-[10px] text-slate-400">
            Notifikasi disimpan selama 30 hari
          </p>
        </div>
      )}
    </div>
  );
}
