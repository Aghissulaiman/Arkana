"use client";

import React from "react";
import { StatCards } from "./StatCards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Star,
  Search,
  ChevronRight,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  UserPlus,
  ArrowRight,
} from "lucide-react";

// Perbaikan: Definisi tipe dan data yang sebelumnya missing
type StatusType = "Menunggu" | "Diproses" | "Selesai" | "Ditolak";
const CATEGORIES = [
  "Semua",
  "Plastik & Botol",
  "Kertas & Kardus",
  "Logam",
  "Elektronik",
];

const STATUS_STYLE: Record<
  StatusType,
  { label: string; color: string; icon: React.ReactNode }
> = {
  Menunggu: {
    label: "Pending",
    color: "text-amber-500 bg-amber-50 border-amber-100",
    icon: <Clock className="w-3 h-3" />,
  },
  Diproses: {
    label: "Proses",
    color: "text-blue-500 bg-blue-50 border-blue-100",
    icon: <AlertCircle className="w-3 h-3" />,
  },
  Selesai: {
    label: "Success",
    color: "text-emerald-500 bg-emerald-50 border-emerald-100",
    icon: <CheckCircle2 className="w-3 h-3" />,
  },
  Ditolak: {
    label: "Reject",
    color: "text-rose-500 bg-rose-50 border-rose-100",
    icon: <XCircle className="w-3 h-3" />,
  },
};

export default function AdminDashboard() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 p-6 bg-[#FAFBFC] min-h-screen font-sans">
      {/* 1. MINIMALIST HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-slate-200 pb-8">
        <div className="w-full md:w-auto">
          <div className="flex items-center gap-2 text-emerald-600 mb-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              TrashFlow System
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Dashboard Overview
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Selamat datang kembali, berikut pantauan sirkular ekonomi hari ini.
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="flex-1 md:flex-none rounded-xl border-slate-200 text-slate-600 font-bold px-6 h-11"
          >
            Log Aktivitas
          </Button>
          <Button className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl px-6 h-11 font-bold shadow-lg shadow-emerald-100 transition-all">
            Export Report
          </Button>
        </div>
      </div>

      {/* 2. STATS SECTION */}
      <StatCards />

      {/* 3. AGENT MANAGEMENT SECTION */}
      <div className="grid lg:grid-cols-3 gap-10 pt-3">
        {/* Left: Pending Verifications */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-800 flex items-center gap-3">
                Verifikasi Agent
                <span className="bg-rose-100 text-rose-600 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  12 New Request
                </span>
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Periksa kelengkapan dokumen calon mitra pengepul.
              </p>
            </div>
            <Button
              variant="ghost"
              className="text-emerald-600 text-sm font-bold hover:bg-emerald-50 rounded-xl"
            >
              Lihat Semua <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="bg-white rounded-[32px] border border-slate-100 overflow-hidden shadow-sm">
            {[
              {
                name: "Pengepul Jaya Abadi",
                id: "ARK-882",
                cap: "850kg/day",
                loc: "Jakarta Selatan",
              },
              {
                name: "Sinar Rejeki Waste",
                id: "ARK-712",
                cap: "1.2 Ton/day",
                loc: "Depok, Jabar",
              },
              {
                name: "Lestari Recycle",
                id: "ARK-441",
                cap: "400kg/day",
                loc: "Tangerang",
              },
            ].map((agent, i) => (
              <div
                key={i}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img
                      src={`https://i.pravatar.cc/100?img=${i + 20}`}
                      className="w-14 h-14 rounded-2xl object-cover grayscale-[0.2] border-2 border-white shadow-sm"
                      alt="avatar"
                    />
                    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 border-2 border-white rounded-full flex items-center justify-center">
                      <ShieldCheck className="w-3 h-3 text-white" />
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                      {agent.name}
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                        {agent.id}
                      </span>
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                      <p className="text-[11px] text-slate-400 font-medium">
                        {agent.loc}
                      </p>
                      <span className="text-slate-200 text-[10px]">|</span>
                      <p className="text-[11px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                        Cap: {agent.cap}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 items-center justify-end">
                  <Button
                    variant="outline"
                    className="h-10 px-4 rounded-xl text-slate-500 border-slate-200 text-xs font-bold hover:bg-slate-100 transition-all"
                  >
                    Cek Dokumen
                  </Button>
                  <Button className="h-10 px-5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-slate-200">
                    Setujui
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Top Rated */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-slate-800">
              Top Performance
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              Agent dengan produktivitas tertinggi bulan ini.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                name: "Haryanto Waste",
                score: 4.9,
                pickups: 124,
                color: "text-amber-500 bg-amber-50 border-amber-100",
              },
              {
                name: "Siti Aminah",
                score: 4.8,
                pickups: 98,
                color: "text-emerald-500 bg-emerald-50 border-emerald-100",
              },
              {
                name: "Budi Santoso",
                score: 4.7,
                pickups: 82,
                color: "text-blue-500 bg-blue-50 border-blue-100",
              },
            ].map((agent, i) => (
              <div
                key={i}
                className="group p-5 bg-white rounded-3xl border border-slate-100 hover:border-emerald-200 hover:shadow-lg hover:shadow-slate-100/50 transition-all cursor-default"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`px-3 py-1 rounded-full font-black text-[10px] border uppercase tracking-widest ${agent.color}`}
                  >
                    Rank #0{i + 1}
                  </div>
                  <div className="flex items-center gap-1 text-xs font-black text-slate-700">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {agent.score}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-black text-slate-800 group-hover:text-emerald-600 transition-colors">
                      {agent.name}
                    </p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">
                      {agent.pickups} Sukses Penjemputan
                    </p>
                  </div>
                  <div className="h-10 w-10 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-emerald-50 transition-colors">
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 4. MONITORING SECTION */}
      <div className="space-y-6 ">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">
            Aktivitas Terkini
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Bar (Ref: image_740fc5.png) */}

          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

            <Input
              placeholder="Cari transaksi atau user..."
              className="pl-11 rounded-2xl border-slate-100 bg-slate-50/50 focus:bg-white h-11"
            />
          </div>

          {/* Category Filter */}

          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap ${
                  cat === "Semua"
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-100"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Activity List */}
        <div className="grid gap-4">
          {[
            {
              id: "TX-99",
              user: "Rina Dewi",
              agent: "Haryanto Waste",
              status: "Diproses",
              weight: "12kg",
              time: "2m ago",
              type: "Plastik & Botol",
            },
            {
              id: "TX-98",
              user: "Ahmad Fauzi",
              agent: "Budi Santoso",
              status: "Menunggu",
              weight: "5kg",
              time: "15m ago",
              type: "Kertas & Kardus",
            },
            {
              id: "TX-97",
              user: "Siti Rahayu",
              agent: "Siti Aminah",
              status: "Selesai",
              weight: "20kg",
              time: "1h ago",
              type: "Logam",
            },
          ].map((trx) => {
            const s = STATUS_STYLE[trx.status as StatusType];
            return (
              <div
                key={trx.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-5 rounded-[28px] border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-100/50 transition-all cursor-pointer group gap-4"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${s.color} bg-opacity-10 transition-all group-hover:scale-105 border`}
                  >
                    {s.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.15em]">
                        {trx.id}
                      </span>
                      <span
                        className={`text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase border ${s.color}`}
                      >
                        {s.label}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-slate-800 leading-none">
                      {trx.user}{" "}
                      <span className="text-slate-300 font-medium mx-1 text-sm">
                        mengirim ke
                      </span>{" "}
                      {trx.agent}
                    </h4>
                    <p className="text-xs text-slate-400 font-medium mt-1.5">
                      {trx.type} •{" "}
                      <span className="text-emerald-600 font-bold">
                        {trx.weight}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end sm:gap-8 border-t sm:border-none pt-3 sm:pt-0">
                  <div className="text-left sm:text-right">
                    <p className="text-[11px] font-bold text-slate-400">
                      {trx.time}
                    </p>
                    <p className="text-[10px] font-medium text-slate-300 hidden sm:block">
                      Status Terupdate
                    </p>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-45">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}