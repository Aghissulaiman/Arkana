"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, UserCheck, UserX, Eye, Plus, Filter } from "lucide-react";

// Data USERS tetap sama...
const USERS = [
  {
    id: 1,
    name: "Budi Santoso",
    email: "budi@email.com",
    role: "Masyarakat",
    points: 1250,
    status: "Aktif",
    joined: "12 Jan 2026",
  },
  {
    id: 2,
    name: "Siti Rahayu",
    email: "siti@email.com",
    role: "Masyarakat",
    points: 3400,
    status: "Aktif",
    joined: "15 Jan 2026",
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    email: "ahmad@admin.com",
    role: "Petugas",
    points: 0,
    status: "Aktif",
    joined: "20 Jan 2026",
  },
  {
    id: 4,
    name: "Rina Dewi",
    email: "rina@email.com",
    role: "Masyarakat",
    points: 5200,
    status: "Aktif",
    joined: "02 Feb 2026",
  },
  {
    id: 5,
    name: "Hendra Saputra",
    email: "hendra@admin.com",
    role: "Petugas",
    points: 0,
    status: "Nonaktif",
    joined: "10 Feb 2026",
  },
];

export default function UserTable() {
  const [activeTab, setActiveTab] = useState("masyarakat");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = USERS.filter((user) =>
    activeTab === "masyarakat"
      ? user.role === "Masyarakat"
      : user.role === "Petugas",
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-0 font-sans">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Manajemen User
          </h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Kelola akses dan data pengguna sistem Arkana.
          </p>
        </div>
        <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-100 gap-2 px-5 py-5 rounded-xl font-bold transition-all active:scale-95">
          <Plus className="w-5 h-5" /> Tambah{" "}
          {activeTab === "masyarakat" ? "User" : "Petugas"}
        </Button>
      </div>

      <Tabs
        defaultValue="masyarakat"
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <TabsList className="grid grid-cols-2 w-full sm:w-[350px] h-12 bg-slate-100  rounded-xl">
          <TabsTrigger
            value="masyarakat"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-slate-600"
          >
            Masyarakat
          </TabsTrigger>
          <TabsTrigger
            value="petugas"
            className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm font-bold text-slate-600"
          >
            Petugas
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-0 focus-visible:ring-0">
          <Card className="border-slate-200 shadow-sm rounded-2xl overflow-hidden bg-white">
            {/* Search & Filter Bar */}
            <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-50/30">
              <div className="relative w-full md:w-96 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5 group-focus-within:text-emerald-500 transition-colors" />
                <input
                  type="text"
                  placeholder={`Cari nama atau email ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm 
                             placeholder:text-slate-400 outline-none transition-all
                             hover:border-slate-300 hover:shadow-sm
                             focus:border-emerald-500 focus:ring-4 focus:bg-white"
                />
              </div>
            </div>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Identitas
                      </th>
                      {activeTab === "masyarakat" && (
                        <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                          Tabungan Poin
                        </th>
                      )}
                      <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Bergabung
                      </th>
                      <th className="px-6 py-4 text-right text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="group hover:bg-slate-50/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                                activeTab === "masyarakat"
                                  ? "bg-emerald-50 text-emerald-600"
                                  : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              {user.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 text-sm">
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-400 font-medium">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        {activeTab === "masyarakat" && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1">
                              <span className="font-bold text-slate-700 text-sm">
                                {user.points.toLocaleString()}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase">
                                Pts
                              </span>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <Badge
                            variant="secondary"
                            className={`rounded-lg px-2.5 py-1 font-bold text-[10px] uppercase tracking-tighter border-none ${
                              user.status === "Aktif"
                                ? "bg-emerald-50 text-emerald-600"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-semibold text-xs">
                          {user.joined}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-9 h-9 rounded-lg hover:bg-white hover:text-emerald-600 shadow-none hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-9 h-9 rounded-lg hover:bg-white hover:text-blue-600 shadow-none hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-9 h-9 rounded-lg hover:bg-white hover:text-rose-600 shadow-none hover:shadow-sm border border-transparent hover:border-slate-100 transition-all"
                            >
                              <UserX className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="px-6 py-5 my-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50/30">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Total: {filteredUsers.length} {activeTab}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 rounded-xl border-slate-200 bg-white font-bold text-xs hover:bg-slate-50 transition-all"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 rounded-xl border-emerald-100 bg-white font-bold text-xs text-emerald-600 hover:bg-emerald-50 transition-all"
                  >
                    Berikutnya
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
