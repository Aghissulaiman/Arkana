"use client";

import { useState } from "react";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  Search,
  Calendar
} from "lucide-react";

export default function Riwayat() {
  const [activeTab, setActiveTab] = useState("semua");
  const [searchQuery, setSearchQuery] = useState("");

  const transactions = [
    {
      id: "ARK-001",
      type: "Penjemputan",
      category: "Plastik",
      weight: "2,5 kg",
      points: "+1.250",
      date: "15 Mei 2026",
      time: "09:00",
      status: "selesai"
    },
    {
      id: "ARK-002",
      type: "Penjemputan",
      category: "Kertas",
      weight: "5 kg",
      points: "+1.750",
      date: "12 Mei 2026",
      time: "14:00",
      status: "selesai"
    },
    {
      id: "ARK-003",
      type: "Penjemputan",
      category: "Logam",
      weight: "1,2 kg",
      points: "+1.440",
      date: "8 Mei 2026",
      time: "10:30",
      status: "selesai"
    },
    {
      id: "ARK-004",
      type: "Tukar Poin",
      category: "Voucher GoFood",
      weight: "-",
      points: "-5.000",
      date: "5 Mei 2026",
      time: "15:20",
      status: "selesai"
    },
    {
      id: "ARK-005",
      type: "Penjemputan",
      category: "Kaca",
      weight: "3 kg",
      points: "+600",
      date: "2 Mei 2026",
      time: "11:00",
      status: "selesai"
    },
    {
      id: "ARK-006",
      type: "Penjemputan",
      category: "Plastik",
      weight: "4 kg",
      points: "+2.000",
      date: "28 Apr 2026",
      time: "13:15",
      status: "dibatalkan"
    }
  ];

  const getStatusBadge = (status: string) => {
    if (status === "selesai") {
      return <span className="text-xs text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Selesai</span>;
    }
    if (status === "dibatalkan") {
      return <span className="text-xs text-red-600 bg-red-100 px-2 py-0.5 rounded-full">Dibatalkan</span>;
    }
    return null;
  };

  const filteredTransactions = transactions.filter(t => {
    if (activeTab !== "semua" && t.type.toLowerCase() !== activeTab) return false;
    if (searchQuery && !t.category.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { id: "semua", label: "Semua" },
    { id: "penjemputan", label: "Penjemputan" },
    { id: "tukar poin", label: "Tukar Poin" }
  ];

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-foreground">Riwayat</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Riwayat transaksi Anda</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari transaksi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 text-sm transition ${
              activeTab === tab.id
                ? "text-primary border-b-2 border-primary font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Transactions List */}
      <div className="space-y-3">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">Tidak ada transaksi</p>
          </div>
        ) : (
          filteredTransactions.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                  item.type === "Penjemputan" ? "bg-green-100" : "bg-blue-100"
                }`}>
                  {item.type === "Penjemputan" ? (
                    <Package className="w-4 h-4 text-green-600" />
                  ) : (
                    <Clock className="w-4 h-4 text-blue-600" />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{item.category}</p>
                    {getStatusBadge(item.status)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.date} • {item.time}
                  </p>
                  {item.weight !== "-" && (
                    <p className="text-xs text-muted-foreground mt-0.5">Berat: {item.weight}</p>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${item.points.startsWith("+") ? "text-green-600" : "text-red-600"}`}>
                  {item.points}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.id}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}