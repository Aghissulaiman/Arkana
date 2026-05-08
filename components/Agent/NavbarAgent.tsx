"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  User,
  Home,
  MapPin,
  History,
  LogOut,
  Menu,
  X,
  Bell,
  Settings,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function AgentSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (isResizing) {
        const w = Math.min(Math.max(e.clientX, 200), 320);
        setSidebarWidth(w);
      }
    };
    const up = () => setIsResizing(false);
    if (isResizing) {
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    }
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, [isResizing]);

  const menu = [
    { name: "Dashboard", href: "/agent", icon: Home },
    { name: "Tugas Penjemputan", href: "/agent/tasks", icon: MapPin },
    { name: "Riwayat", href: "/agent/history", icon: History },
    { name: "Pengaturan", href: "/agent/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">
      <aside
        className="hidden lg:flex flex-col fixed top-0 left-0 h-full border-r bg-background z-50"
        style={{ width: sidebarWidth }}
      >
        <div className="h-14 flex items-center px-4 border-b gap-2">
          <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
            <Leaf className="w-4 h-4 text-white" />
          </div>
          <div>
            <span className="font-semibold text-sm leading-none block">Arkana</span>
            <span className="text-[10px] text-muted-foreground leading-none">Agent Portal</span>
          </div>
          <span className="ml-auto">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
          </span>
        </div>

        <nav className="p-3 space-y-0.5 flex-1 overflow-y-auto">
          <p className="text-[10px] uppercase font-semibold text-muted-foreground px-3 pt-2 pb-1">
            Menu
          </p>
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                  active
                    ? "bg-green-600/10 text-green-600 font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t">
          <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-500 hover:bg-red-50 text-sm transition-colors">
            <LogOut className="w-4 h-4" />
            Keluar
          </button>
        </div>
      </aside>

      {isDesktop && (
        <div
          className="fixed top-0 bottom-0 w-1 cursor-ew-resize hidden lg:block z-50"
          style={{ left: sidebarWidth }}
          onMouseDown={() => setIsResizing(true)}
        />
      )}

      <div
        className="flex-1 min-w-0 w-full"
        style={{ marginLeft: isDesktop ? sidebarWidth : 0 }}
      >
        <div
          className="fixed top-0 right-0 z-40 h-14 border-b bg-background flex items-center px-4 sm:px-6"
          style={{ left: isDesktop ? sidebarWidth : 0 }}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-foreground font-medium">Agent Portal</span>
          </div>

          <div className="flex-1" />

          <div className="flex items-center gap-2">
            <button className="relative w-9 h-9 bg-muted rounded-lg flex items-center justify-center hover:bg-muted/80 transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
              >
                <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-green-600" />
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-medium leading-none">Budi Santoso</p>
                  <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Agent Aktif</p>
                </div>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-background border rounded-xl shadow-lg p-1 z-50">
                  <Link href="/agent/settings" className="flex items-center gap-2 px-3 py-2 hover:bg-muted rounded-lg text-sm">
                    <Settings className="w-3.5 h-3.5" /> Pengaturan
                  </Link>
                  <div className="border-t my-1" />
                  <button className="flex items-center gap-2 px-3 py-2 text-red-500 w-full text-left hover:bg-red-50 rounded-lg text-sm">
                    <LogOut className="w-3.5 h-3.5" /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <aside
          className={`fixed top-0 left-0 h-full w-[260px] bg-background z-50 transform transition duration-300 lg:hidden shadow-xl ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-green-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-sm block leading-none">Arkana</span>
                <span className="text-[10px] text-muted-foreground leading-none">Agent Portal</span>
              </div>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded hover:bg-muted">
              <X className="w-4 h-4" />
            </button>
          </div>

          <nav className="p-3 space-y-0.5 overflow-y-auto">
            <p className="text-[10px] uppercase font-semibold text-muted-foreground px-3 pt-2 pb-1">Menu</p>
            {menu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                    active ? "bg-green-600/10 text-green-600 font-medium" : "text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-3 border-t">
            <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-500 hover:bg-red-50 text-sm">
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </aside>

        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        <main className="pt-14 p-6 min-w-0">{children}</main>
      </div>
    </div>
  );
}
