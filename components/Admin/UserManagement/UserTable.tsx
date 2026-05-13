"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Eye, 
  Plus, 
  Pencil, 
  Trash2, 
  Ban, 
  CheckCircle2,
  Users,
  Store
} from "lucide-react";

const USERS = [
  { id: 1, name: "Budi Santoso", email: "budi@email.com", role: "masyarakat", points: 1250, status: "Aktif", joined: "12 Jan 2026" },
  { id: 2, name: "Siti Rahayu", email: "siti@email.com", role: "masyarakat", points: 3400, status: "Aktif", joined: "15 Jan 2026" },
  { id: 4, name: "Rina Dewi", email: "rina@email.com", role: "agent", points: 5200, status: "Aktif", joined: "02 Feb 2026" },
  { id: 5, name: "Hendra Saputra", email: "hendra@email.com", role: "agent", points: 0, status: "Nonaktif", joined: "10 Feb 2026" },
];

export default function UserTable() {
  const [activeTab, setActiveTab] = useState("masyarakat");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = USERS.filter((user) => {
    const matchesTab = user.role === activeTab;
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 font-sans">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Pengguna</h1>
          <p className="text-slate-500 text-sm font-medium">
            Manajemen data {activeTab} dan otoritas akses sistem.
          </p>
        </div>

        {/* Layout 2 Bar Pilihan (Clean Toggle) */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab("masyarakat")}
            className={`flex-1 md:w-40 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "masyarakat" 
              ? "bg-white text-emerald-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Users size={16} /> Masyarakat
          </button>
          <button
            onClick={() => setActiveTab("agent")}
            className={`flex-1 md:w-40 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "agent" 
              ? "bg-white text-emerald-600 shadow-sm" 
              : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Store size={16} /> Agent
          </button>
        </div>
      </div>

      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-[24px] overflow-hidden bg-white">
        {/* Toolbar */}
        <div className="p-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
            <input
              type="text"
              placeholder={`Cari ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>
          
          <Button className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white gap-2 px-6 py-6 rounded-2xl font-bold transition-transform active:scale-95">
            <Plus size={18} /> Tambah {activeTab}
          </Button>
        </div>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/50">
                  <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Identitas</th>
                  <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Poin</th>
                  <th className="text-left px-8 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Status</th>
                  <th className="px-8 py-4 text-right text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-base">
                          {user.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                          <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="font-black text-slate-700 text-sm">{user.points.toLocaleString()}</span>
                      <span className="ml-1 text-[10px] font-bold text-slate-300 uppercase">Pts</span>
                    </td>
                    <td className="px-8 py-5">
                      <Badge className={`rounded-lg px-2.5 py-1 font-bold text-[10px] uppercase shadow-none border-none ${user.status === "Aktif" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"}`}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-md transition-all">
                          <Pencil size={16} />
                        </Button>
                        
                        {activeTab === "agent" && (
                          <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white hover:text-amber-500 hover:shadow-md transition-all">
                            {user.status === "Aktif" ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                          </Button>
                        )}

                        <Button variant="ghost" size="icon" className="w-9 h-9 rounded-xl hover:bg-white hover:text-rose-600 hover:shadow-md transition-all">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Subtle Footer */}
          <div className="p-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/20">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Menampilkan {filteredUsers.length} data {activeTab}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}