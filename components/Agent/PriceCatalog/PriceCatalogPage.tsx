"use client";

import { useState, useEffect } from "react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";
import {
  Loader2,
  Plus,
  Edit2,
  Trash2,
  Save,
  X,
  DollarSign,
  Package,
  TrendingUp,
  RefreshCw,
  Info,
  Globe,
  User,
  AlertCircle,
} from "lucide-react";

// Mapping untuk tampilan
const WASTE_INFO: Record<string, { label: string; emoji: string; color: string }> = {
  plastic: { label: "Plastik", emoji: "♻️", color: "bg-blue-100 text-blue-700" },
  paper: { label: "Kertas", emoji: "📄", color: "bg-yellow-100 text-yellow-700" },
  cardboard: { label: "Kardus", emoji: "📦", color: "bg-amber-100 text-amber-700" },
  glass: { label: "Kaca", emoji: "🫙", color: "bg-cyan-100 text-cyan-700" },
  aluminium: { label: "Aluminium", emoji: "🥫", color: "bg-gray-100 text-gray-700" },
  metal: { label: "Logam", emoji: "⚙️", color: "bg-slate-100 text-slate-700" },
  electronic: { label: "Elektronik", emoji: "💻", color: "bg-purple-100 text-purple-700" },
  mixed: { label: "Campuran", emoji: "🗑️", color: "bg-orange-100 text-orange-700" },
};

type PriceEntry = {
  id?: string;
  waste_type: string;
  price_per_kg: number;
  agent_id?: string;
  is_active?: boolean;
  is_custom?: boolean;
};

export default function AgentPriceCatalogPage() {
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [agentWasteTypes, setAgentWasteTypes] = useState<string[]>([]);
  const [globalPrices, setGlobalPrices] = useState<Map<string, number>>(new Map());
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Ambil data agent (termasuk waste_categories yang dipilih)
      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .select("id, waste_categories")
        .eq("user_id", user.id)
        .single();

      if (agentError || !agentData) {
        toast.error("Tidak ditemukan data agent");
        setLoading(false);
        return;
      }

      setAgentId(agentData.id);
      const wasteTypes = agentData.waste_categories || [];
      setAgentWasteTypes(wasteTypes);

      if (wasteTypes.length === 0) {
        toast.warning("Anda belum memilih jenis sampah yang diterima. Silakan hubungi admin.");
        setLoading(false);
        return;
      }

      // Fetch global prices (agent_id IS NULL)
      const { data: globalData } = await supabase
        .from("price_catalog")
        .select("*")
        .is("agent_id", null)
        .in("waste_type", wasteTypes)
        .order("waste_type");

      const globalMap = new Map<string, number>();
      globalData?.forEach((item: PriceEntry) => {
        globalMap.set(item.waste_type, item.price_per_kg);
      });
      setGlobalPrices(globalMap);

      // Fetch agent-specific prices
      const { data: agentPrices } = await supabase
        .from("price_catalog")
        .select("*")
        .eq("agent_id", agentData.id)
        .in("waste_type", wasteTypes)
        .order("waste_type");

      // Merge: agent prices override global
      const merged: PriceEntry[] = [];
      wasteTypes.forEach((wasteType) => {
        const agentPrice = agentPrices?.find((p) => p.waste_type === wasteType);
        const globalPrice = globalData?.find((p) => p.waste_type === wasteType);
        
        if (agentPrice) {
          merged.push({ ...agentPrice, is_custom: true });
        } else if (globalPrice) {
          merged.push({ ...globalPrice, is_custom: false, agent_id: undefined });
        } else {
          // No price at all
          merged.push({
            waste_type: wasteType,
            price_per_kg: 0,
            is_custom: false,
          });
        }
      });

      setPrices(merged);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getPriceForType = (wasteType: string) => {
    return prices.find((p) => p.waste_type === wasteType);
  };

  const handleSaveEdit = async (wasteType: string) => {
    const val = parseFloat(editValue);
    if (isNaN(val) || val < 0) {
      toast.error("Masukkan harga yang valid (angka positif)");
      return;
    }

    setSaving(true);
    try {
      const existing = getPriceForType(wasteType);
      const isCustom = existing?.is_custom;

      if (isCustom) {
        // Update existing agent-specific price
        const { error } = await supabase
          .from("price_catalog")
          .update({ price_per_kg: val, updated_at: new Date().toISOString() })
          .eq("id", existing?.id);

        if (error) throw error;
        toast.success("Harga berhasil diperbarui");
      } else {
        // Insert new agent-specific price (override global)
        const { error } = await supabase.from("price_catalog").insert({
          waste_type: wasteType,
          price_per_kg: val,
          agent_id: agentId,
          is_active: true,
        });

        if (error) throw error;
        toast.success("Harga khusus untuk agent Anda berhasil ditambahkan");
      }

      setEditingType(null);
      setEditValue("");
      await fetchData();
    } catch (err: any) {
      toast.error("Gagal menyimpan: " + err?.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (wasteType: string) => {
    const existing = getPriceForType(wasteType);
    if (!existing?.id || !existing?.is_custom) return;

    if (!confirm("Hapus harga khusus agent? Harga akan kembali menggunakan harga global.")) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("price_catalog")
        .delete()
        .eq("id", existing.id);

      if (error) throw error;
      toast.success("Harga khusus dihapus, kembali ke harga global");
      await fetchData();
    } catch (err: any) {
      toast.error("Gagal menghapus: " + err?.message);
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

  if (agentWasteTypes.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto p-6 text-center">
          <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Belum Ada Jenis Sampah</h2>
          <p className="text-gray-500 mb-4">
            Anda belum memilih jenis sampah yang diterima. Silakan hubungi admin untuk mengatur jenis sampah.
          </p>
          <button
            onClick={() => window.location.href = "/agent/dashboard"}
            className="px-6 py-2 bg-primary text-white rounded-lg"
          >
            Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  const activePrices = prices.filter((p) => p.price_per_kg > 0);
  const customPrices = prices.filter((p) => p.is_custom);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Harga Sampah</h1>
            <p className="text-sm text-gray-500 mt-1">
              Atur harga pembelian sampah untuk {agentWasteTypes.length} jenis yang Anda terima
            </p>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-primary">Jenis Sampah yang Anda Terima</p>
            <p className="text-xs text-primary/70 mt-1">
              Anda menerima <strong>{agentWasteTypes.length} jenis sampah</strong>:{" "}
              {agentWasteTypes.map(w => WASTE_INFO[w]?.label || w).join(", ")}.
              Harga yang Anda set akan digunakan saat user jual sampah ke Anda.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Jenis Diterima</p>
            <p className="text-2xl font-bold text-primary">{agentWasteTypes.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Harga Khusus Agent</p>
            <p className="text-2xl font-bold text-blue-600">{customPrices.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Mengikuti Harga Global</p>
            <p className="text-2xl font-bold text-gray-400">
              {activePrices.length - customPrices.length}
            </p>
          </div>
        </div>

        {/* Price List */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            Daftar Harga Sampah ({agentWasteTypes.length} jenis)
          </h2>

          <div className="space-y-2">
            {prices.map((priceData) => {
              const wasteInfo = WASTE_INFO[priceData.waste_type];
              if (!wasteInfo) return null;
              
              const isEditing = editingType === priceData.waste_type;
              const isCustom = priceData.is_custom;
              const globalPrice = globalPrices.get(priceData.waste_type) || 0;

              return (
                <div
                  key={priceData.waste_type}
                  className={`bg-white rounded-xl p-4 border transition-all ${
                    isCustom ? "border-blue-200 bg-blue-50/30" : "border-gray-100"
                  } hover:shadow-sm`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${wasteInfo.color}`}
                    >
                      {wasteInfo.emoji}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{wasteInfo.label}</p>
                        {isCustom ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                            <User className="w-2.5 h-2.5" />
                            Harga Khusus
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-full">
                            <Globe className="w-2.5 h-2.5" />
                            Harga Global
                          </span>
                        )}
                      </div>
                      
                      {!isEditing ? (
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <DollarSign className="w-3.5 h-3.5 text-primary" />
                          <span className="text-lg font-bold text-primary">
                            {priceData.price_per_kg.toLocaleString("id-ID")}
                          </span>
                          <span className="text-xs text-gray-400">poin/kg</span>
                          {!isCustom && globalPrice > 0 && (
                            <span className="text-[10px] text-gray-400 ml-2">
                              (global: {globalPrice.toLocaleString()} poin)
                            </span>
                          )}
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 mt-1">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            className="w-32 px-3 py-1.5 text-sm border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="Harga (poin)"
                            autoFocus
                          />
                          <span className="text-xs text-gray-400">poin/kg</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {!isEditing ? (
                        <>
                          <button
                            onClick={() => {
                              setEditingType(priceData.waste_type);
                              setEditValue(String(priceData.price_per_kg));
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit harga"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {isCustom && (
                            <button
                              onClick={() => handleDelete(priceData.waste_type)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus harga khusus (kembali ke global)"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleSaveEdit(priceData.waste_type)}
                            disabled={saving}
                            className="flex items-center gap-1 px-3 py-1.5 bg-primary text-white rounded-lg text-sm hover:bg-primary/90 disabled:opacity-50"
                          >
                            {saving ? (
                              <Loader2 className="w-3 h-3 animate-spin" />
                            ) : (
                              <Save className="w-3 h-3" />
                            )}
                            Simpan
                          </button>
                          <button
                            onClick={() => {
                              setEditingType(null);
                              setEditValue("");
                            }}
                            className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-lg"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Tambahan */}
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">
            Harga yang kompetitif akan menarik lebih banyak pengguna untuk menjual sampah ke Anda.
            Anda bisa mengatur harga khusus untuk setiap jenis sampah yang Anda terima.
          </p>
        </div>
      </div>
    </div>
  );
}