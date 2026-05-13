"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient"; // Pastikan path ini benar
import {
  Leaf,
  User,
  Home,
  LogOut,
  Menu,
  Bell,
  Settings,
  ShieldCheck,
  BarChart3,
  Users,
  ArrowLeftRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Tag,
  Loader2,
} from "lucide-react";

export default function AdminSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const supabase = createClientSupabaseClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const profileRef = useRef<HTMLDivElement>(null);
  const sidebarWidth = isCollapsed ? 80 : 260;

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, user_id, users(email, role)")
          .eq("user_id", session.user.id)
          .single();

        setUserData(profile);
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
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login"; // Redirect manual setelah logout
  };

  const sidebarMenu = [
    {
      group: "Utama",
      items: [
        { name: "Dashboard", href: "/admin", icon: Home },
        { name: "Laporan", href: "/admin/reports", icon: BarChart3 },
      ],
    },
    {
      group: "Verifikasi",
      items: [
        {
          name: "Verifikasi Agent",
          href: "/admin/agent-applications",
          icon: ShieldCheck,
        },
      ],
    },
    {
      group: "Data Master",
      items: [
        { name: "Semua User", href: "/admin/users", icon: Users },
        {
          name: "Transaksi",
          href: "/admin/transactions",
          icon: ArrowLeftRight,
        },
      ],
    },
  ];

  return (
    <div className="h-screen flex bg-[#FDFDFD] font-sans text-slate-900 overflow-hidden">
      {/* --- SIDEBAR --- */}
      <aside
        className="hidden lg:flex flex-col h-full border-r border-slate-100 bg-white z-50 transition-all duration-300 ease-in-out relative shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]"
        style={{ width: sidebarWidth }}
      >
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-8 bg-white border border-slate-200 rounded-full p-1.5 text-slate-400 hover:text-emerald-600 shadow-md z-50 transition-all hover:scale-110"
        >
          {isCollapsed ? (
            <ChevronRight size={12} strokeWidth={3} />
          ) : (
            <ChevronLeft size={12} strokeWidth={3} />
          )}
        </button>

        <div
          className={`h-20 flex items-center shrink-0 transition-all duration-300 ${isCollapsed ? "justify-center px-0" : "px-6"}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 shrink-0">
              <Leaf className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <span className="font-black text-slate-900 text-lg tracking-tight">
                TrashFlow
              </span>
            )}
          </div>
        </div>

        <nav
          className={`py-6 flex-1 flex flex-col overflow-y-auto no-scrollbar transition-all duration-300 ${isCollapsed ? "px-3" : "px-4"}`}
        >
          <div className="space-y-8">
            {sidebarMenu.map((section) => (
              <div key={section.group}>
                {!isCollapsed && (
                  <h3 className="text-[10px] uppercase font-black text-slate-300 px-4 mb-3 tracking-[0.2em]">
                    {section.group}
                  </h3>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center rounded-2xl text-[13px] font-bold transition-all group relative ${
                          isCollapsed
                            ? "justify-center py-3"
                            : "px-4 py-2.5 gap-3"
                        } ${active ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}
                      >
                        <item.icon
                          className={`w-5 h-5 shrink-0 ${active ? "text-white" : "text-slate-400 group-hover:text-emerald-500"}`}
                          strokeWidth={active ? 2.5 : 2}
                        />
                        {!isCollapsed && (
                          <span className="flex-1 truncate">{item.name}</span>
                        )}
                        {isCollapsed && (
                          <div className="absolute left-full ml-4 px-3 py-2 bg-slate-900 text-white text-[11px] rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-70 shadow-2xl">
                            {item.name}
                          </div>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 z-40 shrink-0 sticky top-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden lg:block">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                Workspace
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="p-2.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-full transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-slate-100" />

            {/* PROFILE DROPDOWN DENGAN DATA DINAMIS */}
            <div className="relative" ref={profileRef}>
              <div
                className="flex items-center gap-3 pl-2 cursor-pointer group"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="flex flex-col items-end leading-tight">
                  <span className="text-[13px] font-black text-slate-900 group-hover:text-emerald-600 transition-colors">
                    {loading ? "..." : userData?.full_name || "Admin"}
                  </span>
                  <span className="text-[10px] font-black text-emerald-500 mt-0.5 uppercase tracking-tighter">
                    {loading
                      ? "Loading"
                      : userData?.users?.role?.replace("_", " ") ||
                        "Super Admin"}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-emerald-50 p-0.5 transition-transform group-hover:scale-105">
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                    ) : (
                      <User className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>
                <ChevronDown
                  size={14}
                  className={`text-slate-300 transition-transform duration-300 ${isProfileOpen ? "rotate-180 text-emerald-500" : ""}`}
                />
              </div>

              {isProfileOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-white border border-slate-100 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] py-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200 origin-top-right">
                  <div className="px-6 py-4 border-b border-slate-50 mb-2">
                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-1">
                      Kredensial
                    </p>
                    <p className="text-[13px] font-bold text-slate-800 truncate">
                      {userData?.users?.email || "..."}
                    </p>
                  </div>

                  <div className="px-3 space-y-1">
                    <ProfileMenuItem
                      icon={<User size={16} />}
                      label="Profil Saya"
                      href="/admin/profile"
                    />
                    <div className="h-px bg-slate-50 mx-3 my-2" />
                    <p className="text-[9px] font-black text-slate-300 uppercase px-4 py-2 tracking-[0.2em]">
                      Sistem
                    </p>
                    <ProfileMenuItem
                      icon={<Settings size={16} />}
                      label="Pengaturan Umum"
                      href="/admin/settings"
                    />
                    <ProfileMenuItem
                      icon={<Tag size={16} />}
                      label="Katalog Harga"
                      href="/admin/priceCatalogs"
                    />
                  </div>

                  <div className="mt-4 px-3">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-3 text-[13px] font-black text-rose-500 hover:bg-rose-50 rounded-2xl transition-all"
                    >
                      <LogOut size={16} strokeWidth={3} /> Keluar Aplikasi
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-[#FDFDFD] p-8 no-scrollbar">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}

function ProfileMenuItem({
  icon,
  label,
  href,
}: {
  icon: any;
  label: string;
  href: string;
}) {
  return (
    <Link href={href}>
      <button className="flex items-center gap-3 w-full px-4 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-2xl transition-all text-left group">
        <span className="text-slate-400 group-hover:text-emerald-500">
          {icon}
        </span>
        {label}
      </button>
    </Link>
  );
}
