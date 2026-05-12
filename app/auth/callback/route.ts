import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const fromRegister = requestUrl.searchParams.get("from") === "register";

  if (code) {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.exchangeCodeForSession(code);

    if (user && fromRegister) {
      // Cek apakah user sudah ada di tabel users
      const { data: existingUser } = await supabase
        .from("users")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        // Insert user dengan provider google
        await supabase.from("users").insert({
          id: user.id,
          email: user.email,
          role: "user",
          provider: "google"
        });

        // Insert profile
        await supabase.from("profiles").insert({
          user_id: user.id,
          full_name: user.user_metadata?.full_name || user.email?.split("@")[0],
          phone: null,
          address: null,
          balance_points: 0
        });

        // Redirect ke complete profile untuk user baru
        return NextResponse.redirect(new URL("/complete-profile", requestUrl.origin));
      }
    }
  }

  // Redirect ke user home
  return NextResponse.redirect(new URL("/user/home", requestUrl.origin));
}