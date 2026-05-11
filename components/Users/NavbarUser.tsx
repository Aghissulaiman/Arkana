"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Leaf,
  User,
  Coins,
  History,
  HelpCircle,
  LogOut,
  X,
  Bell,
  Settings,
  Bot,
  Send,
} from "lucide-react";

export default function NavbarUser({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const [points] = useState(1250);

  const [messages, setMessages] = useState([
    { role: "ai", text: "Halo, saya AI TrashFlow. Ada yang bisa dibantu hari ini?" },
  ]);
  const [input, setInput] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  // handle scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // close dropdown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;

    setMessages((prev) => [
      ...prev,
      { role: "user", text: input },
      { role: "ai", text: "AI belum connect 🤖" },
    ]);

    setInput("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      {/* TOP NAVBAR */}
      <nav className={`sticky top-0 z-50 w-full transition-all duration-300 h-16 sm:h-20 flex items-center justify-between px-4 md:px-8 lg:px-12 border-b ${
        isScrolled 
          ? "bg-white/40 backdrop-blur-xl border-slate-200/50 shadow-md" 
          : "bg-white border-slate-100 shadow-sm"
      }`}>
        {/* LEFT: LOGO */}
        <div className="flex items-center gap-3 lg:gap-6">
          <Link href="/user/home" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">TrashFlow</span>
          </Link>
        </div>

        {/* CENTER: EMPTY SPACER */}
        <div className="flex-1" />

        {/* RIGHT: ACTIONS */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* POINT */}
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full">
            <div className="bg-amber-100 p-1 rounded-full">
              <Coins className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-sm font-black text-amber-700">{points}</span>
          </div>

          {/* AI BOT */}
          <button
            onClick={() => setIsAiOpen(true)}
            className="w-10 h-10 bg-primary/10 text-primary hover:bg-primary hover:text-white rounded-full flex items-center justify-center transition-colors shadow-sm"
          >
            <Bot className="w-5 h-5" />
          </button>

          {/* PROFILE */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-10 h-10 bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors border border-slate-200 shadow-sm overflow-hidden"
            >
              <User className="w-5 h-5" />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-3 border-b border-slate-100 mb-2">
                  <p className="text-sm font-bold text-slate-900">John Doe</p>
                  <p className="text-xs font-medium text-slate-500">john@example.com</p>
                </div>

                <Link
                  href="/user/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-colors"
                >
                  <User className="w-4 h-4" /> Profile
                </Link>
                <Link
                  href="/user/history"
                  onClick={() => setIsProfileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-colors ${pathname === "/user/history" ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-primary"}`}
                >
                  <History className="w-4 h-4" /> Riwayat
                </Link>
                <Link
                  href="/user/help"
                  onClick={() => setIsProfileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-xl transition-colors ${pathname === "/user/help" ? "bg-primary/10 text-primary" : "text-slate-600 hover:bg-slate-50 hover:text-primary"}`}
                >
                  <HelpCircle className="w-4 h-4" /> Bantuan
                </Link>
                <Link
                  href="/user/settings/akun"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-primary rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4" /> Pengaturan
                </Link>

                <div className="h-px bg-slate-100 my-2" />
                
                <button 
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-rose-500 w-full text-left hover:bg-rose-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <main className="flex-1 w-full max-w-none">{children}</main>

      {/* AI CHAT */}
      {isAiOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-end items-end p-4 sm:p-6 z-[60] transition-opacity">
          <div className="w-full max-w-sm h-[500px] bg-white rounded-[2rem] shadow-2xl flex flex-col animate-in slide-in-from-bottom-10 fade-in">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[2rem]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-slate-800">AI TrashFlow</span>
              </div>
              <button 
                onClick={() => setIsAiOpen(false)}
                className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-2xl text-sm max-w-[85%] ${
                    m.role === "user"
                      ? "bg-primary text-white ml-auto rounded-tr-none shadow-md shadow-primary/20"
                      : "bg-slate-100 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-[2rem]">
              <div className="flex gap-2 relative">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ketik pertanyaan Anda..."
                  className="flex-1 border-0 bg-white py-3 pl-4 pr-12 rounded-full text-sm shadow-sm focus:ring-2 focus:ring-primary focus:outline-none"
                />
                <button
                  onClick={handleSend}
                  className="absolute right-1 top-1 bottom-1 w-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-primary/90 transition-colors shadow-sm"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
