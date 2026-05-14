"use client";

import React, { useState, useCallback, useMemo } from "react";
import {
  Bell,
  ShieldCheck,
  Monitor,
  Globe,
  Clock,
  Save,
  RotateCcw,
  Zap,
  Lock,
} from "lucide-react";

// --- Types ---
type NotificationFrequency = "instant" | "daily" | "weekly";
type ThemePreference = "light" | "dark" | "system";
type Language = "en" | "id";

interface GeneralSettings {
  // System Configuration
  maintenanceMode: boolean;
  allowUserRegistration: boolean;

  // Notifications
  emailAlerts: boolean;
  pushAlerts: boolean;
  frequency: NotificationFrequency;

  // Appearance & Localization
  theme: ThemePreference;
  language: Language;

  // Security & Session
  twoFactorRequired: boolean;
  sessionTimeout: number; // minutes
}

const INITIAL_STATE: GeneralSettings = {
  maintenanceMode: false,
  allowUserRegistration: true,
  emailAlerts: true,
  pushAlerts: true,
  frequency: "instant",
  theme: "light",
  language: "id",
  twoFactorRequired: false,
  sessionTimeout: 60,
};

// --- UI Components ---
const SectionCard = ({ title, icon: Icon, description, children }: any) => (
  <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-emerald-50 bg-gradient-to-r from-emerald-50/30 to-white flex items-center gap-3">
      <div className="p-2 bg-emerald-100 rounded-lg text-emerald-600">
        <Icon size={18} />
      </div>
      <div>
        <h2 className="text-md font-semibold text-gray-800">{title}</h2>
        {description && <p className="text-xs text-gray-500">{description}</p>}
      </div>
    </div>
    <div className="p-6 space-y-4">{children}</div>
  </div>
);

const SettingItem = ({ label, description, children }: any) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
    <div className="flex-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      {description && (
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      )}
    </div>
    <div className="flex items-center">{children}</div>
  </div>
);

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<GeneralSettings>(INITIAL_STATE);
  const [isDirty, setIsDirty] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving">("idle");

  const update = <K extends keyof GeneralSettings>(
    key: K,
    value: GeneralSettings[K],
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    setStatus("saving");
    await new Promise((r) => setTimeout(r, 1000)); // Simulate API
    setIsDirty(false);
    setStatus("idle");
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-4 pt-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              Pengaturan Sistem
            </h1>
            <p className="text-emerald-600 text-sm font-medium">
              Konfigurasi global platform Arkana
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setSettings(INITIAL_STATE);
                setIsDirty(false);
              }}
              disabled={!isDirty || status === "saving"}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-40 transition-all"
            >
              <RotateCcw size={16} /> Reset
            </button>
            <button
              onClick={handleSave}
              disabled={!isDirty || status === "saving"}
              className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 shadow-sm disabled:opacity-60 transition-all"
            >
              {status === "saving" ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save size={16} /> Simpan Perubahan
                </>
              )}
            </button>
          </div>
        </div>

        <div className="grid gap-6">
          {/* General Config */}
          <SectionCard
            title="Konfigurasi Utama"
            icon={Zap}
            description="Atur status operasional aplikasi secara umum"
          >
            <SettingItem
              label="Mode Pemeliharaan"
              description="Nonaktifkan akses publik untuk sementara waktu"
            >
              <Toggle
                enabled={settings.maintenanceMode}
                onChange={(v) => update("maintenanceMode", v)}
              />
            </SettingItem>
            <SettingItem
              label="Registrasi Pengguna Baru"
              description="Izinkan orang baru untuk mendaftar ke platform"
            >
              <Toggle
                enabled={settings.allowUserRegistration}
                onChange={(v) => update("allowUserRegistration", v)}
              />
            </SettingItem>
          </SectionCard>

          {/* Notifications */}
          <SectionCard
            title="Pusat Notifikasi"
            icon={Bell}
            description="Kelola saluran pengiriman informasi kepada admin"
          >
            <SettingItem
              label="Email Alert"
              description="Kirim laporan harian ke email"
            >
              <Toggle
                enabled={settings.emailAlerts}
                onChange={(v) => update("emailAlerts", v)}
              />
            </SettingItem>
            <SettingItem
              label="Push Notification"
              description="Notifikasi real-time di browser"
            >
              <Toggle
                enabled={settings.pushAlerts}
                onChange={(v) => update("pushAlerts", v)}
              />
            </SettingItem>
            <SettingItem label="Frekuensi Laporan">
              <select
                value={settings.frequency}
                onChange={(e) =>
                  update("frequency", e.target.value as NotificationFrequency)
                }
                className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg p-2 outline-none focus:ring-2 focus:ring-emerald-500/20"
              >
                <option value="instant">Setiap Kejadian</option>
                <option value="daily">Ringkasan Harian</option>
                <option value="weekly">Ringkasan Mingguan</option>
              </select>
            </SettingItem>
          </SectionCard>

          {/* Appearance */}
          <SectionCard title="Tampilan & Bahasa" icon={Monitor}>
            <SettingItem
              label="Tema Interface"
              description="Pilih gaya visual yang nyaman"
            >
              <div className="flex bg-gray-100 p-1 rounded-xl">
                {(["light", "dark", "system"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => update("theme", t)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-all ${
                      settings.theme === t
                        ? "bg-white text-emerald-600 shadow-sm"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </SettingItem>
            <SettingItem label="Bahasa Sistem">
              <div className="flex items-center gap-2 text-gray-600">
                <Globe size={16} />
                <select
                  value={settings.language}
                  onChange={(e) =>
                    update("language", e.target.value as Language)
                  }
                  className="bg-transparent text-sm font-medium outline-none"
                >
                  <option value="id">Bahasa Indonesia</option>
                  <option value="en">English (US)</option>
                </select>
              </div>
            </SettingItem>
          </SectionCard>

          {/* Security */}
          <SectionCard
            title="Keamanan Global"
            icon={ShieldCheck}
            description="Proteksi tambahan untuk seluruh akun admin"
          >
            <SettingItem
              label="Wajib 2FA"
              description="Paksa semua admin menggunakan autentikasi dua faktor"
            >
              <Toggle
                enabled={settings.twoFactorRequired}
                onChange={(v) => update("twoFactorRequired", v)}
              />
            </SettingItem>
            <SettingItem
              label="Durasi Sesi Inaktif"
              description="Otomatis logout setelah tidak ada aktivitas"
            >
              <div className="flex items-center gap-2">
                <Clock size={14} className="text-gray-400" />
                <select
                  value={settings.sessionTimeout}
                  onChange={(e) =>
                    update("sessionTimeout", parseInt(e.target.value))
                  }
                  className="bg-gray-50 border border-gray-200 text-sm rounded-lg p-2 outline-none"
                >
                  <option value={30}>30 Menit</option>
                  <option value={60}>1 Jam</option>
                  <option value={120}>2 Jam</option>
                </select>
              </div>
            </SettingItem>
            <div className="pt-4 border-t border-emerald-50 mt-2">
              <button className="text-sm font-medium text-emerald-600 hover:text-emerald-700 flex items-center gap-2">
                <Lock size={14} /> Kelola Izin Peran (Role Permissions)
              </button>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}

// --- Small Helper Components ---
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        enabled ? "bg-emerald-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}
