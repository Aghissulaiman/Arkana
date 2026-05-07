"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  MoreVertical,
  UserCheck,
  UserX,
  Eye,
} from "lucide-react";

const USERS = [
  { id: 1, name: "Budi Santoso", email: "budi@email.com", phone: "0812-xxxx-1234", points: 1250, status: "Aktif", joined: "12 Jan 2026" },
  { id: 2, name: "Siti Rahayu", email: "siti@email.com", phone: "0813-xxxx-5678", points: 3400, status: "Aktif", joined: "15 Jan 2026" },
  { id: 3, name: "Ahmad Fauzi", email: "ahmad@email.com", phone: "0821-xxxx-9012", points: 800, status: "Nonaktif", joined: "20 Jan 2026" },
  { id: 4, name: "Rina Dewi", email: "rina@email.com", phone: "0856-xxxx-3456", points: 5200, status: "Aktif", joined: "02 Feb 2026" },
  { id: 5, name: "Hendra Saputra", email: "hendra@email.com", phone: "0878-xxxx-7890", points: 950, status: "Aktif", joined: "10 Feb 2026" },
];

export default function UserTable() {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Manajemen User</h1>
          <p className="text-sm text-muted-foreground">Kelola semua pengguna yang terdaftar di sistem</p>
        </div>
        <Button size="sm">Tambah User</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Cari nama, email..." className="pl-9 h-9" />
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="w-4 h-4" /> Filter
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/30">
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">User</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Telepon</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Poin</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Status</th>
                  <th className="text-left px-4 py-3 text-xs text-muted-foreground font-medium">Bergabung</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {USERS.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/20 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-primary">{user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{user.phone}</td>
                    <td className="px-4 py-3 font-semibold text-primary">{user.points.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <Badge
                        variant="outline"
                        className={
                          user.status === "Aktif"
                            ? "border-green-200 bg-green-50 text-green-600"
                            : "border-gray-200 bg-gray-50 text-gray-500"
                        }
                      >
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">{user.joined}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="w-7 h-7">
                          <Eye className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-primary">
                          <UserCheck className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-7 h-7 text-red-500">
                          <UserX className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 border-t flex items-center justify-between text-xs text-muted-foreground">
            <span>Menampilkan 5 dari 1.284 user</span>
            <div className="flex gap-1">
              <Button variant="outline" size="sm" className="h-7 text-xs">Sebelumnya</Button>
              <Button variant="outline" size="sm" className="h-7 text-xs">Berikutnya</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
