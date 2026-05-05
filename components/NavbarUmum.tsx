"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  User,
  Coins,
  Home,
  Trash2,
  History,
  Gift,
  HelpCircle,
  LogOut,
  Menu,
  Truck,
  Repeat,
  X,
} from "lucide-react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [points] = useState(1250);

  // detect screen
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // lock scroll mobile
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  // navbar scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // resize sidebar
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.min(Math.max(e.clientX, 180), 320);
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const menuItems = [
    { name: "Beranda", href: "/dashboard", icon: Home },
    { name: "Jual Sampah", href: "/dashboard/jual-sampah", icon: Trash2 },
    { name: "Pengangkutan", href: "/dashboard/pengangkutan", icon: Truck },
    { name: "Langganan", href: "/dashboard/langganan", icon: Repeat },
    { name: "Riwayat", href: "/dashboard/riwayat", icon: History },
    { name: "Tukar Poin", href: "/dashboard/tukar-poin", icon: Gift },
    { name: "Bantuan", href: "/dashboard/bantuan", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background flex">

      {/* SIDEBAR DESKTOP */}
      <aside
        className="hidden lg:block border-r bg-background fixed left-0 top-0 h-full z-50"
        style={{ width: sidebarWidth }}
      >
        <div className="h-14 flex items-center px-3 border-b">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold">Arkana</span>
          </Link>
        </div>

        <nav className="p-3 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted text-muted-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* RESIZE HANDLE */}
      {isDesktop && (
        <div
          className="fixed top-0 bottom-0 w-1 cursor-ew-resize z-50 hover:bg-primary/50 hidden lg:block"
          style={{ left: sidebarWidth }}
          onMouseDown={() => setIsResizing(true)}
        />
      )}

      {/* MAIN WRAPPER */}
      <div
        className="flex-1 min-w-0"
        style={{
          marginLeft: isDesktop ? sidebarWidth : 0,
        }}
      >

        {/* NAVBAR */}
        <div className="fixed top-0 right-0 left-0 z-40 lg:left-auto"
          style={{
            left: isDesktop ? sidebarWidth : 0,
          }}
        >
          <nav className="flex items-center h-14 px-6 border-b bg-background">

            {/* kiri hamburger */}
            <div>
              {!isSidebarOpen && (
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2"
                >
                  <Menu />
                </button>
              )}
            </div>

            <div className="flex-1" />

            {/* kanan */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
                <Coins className="w-4 h-4 text-primary" />
                <span>{points}</span>
              </div>

              <Link href="/profil" className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
                <User className="w-4 h-4" />
              </Link>
            </div>
          </nav>
        </div>

        {/* MOBILE SIDEBAR */}
        <aside
          className={`fixed top-0 left-0 h-full w-[260px] bg-background z-50 transform transition-all duration-300 lg:hidden ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex justify-between border-b">
            <span>Arkana</span>
            <button onClick={() => setIsSidebarOpen(false)}>
              <X />
            </button>
          </div>
        </aside>

        {/* CONTENT */}
        <main className="pt-14 min-w-0 overflow-hidden">
          <div className="p-4 sm:p-6 lg:p-8 min-w-0">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}