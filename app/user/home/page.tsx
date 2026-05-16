"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import UserDashboard from "@/components/Users/HomePage/Dashboard";
import Recommendations from "@/components/Users/HomePage/Rekomendasi";

import { createClientSupabaseClient } from "@/lib/supabaseClient";

export default function HomePage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const supabase = createClientSupabaseClient();

      const {
        data: { session },
      } = await supabase.auth.getSession();

      // kalau belum login
      if (!session) {
        router.push("/login");
        return;
      }

      // cek role
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      // kalau bukan user
      if (userData?.role !== "user") {
        router.push("/tidakAdaAkses");
        return;
      }

      setLoading(false);
    };

    checkSession();
  }, [router]);

  // loading screen
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      <UserDashboard />
      <Recommendations />
    </>
  );
}