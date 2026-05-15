"use client";

import React, { useEffect, useState } from "react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Coins,
  Edit2,
  Save,
  X,
  Loader2,
  Calendar,
  History,
  TrendingUp,
} from "lucide-react";
import { useRouter } from "next/navigation";

type UserProfile = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  balance_points: number;
  role: string;
  joined_date: string;
  total_requests: number;
  total_waste_collected: number;
  total_points_earned: number;
};

export default function ProfilePage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // Ambil user yang login
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.push("/login");
        return;
      }

      // Ambil data dari tabel users (role)
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      // Ambil data dari tabel profiles
      let { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      // Jika profile belum ada, buat baru
      if (!profileData) {
        const { data: newProfile, error: insertError } = await supabase
          .from("profiles")
          .insert({
            user_id: user.id,
            full_name: user.email?.split("@")[0] || "User",
            phone: null,
            address: null,
            balance_points: 0,
          })
          .select()
          .single();

        if (insertError) {
          console.error("Error creating profile:", insertError);
        } else {
          profileData = newProfile;
        }
      }

      // Ambil statistik dari pickup_requests
      const { data: requests, error: requestsError } = await supabase
        .from("pickup_requests")
        .select("points_earned, actual_weight, status")
        .eq("user_id", user.id)
        .eq("status", "completed");

      let totalWaste = 0;
      let totalPoints = 0;

      if (requests && !requestsError) {
        requests.forEach((req) => {
          totalPoints += req.points_earned || 0;
          totalWaste += req.actual_weight || 0;
        });
      }

      // Total requests
      const { count: totalRequests, error: countError } = await supabase
        .from("pickup_requests")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      setProfile({
        id: user.id,
        email: user.email || "",
        full_name: profileData?.full_name || "",
        phone: profileData?.phone || "",
        address: profileData?.address || "",
        balance_points: profileData?.balance_points || 0,
        role: userData?.role || "user",
        joined_date: user.created_at
          ? new Date(user.created_at).toLocaleDateString("id-ID")
          : "-",
        total_requests: totalRequests || 0,
        total_waste_collected: totalWaste,
        total_points_earned: totalPoints,
      });

      setEditForm({
        full_name: profileData?.full_name || "",
        phone: profileData?.phone || "",
        address: profileData?.address || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert("User tidak ditemukan");
        return;
      }

      const { error } = await supabase.from("profiles").upsert(
        {
          user_id: user.id,
          full_name: editForm.full_name,
          phone: editForm.phone || null,
          address: editForm.address || null,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "user_id",
        },
      );

      if (error) throw error;

      setProfile((prev) =>
        prev
          ? {
              ...prev,
              full_name: editForm.full_name,
              phone: editForm.phone,
              address: editForm.address,
            }
          : null,
      );

      setIsEditing(false);
      alert("Profil berhasil disimpan!");
    } catch (error: any) {
      console.error("Error:", error);
      alert("Error: " + error?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setEditForm({
        full_name: profile.full_name,
        phone: profile.phone,
        address: profile.address,
      });
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Gagal memuat profil</p>
            <Button onClick={() => router.push("/login")} className="mt-4">
              Kembali ke Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Profil Saya</h1>
          <p className="text-sm text-muted-foreground">
            Kelola informasi akun Anda
          </p>
        </div>
        <div className="flex gap-2">
          {!isEditing ? (
            <Button
              onClick={() => setIsEditing(true)}
              variant="outline"
              className="gap-2"
            >
              <Edit2 className="w-4 h-4" /> Edit Profil
            </Button>
          ) : (
            <>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="gap-2"
              >
                <X className="w-4 h-4" /> Batal
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Simpan
              </Button>
            </>
          )}
          <Button onClick={handleLogout} variant="destructive">
            Logout
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Avatar Card */}
          <Card>
            <CardContent className="p-6 text-center">
              <Avatar className="w-24 h-24 mx-auto mb-4">
                <AvatarFallback className="text-2xl bg-primary text-white">
                  {profile.full_name?.charAt(0) ||
                    profile.email?.charAt(0) ||
                    "U"}
                </AvatarFallback>
              </Avatar>
              {!isEditing ? (
                <>
                  <h2 className="text-xl font-semibold">
                    {profile.full_name || "Belum diisi"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {profile.email}
                  </p>
                  <div className="mt-4 p-3 bg-primary/10 rounded-lg">
                    <p className="text-sm text-muted-foreground">Total Poin</p>
                    <p className="text-2xl font-bold text-primary">
                      {profile.balance_points.toLocaleString("id-ID")}
                    </p>
                  </div>
                </>
              ) : (
                <div className="space-y-3 text-left">
                  <div>
                    <Label>Nama Lengkap</Label>
                    <Input
                      value={editForm.full_name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, full_name: e.target.value })
                      }
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Contact Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5" /> Informasi Kontak
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="text-sm">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">No. Telepon</p>
                  {!isEditing ? (
                    <p className="text-sm">{profile.phone || "Belum diisi"}</p>
                  ) : (
                    <Input
                      value={editForm.phone}
                      onChange={(e) =>
                        setEditForm({ ...editForm, phone: e.target.value })
                      }
                      placeholder="Masukkan nomor telepon"
                      className="mt-1"
                    />
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Alamat</p>
                  {!isEditing ? (
                    <p className="text-sm">
                      {profile.address || "Belum diisi"}
                    </p>
                  ) : (
                    <textarea
                      value={editForm.address}
                      onChange={(e) =>
                        setEditForm({ ...editForm, address: e.target.value })
                      }
                      placeholder="Masukkan alamat lengkap"
                      className="w-full p-2 text-sm border rounded-md mt-1"
                      rows={3}
                    />
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Stats & Activity */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Penjemputan
                    </p>
                    <p className="text-2xl font-bold">
                      {profile.total_requests}
                    </p>
                  </div>
                  <History className="w-8 h-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Total Sampah
                    </p>
                    <p className="text-2xl font-bold">
                      {profile.total_waste_collected.toLocaleString("id-ID")}
                      <span className="text-sm ml-1">kg</span>
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Poin Dikumpulkan
                    </p>
                    <p className="text-2xl font-bold">
                      {profile.total_points_earned.toLocaleString("id-ID")}
                    </p>
                  </div>
                  <Coins className="w-8 h-8 text-primary/50" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Member Since */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" /> Informasi Akun
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Bergabung sejak</span>
                <span className="font-medium">{profile.joined_date}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize">{profile.role}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">User ID</span>
                <span className="font-mono text-xs">
                  {profile.id.slice(0, 8)}...
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Aksi Cepat</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/user/jual_sampah")}
              >
                Jual Sampah
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/user/history")}
              >
                Lihat Riwayat
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
