"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { User, Lock, Bell, Moon, Shield, ArrowLeft } from "lucide-react";

export default function SidebarSettings({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const menu = [
    { name: "Akun Saya", href: "/user/settings/akun", icon: User },
    { name: "Keamanan", href: "/user/settings/keamanan", icon: Lock },
    { name: "Notifikasi", href: "/user/settings/notifikasi", icon: Bell },
    { name: "Tampilan", href: "/user/settings/tampilan", icon: Moon },
    { name: "Privasi", href: "/user/settings/privasi", icon: Shield },
  ];

  const isActive = (href: string) => pathname === href;

  // Ambil nama menu yang sedang aktif untuk judul header
  const activeMenuName = menu.find((m) => isActive(m.href))?.name || "Settings";

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] bg-slate-50/50">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full lg:w-72 bg-white lg:min-h-screen border-b lg:border-r border-slate-200 sticky top-16 sm:top-20 z-30">
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible no-scrollbar px-4 lg:px-3 py-4 lg:py-6 gap-1.5">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 ${
                  active
                    ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                <Icon
                  className={`w-4 h-4 ${active ? "text-primary" : "text-slate-400"}`}
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 p-6 md:p-10 lg:p-14 animate-in fade-in slide-in-from-bottom-2 duration-500">
        <div className="max-w-4xl mx-auto">
          {/* DYNAMIC HEADER - Muncul di semua ukuran layar */}
          <header className="mb-8 lg:mb-12">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={() => router.push("/user/home")}
                className="lg:hidden p-2 bg-white border border-slate-200 rounded-lg shadow-sm"
              >
                <ArrowLeft className="w-4 h-4 text-slate-600" />
              </button>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
                {activeMenuName}
              </h2>
            </div>
            <div className="h-1.5 w-16 lg:w-24 bg-primary rounded-full" />
            <p className="mt-4 text-sm lg:text-base text-slate-500 font-medium">
              Atur dan kelola preferensi {activeMenuName.toLowerCase()} untuk
              akun TrashFlow kamu.
            </p>
          </header>

          {/* Konten dari masing-masing page settings */}
          <div className="bg-white lg:bg-transparent rounded-3xl lg:rounded-none">
            {children}
          </div>
        </div>
      </main>

      <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
