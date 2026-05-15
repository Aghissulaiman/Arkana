    "use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";
import {
  Loader2,
  User,
  Mail,
  Phone,
  MapPin,
  Store,
  Package,
  Edit2,
  Save,
  X,
  CheckCircle,
  AlertCircle,
  Building2,
  Clock,
  Calendar,
} from "lucide-react";
import Image from "next/image";

type AgentProfile = {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  address: string;
  agent_name: string;
  service_area: string;
  waste_categories: string[];
  balance_income: number;
  is_active: boolean;
  avatar_url?: string;
  joined_date: string;
  total_pickups: number;
  total_weight: number;
  total_points_given: number;
  avg_rating: number;
};

const WASTE_LABELS: Record<string, string> = {
  plastic: "Plastik",
  paper: "Kertas",
  cardboard: "Kardus",
  glass: "Kaca",
  aluminium: "Aluminium",
  metal: "Logam",
  electronic: "Elektronik",
  mixed: "Campuran",
};

export default function AgentProfilePage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [editForm, setEditForm] = useState({
    full_name: "",
    phone: "",
    address: "",
    agent_name: "",
    service_area: "",
  });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        router.push("/login");
        return;
      }

      // Ambil avatar dari Google (user_metadata)
      const userAvatar = user.user_metadata?.avatar_url || user.user_metadata?.picture;
      setAvatarUrl(userAvatar || null);

      // Ambil data dari tabel users
      const { data: userData } = await supabase
        .from("users")
        .select("role, created_at")
        .eq("id", user.id)
        .single();

      // Ambil data dari tabel profiles
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Ambil data dari tabel agents
      const { data: agentData } = await supabase
        .from("agents")
        .select("*")
        .eq("user_id", user.id)
        .single();

      // Ambil statistik penjemputan
      const { data: pickups } = await supabase
        .from("pickup_requests")
        .select("estimated_weight, total_points, status")
        .eq("agent_id", agentData?.id);

      const completedPickups = pickups?.filter(p => p.status === "completed") || [];
      const totalWeight = completedPickups.reduce((sum, p) => sum + (p.estimated_weight || 0), 0);
      const totalPoints = completedPickups.reduce((sum, p) => sum + (p.total_points || 0), 0);

      setProfile({
        id: user.id,
        email: user.email || "",
        full_name: profileData?.full_name || user.user_metadata?.full_name || "",
        phone: profileData?.phone || "",
        address: profileData?.address || "",
        agent_name: agentData?.agent_name || "",
        service_area: agentData?.service_area || "",
        waste_categories: agentData?.waste_categories || [],
        balance_income: agentData?.balance_income || 0,
        is_active: agentData?.is_active || false,
        joined_date: userData?.created_at ? new Date(userData.created_at).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) : "-",
        total_pickups: completedPickups.length,
        total_weight: totalWeight,
        total_points_given: totalPoints,
        avg_rating: agentData?.avg_rating || 0,
      });

      setEditForm({
        full_name: profileData?.full_name || user.user_metadata?.full_name || "",
        phone: profileData?.phone || "",
        address: profileData?.address || "",
        agent_name: agentData?.agent_name || "",
        service_area: agentData?.service_area || "",
      });

    } catch (error) {
      console.error("Error fetching profile:", error);
      toast.error("Gagal memuat profil");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          full_name: editForm.full_name,
          phone: editForm.phone,
          address: editForm.address,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Update agents
      const { error: agentError } = await supabase
        .from("agents")
        .update({
          agent_name: editForm.agent_name,
          service_area: editForm.service_area,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (agentError) throw agentError;

      toast.success("Profil berhasil diperbarui!");
      setIsEditing(false);
      await fetchProfile();
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Gagal menyimpan profil");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <p className="text-gray-500">Gagal memuat profil</p>
        <button
          onClick={() => router.push("/agent/dashboard")}
          className="px-4 py-2 bg-primary text-white rounded-lg"
        >
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Profil Agent</h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola informasi profil dan data agen Anda
            </p>
          </div>
          <div className="flex gap-2">
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
                Edit Profil
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    if (profile) {
                      setEditForm({
                        full_name: profile.full_name,
                        phone: profile.phone,
                        address: profile.address,
                        agent_name: profile.agent_name,
                        service_area: profile.service_area,
                      });
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Simpan
                </button>
              </>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Avatar & Basic Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 text-center shadow-sm">
              {/* Avatar */}
              <div className="relative mx-auto w-28 h-28 mb-4">
                {avatarUrl ? (
                  <Image
                    src={avatarUrl}
                    alt={profile.full_name || "Avatar"}
                    fill
                    className="rounded-full object-cover border-4 border-primary/20"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-primary/10 flex items-center justify-center mx-auto border-4 border-primary/20">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                )}
                <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1 border-2 border-white">
                  <CheckCircle className="w-3 h-3 text-white" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-800">{profile.full_name || profile.agent_name}</h2>
              <p className="text-sm text-gray-500">{profile.email}</p>
              
              <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-green-100 rounded-full">
                <CheckCircle className="w-3 h-3 text-green-600" />
                <span className="text-xs font-medium text-green-700">
                  {profile.is_active ? "Agent Aktif" : "Agent Nonaktif"}
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">Bergabung sejak</span>
                  <span className="font-medium">{profile.joined_date}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-500">Rating</span>
                  <span className="font-medium text-amber-600">
                    {profile.avg_rating > 0 ? `${profile.avg_rating.toFixed(1)} ★` : "Belum ada rating"}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-primary" />
                Statistik Penjemputan
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Total Penjemputan</span>
                  <span className="font-bold text-gray-800">{profile.total_pickups}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Total Berat Sampah</span>
                  <span className="font-bold text-gray-800">{profile.total_weight.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Total Poin Diberikan</span>
                  <span className="font-bold text-primary">{profile.total_points_given.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Contact Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Informasi Kontak
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Email</p>
                    <p className="font-medium">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Nomor Telepon</p>
                    {!isEditing ? (
                      <p className="font-medium">{profile.phone || "Belum diisi"}</p>
                    ) : (
                      <input
                        type="tel"
                        value={editForm.phone}
                        onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="08123456789"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Alamat</p>
                    {!isEditing ? (
                      <p className="font-medium">{profile.address || "Belum diisi"}</p>
                    ) : (
                      <textarea
                        value={editForm.address}
                        onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        rows={2}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Jl. Contoh No. 123"
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Agent Info */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Store className="w-5 h-5 text-primary" />
                Informasi Agen
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Building2 className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Nama Agen</p>
                    {!isEditing ? (
                      <p className="font-medium">{profile.agent_name || "Belum diisi"}</p>
                    ) : (
                      <input
                        type="text"
                        value={editForm.agent_name}
                        onChange={(e) => setEditForm({ ...editForm, agent_name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Nama Agen"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Wilayah Layanan</p>
                    {!isEditing ? (
                      <p className="font-medium">{profile.service_area || "Belum diisi"}</p>
                    ) : (
                      <input
                        type="text"
                        value={editForm.service_area}
                        onChange={(e) => setEditForm({ ...editForm, service_area: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder="Contoh: Depok, Jakarta Selatan"
                      />
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Package className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-400">Jenis Sampah Diterima</p>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {profile.waste_categories.map((w) => (
                        <span
                          key={w}
                          className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium"
                        >
                          {WASTE_LABELS[w] || w}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Income Info */}
            <div className="bg-gradient-to-r from-primary/5 to-primary/10 rounded-2xl p-5 border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-primary/70">Total Pendapatan</p>
                  <p className="text-2xl font-bold text-primary">
                    Rp {profile.balance_income.toLocaleString("id-ID")}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-primary" />
                </div>
              </div>
              <p className="text-[10px] text-primary/60 mt-2">
                *Pendapatan dari komisi setiap penjemputan
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Wallet icon component
function Wallet(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  );
}