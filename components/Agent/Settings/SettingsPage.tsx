"use client";

import { useState, useEffect } from "react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
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
  Loader2,
  Bell,
  CheckCircle,
  MapPin,
} from "lucide-react";
import { Toaster, toast } from "sonner";

type AgentProfile = {
  full_name: string;
  phone: string;
  address: string;
  email: string;
  area_operational?: string;
  vehicle_plate?: string;
};

const NOTIF_OPTIONS = [
  {
    key: "new_task",
    label: "Tugas Penjemputan Baru",
    desc: "Notif saat Anda ditugaskan rute baru",
  },
  {
    key: "route_change",
    label: "Perubahan Rute",
    desc: "Notif saat ada pembatalan atau perubahan jadwal dari pelanggan",
  },
  {
    key: "reminder",
    label: "Pengingat Jadwal",
    desc: "Notif 30 menit sebelum jadwal penjemputan dimulai",
  },
  {
    key: "earnings",
    label: "Laporan Pendapatan",
    desc: "Ringkasan poin/uang masuk setiap akhir minggu",
  },
];

export default function AgentSettingsPageFull() {
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profile, setProfile] = useState<AgentProfile>({
    full_name: "",
    phone: "",
    address: "",
    email: "",
    area_operational: "",
    vehicle_plate: "",
  });
  const [passwords, setPasswords] = useState({
    old: "",
    new: "",
    confirm: "",
  });
  const [notifSettings, setNotifSettings] = useState<Record<string, boolean>>({
    new_task: true,
    route_change: true,
    reminder: true,
    earnings: false,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      const { data: agentData } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setProfile({
        full_name: profileData?.full_name || "",
        phone: profileData?.phone || "",
        address: profileData?.address || "",
        email: user.email || "",
        area_operational: agentData?.area_operational || "",
        vehicle_plate: agentData?.vehicle_plate || "",
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          full_name: profile.full_name,
          phone: profile.phone,
          address: profile.address,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (error) throw error;

      // Try to update agent-specific data if columns exist
      if (profile.area_operational || profile.vehicle_plate) {
        await supabase
          .from("agents")
          .update({
            area_operational: profile.area_operational,
            vehicle_plate: profile.vehicle_plate,
          })
          .eq("user_id", user.id);
      }

      toast.success("Profil berhasil disimpan!");
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err?.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwords.old || !passwords.new || !passwords.confirm) {
      toast.error("Isi semua field password");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      toast.error("Konfirmasi password tidak cocok");
      return;
    }
    if (passwords.new.length < 6) {
      toast.error("Password minimal 6 karakter");
      return;
    }

    setSavingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwords.new,
      });

      if (error) throw error;

      toast.success("Password berhasil diubah!");
      setPasswords({ old: "", new: "", confirm: "" });
    } catch (err: any) {
      toast.error("Gagal update password: " + err?.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const toggleNotif = (key: string) => {
    setNotifSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-100">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Toaster position="top-right" richColors />

      <div>
        <h1 className="text-2xl font-semibold">Pengaturan Akun</h1>
        <p className="text-sm text-muted-foreground">
          Kelola profil, keamanan, dan notifikasi akun Agent Anda
        </p>
      </div>

      <div className="space-y-5">
        {/* Profil Agent */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Profil Agent
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <User className="w-8 h-8 text-primary" />
              </div>
              <div>
                <p className="font-medium">
                  {profile.full_name || "Nama belum diisi"}
                </p>
                <p className="text-xs text-muted-foreground mb-2">
                  {profile.email}
                </p>
                <Badge
                  variant="outline"
                  className="border-primary/30 bg-primary/5 text-primary text-xs"
                >
                  Agent Aktif
                </Badge>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <User className="w-3 h-3" /> Nama Lengkap
                </label>
                <Input
                  value={profile.full_name}
                  onChange={(e) =>
                    setProfile({ ...profile, full_name: e.target.value })
                  }
                  className="h-9"
                  placeholder="Nama lengkap"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email
                </label>
                <Input
                  value={profile.email}
                  disabled
                  className="h-9 bg-muted/30"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Phone className="w-3 h-3" /> No. Telepon
                </label>
                <Input
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  className="h-9"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Plat Kendaraan
                </label>
                <Input
                  value={profile.vehicle_plate}
                  onChange={(e) =>
                    setProfile({ ...profile, vehicle_plate: e.target.value })
                  }
                  className="h-9"
                  placeholder="B 1234 CD"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Area Operasional
                </label>
                <Input
                  value={profile.area_operational}
                  onChange={(e) =>
                    setProfile({ ...profile, area_operational: e.target.value })
                  }
                  className="h-9"
                  placeholder="Contoh: Jakarta Selatan"
                />
              </div>
              <div className="sm:col-span-2 space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Alamat
                </label>
                <Input
                  value={profile.address}
                  onChange={(e) =>
                    setProfile({ ...profile, address: e.target.value })
                  }
                  className="h-9"
                  placeholder="Alamat lengkap"
                />
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t">
              <Button
                size="sm"
                onClick={handleSaveProfile}
                disabled={savingProfile}
                className="gap-2"
              >
                {savingProfile ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan Perubahan
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Keamanan */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Lock className="w-4 h-4 text-primary" />
              Keamanan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Password Lama
                </label>
                <Input
                  type="password"
                  value={passwords.old}
                  onChange={(e) =>
                    setPasswords({ ...passwords, old: e.target.value })
                  }
                  placeholder="••••••••"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Password Baru
                </label>
                <Input
                  type="password"
                  value={passwords.new}
                  onChange={(e) =>
                    setPasswords({ ...passwords, new: e.target.value })
                  }
                  placeholder="••••••••"
                  className="h-9"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-medium text-muted-foreground">
                  Konfirmasi Password Baru
                </label>
                <Input
                  type="password"
                  value={passwords.confirm}
                  onChange={(e) =>
                    setPasswords({ ...passwords, confirm: e.target.value })
                  }
                  placeholder="••••••••"
                  className="h-9"
                />
              </div>
            </div>
            <div className="flex justify-end pt-2 border-t">
              <Button
                size="sm"
                variant="outline"
                onClick={handleUpdatePassword}
                disabled={savingPassword}
                className="gap-2 text-primary border-primary/50 hover:bg-primary/5"
              >
                {savingPassword ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Lock className="w-4 h-4" />
                )}
                Update Password
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notifikasi */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              Preferensi Notifikasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {NOTIF_OPTIONS.map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2 border-b last:border-0"
              >
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotif(item.key)}
                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                    notifSettings[item.key]
                      ? "bg-primary"
                      : "bg-muted-foreground/30"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow ${
                      notifSettings[item.key]
                        ? "translate-x-4"
                        : "translate-x-0.5"
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
