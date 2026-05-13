"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

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

export default function PickupRequestForm() {
  const router = useRouter();
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
    setFormData({ ...formData, agentId: agentId });
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

    console.log("=== SUBMITTING REQUEST ===");
    console.log("userId:", userId);
    console.log("selectedAgentUserId:", selectedAgentUserId);

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
        .from("pickup_requests")
        .insert({
          user_id: userId,
          agent_id: selectedAgentUserId,
          status: "pending",
          pickup_address: userAddress,
          estimated_weight: estimatedWeights,
          created_at: pickupDateTime.toISOString(),
        })
        .select();

      if (error) {
        console.error("Supabase insert error:", error);
        throw error;
      }

      console.log("✅ Request created:", newRequest);

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
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isSuccess) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          Pengajuan Berhasil!
        </h3>
        <p className="text-sm text-muted-foreground">
          Petugas kami akan segera memproses penjemputan sampah Anda
        </p>
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.push("/dashboard")}
        >
          Kembali ke Dashboard
        </Button>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Ajukan Penjemputan
        </h1>
        <p className="text-sm text-muted-foreground">
          Isi form berikut untuk menjemput sampah Anda
        </p>
      </div>

      <Card className="p-5 space-y-5">
        {/* Alamat */}
        <div className="bg-muted/30 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">
              Alamat Penjemputan
            </span>
          </div>
          <p className="text-sm text-foreground">
            {userAddress || "Belum diisi"}
          </p>
          <button
            type="button"
            onClick={() => router.push("/profile")}
            className="text-[10px] text-primary mt-2 hover:underline"
          >
            Ubah alamat di profil
          </button>
        </div>

        {/* Pilih AGENT */}
        <div className="bg-muted/30 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <UserCheck className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">
              Agen Penjemput
            </span>
          </div>
          <div className="text-sm text-foreground">
            {selectedAgent ? (
              <div>
                <p className="font-semibold">{selectedAgent.name}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedAgent.phone}</p>
                <p className="text-xs text-muted-foreground mt-1">{selectedAgent.address}</p>
              </div>
            ) : (
              <div>
                <p className="text-red-500 font-medium">Agen belum dipilih</p>
                <button type="button" onClick={() => router.push("/user/home")} className="text-[10px] text-primary mt-2 hover:underline">
                  Pilih Agen dari Dashboard
                </button>
              </div>
            )}
          </div>
          {selectedAgentId && (
            <p className="text-xs text-green-600 mt-2">
              ✓ Agen tersedia dan dipilih
            </p>
          )}
        </div>

        {/* Jenis Sampah */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            <Package className="w-4 h-4 inline mr-2 text-primary" />
            Jenis Sampah
          </label>
          <select
            required
            value={formData.wasteType}
            onChange={(e) => handleChange("wasteType", e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="">Pilih jenis sampah</option>
            {availableWasteTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name} - {type.price_per_kg.toLocaleString("id-ID")} poin/kg
              </option>
            ))}
            {availableWasteTypes.length === 0 && selectedAgent && (
              <option value="" disabled>Agen ini tidak menerima jenis sampah dari katalog</option>
            )}
          </select>
        </div>

        {/* Estimasi Berat */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Estimasi Berat (kg)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              required
              placeholder="0"
              value={formData.estimatedWeight}
              onChange={(e) => handleChange("estimatedWeight", e.target.value)}
              className="flex-1 px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {/* Jadwal */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              <Calendar className="w-4 h-4 inline mr-2 text-primary" />
              Tanggal
            </label>
            <input
              type="date"
              required
              min={getMinDate()}
              value={formData.pickupDate}
              onChange={(e) => handleChange("pickupDate", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">
              <Clock className="w-4 h-4 inline mr-2 text-primary" />
              Jam
            </label>
            <select
              required
              value={formData.pickupTime}
              onChange={(e) => handleChange("pickupTime", e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Pilih jam</option>
              <option value="08:00 - 10:00">08:00 - 10:00</option>
              <option value="10:00 - 12:00">10:00 - 12:00</option>
              <option value="12:00 - 14:00">12:00 - 14:00</option>
              <option value="14:00 - 16:00">14:00 - 16:00</option>
              <option value="16:00 - 18:00">16:00 - 18:00</option>
            </select>
          </div>
        </div>

        {/* Catatan */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            <ClipboardList className="w-4 h-4 inline mr-2 text-primary" />
            Catatan (opsional)
          </label>
          <textarea
            rows={2}
            placeholder="Contoh: Sampah sudah dipilah dalam karung"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Submit */}
        <Button
          type="submit"
          disabled={isSubmitting || !userAddress || !selectedAgentId || agents.length === 0}
          className="w-full gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Ajukan Penjemputan
            </>
          )}
        </Button>

        {!userAddress && (
          <p className="text-xs text-red-500 text-center">
            *Silakan lengkapi alamat di halaman profil terlebih dahulu
          </p>
        )}
      </Card>
    </form>
  );
}