"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Coins,
  Bell,
  Settings,
  Bot,
  Send,
  Shield,
  Moon,
  Lock,
  Globe,
  HelpCircle,
  ArrowLeft,
  Menu,
  X,
  LogOut
} from "lucide-react";

export default function SidebarSettings({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

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

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
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
    { name: "Akun Saya", href: "/dashboard/pengaturan/akun", icon: User },
    { name: "Keamanan", href: "/dashboard/pengaturan/keamanan", icon: Lock },
    { name: "Notifikasi", href: "/dashboard/pengaturan/notifikasi", icon: Bell },
    { name: "Tampilan", href: "/dashboard/pengaturan/tampilan", icon: Moon },
    { name: "Privasi", href: "/dashboard/pengaturan/privasi", icon: Shield },
    { name: "Bantuan", href: "/dashboard/pengaturan/bantuan", icon: HelpCircle },
  ];

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* DESKTOP LAYOUT - Flex row */}
      <div className="hidden lg:flex min-h-screen">
        {/* SIDEBAR */}
        <aside
          className="fixed top-0 left-0 h-full border-r bg-background"
          style={{ width: sidebarWidth }}
        >
          <div className="h-14 flex items-center justify-between px-4 border-b">
            <div className="flex items-center gap-2">
              <ArrowLeft 
                className="w-5 h-5 text-muted-foreground cursor-pointer hover:text-primary transition" 
                onClick={() => router.push("/dashboard")}
              />
              <span className="font-semibold">Pengaturan</span>
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

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

        {/* RESIZE HANDLE */}
        <div
          className="fixed top-0 bottom-0 w-1 cursor-ew-resize hover:bg-primary/50 transition z-50"
          style={{ left: sidebarWidth }}
          onMouseDown={() => setIsResizing(true)}
        />

        {/* MAIN CONTENT DESKTOP */}
        <main
          className="flex-1 min-h-screen"
          style={{ marginLeft: sidebarWidth }}
        >
          <div className="p-6">
            {children}
          </div>
        </main>
      </div>

      {/* MOBILE LAYOUT */}
      <div className="lg:hidden">
        {/* MOBILE NAVBAR */}
        <div className="fixed top-0 left-0 right-0 z-40 h-14 border-b bg-background flex items-center px-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAiOpen(true)}
              className="w-9 h-9 bg-primary text-white rounded-lg flex items-center justify-center"
            >
              <Bot className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1 bg-muted rounded-lg text-sm">
              <Coins className="w-4 h-4 text-primary" />
              {points}
            </div>

            <button className="relative w-9 h-9 bg-muted rounded-lg flex items-center justify-center">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 bg-muted rounded-lg flex items-center justify-center"
              >
                <User className="w-4 h-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-background border rounded-lg shadow p-1">
                  <Link href="/profil" className="block px-3 py-2 hover:bg-muted rounded">
                    Profile
                  </Link>
                  <Link href="/dashboard/tracking" className="block px-3 py-2 hover:bg-muted rounded">
                    Tracking
                  </Link>
                  <Link href="/dashboard/pengaturan" className="block px-3 py-2 hover:bg-muted rounded">
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
          className={`fixed top-0 left-0 h-full w-[260px] bg-background z-50 transform transition duration-300 shadow-lg ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-2">
              <ArrowLeft 
                className="w-5 h-5 text-muted-foreground cursor-pointer" 
                onClick={() => {
                  setIsSidebarOpen(false);
                  router.push("/dashboard");
                }}
              />
              <span className="font-semibold">Pengaturan</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="p-1 rounded hover:bg-muted">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 border-b">
            <div className="flex items-center gap-2 px-3 py-2 bg-muted rounded-lg w-fit text-sm">
              <Coins className="w-4 h-4 text-primary" />
              {points} poin
            </div>
          </div>

          <nav className="p-3 space-y-1">
            {menu.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

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
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* MOBILE CONTENT */}
        <main className="pt-14 p-4 min-h-screen">
          {children}
        </main>
      </div>

      {/* AI CHAT - Sama untuk desktop & mobile */}
      {isAiOpen && (
        <div className="fixed inset-0 bg-black/30 flex justify-end items-end p-4 z-50">
          <div className="w-full max-w-sm h-[500px] bg-background rounded-xl shadow flex flex-col">
            <div className="p-3 border-b flex justify-between">
              <span>AI TrashFlow</span>
              <button onClick={() => setIsAiOpen(false)}><X className="w-4 h-4" /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {messages.map((m, i) => (
                <div key={i} className={`p-2 rounded text-sm max-w-[80%] ${m.role === "user" ? "bg-primary text-white ml-auto" : "bg-muted"}`}>
                  {m.text}
                </div>
              ))}
            </div>
            <div className="p-3 border-t flex gap-2">
              <input 
                value={input} 
                onChange={(e) => setInput(e.target.value)} 
                placeholder="Tanya sesuatu..."
                className="flex-1 border px-3 py-2 rounded-lg text-sm bg-background focus:outline-none focus:ring-1 focus:ring-primary"
              />
              <button onClick={handleSend} className="bg-primary text-white px-4 rounded-lg">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}