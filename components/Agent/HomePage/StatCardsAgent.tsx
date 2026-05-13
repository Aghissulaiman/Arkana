"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  CheckCircle2,
  Weight,
  MapPin,
  TrendingUp,
} from "lucide-react";

import { createClientSupabaseClient } from "@/lib/supabaseClient";

const supabase = createClientSupabaseClient();

interface Stats {
  completedPickups: number;
  totalWeight: number;
  todayTasks: number;
  completedToday: number;
  pendingToday: number;
}

export default function StatCardsAgent() {
  const [stats, setStats] = useState<Stats>({
    completedPickups: 0,
    totalWeight: 0,
    todayTasks: 0,
    completedToday: 0,
    pendingToday: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data: pickups, error } = await supabase
          .from("pickup_requests")
          .select("*");

        if (error) throw error;

        const completed = pickups.filter(
          (item) => item.status === "completed"
        );

        const today = new Date().toISOString().split("T")[0];

        const todayTasks = pickups.filter(
          (item) => item.date?.split("T")[0] === today
        );

        const completedToday = todayTasks.filter(
          (item) => item.status === "completed"
        );

        const pendingToday = todayTasks.filter(
          (item) => item.status === "pending"
        );

        const totalWeight = completed.reduce(
          (acc, item) => acc + (item.weight || 0),
          0
        );

        setStats({
          completedPickups: completed.length,
          totalWeight,
          todayTasks: todayTasks.length,
          completedToday: completedToday.length,
          pendingToday: pendingToday.length,
        });
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsData = [
    {
      label: "Penjemputan Selesai",
      value: loading ? "..." : stats.completedPickups,
      desc: "Total pickup selesai",
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-100/50",
      progress: 98,
    },
    {
      label: "Berat Sampah",
      value: loading ? "..." : `${stats.totalWeight} kg`,
      desc: "Total berat terkumpul",
      icon: Weight,
      color: "text-blue-600",
      bg: "bg-blue-100/50",
    },
    {
      label: "Tugas Hari Ini",
      value: loading ? "..." : stats.todayTasks,
      desc: `${stats.completedToday} selesai, ${stats.pendingToday} pending`,
      icon: MapPin,
      color: "text-amber-600",
      bg: "bg-amber-100/50",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statsData.map((stat, i) => (
        <Card
          key={i}
          className="p-6 border border-emerald-100/50 shadow-sm rounded-[32px] bg-white hover:shadow-md transition-all duration-300 group"
        >
          <div className="flex flex-col h-full justify-between">
            <div className="flex items-start justify-between mb-4">
              <div
                className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}
              >
                <stat.icon className="w-5 h-5" />
              </div>

              {stat.progress && (
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" /> +2.1%
                </div>
              )}
            </div>

            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em] mb-1">
                {stat.label}
              </p>

              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </h3>

              <p className="text-[11px] font-medium text-slate-400 mt-1">
                {stat.desc}
              </p>
            </div>

            {stat.progress && (
              <div className="mt-4 w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}