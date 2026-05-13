"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  Users,
  UserCheck,
  Activity,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    label: "Success Rate",
    value: "98.2%",
    desc: "Target: 100%",
    icon: Activity,
    color: "text-emerald-600",
    bg: "bg-emerald-100/50",
    progress: 98,
  },
  {
    label: "Total Users",
    value: "1,240",
    desc: "Active this month",
    icon: Users,
    color: "text-blue-600",
    bg: "bg-blue-100/50",
  },
  {
    label: "Active Agents",
    value: "86",
    desc: "Ready to pickup",
    icon: UserCheck,
    color: "text-indigo-600",
    bg: "bg-indigo-100/50",
  },
  {
    label: "New Proposals",
    value: "12",
    desc: "Wait for review",
    icon: ClipboardList,
    color: "text-amber-600",
    bg: "bg-amber-100/50",
  },
];

export function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
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
              {stat.label === "Success Rate" && (
                <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <TrendingUp className="w-3 h-3" /> +2.1%
                </div>
              )}
            </div>

            <div>
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">
                {stat.value}
              </h3>
              <p className="text-[11px] font-medium text-slate-400 mt-1 flex items-center gap-1">
                {stat.desc}
              </p>
            </div>

            {/* Visual Indicator (Optional - inspired by current balance card in image_740fc5.png) */}
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
