"use client";

import { useState, useEffect, Suspense } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Package,
  Calendar,
  Clock,
  ClipboardList,
  Send,
  MapPin,
  Loader2,
  UserCheck,
  CheckCircle2,
  Truck,
  Leaf,
  Map,
  Phone
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

interface PickupFormData {
  wasteType: string;
  estimatedWeight: string;
  notes: string;
  pickupDate: string;
  pickupTime: string;
  agentId: string;
}

interface WasteType {
  id: string;
  name: string;
  unit: string;
  price_per_kg: number;
}

interface Agent {
  id: string;
  user_id: string;
  name: string;
  phone: string;
  address: string;
  waste_types?: string[];
}

function PickupFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClientSupabaseClient();
  const queryAgentId = searchParams.get("agentId");
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [userAddress, setUserAddress] = useState("");
  const [userName, setUserName] = useState("");
  const [wasteTypes, setWasteTypes] = useState<WasteType[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState("");
  const [selectedAgentUserId, setSelectedAgentUserId] = useState("");
  const [formData, setFormData] = useState<PickupFormData>({
    wasteType: "",
    estimatedWeight: "",
    notes: "",
    pickupDate: "",
    pickupTime: "",
    agentId: "",
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  // Set agent from query parameter once agents are loaded
  useEffect(() => {
    if (agents.length > 0 && queryAgentId) {
      const agent = agents.find(a => a.id === queryAgentId);
      if (agent) {
        handleAgentSelect(agent.id, agent.user_id);
      }
    }
  }, [agents, queryAgentId]);

  const fetchInitialData = async () => {
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

    if (!selectedAgentUserId) {
      alert("Silakan pilih agent terlebih dahulu.");
      return;
    }

    if (!userAddress) {
      alert("Silakan lengkapi alamat terlebih dahulu di halaman profil.");
      router.push("/profile");
      return;
    }

    if (!formData.wasteType) {
      alert("Silakan pilih jenis sampah.");
      return;
    }

    if (!formData.estimatedWeight || parseFloat(formData.estimatedWeight) <= 0) {
      alert("Silakan isi estimasi berat yang valid.");
      return;
    }

    if (!formData.pickupDate) {
      alert("Silakan pilih tanggal penjemputan.");
      return;
    }

    if (!formData.pickupTime) {
      alert("Silakan pilih jam penjemputan.");
      return;
    }

    setIsSubmitting(true);

    try {
      const estimatedWeights: Record<string, number> = {};
      const weight = parseFloat(formData.estimatedWeight);
      estimatedWeights[formData.wasteType] = weight;

      let pickupDateTime = new Date(formData.pickupDate);
      if (formData.pickupTime) {
        const timeRange = formData.pickupTime.split(" - ")[0];
        const [hour] = timeRange.split(":");
        pickupDateTime.setHours(parseInt(hour), 0, 0);
      }

      const { data: newRequest, error } = await supabase
        .from("requests")
        .insert({
          user_id: userId,
          agent_id: selectedAgentUserId,
          status: "pending",
          pickup_address: userAddress,
          estimated_weights: estimatedWeights,
          created_at: pickupDateTime.toISOString(),
        })
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      setIsSuccess(true);
      setFormData({
        wasteType: "",
        estimatedWeight: "",
        notes: "",
        pickupDate: "",
        pickupTime: "",
        agentId: "",
      });
      setSelectedAgentId("");
      setSelectedAgentUserId("");

      setTimeout(() => {
        setIsSuccess(false);
        router.push("/user/home");
      }, 3000);

    } catch (error) {
      console.error("❌ Error:", error);
      alert("Gagal mengajukan penjemputan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md mx-auto mt-20"
      >
        <Card className="p-10 text-center rounded-[2rem] border-slate-100 shadow-xl shadow-emerald-500/10">
          <div className="w-24 h-24 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-6 relative">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
            >
              <CheckCircle2 className="w-12 h-12 text-emerald-600" />
            </motion.div>
            <div className="absolute inset-0 rounded-full border-4 border-emerald-500/20 animate-ping" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-800 mb-3">
            Hore! Permintaan Berhasil
          </h3>
          <p className="text-slate-500 mb-8">
            Mitra kami akan segera memproses penjemputan sampah Anda sesuai jadwal.
          </p>
          <Button 
            className="w-full h-14 rounded-2xl text-lg font-bold bg-slate-900 hover:bg-slate-800 text-white transition-all"
            onClick={() => router.push("/user/home")}
          >
            Kembali ke Beranda
          </Button>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <div className="inline-flex items-center justify-center p-3 bg-emerald-100 rounded-2xl mb-5 shadow-sm transform -rotate-6">
          <Truck className="w-8 h-8 text-emerald-600 transform rotate-6" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
          Ajukan Penjemputan <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600">Sampah</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-lg">
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
          <Card className="p-6 sm:p-8 rounded-[2rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <MapPin className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Lokasi & Agen</h2>
                  <p className="text-sm text-slate-500">Tentukan alamat dan agen tujuan</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Lokasi */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative group overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
                  <label className="text-sm font-semibold text-slate-500 block mb-3 flex items-center gap-2">
                    Alamat Penjemputan
                  </label>
                  <div className="text-slate-800 font-medium leading-relaxed min-h-[3rem]">
                    {userAddress || "Alamat belum diatur"}
                  </div>
                  <button type="button" onClick={() => router.push("/user/profile")} className="mt-3 text-sm text-blue-600 font-bold hover:text-blue-700 hover:underline inline-flex items-center gap-1.5 transition-colors">
                    <Map className="w-4 h-4" /> Ubah alamat di profil
                  </button>
                </div>

                {/* Agen */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative group overflow-hidden flex flex-col justify-center">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-bl-[100px] -z-10 transition-transform duration-500 group-hover:scale-110" />
                  <label className="text-sm font-semibold text-slate-500 block mb-3 flex items-center gap-2">
                    Agen Penjemput
                  </label>
                  <div className="text-slate-800 font-medium leading-relaxed">
                    {selectedAgent ? (
                      <div>
                        <p className="font-bold text-lg">{selectedAgent.name}</p>
                        <p className="text-sm text-slate-500 mt-1 flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {selectedAgent.phone}</p>
                        <p className="text-sm text-slate-500 mt-0.5 flex items-start gap-1"><MapPin className="w-3.5 h-3.5 mt-0.5" /> {selectedAgent.address}</p>
                      </div>
                    ) : (
                      <div className="py-2">
                        <span className="text-rose-500 font-semibold">Agen belum dipilih</span>
                        <br />
                        <button type="button" onClick={() => router.push("/user/home")} className="mt-2 text-sm text-blue-600 font-bold hover:text-blue-700 hover:underline">
                          Pilih Agen dari Dashboard
                        </button>
                      </div>
                    )}
                  </div>
                  {selectedAgentId && (
                    <motion.p initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="text-xs font-bold text-emerald-600 mt-3 flex items-center gap-1">
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
          <Card className="p-6 sm:p-8 rounded-[2rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center border border-amber-100">
                  <Package className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Detail Sampah</h2>
                  <p className="text-sm text-slate-500">Informasi sampah yang akan dijemput</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Jenis Sampah */}
                <div>
                  <label className="text-sm font-semibold text-slate-500 block mb-3 flex items-center gap-2">Jenis Sampah</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.wasteType}
                      onChange={(e) => handleChange("wasteType", e.target.value)}
                      className="w-full pl-5 pr-12 py-4 text-base font-medium rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 appearance-none shadow-sm transition-all cursor-pointer hover:border-slate-300"
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
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none bg-white pl-2">
                      <Leaf className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>

                {/* Estimasi Berat */}
                <div>
                  <label className="text-sm font-semibold text-slate-500 block mb-3 flex items-center gap-2">Estimasi Berat</label>
                  <div className="relative">
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="0.0"
                      value={formData.estimatedWeight}
                      onChange={(e) => handleChange("estimatedWeight", e.target.value)}
                      className="w-full pl-5 pr-16 py-4 text-base font-medium rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-sm transition-all hover:border-slate-300"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600 font-bold bg-slate-100 px-3 py-1.5 rounded-xl">
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
          <Card className="p-6 sm:p-8 rounded-[2rem] border-slate-100 shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-xl">
             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center border border-violet-100">
                  <Calendar className="w-6 h-6 text-violet-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Jadwal & Catatan</h2>
                  <p className="text-sm text-slate-500">Tentukan waktu penjemputan</p>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="text-sm font-semibold text-slate-500 block mb-3">Tanggal Penjemputan</label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      min={getMinDate()}
                      value={formData.pickupDate}
                      onChange={(e) => handleChange("pickupDate", e.target.value)}
                      className="w-full px-5 py-4 text-base font-medium rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-sm transition-all appearance-none cursor-text hover:border-slate-300"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-slate-500 block mb-3">Waktu Penjemputan</label>
                  <div className="relative">
                    <select
                      required
                      value={formData.pickupTime}
                      onChange={(e) => handleChange("pickupTime", e.target.value)}
                      className="w-full pl-5 pr-12 py-4 text-base font-medium rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 appearance-none shadow-sm transition-all cursor-pointer hover:border-slate-300"
                    >
                      <option value="">-- Pilih Jam --</option>
                      <option value="08:00 - 10:00">08:00 - 10:00</option>
                      <option value="10:00 - 12:00">10:00 - 12:00</option>
                      <option value="12:00 - 14:00">12:00 - 14:00</option>
                      <option value="14:00 - 16:00">14:00 - 16:00</option>
                      <option value="16:00 - 18:00">16:00 - 18:00</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none bg-white pl-2">
                      <Clock className="w-5 h-5 text-slate-400" />
                    </div>
                  </div>
                </div>
             </div>

             <div>
               <label className="text-sm font-semibold text-slate-500 block mb-3 flex items-center gap-2">
                  <ClipboardList className="w-4 h-4 text-slate-400" /> Catatan Tambahan (Opsional)
               </label>
               <textarea
                 rows={3}
                 placeholder="Contoh: Tolong hubungi nomor saya jika sudah di depan rumah atau sampah sudah dipisahkan dalam kardus..."
                 value={formData.notes}
                 onChange={(e) => handleChange("notes", e.target.value)}
                 className="w-full px-5 py-4 text-base font-medium rounded-2xl border border-slate-200 bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 shadow-sm transition-all resize-none hover:border-slate-300"
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
            className="w-full py-8 rounded-2xl text-lg font-extrabold shadow-xl shadow-emerald-500/25 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 transition-all gap-3 hover:-translate-y-1"
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
            <p className="text-sm text-rose-500 text-center mt-5 font-bold flex items-center justify-center gap-2 bg-rose-50 py-3 rounded-xl">
               <MapPin className="w-4 h-4" />
               Silakan lengkapi alamat di halaman profil terlebih dahulu
            </p>
          )}
        </motion.div>
      </form>
    </div>
  );
}

export default function PickupRequestForm() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-12 h-12 animate-spin text-emerald-500" />
      </div>
    }>
      <PickupFormContent />
    </Suspense>
  );
}