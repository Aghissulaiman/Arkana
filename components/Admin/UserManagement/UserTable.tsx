"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  Store,
  Loader2,
  RefreshCw,
  Filter
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  status: string;
  joined: string;
  phone?: string;
};

export default function UserTable() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [activeTab, setActiveTab] = useState("user");
  const [statusFilter, setStatusFilter] = useState("semua");
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    checkAdminAndFetch();
  }, [activeTab]);

  const checkAdminAndFetch = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role !== "admin") {
      router.push("/user/home");
      return;
    }

    setIsAdmin(true);
    await fetchUsers();
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: usersData, error: usersError } = await supabase
        .from("users")
        .select("id, email, role, created_at")
        .eq("role", activeTab)
        .order("created_at", { ascending: false });

      if (usersError) throw usersError;

      const userIds = usersData?.map(u => u.id) || [];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone, balance_points")
        .in("user_id", userIds);

      const profileMap = new Map();
      profilesData?.forEach(p => {
        profileMap.set(p.user_id, {
          name: p.full_name,
          phone: p.phone,
          points: p.balance_points,
        });
      });

      let agentStatusMap = new Map();
      if (activeTab === "agent") {
        const { data: agentsData } = await supabase
          .from("agents")
          .select("user_id, is_active")
          .in("user_id", userIds);
        
        agentsData?.forEach(a => {
          agentStatusMap.set(a.user_id, a.is_active);
        });
      }

      const formattedUsers: User[] = (usersData || []).map(u => {
        const profile = profileMap.get(u.id);
        const isActive = activeTab === "agent" 
          ? (agentStatusMap.get(u.id) === true ? "Aktif" : "Nonaktif")
          : "Aktif";

        return {
          id: u.id,
          name: profile?.name || u.email.split("@")[0],
          email: u.email,
          role: u.role,
          points: profile?.points || 0,
          status: isActive,
          joined: new Date(u.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
          phone: profile?.phone,
        };
      });

      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Gagal memuat data pengguna");
    } finally {
      setLoading(false);
    }
  };

  const toggleAgentStatus = async (user: User) => {
    if (activeTab !== "agent") return;

    const newStatus = user.status === "Aktif" ? false : true;
    
    const { error } = await supabase
      .from("agents")
      .update({ is_active: newStatus })
      .eq("user_id", user.id);

    if (error) {
      toast.error("Gagal mengubah status agent");
    } else {
      toast.success(`Status agent ${user.name} berhasil diubah`);
      await fetchUsers();
    }
  };

  const deleteUser = async (user: User) => {
    if (!confirm(`Yakin ingin menghapus user ${user.name}?`)) return;

    const { error } = await supabase
      .from("users")
      .delete()
      .eq("id", user.id);

    if (error) {
      toast.error("Gagal menghapus user");
    } else {
      toast.success("User berhasil dihapus");
      await fetchUsers();
    }
  };

  // Filter berdasarkan status
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "semua" || 
                          (statusFilter === "aktif" && user.status === "Aktif") ||
                          (statusFilter === "nonaktif" && user.status === "Nonaktif");
    
    return matchesSearch && matchesStatus;
  });

  const getStatusCount = () => {
    const aktif = users.filter(u => u.status === "Aktif").length;
    const nonaktif = users.filter(u => u.status === "Nonaktif").length;
    return { aktif, nonaktif };
  };

  const statusCount = getStatusCount();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-6 font-sans">
      <Toaster position="top-right" richColors />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Pengguna</h1>
          <p className="text-slate-500 text-sm font-medium">
            Manajemen data {activeTab === "user" ? "masyarakat" : "agent"} dan otoritas akses sistem.
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
          <button
            onClick={() => setActiveTab("user")}
            className={`flex-1 md:w-40 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === "user" 
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
        <div className="p-6 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
              <input
                type="text"
                placeholder={`Cari ${activeTab === "user" ? "masyarakat" : "agent"}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                variant="outline"
                onClick={() => setShowFilter(!showFilter)}
                className={`gap-2 px-6 py-6 rounded-2xl font-bold ${
                  statusFilter !== "semua" ? "bg-emerald-50 text-emerald-600 border-emerald-200" : ""
                }`}
              >
                <Filter size={18} /> Filter
              </Button>
              <Button 
                variant="outline"
                onClick={fetchUsers}
                className="gap-2 px-6 py-6 rounded-2xl font-bold"
              >
                <RefreshCw size={18} /> Refresh
              </Button>
              <Button 
                className="bg-slate-900 hover:bg-slate-800 text-white gap-2 px-6 py-6 rounded-2xl font-bold transition-transform active:scale-95"
                onClick={() => router.push("/admin/users/add")}
              >
                <Plus size={18} /> Tambah
              </Button>
            </div>
          </div>

          {/* Filter Dropdown */}
          {showFilter && (
            <div className="flex flex-wrap gap-2 p-4 bg-slate-50 rounded-2xl">
              <button
                onClick={() => setStatusFilter("semua")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === "semua"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                Semua ({users.length})
              </button>
              <button
                onClick={() => setStatusFilter("aktif")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === "aktif"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                Aktif ({statusCount.aktif})
              </button>
              <button
                onClick={() => setStatusFilter("nonaktif")}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  statusFilter === "nonaktif"
                    ? "bg-emerald-600 text-white"
                    : "bg-white text-slate-600 hover:bg-slate-100"
                }`}
              >
                Nonaktif ({statusCount.nonaktif})
              </button>
            </div>
          )}
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
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-12 text-center text-slate-400">
                      Tidak ada data {activeTab === "user" ? "masyarakat" : "agent"} 
                      {statusFilter !== "semua" && ` dengan status ${statusFilter}`}
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-base">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 text-sm">{user.name}</p>
                            <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                            {user.phone && (
                              <p className="text-[10px] text-slate-400 mt-0.5">📞 {user.phone}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-black text-slate-700 text-sm">{user.points.toLocaleString()}</span>
                        <span className="ml-1 text-[10px] font-bold text-slate-300 uppercase">Pts</span>
                      </td>
                      <td className="px-8 py-5">
                        <Badge className={`rounded-lg px-2.5 py-1 font-bold text-[10px] uppercase shadow-none border-none ${
                          user.status === "Aktif" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                        }`}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1 justify-end">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-9 h-9 rounded-xl hover:bg-white hover:text-blue-600 hover:shadow-md transition-all"
                            onClick={() => router.push(`/admin/users/${user.id}`)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-9 h-9 rounded-xl hover:bg-white hover:text-amber-600 hover:shadow-md transition-all"
                            onClick={() => router.push(`/admin/users/${user.id}/edit`)}
                          >
                            <Pencil size={16} />
                          </Button>
                          
                          {activeTab === "agent" && (
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className={`w-9 h-9 rounded-xl hover:shadow-md transition-all ${
                                user.status === "Aktif" 
                                  ? "hover:text-amber-500 hover:bg-white" 
                                  : "hover:text-emerald-500 hover:bg-white"
                              }`}
                              onClick={() => toggleAgentStatus(user)}
                            >
                              {user.status === "Aktif" ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                            </Button>
                          )}

                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="w-9 h-9 rounded-xl hover:bg-white hover:text-rose-600 hover:shadow-md transition-all"
                            onClick={() => deleteUser(user)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer */}
          <div className="p-6 border-t border-slate-50 flex justify-between items-center bg-slate-50/20">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Menampilkan {filteredUsers.length} dari {users.length} data {activeTab === "user" ? "masyarakat" : "agent"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}