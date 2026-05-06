"use client";

import { useState } from "react";
import {
  Shield,
  Eye,
  Database,
  FileText,
  ChevronRight,
  CheckCircle,
  AlertTriangle,
  Download,
  Trash2,
} from "lucide-react";

export default function Privasi() {
  const [showDataPrivacy, setShowDataPrivacy] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [showDataRequest, setShowDataRequest] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [privacySettings, setPrivacySettings] = useState({
    profile_visible: true,
    show_poin: true,
    show_history: false,
    data_analytics: true,
  });

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const toggleSetting = (key: keyof typeof privacySettings) => {
    setPrivacySettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-3xl ">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl mt-5 font-bold text-foreground">
          Privasi & Data
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola privasi akun dan data Anda
        </p>
      </div>

      {/* Alert Sukses */}
      {isSaved && (
        <div className="mb-4 p-3 bg-green-500/10 rounded-lg flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          Pengaturan privasi disimpan
        </div>
      )}

      {/* Privasi Data */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowDataPrivacy(!showDataPrivacy)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Eye className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Privasi Data</h2>
              <p className="text-xs text-muted-foreground">
                Kelola siapa yang dapat melihat informasi Anda
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform ${showDataPrivacy ? "rotate-90" : ""}`}
          />
        </div>

        {showDataPrivacy && (
          <div className="p-4 pt-0 border-t border-border space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Profil Terlihat</p>
                <p className="text-xs text-muted-foreground">
                  Izinkan pengguna lain melihat profil Anda
                </p>
              </div>
              <button
                onClick={() => toggleSetting("profile_visible")}
                className={`w-10 h-5 rounded-full transition-colors ${privacySettings.profile_visible ? "bg-primary" : "bg-muted"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${privacySettings.profile_visible ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Tampilkan Poin</p>
                <p className="text-xs text-muted-foreground">
                  Perlihatkan jumlah poin di profil
                </p>
              </div>
              <button
                onClick={() => toggleSetting("show_poin")}
                className={`w-10 h-5 rounded-full transition-colors ${privacySettings.show_poin ? "bg-primary" : "bg-muted"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${privacySettings.show_poin ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Riwayat Transaksi</p>
                <p className="text-xs text-muted-foreground">
                  Izinkan melihat riwayat transaksi Anda
                </p>
              </div>
              <button
                onClick={() => toggleSetting("show_history")}
                className={`w-10 h-5 rounded-full transition-colors ${privacySettings.show_history ? "bg-primary" : "bg-muted"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${privacySettings.show_history ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm text-foreground">Data Analitik</p>
                <p className="text-xs text-muted-foreground">
                  Izinkan pengumpulan data untuk pengembangan
                </p>
              </div>
              <button
                onClick={() => toggleSetting("data_analytics")}
                className={`w-10 h-5 rounded-full transition-colors ${privacySettings.data_analytics ? "bg-primary" : "bg-muted"}`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${privacySettings.data_analytics ? "translate-x-5" : "translate-x-0.5"}`}
                />
              </button>
            </div>

            <button
              onClick={() => setShowDataPrivacy(false)}
              className="mt-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Aktivitas Akun */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowActivity(!showActivity)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Aktivitas Akun</h2>
              <p className="text-xs text-muted-foreground">
                Lihat aktivitas login dan perangkat
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform ${showActivity ? "rotate-90" : ""}`}
          />
        </div>

        {showActivity && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="text-sm text-foreground">Login terakhir</p>
                  <p className="text-xs text-muted-foreground">
                    15 Mei 2026, 09:23 WIB
                  </p>
                </div>
                <span className="text-xs text-green-600">Perangkat ini</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-border">
                <div>
                  <p className="text-sm text-foreground">Login sebelumnya</p>
                  <p className="text-xs text-muted-foreground">
                    14 Mei 2026, 18:45 WIB - Windows PC
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-foreground">Login 2 minggu lalu</p>
                  <p className="text-xs text-muted-foreground">
                    2 Mei 2026, 07:30 WIB - iPhone
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowActivity(false)}
              className="mt-4 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Permintaan Data */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowDataRequest(!showDataRequest)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Permintaan Data</h2>
              <p className="text-xs text-muted-foreground">
                Unduh atau hapus data Anda
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform ${showDataRequest ? "rotate-90" : ""}`}
          />
        </div>

        {showDataRequest && (
          <div className="p-4 pt-0 border-t border-border space-y-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <p className="text-sm text-foreground mb-1">Unduh Data Anda</p>
              <p className="text-xs text-muted-foreground mb-3">
                Dapatkan salinan semua data yang kami simpan tentang Anda
              </p>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition">
                <Download className="w-3.5 h-3.5" />
                Unduh Data
              </button>
            </div>

            <div className="p-3 bg-red-500/5 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-red-500" />
                <p className="text-sm font-medium text-red-600">Hapus Akun</p>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Menghapus akun akan menghilangkan semua data Anda secara
                permanen
              </p>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-sm hover:bg-red-500/20 transition">
                <Trash2 className="w-3.5 h-3.5" />
                Hapus Akun
              </button>
            </div>

            <button
              onClick={() => setShowDataRequest(false)}
              className="mt-2 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Kebijakan Privasi */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Kebijakan Privasi</h2>
              <p className="text-xs text-muted-foreground">
                Pelajari bagaimana kami melindungi data Anda
              </p>
            </div>
          </div>
          <button className="text-sm text-primary hover:underline">
            Baca Kebijakan Privasi →
          </button>
        </div>
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
