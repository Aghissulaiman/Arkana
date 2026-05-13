"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, MapPin, Weight } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
        // Ambil data pickup
        const { data: pickups, error } = await supabase
          .from("pickups")
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
      title: "Penjemputan Selesai",
      value: loading ? "..." : stats.completedPickups,
      change: "Total pickup selesai",
      icon: CheckCircle2,
      trend: "up",
    },
    {
      title: "Berat Sampah",
      value: loading ? "..." : `${stats.totalWeight} kg`,
      change: "Total berat terkumpul",
      icon: Weight,
      trend: "up",
    },
    {
      title: "Tugas Hari Ini",
      value: loading ? "..." : stats.todayTasks,
      change: `${stats.completedToday} selesai, ${stats.pendingToday} pending`,
      icon: MapPin,
      trend: "neutral",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {statsData.map((stat, i) => {
        const Icon = stat.icon;

        return (
          <Card key={i}>
            <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-green-600/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>

                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>

                  <span
                    className={`text-xs font-medium ${stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                          ? "text-red-500"
                          : "text-muted-foreground"
                      }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}