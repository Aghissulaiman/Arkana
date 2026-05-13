"use client";

import React, { useEffect, useState } from "react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Mail,
  MapPin,
  Edit3,
  Loader2,
  Users,
  ShieldCheck,
  Zap,
  Clock,
  IdCard,
} from "lucide-react";

export default function AdminWorkspacePage() {
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeAgents: 0,
    pendingApps: 0,
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, address, user_id, users(email, role)")
          .eq("user_id", session.user.id)
          .single();
        setUserData(profile);
      }

      // Fetching stats & recent activity (mocking activity from agent_applications)
      const [u, a, app, logs] = await Promise.all([
        supabase
          .from("users")
          .select("*", { count: "exact", head: true })
          .eq("role", "user"),
        supabase
          .from("agents")
          .select("*", { count: "exact", head: true })
          .eq("is_active", true),
        supabase
          .from("agent_applications")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),
        supabase
          .from("agent_applications")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      setStats({
        totalUsers: u.count || 0,
        activeAgents: a.count || 0,
        pendingApps: app.count || 0,
      });
      setActivities(logs.data || []);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-emerald-600 w-8 h-8" />
      </div>
    );

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* 1. TOP ADMIN BANNER (Full Width Profile Data) */}
      <div className="bg-white rounded-2xl border-b border-slate-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="w-24 h-24 border-4 border-white shadow-xl">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-emerald-600 text-white text-2xl font-bold">
                    {userData?.full_name?.substring(0, 2).toUpperCase() || "AD"}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-md border border-slate-100 hover:text-emerald-600 transition-colors">
                  <Edit3 size={14} />
                </button>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-extrabold text-slate-900 leading-none">
                    {userData?.full_name || "Admin TrashFlow"}
                  </h1>
                  <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase rounded tracking-wider">
                    {userData?.users?.role || "Super Admin"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-slate-500 font-medium pt-1">
                  <span className="flex items-center gap-1.5">
                    <Mail size={14} className="text-slate-400" />
                    {userData?.users?.email || "admin@trashflow.com"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin size={14} className="text-slate-400" />
                    {userData?.address || "Jakarta, Indonesia"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <IdCard size={14} className="text-slate-400" />
                    ID: {userData?.user_id?.substring(0, 8) || "TF-001"}
                  </span>
                </div>
              </div>
            </div>

            <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-6 h-12 shadow-lg shadow-slate-200 transition-all active:scale-95">
              <Edit3 size={16} className="mr-2" />
              Update Profile
            </Button>
          </div>
        </div>
      </div>

      <main className="max-w-6xl mx-auto px-6 mt-12">
        {/* 2. STATS OVERVIEW */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <StatCard
            label="Total Users"
            value={stats.totalUsers}
            icon={<Users />}
            color="text-blue-600"
            bg="bg-blue-50"
          />
          <StatCard
            label="Active Agents"
            value={stats.activeAgents}
            icon={<Zap />}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
          <StatCard
            label="Pending Review"
            value={stats.pendingApps}
            icon={<ShieldCheck />}
            color="text-amber-600"
            bg="bg-amber-50"
          />
        </div>

        {/* 3. RECENT ACTIVITY (Replacing Agent List) */}
        <section className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Aktivitas Terbaru
              </h2>
              <p className="text-sm text-slate-500">
                Pantau log sistem secara real-time
              </p>
            </div>
            <Button
              variant="outline"
              className="text-xs font-bold uppercase tracking-wider rounded-lg border-slate-200"
            >
              Lihat Semua
            </Button>
          </div>

          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent">
            {activities.length > 0 ? (
              activities.map((log) => (
                <div
                  key={log.id}
                  className="relative flex items-center justify-between group"
                >
                  <div className="flex items-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white border-2 border-slate-100 text-slate-400 group-hover:border-emerald-500 group-hover:text-emerald-500 transition-all z-10">
                      <Clock size={16} />
                    </div>
                    <div className="ml-6">
                      <p className="text-sm font-semibold text-slate-800">
                        Pendaftaran Agen baru:{" "}
                        <span className="text-emerald-600">
                          {log.agent_name}
                        </span>
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Area: {log.service_area}
                      </p>
                    </div>
                  </div>
                  <div className="text-xs font-medium text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                    Baru saja
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-10 text-slate-400 italic">
                Tidak ada aktivitas terbaru.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

// Sub-components dengan desain lebih clean
function StatCard({ label, value, icon, color, bg }: any) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 ${bg} ${color} rounded-xl flex items-center justify-center mb-4`}
      >
        {React.cloneElement(icon, { size: 22 })}
      </div>
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {label}
        </p>
        <h4 className="text-3xl font-black text-slate-900 mt-1">{value}</h4>
      </div>
    </div>
  );
}
