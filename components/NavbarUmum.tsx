"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Search,
  Filter,
  LayoutDashboard,
  Users,
  CheckCircle,
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(260);
  const [isResizing, setIsResizing] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [userRole, setUserRole] = useState<"user" | "agent" | "admin">("user");
  const [userName, setUserName] = useState("");
  const [userPoints, setUserPoints] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Ambil data user dari database
  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // Ambil role dari tabel users
        const { data: userData } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();

        // Ambil profile
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, balance_points")
          .eq("user_id", user.id)
          .single();

        if (userData) setUserRole(userData.role);
        if (profile) {
          setUserName(profile.full_name || user.email?.split("@")[0] || "User");
          setUserPoints(profile.balance_points || 0);
        }
      }
      setLoading(false);
    };

    fetchUserData();
  }, [supabase]);

  // Detect screen size
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Lock scroll mobile
  useEffect(() => {
    document.body.style.overflow = isSidebarOpen ? "hidden" : "auto";
  }, [isSidebarOpen]);

  // Close dropdown
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    window.addEventListener("mousedown", handleClick);
    return () => window.removeEventListener("mousedown", handleClick);
  }, []);

  // Resize sidebar
  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (isResizing) {
        const w = Math.min(Math.max(e.clientX, 220), 320);
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Menu berdasarkan role
  const userMenu = [
    { name: "Beranda", href: "/dashboard", icon: Home },
    { name: "Jual Sampah", href: "/dashboard/jual-sampah", icon: Trash2 },
    { name: "Pengangkutan", href: "/dashboard/pengangkutan", icon: Truck },
    { name: "Langganan", href: "/dashboard/langganan", icon: Repeat },
    { name: "Riwayat", href: "/dashboard/riwayat", icon: History },
    { name: "Tukar Poin", href: "/dashboard/tukar-poin", icon: Gift },
    { name: "Bantuan", href: "/dashboard/bantuan", icon: HelpCircle },
  ];

  const agentMenu = [
    { name: "Dashboard", href: "/agent/dashboard", icon: LayoutDashboard },
    { name: "Permintaan Jemput", href: "/agent/pickups", icon: Truck },
    { name: "Scan QR", href: "/agent/scan", icon: CheckCircle },
    { name: "Riwayat", href: "/agent/history", icon: History },
    { name: "Bantuan", href: "/dashboard/bantuan", icon: HelpCircle },
  ];

  const adminMenu = [
    { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Kelola Agent", href: "/admin/agents", icon: Users },
    { name: "Kelola User", href: "/admin/users", icon: User },
    { name: "Laporan", href: "/admin/reports", icon: History },
    { name: "Bantuan", href: "/dashboard/bantuan", icon: HelpCircle },
  ];

  const menu = userRole === "admin" ? adminMenu : userRole === "agent" ? agentMenu : userMenu;

  // Filter menu berdasarkan search
  const filteredMenu = menu.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen flex bg-background overflow-x-hidden">
      {/* DESKTOP SIDEBAR */}
      <aside
        className="hidden lg:block fixed top-0 left-0 h-full border-r bg-sidebar z-50 transition-all duration-200"
        style={{ width: sidebarWidth }}
      >
        {/* Logo */}
        <div className="h-14 flex items-center px-4 border-b border-sidebar-border">
          <Leaf className="w-6 h-6 text-primary" />
          <span className="ml-2 font-bold text-lg bg-gradient-to-r from-primary to-primary-dark bg-clip-text text-transparent">
            TrashFlow
          </span>
        </div>

        {/* User Info */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-muted rounded-lg">
            <Coins className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">{userPoints.toLocaleString()} Poin</span>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="p-3 border-b border-sidebar-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari menu..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-1 focus:ring-primary outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          
          <button
            onClick={() => setShowFilter(!showFilter)}
            className="flex items-center gap-2 px-3 py-1.5 mt-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>

          {showFilter && (
            <div className="mt-2 p-2 bg-muted rounded-lg space-y-1">
              {menu.map((item) => (
                <label key={item.name} className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded border-gray-300" />
                  {item.name}
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="p-3 space-y-1 overflow-y-auto" style={{ height: "calc(100vh - 200px)" }}>
          {filteredMenu.length > 0 ? (
            filteredMenu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">
              Menu tidak ditemukan
            </p>
          )}
        </nav>
      </aside>

      {/* RESIZE HANDLE */}
      {isDesktop && (
        <div
          className="fixed top-0 bottom-0 w-1 cursor-ew-resize hidden lg:block hover:bg-primary/50 transition-colors z-50"
          style={{ left: sidebarWidth }}
          onMouseDown={() => setIsResizing(true)}
        />
      )}

      {/* MAIN CONTENT */}
      <div
        className="flex-1 min-w-0 w-full transition-all duration-200"
        style={{ marginLeft: isDesktop ? sidebarWidth : 0 }}
      >
        {/* NAVBAR */}
        <div
          className="fixed top-0 left-0 right-0 z-40 h-14 border-b bg-background/95 backdrop-blur-sm flex items-center px-4 sm:px-6"
          style={{ left: isDesktop ? sidebarWidth : 0 }}
        >
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-muted"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex-1" />

          {/* Search Bar di Navbar (mobile) */}
          <div className="lg:hidden relative mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari..."
              className="w-32 sm:w-48 pl-9 pr-3 py-1.5 text-sm bg-muted rounded-lg border-0 focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Points */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-muted rounded-lg">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium">{userPoints.toLocaleString()}</span>
            </div>

            {/* Notification */}
            <button className="relative w-9 h-9 rounded-lg hover:bg-muted flex items-center justify-center">
              <Bell className="w-4 h-4" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center hover:bg-muted/80 transition-colors"
              >
                <User className="w-4 h-4" />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-background border rounded-lg shadow-lg p-1 z-50">
                  <div className="px-3 py-2 border-b">
                    <p className="text-sm font-medium">{userName}</p>
                    <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
                  </div>
                  <Link
                    href={`/${userRole}/profile`}
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded mt-1"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </Link>
                  <Link
                    href="/dashboard/pengaturan"
                    className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted rounded"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Pengaturan
                  </Link>
                  <div className="border-t my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded w-full"
                  >
                    <LogOut className="w-4 h-4" />
                    Keluar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* MOBILE SIDEBAR */}
        <aside
          className={`fixed top-0 left-0 h-full w-[280px] bg-background z-50 transform transition-transform duration-300 lg:hidden shadow-xl ${
            isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="p-4 flex justify-between items-center border-b">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="font-bold text-lg">TrashFlow</span>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{userName}</p>
                <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-3 px-3 py-2 bg-muted rounded-lg">
              <Coins className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">{userPoints.toLocaleString()} Poin</span>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="p-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Cari menu..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 text-sm bg-muted rounded-lg border-0 focus:ring-1 focus:ring-primary outline-none"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1 overflow-y-auto" style={{ height: "calc(100vh - 280px)" }}>
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                    active
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-red-500 hover:bg-red-50 text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Keluar
            </button>
          </div>
        </aside>

        {/* Overlay */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Page Content */}
        <main className="pt-14 p-4 md:p-6 min-w-0 max-w-full">
          {children}
        </main>
      </div>
    </div>
  );
}