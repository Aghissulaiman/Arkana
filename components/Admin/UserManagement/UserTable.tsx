"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  UserCheck,
  UserX,
  Eye,
  ShieldCheck,
  Plus,
} from "lucide-react";

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

  const filteredUsers = USERS.filter((user) =>
    activeTab === "masyarakat"
      ? user.role === "Masyarakat"
      : user.role === "Petugas",
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6 p-4 md:p-0">
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
        <Button className="bg-emerald-600 hover:bg-emerald-700 shadow-sm shadow-emerald-100 gap-2">
          <Plus className="w-4 h-4" /> Tambah{" "}
          {activeTab === "masyarakat" ? "User" : "Petugas"}
        </Button>
      </div>

      <Tabs
        defaultValue="masyarakat"
        onValueChange={setActiveTab}
        className="w-full space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TabsList className="grid grid-cols-2 w-full sm:w-[400px] h-11 bg-slate-100 p-1">
            <TabsTrigger
              value="masyarakat"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
            >
              Masyarakat
            </TabsTrigger>
            <TabsTrigger
              value="petugas"
              className="gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm font-semibold"
            >
              Petugas
            </TabsTrigger>
          </TabsList>

          <div className="flex gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Cari nama atau email..."
                className="pl-9 h-10 border-slate-200"
              />
            </div>
          </div>
        </div>

        <TabsContent value={activeTab} className="mt-0 focus-visible:ring-0">
          <Card className="border-slate-200 shadow-sm overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-slate-50/50">
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Identitas
                      </th>
                      {activeTab === "masyarakat" && (
                        <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Tabungan Poin
                        </th>
                      )}
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Tanggal Bergabung
                      </th>
                      <th className="px-6 py-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="group hover:bg-slate-50/50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold border-2 ${
                                activeTab === "masyarakat"
                                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                                  : "bg-blue-50 text-blue-600 border-blue-100"
                              }`}
                            >
                              {user.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold text-slate-800 truncate">
                                {user.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {user.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        {activeTab === "masyarakat" && (
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-emerald-600 text-base">
                                {user.points.toLocaleString()}
                              </span>
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                                Poin
                              </span>
                            </div>
                          </td>
                        )}
                        <td className="px-6 py-4">
                          <Badge
                            variant="secondary"
                            className={`rounded-md px-2 py-0.5 font-bold border-none ${
                              user.status === "Aktif"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-500"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full mr-2 ${user.status === "Aktif" ? "bg-emerald-500" : "bg-slate-400"}`}
                            />
                            {user.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-500 font-medium">
                          {user.joined}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 hover:text-emerald-600 hover:bg-emerald-50"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 hover:text-blue-600 hover:bg-blue-50"
                            >
                              <UserCheck className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="w-8 h-8 hover:text-rose-600 hover:bg-rose-50"
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

              {/* Pagination Section */}
              <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs font-medium text-slate-500 italic">
                  Menampilkan {filteredUsers.length} dari total data {activeTab}
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 border-slate-200 font-semibold text-xs"
                  >
                    Sebelumnya
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9 px-4 border-slate-200 font-semibold text-xs text-emerald-600"
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
