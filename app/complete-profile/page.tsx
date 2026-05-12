// app/complete-profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Loader2, Phone, MapPin, User, Eye, EyeOff, CheckCircle } from "lucide-react";

export default function CompleteProfilePage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [provider, setProvider] = useState<"credentials" | "google" | null>(null);
  const [profileExists, setProfileExists] = useState(false);
  const [profileComplete, setProfileComplete] = useState(false);
  
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const getUserAndProfile = async () => {
      setLoading(true);
      
      // Ambil user dari auth
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      console.log("Current user:", user);
      console.log("User error:", userError);
      
      if (!user || userError) {
        router.push("/login");
        return;
      }

      setUserId(user.id);
      setUserEmail(user.email || "");

      // Cek provider dari metadata
      const isGoogleUser = user.app_metadata?.provider === "google" || 
                           user.user_metadata?.provider === "google";
      setProvider(isGoogleUser ? "google" : "credentials");

      // Ambil data profile yang sudah ada
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      console.log("Profile data:", profile);
      console.log("Profile error:", profileError);

      if (profile && !profileError) {
        setProfileExists(true);
        setUserName(profile.full_name || "");
        setPhone(profile.phone || "");
        setAddress(profile.address || "");
        
        // Cek apakah profile sudah lengkap (ada phone atau address)
        if (profile.phone || profile.address) {
          setProfileComplete(true);
        }
      } else {
        // Profile belum ada, ambil dari metadata
        setUserName(user.user_metadata?.full_name || user.email?.split("@")[0] || "");
      }
      
      setLoading(false);
    };

    getUserAndProfile();
  }, [supabase, router]);

  // Jika profile sudah lengkap, redirect ke home
  useEffect(() => {
    if (!loading && profileComplete && !newPassword) {
      console.log("Profile already complete, redirecting to home...");
      router.push("/user/home");
    }
  }, [loading, profileComplete, router, newPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    // Validasi password untuk Google user
    if (provider === "google" && newPassword) {
      if (newPassword !== confirmPassword) {
        setError("Password tidak cocok");
        setLoading(false);
        return;
      }
      if (newPassword.length < 6) {
        setError("Password minimal 6 karakter");
        setLoading(false);
        return;
      }

      // Set password untuk user Google
      const { error: passwordError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (passwordError) {
        setError(passwordError.message);
        setLoading(false);
        return;
      }
    }

    // Update atau insert profile
    if (profileExists) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          phone: phone || null,
          address: address || null,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId);

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }
    } else {
      // Insert new profile
      const { error: insertError } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          full_name: userName,
          phone: phone || null,
          address: address || null,
          balance_points: 0
        });

      if (insertError) {
        setError(insertError.message);
        setLoading(false);
        return;
      }
    }

    setSuccess(true);
    setLoading(false);

    // Redirect setelah sukses
    setTimeout(() => {
      router.push("/user/home");
    }, 1500);
  };

  const handleSkip = () => {
    router.push("/user/home");
  };

  if (loading && !profileExists) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-md mx-auto mt-20 p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold mb-2">Profil Tersimpan!</h2>
        <p className="text-muted-foreground">Mengalihkan ke dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">
            {provider === "google" ? "Lengkapi Profil" : "Selamat Datang!"}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {provider === "google" 
              ? "Isi data berikut untuk menyelesaikan pendaftaran. Kamu juga bisa membuat password untuk login manual nantinya."
              : "Akun berhasil dibuat! Lengkapi data berikut untuk pengalaman terbaik."}
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email (readonly) */}
            <div>
              <Label>Email</Label>
              <Input value={userEmail} disabled className="bg-muted" />
            </div>

            {/* Nama (readonly jika sudah ada) */}
            <div>
              <Label>Nama Lengkap</Label>
              <Input value={userName} disabled className="bg-muted" />
            </div>

            {/* Phone */}
            <div>
              <Label>Nomor Telepon</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="08123456789"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Diperlukan untuk koordinasi penjemputan sampah
              </p>
            </div>

            {/* Address */}
            <div>
              <Label>Alamat Lengkap</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea
                  className="w-full pl-9 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Jl. Contoh No. 123, RT 01/RW 02, Kelurahan, Kecamatan, Kota"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            {/* Set Password (khusus user Google) */}
            {provider === "google" && (
              <div className="border-t pt-4 mt-2">
                <div className="flex items-center gap-2 mb-3">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <Label className="font-semibold">Buat Password </Label>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Dengan membuat password, kamu bisa login menggunakan email dan password selain login dengan Google.
                </p>
                
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password baru (minimal 6 karakter)"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                
                <Input
                  type="password"
                  placeholder="Konfirmasi password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-2"
                />
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 text-center bg-red-50 p-2 rounded-lg">
                {error}
              </p>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="flex-1"
              >
                Lewati
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}