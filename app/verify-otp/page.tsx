"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

function VerifyOTPContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  const supabase = createClientSupabaseClient();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // ✅ PASTIKAN type = 'email'
    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',  // ← INI YANG PENTING
    });

    if (verifyError) {
      setError(verifyError.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      // Cek apakah user sudah ada
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", data.user.id)
        .single();

      if (!existingUser) {
        await supabase.from("users").insert({
          id: data.user.id,
          email: email,
          role: "user"
        });

        await supabase.from("profiles").insert({
          user_id: data.user.id,
          full_name: email.split("@")[0],
          phone: null,
          address: null,
          balance_points: 0
        });
      }
    }

    setLoading(false);
    router.push("/complete-profile");
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-2">Verifikasi Kode</h1>
      <p className="text-gray-600 mb-6">
        Kami telah mengirim kode 6 digit ke <strong>{email}</strong>
      </p>
      
      <form onSubmit={verifyOTP}>
        <Input
          type="text"
          placeholder="000000"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          className="text-center text-2xl tracking-widest mb-4"
          maxLength={8}
          autoFocus
          required
        />
        
        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Memverifikasi..." : "Verifikasi & Masuk"}
        </Button>
      </form>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}