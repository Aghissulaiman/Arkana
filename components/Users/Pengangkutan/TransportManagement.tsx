"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { 
  Loader2, 
  Coins, 
  Package, 
  Ticket, 
  DollarSign, 
  Heart,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  ShoppingBag
} from "lucide-react";
import Link from "next/link";
import { Toaster, toast } from "sonner";

type Reward = {
  id: string;
  name: string;
  description: string;
  category: string;
  points_required: number;
  cash_value: number;
  stock: number;
  image_url: string;
  is_active: boolean;
  created_at: string;
};

export default function RewardDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supabase = createClientSupabaseClient();
  const queryAgentId = searchParams.get("agentId");
  const [loading, setLoading] = useState(true);
  const [userPoints, setUserPoints] = useState(0);
  const [redeeming, setRedeeming] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // 1. Ambil user yang login dari AUTH
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("User not logged in");
        router.push("/login");
        return;
      }
      setUserId(user.id);
      console.log("✅ User ID:", user.id);

      // 2. Ambil data profiles (nama & alamat)
      const { data: userData, error: userDetailsError } = await supabase
        .from("profiles")
        .select("full_name, address")
        .eq("user_id", user.id)
        .maybeSingle();

      if (userDetailsError) {
        console.error("Error fetching user details:", userDetailsError);
      }

      if (userData) {
        setUserName(userData.full_name || "");
        setUserAddress(userData.address || "");
        console.log("✅ User address:", userData.address);
      } else {
        console.log("⚠️ User details not found, please update profile");
      }

      // 3. Ambil data price_catalog (jenis sampah)
      const { data: priceData, error: priceError } = await supabase
        .from("price_catalog")
        .select("waste_type, price_per_kg")
        .order("price_per_kg", { ascending: false });

      if (priceError) {
        console.error("Error fetching price catalog:", priceError);
      }

      if (priceData && priceData.length > 0) {
        const types = priceData.map((item) => ({
          id: item.waste_type,
          name: getWasteTypeName(item.waste_type),
          unit: "kg",
          price_per_kg: item.price_per_kg,
        }));
        setWasteTypes(types);
        console.log("✅ Waste types loaded:", types.length);
      }

      // 4. Ambil semua AGENT dari agent_details (LANGSUNG, tanpa join)
      const { data: agentsData, error: agentsError } = await supabase
        .from("agent_details")
        .select("*");

      if (agentsError) {
        console.warn("Table agent_details missing or error:", agentsError);
      }

      // Gunakan mock data jika gagal ambil dari DB agar fitur tetap berjalan
      const MOCK_AGENTS: Agent[] = [
        { id: "1", user_id: "user-agent-1", name: "Hijau Bersama", phone: "08123456789", address: "Jl. Margonda Raya No. 1", waste_types: ["Organik", "Plastik", "Kertas", "Campuran"] },
        { id: "2", user_id: "user-agent-2", name: "EcoPoint Beji", phone: "08234567890", address: "Jl. Arif Rahman Hakim", waste_types: ["Elektronik", "Logam"] },
        { id: "3", user_id: "user-agent-3", name: "Kertas Mas Jaya", phone: "08345678901", address: "Jl. Nusantara Raya", waste_types: ["Kertas", "Kardus"] },
        { id: "4", user_id: "user-agent-4", name: "Plastik Lestari", phone: "08456789012", address: "Jl. Raya Sawangan", waste_types: ["Plastik", "PET"] },
        { id: "5", user_id: "user-agent-5", name: "ReTech Daur Ulang", phone: "08567890123", address: "Jl. Siliwangi", waste_types: ["Elektronik", "Baterai"] },
      ];

      if (agentsData && agentsData.length > 0) {
        const formattedAgents = agentsData.map((agent) => ({
          id: String(agent.id),
          user_id: String(agent.user_id),
          name: agent.name,
          phone: agent.phone || "-",
          address: agent.address || "-",
        }));
        setAgents(formattedAgents);
        console.log("✅ Agents loaded from DB:", formattedAgents.length);
      } else {
        console.warn("⚠️ No agents found in DB, using MOCK_AGENTS");
        setAgents(MOCK_AGENTS);
      }

    } catch (error) {
      console.error("❌ Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getWasteTypeName = (type: string): string => {
    const names: Record<string, string> = {
      plastic: "Plastik",
      cardboard: "Kardus",
      glass: "Kaca",
      aluminium: "Aluminium",
      paper: "Kertas",
      metal: "Logam",
      electronic: "Elektronik",
      mixed: "Campuran",
    };
    return names[type] || type;
  };

  const handleAgentSelect = (agentId: string, agentUserId: string) => {
    setSelectedAgentId(agentId);
    setSelectedAgentUserId(agentUserId);
    setFormData((prev) => ({ ...prev, agentId: agentId }));
  };

  const handleChange = (field: keyof PickupFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const selectedAgent = agents.find(a => a.id === selectedAgentId);
  const availableWasteTypes = wasteTypes.filter(type => {
    if (!selectedAgent || !selectedAgent.waste_types) return true;
    return selectedAgent.waste_types.some(w =>
      type.name.toLowerCase().includes(w.toLowerCase()) ||
      w.toLowerCase().includes(type.name.toLowerCase())
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validasi
    if (!userId) {
      alert("User tidak ditemukan. Silakan login ulang.");
      router.push("/login");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("balance_points")
      .eq("user_id", user.id)
      .single();

    setUserPoints(profile?.balance_points || 0);

    // Ambil detail reward
    const { data: rewardData, error } = await supabase
      .from("rewards")
      .select("*")
      .eq("id", params.id)
      .single();

    if (error || !rewardData) {
      toast.error("Reward tidak ditemukan");
      router.push("/user/redeem");
      return;
    }

    setReward(rewardData);
    setLoading(false);
  };

  const handleRedeem = async () => {
    if (!reward) return;
    
    if (userPoints < reward.points_required) {
      toast.error(`Poin tidak cukup! Butuh ${reward.points_required.toLocaleString()} poin`);
      return;
    }

    setShowConfirm(true);
  };

  const confirmRedeem = async () => {
    if (!reward) return;
    
    setRedeeming(true);
    
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data, error } = await supabase.rpc("redeem_points", {
      p_user_id: user?.id,
      p_points_spent: reward.points_required,
      p_reward_id: reward.id,
      p_reward_name: reward.name,
    });

    if (error) {
      toast.error("Gagal: " + error.message);
    } else if (data?.success) {
      toast.success("Berhasil menukar poin!");
      await fetchData();
      router.push("/user/redeem/history");
    } else {
      toast.error(data?.message || "Gagal menukar poin");
    }
    
    setRedeeming(false);
    setShowConfirm(false);
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "product": return <Package className="w-5 h-5" />;
      case "voucher": return <Ticket className="w-5 h-5" />;
      case "cash": return <DollarSign className="w-5 h-5" />;
      case "donation": return <Heart className="w-5 h-5" />;
      default: return <Package className="w-5 h-5" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch(category) {
      case "product": return "Produk";
      case "voucher": return "Voucher";
      case "cash": return "Tarik Tunai";
      case "donation": return "Donasi";
      default: return category;
    }
  };

  const getCategoryColor = (category: string) => {
    switch(category) {
      case "product": return "bg-blue-100 text-blue-700";
      case "voucher": return "bg-purple-100 text-purple-700";
      case "cash": return "bg-green-100 text-green-700";
      case "donation": return "bg-rose-100 text-rose-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const isEnough = reward ? userPoints >= reward.points_required : false;
  const isOutOfStock = reward?.category === "product" && (reward?.stock || 0) <= 0;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!reward) {
    return (
<<<<<<< HEAD
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-20"
      >
        <Card className="p-10 text-center rounded-[2rem] border-border shadow-xl shadow-primary/10 bg-card">
          <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6 relative">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </motion.div>
            <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-ping" />
          </div>
          <h3 className="text-2xl font-extrabold text-foreground mb-3">
            Hore! Permintaan Berhasil
          </h3>
          <p className="text-muted-foreground mb-8">
            Mitra kami akan segera memproses penjemputan sampah Anda sesuai jadwal.
          </p>
          <Button
            className="w-full h-14 rounded-2xl text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground transition-all"
            onClick={() => router.push("/user/home")}
          >
            Kembali ke Beranda
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
<<<<<<< HEAD
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-5 shadow-sm transform -rotate-6">
          <Truck className="w-8 h-8 text-primary transform rotate-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight mb-3">
          Ajukan Penjemputan <span className="text-primary">Sampah</span>
        </h1>
        <p className="text-muted-foreground max-w-lg mx-auto text-lg">
          Pilah sampahmu, pilih agen terdekat, dan kami akan datang menjemput.
        </p>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Lokasi & Agen */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6 sm:p-8 rounded-[2rem] border-border/50 shadow-xl shadow-border/50 bg-card/80 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <MapPin className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Lokasi & Agen</h2>
                <p className="text-sm text-muted-foreground">Tentukan alamat dan agen tujuan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Lokasi */}
              <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 relative group overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
                <label className="text-sm font-semibold text-muted-foreground block mb-3 flex items-center gap-2">
                  Alamat Penjemputan
                </label>
                <div className="text-foreground font-medium leading-relaxed min-h-[3rem]">
                  {userAddress || "Alamat belum diatur"}
                </div>
                <button type="button" onClick={() => router.push("/user/profile")} className="mt-3 text-sm text-primary font-bold hover:text-primary/80 hover:underline inline-flex items-center gap-1.5 transition-colors">
                  <Map className="w-4 h-4" /> Ubah alamat di profil
                </button>
              </div>

              {/* Agen */}
              <div className="bg-muted/30 p-5 rounded-2xl border border-border/50 relative group overflow-hidden flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
                <label className="text-sm font-semibold text-muted-foreground block mb-3 flex items-center gap-2">
                  Agen Penjemput
                </label>
                <div className="text-foreground font-medium leading-relaxed">
                  {selectedAgent ? (
                    <div>
                      <p className="font-bold text-lg">{selectedAgent.name}</p>
                      <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selectedAgent.phone}</p>
                      <p className="text-sm text-muted-foreground mt-0.5 flex items-start gap-1"><MapPin className="w-3.5 h-3.5 mt-0.5" /> {selectedAgent.address}</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      <span className="text-destructive font-semibold">Agen belum dipilih</span>
                      <br />
                      <button type="button" onClick={() => router.push("/user/home")} className="mt-2 text-sm text-primary font-bold hover:text-primary/80 hover:underline">
                        Pilih Agen dari Dashboard
                      </button>
                    </div>
                  )}
                </div>
                {selectedAgentId && (
                  <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-primary mt-3 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Agen tersedia dan dipilih
                  </motion.p>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Section 2: Detail Sampah */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6 sm:p-8 rounded-[2rem] border-border/50 shadow-xl shadow-border/50 bg-card/80 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Package className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Detail Sampah</h2>
                <p className="text-sm text-muted-foreground">Informasi sampah yang akan dijemput</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Jenis Sampah */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground block mb-3 flex items-center gap-2">Jenis Sampah</label>
                <div className="relative">
                  <select
                    required
                    value={formData.wasteType}
                    onChange={(e) => handleChange("wasteType", e.target.value)}
                    className="w-full pl-5 pr-12 py-4 text-base font-medium rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none shadow-sm transition-all cursor-pointer hover:border-primary/50"
                  >
                    <option value="">-- Pilih Jenis --</option>
                    {availableWasteTypes.map((type) => (
                      <option key={type.id} value={type.id}>
                        {type.name} - {type.price_per_kg.toLocaleString("id-ID")} poin/kg
                      </option>
                    ))}
                    {availableWasteTypes.length === 0 && selectedAgent && (
                      <option value="" disabled>Agen ini tidak menerima jenis sampah dari katalog</option>
                    )}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none bg-background pl-2">
                    <Leaf className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>

              {/* Estimasi Berat */}
              <div>
                <label className="text-sm font-semibold text-muted-foreground block mb-3 flex items-center gap-2">Estimasi Berat</label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="0.0"
                    value={formData.estimatedWeight}
                    onChange={(e) => handleChange("estimatedWeight", e.target.value)}
                    className="w-full pl-5 pr-16 py-4 text-base font-medium rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm transition-all hover:border-primary/50"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground font-bold bg-muted px-3 py-1.5 rounded-xl">
                    kg
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Section 3: Jadwal & Catatan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6 sm:p-8 rounded-[2rem] border-border/50 shadow-xl shadow-border/50 bg-card/80 backdrop-blur-xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">Jadwal & Catatan</h2>
                <p className="text-sm text-muted-foreground">Tentukan waktu penjemputan</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="text-sm font-semibold text-muted-foreground block mb-3">Tanggal Penjemputan</label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    min={getMinDate()}
                    value={formData.pickupDate}
                    onChange={(e) => handleChange("pickupDate", e.target.value)}
                    className="w-full px-5 py-4 text-base font-medium rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm transition-all appearance-none cursor-text hover:border-primary/50"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold text-muted-foreground block mb-3">Waktu Penjemputan</label>
                <div className="relative">
                  <select
                    required
                    value={formData.pickupTime}
                    onChange={(e) => handleChange("pickupTime", e.target.value)}
                    className="w-full pl-5 pr-12 py-4 text-base font-medium rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary appearance-none shadow-sm transition-all cursor-pointer hover:border-primary/50"
                  >
                    <option value="">-- Pilih Jam --</option>
                    <option value="08:00 - 10:00">08:00 - 10:00</option>
                    <option value="10:00 - 12:00">10:00 - 12:00</option>
                    <option value="12:00 - 14:00">12:00 - 14:00</option>
                    <option value="14:00 - 16:00">14:00 - 16:00</option>
                    <option value="16:00 - 18:00">16:00 - 18:00</option>
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none bg-background pl-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-muted-foreground block mb-3 flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-muted-foreground" /> Catatan Tambahan (Opsional)
              </label>
              <textarea
                rows={3}
                placeholder="Contoh: Tolong hubungi nomor saya jika sudah di depan rumah atau sampah sudah dipisahkan dalam kardus..."
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="w-full px-5 py-4 text-base font-medium rounded-2xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary shadow-sm transition-all resize-none hover:border-primary/50"
              />
            </div>
          </Card>
        </motion.div>

        {/* Submit */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Button
            type="submit"
            disabled={isSubmitting || !userAddress || !selectedAgentId || agents.length === 0}
            className="w-full py-8 rounded-2xl text-lg font-extrabold shadow-xl shadow-primary/25 bg-primary hover:bg-primary/90 text-primary-foreground transition-all gap-3 hover:-translate-y-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Memproses Permintaan...
              </>
            ) : (
              <>
                <Send className="w-6 h-6" />
                Kirim Permintaan Penjemputan
              </>
            )}
          </Button>

          {!userAddress && (
            <p className="text-sm text-destructive text-center mt-5 font-bold flex items-center justify-center gap-2 bg-destructive/10 py-3 rounded-xl">
              <MapPin className="w-4 h-4" />
              Silakan lengkapi alamat di halaman profil terlebih dahulu
            </p>
          )}
        </motion.div>
      </form>
    </div>
  );
}