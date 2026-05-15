"use client";

import { useState, useEffect } from "react";
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
  Loader2,
  Wallet,
  ArrowRightLeft,
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

export default function AdminFinanceHistory() {
  const supabase = createClientSupabaseClient();
  const [activeFilter, setActiveFilter] = useState("Semua");
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const [pickupRes, redeemRes, topupRes] = await Promise.all([
        supabase.from("pickup_requests").select(`*, users!pickup_requests_user_id_fkey (email), agents!pickup_requests_agent_id_fkey (agent_name)`).order("created_at", { ascending: false }),
        supabase.from("redeem_requests").select(`*, users!redeem_requests_user_id_fkey (email)`).order("created_at", { ascending: false }),
        supabase.from("topup_requests").select(`*, users!topup_requests_user_id_fkey (email)`).order("created_at", { ascending: false })
      ]);

      const merged = [
        ...(pickupRes.data || []).map((p: any) => ({
          id: p.id,
          code: p.request_code || p.id.slice(0, 8),
          entity: p.agents?.agent_name || "Agent",
          user: p.users?.email || "User",
          type: "Penjemputan Sampah",
          category: "Pickup",
          amount: p.total_points || 0,
          date: new Date(p.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          status: p.status,
          method: "Poin Pengepulan"
        })),
        ...(redeemRes.data || []).map((r: any) => ({
          id: r.id,
          code: r.id.slice(0, 8),
          entity: "Arkana Store",
          user: r.users?.email || "User",
          type: "Redeem Reward: " + r.reward_name,
          category: "Redeem",
          amount: r.points_spent || 0,
          date: new Date(r.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          status: r.status,
          method: "Poin Tukar"
        })),
        ...(topupRes.data || []).map((t: any) => ({
          id: t.id,
          code: t.id.slice(0, 8),
          entity: "Arkana Wallet",
          user: t.users?.email || "User",
          type: "Top Up Saldo Poin",
          category: "Topup",
          amount: t.amount || 0,
          date: new Date(t.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
          status: t.status,
          method: "Midtrans/Payment"
        }))
      ].sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());

      setTransactions(merged);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(t => {
    const matchesSearch = t.code.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          t.entity.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === "Semua" || t.category === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      <div className="md:flex-row items-start gap-4 border-b pb-6">
        <h1 className="text-3xl font-black tracking-tight text-slate-900">
          Riwayat Transaksi
        </h1>
        <div>
          <p className="text-muted-foreground mt-1 font-medium text-sm">
            Log aktivitas finansial dan sirkular ekonomi seluruh pengguna TrashFlow.
          </p>
        </div>
      </div>

      {/* 1. Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="border-none shadow-sm rounded-[24px] p-6 bg-slate-900 text-white">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Total Poin Disirkulasi</p>
          <h3 className="text-3xl font-black mt-2">
            {transactions.reduce((sum, t) => sum + (t.category === 'Pickup' ? t.amount : 0), 0).toLocaleString()}
          </h3>
          <p className="text-[10px] mt-2 text-emerald-400 font-bold">↑ 12% dari bulan lalu</p>
        </Card>
        <Card className="border-none shadow-sm rounded-[24px] p-6 bg-white">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Penukaran</p>
          <h3 className="text-3xl font-black mt-2 text-slate-800">
            {transactions.filter(t => t.category === 'Redeem').length}
          </h3>
          <p className="text-[10px] mt-2 text-slate-400 font-bold">Item reward tersalurkan</p>
        </Card>
        <Card className="border-none shadow-sm rounded-[24px] p-6 bg-emerald-500 text-white">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-80">Saldo Top Up</p>
          <h3 className="text-3xl font-black mt-2">
            {transactions.reduce((sum, t) => sum + (t.category === 'Topup' ? t.amount : 0), 0).toLocaleString()}
          </h3>
          <p className="text-[10px] mt-2 opacity-80 font-bold">Akumulasi deposit user</p>
        </Card>
      </div>

      {/* 2. Filter Bar */}
      <Card className="border-none shadow-sm rounded-[24px] bg-white p-3">
        <div className="flex flex-col lg:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Cari ID, Email, atau Agent..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-sm font-bold text-slate-700 outline-none border border-transparent focus:border-emerald-500 transition-all"
            />
          </div>

          <div className="flex p-1 gap-1 overflow-x-auto w-full lg:w-auto">
            {["Semua", "Pickup", "Redeem", "Topup"].map((f) => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black transition-all whitespace-nowrap ${
                  activeFilter === f
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-100"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <Button 
            onClick={fetchTransactions}
            variant="ghost" 
            className="rounded-xl text-slate-400 font-bold text-xs h-11 px-6"
          >
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : "Refresh"}
          </Button>
        </div>
      </Card>

      {/* 3. Transaction Table */}
      <Card className="border-none shadow-sm rounded-[32px] overflow-hidden bg-white">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Transaksi & ID
                  </th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Pihak Terkait
                  </th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Nilai (Poin/Rp)
                  </th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Detail
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto" />
                    </td>
                  </tr>
                ) : filteredTransactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-20 text-center text-slate-400 font-bold text-sm">
                      Tidak ada data ditemukan.
                    </td>
                  </tr>
                ) : (
                  filteredTransactions.map((item) => (
                    <tr
                      key={item.id}
                      className="group hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                            item.category === 'Pickup' ? 'bg-emerald-50 text-emerald-600' : 
                            item.category === 'Redeem' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                          }`}>
                            {item.category === 'Pickup' ? <Building2 size={20} /> : 
                             item.category === 'Redeem' ? <ArrowRightLeft size={20} /> : <Wallet size={20} />}
                          </div>
                          <div>
                            <p className="font-black text-slate-800 text-sm leading-none mb-1.5">
                              {item.type}
                            </p>
                            <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                              ID: {item.code}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <p className="font-bold text-slate-700 text-xs mb-0.5">
                          {item.user}
                        </p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                          {item.date} • {item.entity}
                        </p>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className={`font-black text-base ${item.category === 'Redeem' ? 'text-orange-600' : 'text-emerald-600'}`}>
                            {item.category === 'Redeem' ? '-' : '+'}{item.amount.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-bold text-slate-300 uppercase">
                            {item.method}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <Badge className={`rounded-full px-3 py-1 text-[9px] font-black uppercase border-none ${
                          item.status === 'completed' || item.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 
                          item.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {item.status}
                        </Badge>
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
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

