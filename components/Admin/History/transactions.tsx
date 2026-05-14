"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Download,
  Filter,
  Building2,
  Receipt,
  Calendar,
  ArrowUpDown,
  ChevronRight,
} from "lucide-react";

const ADMIN_HISTORY = [
  {
    id: "PAY-9921",
    entity: "Agent Lapak Berkah",
    type: "Premium Purchase",
    amount: "+400.000",
    tax: "0",
    date: "13 Mei 2026",
    method: "Midtrans",
    status: "Success",
  },
  {
    id: "TAX-8820",
    entity: "User: Shyfa Felia",
    type: "Platform Fee (2%)",
    amount: "+1.200",
    tax: "1.200",
    date: "13 Mei 2026",
    method: "Internal Wallet",
    status: "Success",
  },
  {
    id: "PAY-9918",
    entity: "Agent Rejeki Jaya",
    type: "Premium Purchase",
    amount: "+150.000",
    tax: "0",
    date: "12 Mei 2026",
    method: "Manual Transfer",
    status: "Success",
  },
  {
    id: "TAX-8815",
    entity: "User: Budi Santoso",
    type: "Platform Fee (2%)",
    amount: "+850",
    tax: "850",
    date: "12 Mei 2026",
    method: "Internal Wallet",
    status: "Success",
  },
];

export default function AdminFinanceHistory() {
  const [activeFilter, setActiveFilter] = useState("Semua");

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div className="md:flex-row items-start gap-4 border-b pb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Riwayat Transaksi
        </h1>
        <div>
          <p className="text-muted-foreground mt-1">
            Pantau performa pengelolaan sampah dan partisipasi pengguna.
          </p>
        </div>
      </div>

      {/* 1. Stats Overview - Card Style */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Revenue",
            value: "Rp 12.8M",
            color: "bg-slate-900 text-white",
          },
          {
            label: "Pajak Terkumpul",
            value: "Rp 450K",
            color: "bg-white text-slate-900",
          },
          {
            label: "Premium Aktif",
            value: "24 Unit",
            color: "bg-white text-slate-900",
          },
          {
            label: "Growth",
            value: "+12.5%",
            color: "bg-emerald-500 text-white",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className={`border-none shadow-sm rounded-[20px] p-5 ${stat.color}`}
          >
            <p className="text-[10px] font-black uppercase tracking-[0.15em] opacity-70">
              {stat.label}
            </p>
            <h3 className="text-2xl font-black mt-1">{stat.value}</h3>
          </Card>
        ))}
      </div>

      {/* 2. Enhanced Filter Card */}
      <Card className="border-none shadow-sm rounded-[24px] bg-white p-2">
        <div className="flex flex-col lg:flex-row items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari transaksi, agent, atau ID..."
              className="w-full pl-11 pr-4 py-3 bg-transparent text-sm font-medium outline-none"
            />
          </div>

          <div className="h-8 w-px bg-slate-100 hidden lg:block" />

          {/* Quick Filter Buttons */}
          <div className="flex p-1 gap-1 overflow-x-auto w-full lg:w-auto">
            {["Semua", "Premium", "Pajak", "Pending"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2 rounded-xl text-xs font-black transition-all whitespace-nowrap ${
                  activeFilter === f
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="h-8 w-px bg-slate-100 hidden lg:block" />

          {/* Action Buttons */}
          <div className="flex gap-2 p-1 w-full lg:w-auto">
            <Button
              variant="ghost"
              className="flex-1 lg:flex-none rounded-xl text-slate-600 font-bold text-xs"
            >
              <Calendar size={14} className="mr-2" /> Range Tanggal
            </Button>
            <Button className="flex-1 lg:flex-none bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs shadow-sm shadow-emerald-100">
              <Download size={14} className="mr-2" /> Export
            </Button>
          </div>
        </div>
      </Card>

      {/* 3. Main Transaction Table */}
      <Card className="border-none shadow-sm rounded-[24px] overflow-hidden bg-white">
        <div className="px-8 py-5 border-b border-slate-50 flex justify-between items-center">
          <h2 className="font-black text-slate-900 flex items-center gap-2 text-sm uppercase tracking-wider">
            <ArrowUpDown size={14} className="text-emerald-500" /> Log Transaksi
            Terbaru
          </h2>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/30">
                  <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Kategori
                  </th>
                  <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Pihak Terkait
                  </th>
                  <th className="text-left px-8 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Nominal
                  </th>
                  <th className="px-8 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Opsi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {ADMIN_HISTORY.map((item) => (
                  <tr
                    key={item.id}
                    className="group hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.type.includes("Premium") ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"}`}
                        >
                          {item.type.includes("Premium") ? (
                            <Building2 size={18} />
                          ) : (
                            <Receipt size={18} />
                          )}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-[13px]">
                            {item.type}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                            {item.id}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-slate-700 text-xs">
                        {item.entity}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {item.date} • {item.method}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span
                          className={`font-black text-sm ${item.type.includes("Pajak") ? "text-emerald-600" : "text-slate-900"}`}
                        >
                          Rp {item.amount}
                        </span>
                        {item.tax !== "0" && (
                          <span className="text-[9px] font-bold text-slate-300 uppercase">
                            Fee Platform
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-xl hover:bg-white hover:shadow-md text-slate-400 hover:text-emerald-600 transition-all"
                      >
                        <ChevronRight size={18} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
