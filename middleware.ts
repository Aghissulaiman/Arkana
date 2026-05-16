import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = req.nextUrl.pathname;

  // kalau belum login → biarkan
  // nanti halaman client yang redirect
  if (!user) {
    return res;
  }

  // ambil role
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = userData?.role;

  // USER
  if (role === "user") {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/agent")
    ) {
      return NextResponse.redirect(
        new URL("/tidakAdaAkses", req.url)
      );
    }
  }

  // AGENT
  if (role === "agent") {
    if (
      pathname.startsWith("/admin") ||
      pathname.startsWith("/user")
    ) {
      return NextResponse.redirect(
        new URL("/tidakAdaAkses", req.url)
      );
    }
  }

  // ADMIN
  if (role === "admin") {
    if (
      pathname.startsWith("/user") ||
      pathname.startsWith("/agent")
    ) {
      return NextResponse.redirect(
        new URL("/tidakAdaAkses", req.url)
      );
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};