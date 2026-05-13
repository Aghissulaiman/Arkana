"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Leaf,
  Search,
  User,
  Coins,
  History,
  HelpCircle,
  LogOut,
  X,
  Bell,
  Settings,
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

export default function NavbarUser({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientSupabaseClient();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [userData, setUserData] = useState({
    id: "",
    name: "",
    email: "",
    points: 0,
  });
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Ambil data user dari database
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Ambil profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, balance_points")
          .eq("user_id", user.id)
          .single();

        setUserData({
          id: user.id,
          name: profile?.full_name || user.email?.split("@")[0] || "User",
          email: user.email || "",
          points: profile?.balance_points || 0,
        });
      }
      setLoading(false);
    };

    fetchUserData();
  }, [supabase]);

  // Set search query dari URL params
  useEffect(() => {
    const q = searchParams.get("q");
    if (q) {
      setSearchQuery(q);
    }
  }, [searchParams]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown ketika klik di luar
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`${pathname}?q=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(pathname);
    }
    setIsSearchFocused(false);
    searchInputRef.current?.blur();
  };

  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    if (val.trim() === "") {
      router.push(pathname);
    } else {
      router.push(`${pathname}?q=${encodeURIComponent(val)}`);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Menu items untuk dropdown profile
  const profileMenu = [
    { name: "Profile", href: "/user/profile", icon: User },
    { name: "Riwayat", href: "/user/riwayat", icon: History },
    { name: "Bantuan", href: "/user/help", icon: HelpCircle },
    { name: "Pengaturan", href: "/user/settings/akun", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* TOP NAVBAR */}
      <nav 
        className={`sticky top-0 z-50 w-full transition-all duration-300 h-16 sm:h-20 flex items-center justify-between px-4 md:px-8 lg:px-12 border-b ${
          isScrolled 
            ? "bg-white/80 backdrop-blur-xl border-slate-200/50 shadow-lg" 
            : "bg-white border-slate-100 shadow-sm"
        }`}
      >
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3 lg:gap-6">
          <Link href="/user/home" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:bg-primary/20">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900 hidden sm:block">
              TrashFlow
            </span>
          </Link>
        </div>

        {/* CENTER: SEARCH BAR (Desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <form onSubmit={handleSearchSubmit} className="w-full relative">
            <div className={`relative transition-all duration-200 ${
              isSearchFocused ? "scale-105" : ""
            }`}>
              <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${
                isSearchFocused ? "text-primary" : "text-slate-400"
              }`} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Cari artikel, panduan, atau bantuan..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100 border border-transparent rounded-2xl text-sm text-slate-700 placeholder:text-slate-400 focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  <X className="w-4 h-4 text-slate-400 hover:text-slate-600" />
                </button>
              )}
            </div>
          </form>
        </div>

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Search Button (Mobile) */}
          <button
            onClick={() => setIsSearchFocused(true)}
            className="md:hidden w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <Search className="w-5 h-5 text-slate-600" />
          </button>

          {/* Mobile Search Modal */}
          {isSearchFocused && (
            <div className="fixed inset-0 z-[60] bg-white animate-in fade-in slide-in-from-top duration-200 md:hidden">
              <div className="p-4 border-b border-slate-100 flex items-center gap-3">
                <Search className="w-5 h-5 text-primary" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Cari..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearchSubmit(e)}
                  className="flex-1 text-lg bg-transparent focus:outline-none"
                />
                <button
                  onClick={() => {
                    setIsSearchFocused(false);
                    setSearchQuery("");
                  }}
                  className="p-2 rounded-full bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm text-slate-400">Ketik dan tekan enter untuk mencari</p>
              </div>
            </div>
          )}

          {/* POINT CARD */}
          {!loading && (
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 bg-gradient-to-r from-amber-50 to-amber-100/50 border border-amber-200 rounded-full shadow-sm">
              <div className="bg-amber-100 p-1 rounded-full">
                <Coins className="w-4 h-4 text-amber-600" />
              </div>
              <span className="text-sm font-black text-amber-700">
                {userData.points.toLocaleString()}
              </span>
            </div>
          )}

          {/* NOTIFICATION */}
          <Link href="/user/notifications">
            <button className="relative w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full ring-2 ring-white" />
            </button>
          </Link>

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 text-primary rounded-full flex items-center justify-center transition-all hover:scale-105 hover:shadow-md border border-primary/20 overflow-hidden"
            >
              <User className="w-5 h-5" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {/* User Info */}
                <div className="px-3 py-3 border-b border-slate-100 mb-2">
                  <p className="text-sm font-bold text-slate-900">{userData.name}</p>
                  <p className="text-xs font-medium text-slate-500 truncate">{userData.email}</p>
                  <div className="flex items-center gap-1.5 mt-2 px-2 py-1.5 bg-amber-50 rounded-lg w-fit">
                    <Coins className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-xs font-bold text-amber-600">{userData.points.toLocaleString()} Poin</span>
                  </div>
                </div>

                {/* Menu Items */}
                {profileMenu.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsProfileOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold rounded-xl transition-all ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-slate-600 hover:bg-slate-50 hover:text-primary"
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
                  className="flex items-center gap-2.5 px-3 py-2.5 text-sm font-semibold text-rose-500 w-full text-left hover:bg-rose-50 rounded-xl transition-all"
                >
                  <LogOut className="w-4 h-4" />
                  Keluar
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Search Bar (under navbar) */}
      <div className="md:hidden px-4 py-3 bg-white border-b border-slate-100">
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari artikel atau bantuan..."
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 rounded-xl text-sm focus:bg-white focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </form>
      </div>

      {/* CONTENT */}
      <main className="flex-1 w-full max-w-none">
        {children}
      </main>
    </div>
  );
}