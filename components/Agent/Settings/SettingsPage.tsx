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
  Truck,
} from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Pengaturan</h1>
        <p className="text-sm text-muted-foreground">Kelola profil, keamanan, dan notifikasi akun Agent Anda</p>
      </div>

      <div className="space-y-5">
        {/* Profil Agent */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Profil Agent</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-green-600/10 flex items-center justify-center">
                <User className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <p className="font-medium">Budi Santoso</p>
                <p className="text-xs text-muted-foreground mb-2">budi.agent@arkana.id</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="text-xs h-7">Ganti Foto</Button>
                  <Badge variant="outline" className="border-green-600/30 bg-green-600/5 text-green-600 text-xs">
                    Agent Aktif
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Nama Lengkap</label>
                <Input defaultValue="Budi Santoso" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Username</label>
                <Input defaultValue="budi_agent" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <Input defaultValue="budi.agent@arkana.id" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" /> No. Telepon
                </label>
                <Input defaultValue="0812-3456-7890" className="h-9" />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Area Operasional / Plat Kendaraan
                </label>
                <Input defaultValue="Jakarta Selatan - B 1234 CD" className="h-9" />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700">
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
              <Button size="sm" variant="outline" className="gap-2 text-green-600 border-green-600 hover:bg-green-50">
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
              { label: "Tugas Penjemputan Baru", desc: "Notif saat Anda ditugaskan rute baru", on: true },
              { label: "Perubahan Rute", desc: "Notif saat ada pembatalan atau perubahan jadwal dari pelanggan", on: true },
              { label: "Pengingat Jadwal", desc: "Notif 30 menit sebelum jadwal penjemputan dimulai", on: true },
              { label: "Laporan Pendapatan", desc: "Ringkasan poin/uang masuk setiap akhir minggu", on: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    item.on ? "bg-green-600" : "bg-muted-foreground/30"
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
