"use client";

import { useState, useEffect, useRef } from "react";
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
  GripVertical,
} from "lucide-react";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [points, setPoints] = useState(1250);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Resize handler
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        const newWidth = Math.min(Math.max(e.clientX, 180), 320);
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

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
    { name: "Beranda", href: "/home", icon: Home },
    { name: "Jual Sampah", href: "/jual-sampah", icon: Trash2 },
    { name: "Riwayat", href: "/riwayat", icon: History },
    { name: "Tukar Poin", href: "/tukar-poin", icon: Gift },
    { name: "Bantuan", href: "/bantuan", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar Atas - Poin & Profil di kanan */}
      <div
        className="fixed top-0 right-0 z-40 transition-all duration-300"
        style={{ left: `${sidebarWidth}px` }}
      >
        <nav
          className={`flex justify-end items-center h-12 lg:h-14 px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
            isScrolled
              ? "bg-background/95 backdrop-blur-sm border-b border-border"
              : "bg-background border-b border-border"
          }`}
        >
          {/* Poin + Profil di kanan */}
          <div className="flex items-center gap-3">
            {/* Poin */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-muted/30">
              <Coins className="w-3.5 h-3.5 text-primary" />
              <span className="font-medium text-sm text-foreground">
                {points.toLocaleString()}
              </span>
              <span className="text-xs text-muted-foreground">poin</span>
            </div>

            {/* Profil */}
            <Link
              href="/profil"
              className="w-8 h-8 rounded-lg bg-muted/50 border border-border flex items-center justify-center hover:bg-muted transition-colors"
            >
              <User className="w-3.5 h-3.5 text-foreground" />
            </Link>

            {/* Menu Button untuk mobile */}
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors -mr-2"
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>
          </div>
        </nav>
      </div>

      {/* Sidebar Resizable */}
      <aside
        className="fixed top-0 left-0 z-50 h-full bg-background border-r border-border hidden lg:block"
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Sidebar Header - Logo */}
        <div className="flex items-center px-3 py-3 border-b border-border h-12 lg:h-14">
          <Link href="/home" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-base text-foreground">
              Arkana<span className="text-primary">.</span>
            </span>
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout di Bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-border">
          <button
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-red-500 transition-colors"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Resize Handle */}
      <div
        className="fixed top-0 bottom-0 z-50 w-1 cursor-ew-resize hidden lg:block hover:bg-primary/50 transition-colors"
        style={{ left: `${sidebarWidth}px` }}
        onMouseDown={() => setIsResizing(true)}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-8 rounded-full bg-border flex items-center justify-center">
          <GripVertical className="w-3 h-3 text-muted-foreground" />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-background border-r border-border transform transition-transform duration-300 ease-in-out lg:hidden ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ width: `${Math.min(sidebarWidth, 280)}px` }}
      >
        <div className="flex items-center justify-between p-3 border-b border-border">
          <Link href="/home" className="flex items-center gap-2">
            <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-base text-foreground">
              Arkana<span className="text-primary">.</span>
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-4 h-4 text-foreground" />
          </button>
        </div>

        {/* Poin di Mobile Sidebar */}
        <div className="p-3 border-b border-border">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-muted/30 w-fit">
            <Coins className="w-3.5 h-3.5 text-primary" />
            <span className="font-medium text-sm text-foreground">
              {points.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground">poin</span>
          </div>
        </div>

        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-2 border-t border-border">
          <button
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-muted-foreground hover:bg-muted hover:text-red-500 transition-colors"
            onClick={() => {
              window.location.href = "/login";
            }}
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Overlay untuk mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main
        className={`pt-12 lg:pt-14 transition-all duration-300`}
        style={{ marginLeft: `${sidebarWidth}px` }}
      >
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}