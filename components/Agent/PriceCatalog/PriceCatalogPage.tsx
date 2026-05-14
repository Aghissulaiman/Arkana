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
} from "lucide-react";

const WASTE_TYPES = [
  { key: "plastic", label: "Plastik", emoji: "♻️", color: "bg-blue-100 text-blue-700" },
  { key: "paper", label: "Kertas", emoji: "📄", color: "bg-yellow-100 text-yellow-700" },
  { key: "cardboard", label: "Kardus", emoji: "📦", color: "bg-amber-100 text-amber-700" },
  { key: "glass", label: "Kaca", emoji: "🫙", color: "bg-cyan-100 text-cyan-700" },
  { key: "aluminium", label: "Aluminium", emoji: "🥫", color: "bg-gray-100 text-gray-700" },
  { key: "metal", label: "Logam", emoji: "⚙️", color: "bg-slate-100 text-slate-700" },
  { key: "electronic", label: "Elektronik", emoji: "💻", color: "bg-purple-100 text-purple-700" },
  { key: "mixed", label: "Campuran", emoji: "🗑️", color: "bg-orange-100 text-orange-700" },
];

type PriceEntry = {
  id?: string;
  waste_type: string;
  price_per_kg: number;
  agent_id?: string;
  is_active?: boolean;
};

export default function AgentPriceCatalogPage() {
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [editingType, setEditingType] = useState<string | null>(null);
  const [editValue, setEditValue] = useState<string>("");
  const [addingType, setAddingType] = useState<string | null>(null);
  const [addValue, setAddValue] = useState<string>("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: agentData } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!agentData) {
        toast.error("Tidak ditemukan data agent");
        setLoading(false);
        return;
      }
      setAgentId(agentData.id);

      // Fetch price catalog for this agent (or global)
      const { data: catalogData, error } = await supabase
        .from("price_catalog")
        .select("*")
        .or(`agent_id.eq.${agentData.id},agent_id.is.null`)
        .order("waste_type");

      if (!error && catalogData) {
        // Prioritize agent-specific prices over global ones
        const merged: Record<string, PriceEntry> = {};
        catalogData.forEach((item: PriceEntry) => {
          if (!merged[item.waste_type] || item.agent_id) {
            merged[item.waste_type] = item;
          }
        });
        setPrices(Object.values(merged));
      } else if (error) {
        // If no agent_id column, just fetch global
        const { data: globalData } = await supabase
          .from("price_catalog")
          .select("*")
          .order("waste_type");
        setPrices(globalData || []);
      }
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

      if (existing?.id && existing?.agent_id === agentId) {
        // Update existing agent-specific price
        const { error } = await supabase
          .from("price_catalog")
          .update({ price_per_kg: val, updated_at: new Date().toISOString() })
          .eq("id", existing.id);

        if (error) throw error;
        toast.success("Harga berhasil diperbarui");
      } else {
        // Insert new agent-specific price
        const { error } = await supabase.from("price_catalog").insert({
          waste_type: wasteType,
          price_per_kg: val,
          agent_id: agentId,
          is_active: true,
        });

        if (error) {
          // Fallback: try without agent_id (global price catalog)
          const { error: err2 } = await supabase
            .from("price_catalog")
            .upsert(
              {
                waste_type: wasteType,
                price_per_kg: val,
              },
              { onConflict: "waste_type" }
            );
          if (err2) throw err2;
        }
        toast.success("Harga berhasil ditambahkan");
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
    if (!existing?.id) return;

    if (!confirm("Yakin ingin menghapus harga ini?")) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from("price_catalog")
        .delete()
        .eq("id", existing.id);

      if (error) throw error;
      toast.success("Harga berhasil dihapus");
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

  const activePrices = WASTE_TYPES.filter((wt) => getPriceForType(wt.key));
  const inactivePrices = WASTE_TYPES.filter((wt) => !getPriceForType(wt.key));

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Harga Sampah</h1>
            <p className="text-sm text-gray-500 mt-1">
              Atur harga pembelian sampah per jenis (poin/kg)
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
            <p className="text-sm font-medium text-primary">Cara Kerja Harga</p>
            <p className="text-xs text-primary/70 mt-1">
              Harga yang Anda set akan digunakan saat user jual sampah ke Anda. 
              Satuan harga adalah <strong>poin per kg</strong>. Contoh: 100 poin/kg berarti 
              user mendapat 100 poin untuk setiap 1 kg sampah.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Jenis Terdaftar</p>
            <p className="text-2xl font-bold text-primary">{activePrices.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Rata-rata Harga</p>
            <p className="text-2xl font-bold text-gray-800">
              {activePrices.length > 0
                ? Math.round(
                    activePrices.reduce((s, wt) => s + (getPriceForType(wt.key)?.price_per_kg || 0), 0) /
                      activePrices.length
                  ).toLocaleString("id-ID")
                : "0"}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 text-center">
            <p className="text-xs text-gray-400 mb-1">Belum Diset</p>
            <p className="text-2xl font-bold text-gray-400">{inactivePrices.length}</p>
          </div>
        </div>

        {/* Price List - Active */}
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
            <div className="w-1 h-5 bg-primary rounded-full" />
            Harga yang Sudah Diset ({activePrices.length} jenis)
          </h2>

          {activePrices.length === 0 ? (
            <div className="bg-white rounded-xl p-8 border border-dashed border-gray-200 text-center">
              <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
              <p className="text-sm text-gray-400">Belum ada harga yang diset</p>
              <p className="text-xs text-gray-300 mt-1">
                Tambahkan harga di bagian bawah
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {activePrices.map((wt) => {
                const priceData = getPriceForType(wt.key)!;
                const isEditing = editingType === wt.key;

                return (
                  <div
                    key={wt.key}
                    className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-sm transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${wt.color}`}
                      >
                        {wt.emoji}
                      </div>

                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{wt.label}</p>
                        {!isEditing ? (
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <DollarSign className="w-3.5 h-3.5 text-primary" />
                            <span className="text-lg font-bold text-primary">
                              {priceData.price_per_kg.toLocaleString("id-ID")}
                            </span>
                            <span className="text-xs text-gray-400">poin/kg</span>
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
                                setEditingType(wt.key);
                                setEditValue(String(priceData.price_per_kg));
                              }}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit harga"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(wt.key)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => handleSaveEdit(wt.key)}
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
          )}
        </div>

        {/* Price List - Not Set */}
        {inactivePrices.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-semibold text-gray-600 flex items-center gap-2">
              <div className="w-1 h-5 bg-gray-300 rounded-full" />
              Tambah Jenis Sampah Baru ({inactivePrices.length} tersisa)
            </h2>

            <div className="space-y-2">
              {inactivePrices.map((wt) => {
                const isAdding = addingType === wt.key;

                return (
                  <div
                    key={wt.key}
                    className="bg-white rounded-xl p-4 border border-dashed border-gray-200 hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-xl opacity-60">
                        {wt.emoji}
                      </div>

                      <div className="flex-1">
                        <p className="font-medium text-gray-600">{wt.label}</p>
                        {isAdding ? (
                          <div className="flex items-center gap-2 mt-1">
                            <input
                              type="number"
                              min="0"
                              step="1"
                              value={addValue}
                              onChange={(e) => setAddValue(e.target.value)}
                              className="w-32 px-3 py-1.5 text-sm border border-primary rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                              placeholder="Harga (poin)"
                              autoFocus
                            />
                            <span className="text-xs text-gray-400">poin/kg</span>
                          </div>
                        ) : (
                          <p className="text-xs text-gray-400 mt-0.5">
                            Belum ada harga
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {!isAdding ? (
                          <button
                            onClick={() => {
                              setAddingType(wt.key);
                              setAddValue("");
                            }}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm hover:bg-primary/20 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            Set Harga
                          </button>
                        ) : (
                          <>
                            <button
                              onClick={async () => {
                                const val = parseFloat(addValue);
                                if (isNaN(val) || val < 0) {
                                  toast.error("Masukkan harga yang valid");
                                  return;
                                }
                                setSaving(true);
                                try {
                                  const { error } = await supabase
                                    .from("price_catalog")
                                    .insert({
                                      waste_type: wt.key,
                                      price_per_kg: val,
                                      agent_id: agentId,
                                      is_active: true,
                                    });
                                  if (error) {
                                    // Fallback without agent_id
                                    await supabase.from("price_catalog").upsert(
                                      { waste_type: wt.key, price_per_kg: val },
                                      { onConflict: "waste_type" }
                                    );
                                  }
                                  toast.success("Harga berhasil ditambahkan");
                                  setAddingType(null);
                                  setAddValue("");
                                  await fetchData();
                                } catch (err: any) {
                                  toast.error("Gagal: " + err?.message);
                                } finally {
                                  setSaving(false);
                                }
                              }}
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
                                setAddingType(null);
                                setAddValue("");
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
        )}

        {/* Bottom note */}
        <div className="bg-gray-100 rounded-xl p-4 text-center">
          <TrendingUp className="w-6 h-6 text-gray-400 mx-auto mb-2" />
          <p className="text-xs text-gray-500">
            Harga yang kompetitif akan menarik lebih banyak pengguna untuk menjual sampah ke Anda.
            Periksa dan perbarui harga secara berkala.
          </p>
        </div>
      </div>
    </div>
  );
}
