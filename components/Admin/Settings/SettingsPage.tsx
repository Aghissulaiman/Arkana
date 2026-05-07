"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  User,
  Lock,
  Save,
  Mail,
  Phone,
  Building2,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola akun, keamanan, dan konfigurasi sistem</p>
      </div>

      <div className="max-w-4xl space-y-5">

          {/* Profil Admin */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Profil Admin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Admin Arkana</p>
                  <p className="text-xs text-muted-foreground mb-2">admin@arkana.id</p>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="text-xs h-7">Ganti Foto</Button>
                    <Badge variant="outline" className="border-primary/30 bg-primary/5 text-primary text-xs">
                      Administrator
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Nama Lengkap</label>
                  <Input defaultValue="Admin Arkana" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Username</label>
                  <Input defaultValue="admin_arkana" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email
                  </label>
                  <Input defaultValue="admin@arkana.id" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" /> No. Telepon
                  </label>
                  <Input defaultValue="0812-3456-7890" className="h-9" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Institusi / Cabang
                  </label>
                  <Input defaultValue="Arkana HQ - Jakarta" className="h-9" />
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t">
                <Button size="sm" className="gap-2">
                  <Save className="w-4 h-4" /> Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Keamanan */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Keamanan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Password Lama</label>
                  <Input type="password" placeholder="••••••••" className="h-9" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-muted-foreground">Password Baru</label>
                  <Input type="password" placeholder="••••••••" className="h-9" />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-medium text-muted-foreground">Konfirmasi Password Baru</label>
                  <Input type="password" placeholder="••••••••" className="h-9" />
                </div>
              </div>
              <div className="flex justify-end pt-2 border-t">
                <Button size="sm" variant="outline" className="gap-2">
                  <Lock className="w-4 h-4" /> Update Password
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Notifikasi */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Preferensi Notifikasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[
                { label: "Permintaan penjemputan baru", desc: "Notif saat ada user mengajukan permintaan", on: true },
                { label: "Verifikasi sampah menunggu", desc: "Notif saat ada ajuan yang belum diproses", on: true },
                { label: "Pengiriman selesai", desc: "Notif konfirmasi setelah pengiriman berhasil", on: false },
                { label: "Laporan mingguan", desc: "Ringkasan performa dikirim setiap Senin", on: true },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <button
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                      item.on ? "bg-primary" : "bg-muted-foreground/30"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                        item.on ? "translate-x-4" : "translate-x-0.5"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
  );
}
