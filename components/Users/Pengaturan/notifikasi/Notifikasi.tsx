"use client";

import { useState } from "react";
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Megaphone,
  ChevronRight,
  CheckCircle
} from "lucide-react";

export default function Notifikasi() {
  const [showEmailNotif, setShowEmailNotif] = useState(false);
  const [showPushNotif, setShowPushNotif] = useState(false);
  const [showPromoNotif, setShowPromoNotif] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    email_pickup: true,
    email_poin: true,
    email_promo: false,
    push_pickup: true,
    push_poin: false,
    promo_weekly: true,
    promo_special: false
  });

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleNotif = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Notifikasi</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Atur notifikasi yang ingin Anda terima
        </p>
      </div>

      {/* Alert Sukses */}
      {isSaved && (
        <div className="mb-4 p-3 bg-green-500/10 rounded-lg flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          Pengaturan notifikasi disimpan
        </div>
      )}

      {/* Email Notifikasi */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowEmailNotif(!showEmailNotif)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Notifikasi Email</h2>
              <p className="text-xs text-muted-foreground">
                Terima pemberitahuan melalui email
              </p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showEmailNotif ? "rotate-90" : ""}`} />
        </div>

        {showEmailNotif && (
          <div className="p-4 pt-0 border-t border-border space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Penjemputan Sampah</p>
                <p className="text-xs text-muted-foreground">Notifikasi saat jadwal penjemputan dikonfirmasi</p>
              </div>
              <button
                onClick={() => toggleNotif("email_pickup")}
                className={`w-10 h-5 rounded-full transition-colors ${notifications.email_pickup ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${notifications.email_pickup ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Poin Masuk</p>
                <p className="text-xs text-muted-foreground">Notifikasi saat poin berhasil ditambahkan</p>
              </div>
              <button
                onClick={() => toggleNotif("email_poin")}
                className={`w-10 h-5 rounded-full transition-colors ${notifications.email_poin ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${notifications.email_poin ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Promo & Penawaran</p>
                <p className="text-xs text-muted-foreground">Info promo dan penawaran menarik</p>
              </div>
              <button
                onClick={() => toggleNotif("email_promo")}
                className={`w-10 h-5 rounded-full transition-colors ${notifications.email_promo ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${notifications.email_promo ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <button
              onClick={() => setShowEmailNotif(false)}
              className="mt-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Push Notifikasi */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowPushNotif(!showPushNotif)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Bell className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Notifikasi Push</h2>
              <p className="text-xs text-muted-foreground">
                Terima pemberitahuan di browser
              </p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showPushNotif ? "rotate-90" : ""}`} />
        </div>

        {showPushNotif && (
          <div className="p-4 pt-0 border-t border-border space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Penjemputan Sampah</p>
                <p className="text-xs text-muted-foreground">Notifikasi realtime saat petugas menjemput</p>
              </div>
              <button
                onClick={() => toggleNotif("push_pickup")}
                className={`w-10 h-5 rounded-full transition-colors ${notifications.push_pickup ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${notifications.push_pickup ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Poin Masuk</p>
                <p className="text-xs text-muted-foreground">Notifikasi saat poin bertambah</p>
              </div>
              <button
                onClick={() => toggleNotif("push_poin")}
                className={`w-10 h-5 rounded-full transition-colors ${notifications.push_poin ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${notifications.push_poin ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <button
              onClick={() => setShowPushNotif(false)}
              className="mt-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Promo & Penawaran */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowPromoNotif(!showPromoNotif)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Megaphone className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Promo & Penawaran</h2>
              <p className="text-xs text-muted-foreground">
                Info promo, event, dan penawaran menarik
              </p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showPromoNotif ? "rotate-90" : ""}`} />
        </div>

        {showPromoNotif && (
          <div className="p-4 pt-0 border-t border-border space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Promo Mingguan</p>
                <p className="text-xs text-muted-foreground">Info promo dari mitra Arkana</p>
              </div>
              <button
                onClick={() => toggleNotif("promo_weekly")}
                className={`w-10 h-5 rounded-full transition-colors ${notifications.promo_weekly ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${notifications.promo_weekly ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Event Spesial</p>
                <p className="text-xs text-muted-foreground">Info event dan program khusus</p>
              </div>
              <button
                onClick={() => toggleNotif("promo_special")}
                className={`w-10 h-5 rounded-full transition-colors ${notifications.promo_special ? "bg-primary" : "bg-muted"}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${notifications.promo_special ? "translate-x-5" : "translate-x-0.5"}`} />
              </button>
            </div>
            <button
              onClick={() => setShowPromoNotif(false)}
              className="mt-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Tombol Simpan */}
      <div className="mt-6 pt-4 border-t border-border">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}