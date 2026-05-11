"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

export default function CompleteProfilePage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [profileExists, setProfileExists] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        
        // Cek apakah profile sudah ada
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("phone, address, id")
          .eq("user_id", user.id)
          .maybeSingle(); // pakai maybeSingle biar tidak error
        
        if (profile) {
          setProfileExists(true);
          setPhone(profile.phone || "");
          setAddress(profile.address || "");
        } else {
          setProfileExists(false);
        }
      } else {
        router.push("/login");
      }
    };
    
    getUser();
  }, [supabase, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!phone && !address) {
      setError("Isi minimal salah satu data (telepon atau alamat)");
      setLoading(false);
      return;
    }

    let updateError = null;

    if (profileExists) {
      // UPDATE jika sudah ada
      const { error } = await supabase
        .from("profiles")
        .update({
          phone: phone || null,
          address: address || null,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userId);
      updateError = error;
    } else {
      // INSERT jika belum ada
      const { error } = await supabase
        .from("profiles")
        .insert({
          user_id: userId,
          full_name: "User",
          phone: phone || null,
          address: address || null,
          balance_points: 0
        });
      updateError = error;
    }

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setLoading(false);
    router.push("/login");
  };

  const handleSkip = () => {
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">Lengkapi Profil</h1>
      <p className="text-gray-600 mb-6">
        Isi data berikut untuk pengalaman penjemputan sampah yang lebih baik
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nomor Telepon</label>
          <Input
            type="tel"
            placeholder="08123456789"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Diperlukan untuk koordinasi penjemputan
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Alamat</label>
          <Input
            type="text"
            placeholder="Jl. Contoh No. 123, RT 01/RW 02"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Alamat lengkap untuk penjemputan sampah
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleSkip}
            className="flex-1"
          >
            Lewati
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </div>
  );
}