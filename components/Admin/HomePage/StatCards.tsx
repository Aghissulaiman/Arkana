"use client";

import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Users, Truck, Recycle, Coins } from "lucide-react";

const STATS = [
  {
    label: "Total User",
    value: "1.284",
    change: "+24",
    changeLabel: "bulan ini",
    trend: "up",
    icon: Users,
    color: "text-blue-500",
    bg: "bg-blue-50",
  },
  {
    label: "Total Sampah",
    value: "4.820",
    unit: "kg",
    change: "+320",
    changeLabel: "kg bulan ini",
    trend: "up",
    icon: Recycle,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Pengiriman Aktif",
    value: "38",
    change: "+7",
    changeLabel: "hari ini",
    trend: "up",
    icon: Truck,
    color: "text-orange-500",
    bg: "bg-orange-50",
  },
  {
    label: "Total Poin Ditukar",
    value: "89.500",
    change: "-1.200",
    changeLabel: "vs bulan lalu",
    trend: "down",
    icon: Coins,
    color: "text-yellow-500",
    bg: "bg-yellow-50",
  },
];

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {STATS.map((stat, i) => {
        const Icon = stat.icon;
        const isUp = stat.trend === "up";
        return (
          <Card key={i} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <span
                  className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                    isUp ? "bg-green-50 text-green-600" : "bg-red-50 text-red-500"
                  }`}
                >
                  {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {stat.change}
                </span>
              </div>

              <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold">
                {stat.value}
                {stat.unit && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">{stat.unit}</span>
                )}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-1">{stat.changeLabel}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
