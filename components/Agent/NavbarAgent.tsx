"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import {
  Leaf,
  User,
  Home,
  LogOut,
  Menu,
  Bell,
  Settings,
  MapPin,
  History,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  CalendarDays,
  Package,
  ClipboardList,
  Coins,
  Wallet,
  TrendingUp,
  PlusCircle, // Tambah icon untuk topup
} from "lucide-react";

export default function AgentSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [agentData, setAgentData] = useState<any>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const profileRef = useRef<HTMLDivElement>(null);
  const sidebarWidth = isCollapsed ? 88 : 260;

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        // Ambil data dari auth.users untuk avatar Google
        const { data: authUser } = await supabase.auth.getUser();
        const googleAvatar =
          authUser?.user?.user_metadata?.avatar_url ||
          authUser?.user?.user_metadata?.picture;
        setAvatarUrl(googleAvatar || null);

        // Ambil data profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, user_id, avatar_url, email")
          .eq("user_id", session.user.id)
          .single();

        // Prioritaskan avatar dari profile, fallback ke Google avatar
        if (profile?.avatar_url) {
          setAvatarUrl(profile.avatar_url);
        }

        // Ambil data agent (termasuk balance_income)
        const { data: agent } = await supabase
          .from("agents")
          .select("id, agent_name, balance_income, is_active")
          .eq("user_id", session.user.id)
          .single();

        setAgentData(agent);
        setUserData({
          ...profile,
          email: session.user.email || profile?.email,
        });
      }
      setLoading(false);
    };
    fetchUser();

    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  const formatBalance = (balance: number) => {
    if (!balance) return "0";
    if (balance >= 1000000) {
      return (balance / 1000000).toFixed(1) + "jt";
    }
    return balance.toLocaleString("id-ID");
  };

  const sidebarMenu = [
    {
      group: "Main Menu",
      items: [
        { name: "Dashboard", href: "/agent", icon: Home },
        { name: "Jadwal Saya", href: "/agent/schedule", icon: CalendarDays },
      ],
    },
    {
      group: "Operasional",
      items: [
        { name: "Permintaan & Pesanan", href: "/agent/tasks", icon: MapPin },
        {
          name: "Harga Sampah",
          href: "/agent/price-catalog",
          icon: ClipboardList,
        },
        { name: "Riwayat Transaksi", href: "/agent/history", icon: History },
      ],
    },
    {
      group: "Katalog",
      items: [{ name: "Daftar Produk", href: "/agent/reward", icon: Package }],
    },
  ];

  return (
    <div className="h-screen flex bg-[#F8FAFC] font-sans text-slate-600 overflow-hidden">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[60] lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 flex flex-col h-full border-r border-slate-200 bg-white z-[80] transition-all duration-300 ease-in-out lg:static
          ${isSidebarOpen ? "translate-x-0 w-[280px]" : "-translate-x-full lg:translate-x-0"}
        `}
        style={{
          width:
            typeof window !== "undefined" && window.innerWidth < 1024
              ? isSidebarOpen
                ? 280
                : 0
              : sidebarWidth,
        }}
      >
        {/* Brand Section - Logo TrashFlow (SAME AS NAVBAR USER) */}
        <div className="h-20 flex items-center px-6 shrink-0">
          <Link href="/agent" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-primary/10 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:bg-primary/20 shadow-sm shrink-0">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            {(!isCollapsed || isSidebarOpen) && (
              <span className="font-black text-xl tracking-tight text-slate-900">
                TrashFlow
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 overflow-y-auto no-scrollbar space-y-6">
          {sidebarMenu.map((group) => (
            <div key={group.group}>
              {(!isCollapsed || isSidebarOpen) && (
                <p className="px-4 text-[10px] font-semibold text-slate-400 uppercase tracking-[0.1em] mb-2">
                  {group.group}
                </p>
              )}
              <div className="space-y-1">
                {group.items.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group relative
                        ${
                          active
                            ? "bg-emerald-50 text-emerald-700 font-semibold"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-800"
                        }
                      `}
                    >
                      {active && (
                        <div className="absolute left-0 w-1 h-5 bg-emerald-500 rounded-r-full" />
                      )}
                      <item.icon
                        className={`w-5 h-5 shrink-0 ${active ? "text-emerald-600" : "text-slate-400 group-hover:text-slate-600"}`}
                      />
                      {(!isCollapsed || isSidebarOpen) && (
                        <span className="text-[13.5px]">{item.name}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Collapse Toggle (Desktop Only) */}
        <div className="p-4 border-t border-slate-100 hidden lg:block">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="flex items-center justify-center w-full py-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all"
          >
            {isCollapsed ? (
              <ChevronRight size={18} />
            ) : (
              <div className="flex items-center gap-2 text-xs font-medium">
                <ChevronLeft size={16} /> Minimize
              </div>
            )}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
            >
              <Menu size={22} />
            </button>

            {/* Contextual Search Bar */}
            {(pathname === "/agent/tasks" || pathname === "/agent/history") && (
              <div className="hidden md:flex items-center gap-2 bg-slate-100/50 px-3 py-1.5 rounded-full border border-slate-200/50 focus-within:bg-white focus-within:ring-2 focus-within:ring-emerald-100 transition-all">
                <Search size={15} className="text-slate-400" />
                <input
                  type="text"
                  placeholder={`Cari di ${pathname.split("/").pop()}...`}
                  className="bg-transparent border-none text-xs focus:outline-none w-xs font-medium"
                />
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Points Badge - Di Header */}
            {!loading && agentData && (
              <div className="hidden md:flex items-center gap-2 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100">
                <Coins className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-bold text-amber-700">
                  {formatBalance(agentData.balance_income || 0)}
                </span>
                <span className="text-[10px] text-amber-500">poin</span>
              </div>
            )}

            <Link href="/agent/notifications">
              <button className="p-2 text-slate-400 hover:text-emerald-500 transition-colors relative">
                <Bell size={25} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
              </button>
            </Link>

            <div className="w-px h-6 bg-slate-200 mx-1" />

            {/* Profile Dropdown */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2.5 p-1 pr-3 hover:bg-slate-50 rounded-full transition-all border border-transparent hover:border-slate-200"
              >
                <div className="relative">
                  {avatarUrl ? (
                    <Image
                      src={avatarUrl}
                      alt="Profile"
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover ring-2 ring-emerald-100"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                      {userData?.full_name?.substring(0, 1) ||
                        userData?.email?.substring(0, 1) ||
                        "A"}
                    </div>
                  )}
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="hidden lg:block text-left">
                  <p className="text-[13px] font-semibold text-slate-800 leading-none">
                    {loading ? "..." : userData?.full_name || "Agent"}
                  </p>
                  <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-wider">
                    Agent Portal
                  </p>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl shadow-slate-200/50 p-2 z-[100] animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-3 border-b border-slate-50 mb-1">
                    <p className="text-xs font-medium text-slate-400">
                      Terautentikasi sebagai
                    </p>
                    <p className="text-sm font-semibold text-slate-700 truncate">
                      {userData?.email || "Loading..."}
                    </p>
                    {/* Points di dropdown */}
                    <div className="flex items-center justify-between mt-2 pt-1">
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-xs text-slate-500">
                          Pendapatan
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-bold text-amber-700">
                          {formatBalance(agentData?.balance_income || 0)}
                        </span>
                        <span className="text-[10px] text-amber-500">poin</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* 🔥 TAMBAH MENU TOP UP DI SINI 🔥 */}
                  <Link href="/agent/topup">
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                      <PlusCircle size={16} className="text-emerald-500" /> 
                      Top Up Balance
                    </button>
                  </Link>
                  
                  <Link href="/agent/profile">
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                      <User size={16} /> Profil Saya
                    </button>
                  </Link>
                  <Link href="/agent/settings">
                    <button className="flex items-center gap-3 w-full px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                      <Settings size={16} /> Pengaturan
                    </button>
                  </Link>
                  <div className="h-px bg-slate-100 my-1 mx-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2 text-[13px] text-rose-600 hover:bg-rose-50 rounded-xl transition-all font-medium"
                  >
                    <LogOut size={16} /> Keluar Aplikasi
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto no-scrollbar bg-emerald-50/50">
          <div className="p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </div>
  );
}