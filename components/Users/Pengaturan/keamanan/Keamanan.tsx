"use client";

import { useState } from "react";
import {
  Lock,
  Shield,
  Smartphone,
  ChevronRight,
  CheckCircle,
  Eye,
  EyeOff,
  AlertCircle,
} from "lucide-react";

export default function Keamanan() {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showTwoFactor, setShowTwoFactor] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setIsPasswordChanged(true);
    setShowPasswordForm(false);
    setTimeout(() => setIsPasswordChanged(false), 3000);
  };

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mt-1">
          Kelola keamanan akun Anda
        </p>
      </div>

      {/* Alert Sukses */}
      {isPasswordChanged && (
        <div className="mb-4 p-3 bg-green-500/10 rounded-lg flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          Password berhasil diubah
        </div>
      )}

      {/* Ganti Password */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowPasswordForm(!showPasswordForm)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Lock className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Ganti Password</h2>
              <p className="text-xs text-muted-foreground">
                Perbarui password akun Anda
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform ${showPasswordForm ? "rotate-90" : ""}`}
          />
        </div>

        {showPasswordForm && (
          <form
            onSubmit={handleChangePassword}
            className="p-4 pt-0 border-t border-border space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Password Lama
              </label>
              <div className="relative">
                <input
                  type={showOldPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Masukkan password lama"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showOldPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Password Baru
              </label>
              <div className="relative">
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Masukkan password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showNewPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground block mb-1">
                Konfirmasi Password Baru
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full px-3 py-2 pr-10 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Konfirmasi password baru"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <Eye className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
              >
                Simpan
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Verifikasi 2 Langkah */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowTwoFactor(!showTwoFactor)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Shield className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">
                Verifikasi 2 Langkah
              </h2>
              <p className="text-xs text-muted-foreground">
                {twoFactorEnabled ? "Aktif" : "Nonaktif"} • Lapisan keamanan
                ekstra
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform ${showTwoFactor ? "rotate-90" : ""}`}
          />
        </div>

        {showTwoFactor && (
          <div className="p-4 pt-0 border-t border-border space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-foreground">
                  Aktifkan Verifikasi 2 Langkah
                </p>
                <p className="text-xs text-muted-foreground">
                  Anda akan diminta memasukkan kode dari aplikasi authenticator
                  setiap login
                </p>
              </div>
              <button
                onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                className={`w-10 h-5 rounded-full transition-colors ${
                  twoFactorEnabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white transition-transform mt-0.5 ${
                    twoFactorEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>

            {twoFactorEnabled && (
              <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-foreground">
                  Scan QR code berikut dengan aplikasi authenticator
                </p>
                <div className="mt-3 flex justify-center">
                  <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center text-xs text-muted-foreground">
                    QR Code
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Kode cadangan: 1234-5678-9012-3456
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowTwoFactor(false)}
              className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Perangkat yang Terhubung */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Smartphone className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">
                Perangkat yang Terhubung
              </h2>
              <p className="text-xs text-muted-foreground">
                Kelola perangkat yang pernah mengakses akun Anda
              </p>
            </div>
          </div>

          <div className="divide-y divide-border">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-foreground">Windows PC - Chrome</p>
                <p className="text-xs text-muted-foreground">
                  Jakarta, Indonesia • Sekarang
                </p>
              </div>
              <button className="text-xs text-red-500 hover:underline">
                Putuskan
              </button>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="text-sm text-foreground">iPhone 13 - Safari</p>
                <p className="text-xs text-muted-foreground">
                  Jakarta, Indonesia • 2 hari lalu
                </p>
              </div>
              <button className="text-xs text-red-500 hover:underline">
                Putuskan
              </button>
            </div>
          </div>

          <button className="mt-3 text-sm text-primary hover:underline">
            Putuskan semua perangkat
          </button>
        </div>
      </div>
    </div>
  );
}
