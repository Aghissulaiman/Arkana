// app/auth/callback/route.ts
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const fromRegister = requestUrl.searchParams.get("from");

  console.log("=== CALLBACK ===");
  console.log("from parameter:", fromRegister);
  console.log("code:", code ? "ada" : "tidak ada");

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code);
    
    console.log("User email:", user?.email);
    console.log("Error:", error);

    if (user) {
      // Cek apakah user sudah ada di tabel users
      const { data: existingUser } = await supabase
        .from("users")
        .select("id, role")  // ← ambil juga role
        .eq("id", user.id)
        .single();

      console.log("Existing user:", existingUser ? "ada" : "tidak ada");

      // Jika user belum ada (berarti registrasi baru)
      if (!existingUser) {
        console.log("User baru, insert ke database...");
        
        await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          role: "user",
          provider: "google"
        });

        await supabase.from("profiles").insert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
          phone: null,
          address: null,
          balance_points: 0
        });

        console.log("Redirect ke /complete-profile");
        return NextResponse.redirect(new URL("/complete-profile", requestUrl.origin));
      }
      
      // Jika user sudah ada, cek role untuk redirect
      const role = existingUser.role || "user";
      console.log("User role:", role);

      // Cek apakah profile lengkap (opsional, bisa di-skip)
      const { data: profile } = await supabase
        .from("profiles")
        .select("phone, address")
        .eq("user_id", user.id)
        .single();

      // Jika profile belum lengkap dan bukan admin/agent, redirect ke complete-profile
      if ((!profile?.phone && !profile?.address) && role === "user") {
        console.log("Profile belum lengkap, redirect ke /complete-profile");
        return NextResponse.redirect(new URL("/complete-profile", requestUrl.origin));
      }

      // REDIRECT BERDASARKAN ROLE
      console.log("Redirect berdasarkan role:", role);
      
      switch (role) {
        case "admin":
          return NextResponse.redirect(new URL("/admin", requestUrl.origin));
        case "agent":
          return NextResponse.redirect(new URL("/agent", requestUrl.origin));
        default:
          return NextResponse.redirect(new URL("/user/home", requestUrl.origin));
      }
    }
  }

  // Default redirect ke home
  console.log("Redirect ke /login");
  return NextResponse.redirect(new URL("/login", requestUrl.origin));
}