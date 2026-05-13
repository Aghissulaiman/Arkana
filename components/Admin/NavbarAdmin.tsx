"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  HandCoins,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  History,
} from "lucide-react";

export default function AdminSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // State untuk Dropdown Profil
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);

  // Lebar sidebar yang lebih compact
  const sidebarWidth = isCollapsed ? 70 : 240;

  useEffect(() => {
    // Menutup dropdown saat klik di luar area profil
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
      group: "Data",
      items: [
        { name: "User", href: "/admin/users", icon: Users },
        {
          name: "Transaksi",
          href: "/admin/transactions",
          icon: ArrowLeftRight,
        },
        {
          name: "History",
          href: "/admin/history",
          icon: History,
        },
      ],
    },
  ];

  return (
    <div className="h-screen flex bg-[#F8FAFC] font-sans text-slate-900 overflow-hidden">
      {/* --- DESKTOP SIDEBAR --- */}
      <aside
        className="hidden lg:flex flex-col h-full border-r border-slate-200 bg-white z-50 transition-all duration-300 ease-in-out relative flex-shrink-0"
        style={{ width: sidebarWidth }}
      >
        {/* Toggle Collapse Button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 bg-white border border-slate-200 rounded-full p-1 text-slate-400 hover:text-emerald-600 shadow-sm z-50 transition-all"
        >
          {isCollapsed ? (
            <ChevronRight size={10} strokeWidth={3} />
          ) : (
            <ChevronLeft size={10} strokeWidth={3} />
          )}
        </button>

        {/* Logo Section */}
        <div
          className={`h-16 flex items-center border-b border-slate-50 flex-shrink-0 transition-all duration-300 ${
            isCollapsed ? "justify-center px-0" : "px-5"
          }`}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center shadow-md flex-shrink-0">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2.5} />
            </div>
            {!isCollapsed && (
              <span className="font-bold text-slate-900 text-base tracking-tight animate-in fade-in duration-300">
                TrashFlow
              </span>
            )}
          </div>
        </div>

        {/* Navigation - No Scroll & Compact */}
        <nav
          className={`py-4 flex-1 flex flex-col transition-all duration-300 overflow-hidden ${
            isCollapsed ? "px-2" : "px-3"
          }`}
        >
          <div className="space-y-5">
            {sidebarMenu.map((section) => (
              <div key={section.group}>
                {!isCollapsed && (
                  <h3 className="text-[10px] uppercase font-bold text-slate-400 px-3 mb-2 tracking-wider">
                    {section.group}
                  </h3>
                )}

                <div className="space-y-0.5">
                  {section.items.map((item) => {
                    const active = pathname === item.href;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center rounded-lg text-[13px] font-medium transition-all group relative ${
                          isCollapsed
                            ? "justify-center py-2.5"
                            : "px-3 py-2 gap-2.5"
                        } ${
                          active
                            ? "bg-emerald-50 text-emerald-700"
                            : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                        }`}
                      >
                        <item.icon
                          className={`w-[17px] h-[17px] flex-shrink-0 ${
                            active
                              ? "text-emerald-600"
                              : "text-slate-400 group-hover:text-slate-600"
                          }`}
                          strokeWidth={active ? 2.5 : 2}
                        />
                        {!isCollapsed && (
                          <span className="flex-1 truncate">{item.name}</span>
                        )}
                        {isCollapsed && (
                          <div className="absolute left-full ml-4 px-2.5 py-1.5 bg-slate-900 text-white text-[11px] rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-[70] shadow-xl">
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

        {/* Bottom Actions */}
        <div className="p-3 border-t border-slate-100 flex-shrink-0">
          <button
            className={`flex items-center text-rose-500 rounded-lg transition-all text-[13px] font-bold w-full ${
              isCollapsed
                ? "justify-center py-2.5"
                : "px-3 py-2 gap-2.5 hover:bg-rose-50"
            }`}
          >
            <LogOut className="w-[17px] h-[17px]" strokeWidth={2.5} />
            {!isCollapsed && <span>Keluar</span>}
          </button>
        </div>
      </aside>

      {/* --- CONTENT AREA --- */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* REFINED NAVBAR */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-40 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-600"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Link href="/admin/notifications">
                <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                  <Bell className="w-5 h-5" />
                </button>
              </Link>
              <Link href="/admin/settings">
                <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
                  <Settings className="w-5 h-5" />
                </button>
              </Link>
            </div>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            {/* Profile Section - Static Badge, Area Klik Aktif */}
            <div className="relative" ref={profileRef}>
              <div
                className="flex items-center gap-3 pl-2 cursor-pointer"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="flex flex-col items-end hidden sm:flex leading-tight">
                  <span className="text-[13px] font-bold text-slate-800 leading-none">
                    Shyfa Felia
                  </span>
                  <span className="text-[10px] font-medium text-emerald-600 mt-1 uppercase tracking-tighter">
                    Super Admin
                  </span>
                </div>
                {/* Badge tanpa hover effect */}
                <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 transition-transform active:scale-95">
                  <User className="w-4 h-4 text-slate-500" />
                </div>
                <ChevronDown
                  size={12}
                  className={`text-slate-400 transition-transform duration-200 ${isProfileOpen ? "rotate-180" : ""}`}
                />
              </div>

              {/* Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-200 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">
                  <div className="px-4 py-2 border-b border-slate-50 mb-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Email
                    </p>
                    <p className="text-[12px] font-semibold text-slate-700 truncate">
                      shyfa@TrashFlow.com
                    </p>
                  </div>

                  <Link href="/admin/profile">
                    <button className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left">
                      <User size={14} /> Profil Saya
                    </button>
                  </Link>
                  <Link href="/admin/settings">
                    <button className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] font-medium text-slate-600 hover:bg-slate-50 transition-colors text-left">
                      <Settings size={14} /> Pengaturan
                    </button>
                  </Link>

                  <div className="h-px bg-slate-50 my-1" />

                  <button className="flex items-center gap-2.5 w-full px-4 py-2 text-[13px] font-bold text-rose-500 hover:bg-rose-50 transition-colors text-left">
                    <LogOut size={14} strokeWidth={2.5} /> Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#F8FAFC] p-6 no-scrollbar">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
