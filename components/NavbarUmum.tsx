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
  Truck,
  Repeat,
  X,
  Bell,
  Settings,
  Bot,
  Send,
} from "lucide-react";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);

  const [sidebarWidth, setSidebarWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const [points] = useState(1250);

  const [messages, setMessages] = useState([
    { role: "ai", text: "Halo 👋, saya AI TrashFlow." },
  ]);
  const [input, setInput] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

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

  // close dropdown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  // resize sidebar
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

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "ai", text: "AI belum connect 🤖" },
    ]);

    setInput("");
  };

  const menu = [
    { name: "Beranda", href: "/dashboard", icon: Home },
    { name: "Jual Sampah", href: "/dashboard/jual-sampah", icon: Trash2 },
    { name: "Pengangkutan", href: "/dashboard/pengangkutan", icon: Truck },
    { name: "Langganan", href: "/dashboard/langganan", icon: Repeat },
    { name: "Riwayat", href: "/dashboard/riwayat", icon: History },
    { name: "Tukar Poin", href: "/dashboard/tukar-poin", icon: Gift },
    { name: "Bantuan", href: "/dashboard/bantuan", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">

      {/* DESKTOP SIDEBAR */}
      <aside
        className="hidden lg:block fixed top-0 left-0 h-full border-r bg-background z-50"
        style={{ width: sidebarWidth }}
      >
        <div className="h-14 flex items-center px-4 border-b">
          <Leaf className="w-5 h-5 text-primary" />
          <span className="ml-2 font-semibold">TrashFlow</span>
        </div>

        <nav className="p-3 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* RESIZE */}
      {isDesktop && (
        <div
          className="fixed top-0 bottom-0 w-1 cursor-ew-resize hidden lg:block"
          style={{ left: sidebarWidth }}
          onMouseDown={() => setIsResizing(true)}
        />
      )}

      {/* MAIN */}
      <div
        className="flex-1 min-w-0 w-full"
        style={{ marginLeft: isDesktop ? sidebarWidth : 0 }}
      >

        {/* NAVBAR */}
        <div
          className="fixed top-0 left-0 right-0 z-40 h-14 border-b bg-background flex items-center px-4 sm:px-6"
          style={{ left: isDesktop ? sidebarWidth : 0 }}
        >

          {/* HAMBURGER */}
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* AI */}
            <button
              onClick={() => setIsAiOpen(true)}
              className="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center"
            >
              <Bot className="w-4 h-4" />
            </button>

            {/* POINT */}
            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg text-sm">
              <Coins className="w-4 h-4 text-primary" />
              {points}
            </div>

            {/* NOTIF */}
            <button className="relative w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* PROFILE */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center"
              >
                <User className="w-4 h-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-background border rounded-lg shadow p-1">
                  <Link href="/dashboard/profile" className="block px-3 py-2 hover:bg-muted rounded">
                    Profile
                  </Link>
                  <Link href="/dashboard/tracking" className="block px-3 py-2 hover:bg-muted rounded">
                    Tracking
                  </Link>
                  <Link href="/dashboard/pengaturan/akun" className="block px-3 py-2 hover:bg-muted rounded">
                    Pengaturan
                  </Link>
                  <div className="border-t my-1" />
                  <button className="px-3 py-2 text-red-500 w-full text-left hover:bg-muted rounded">
                    Logout
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* MOBILE SIDEBAR */}
    <aside
  className={`fixed top-0 left-0 h-full w-[260px] bg-background z-50 transform transition duration-300 lg:hidden shadow-lg ${
    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
  }`}
>
  {/* HEADER */}
  <div className="p-4 flex justify-between items-center border-b">
    <div className="flex items-center gap-2">
      <Leaf className="w-5 h-5 text-primary" />
      <span className="font-semibold">TrashFlow</span>
    </div>

    <button
      onClick={() => setIsSidebarOpen(false)}
      className="p-1 rounded hover:bg-muted"
    >
      <X className="w-4 h-4" />
    </button>
  </div>

  {/* POINTS */}
  <div className="p-4 border-b">
    <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg w-fit text-sm">
      <Coins className="w-4 h-4 text-primary" />
      {points} poin
    </div>
  </div>

  {/* MENU */}
  <nav className="p-3 space-y-1">
    {menu.map((item) => {
      const Icon = item.icon;
      const active = pathname === item.href;

      return (
        <Link
          key={item.name}
          href={item.href}
          onClick={() => setIsSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
            active
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-muted"
          }`}
        >
          <Icon className="w-4 h-4" />
          {item.name}
        </Link>
      );
    })}
  </nav>

  {/* BOTTOM */}
  <div className="absolute bottom-0 left-0 right-0 p-3 border-t">
    <button className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-500 hover:bg-muted text-sm">
      <LogOut className="w-4 h-4" />
      Keluar
    </button>
  </div>
</aside>
        {/* OVERLAY */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* CONTENT */}
        <main className="pt-14 p-6 min-w-0">{children}</main>
      </div>

      {/* AI CHAT */}
      {isAiOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-end items-end p-4 z-50">
          <div className="w-full max-w-sm h-[500px] bg-background rounded-xl shadow flex flex-col">

            <div className="p-3 border-b flex justify-between">
              <span>AI TrashFlow</span>
              <button onClick={() => setIsAiOpen(false)}>
                <X />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded text-sm max-w-[80%] ${
                    m.role === "user"
                      ? "bg-primary text-white ml-auto"
                      : "bg-muted"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="p-3 border-t flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 border px-2 rounded text-sm"
              />
              <button onClick={handleSend} className="bg-primary text-white px-3 rounded">
                <Send className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}