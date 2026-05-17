"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Leaf,
  User,
  History,
  HelpCircle,
  LogOut,
  Bell,
  Settings,
  Wallet,
  Gift,
  Coins,
  Home,
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

export default function NavbarUser({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    points: 0,
    avatarUrl: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Ambil avatar dari Google
        const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture || "";
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, balance_points")
          .eq("user_id", user.id)
          .single();

        setUserData({
          name: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          points: profile?.balance_points || 0,
          avatarUrl: avatarUrl,
        });
      }
    };
    fetchUserData();
  }, [supabase]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const dropdownRef = useRef<HTMLDivElement>(null);

  const profileMenu = [
    { name: "Dashboard", href: "/user/home", icon: Home },
    { name: "Profil Saya", href: "/user/profile", icon: User },
    { name: "Riwayat", href: "/user/history", icon: History },
    { name: "Top Up Poin", href: "/user/topup", icon: Wallet },
    { name: "Tukar Poin", href: "/user/rewards", icon: Gift },
    { name: "Pengaturan", href: "/user/settings", icon: Settings },
    { name: "Bantuan", href: "/user/help", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 h-16 sm:h-20 flex items-center justify-between px-6 md:px-12 border-b ${
          isScrolled
            ? "bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-lg"
            : "bg-white border-slate-100 shadow-sm"
        }`}
      >
        {/* LOGO */}
        <Link href="/user/home" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 transition-transform group-hover:scale-105">
            <Leaf className="w-6 h-6 text-white" />
          </div>
          <span className="font-black text-xl tracking-tight text-slate-900 hidden sm:block">
            TrashFlow
          </span>
        </Link>

        <div className="flex items-center gap-3 sm:gap-6">
          {/* POINT PILL */}
          <Link
            href="/user/transactions"
            className="flex items-center gap-2 bg-amber-50 hover:bg-amber-100 transition-colors px-3 py-1.5 rounded-full border border-amber-200/50 group"
          >
            <div className="bg-amber-400 rounded-full p-1 group-hover:rotate-12 transition-transform">
              <Coins className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-black text-amber-700 leading-none">
              {userData.points.toLocaleString()}
            </span>
          </Link>

          <div className="flex items-center gap-3">
            {/* NOTIFICATION */}
            <Link href="/user/notifications">
              <button className="relative w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
              </button>
            </Link>

            {/* PROFILE DROPDOWN with GOOGLE AVATAR */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-transparent hover:ring-emerald-300 transition-all"
              >
                {userData.avatarUrl ? (
                  <Image
                    src={userData.avatarUrl}
                    alt={userData.name}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white font-bold">
                    {userData.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50">
                  <div className="px-3 py-3 border-b border-slate-100">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-emerald-500 to-emerald-600">
                        {userData.avatarUrl ? (
                          <Image
                            src={userData.avatarUrl}
                            alt={userData.name}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white font-bold text-lg">
                            {userData.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{userData.name}</p>
                        <p className="text-xs text-slate-500 truncate max-w-[180px]">{userData.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-1.5 bg-amber-50 rounded-lg w-fit">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-xs font-bold text-amber-600">{userData.points.toLocaleString()} Poin</span>
                    </div>
                  </div>

                  {profileMenu.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsProfileOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-all ${
                          isActive
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-600 hover:bg-slate-50 hover:text-emerald-600"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </Link>
                    );
                  })}

                  <div className="h-px bg-slate-100 my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium text-rose-600 w-full text-left hover:bg-rose-50 rounded-xl transition-all"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}