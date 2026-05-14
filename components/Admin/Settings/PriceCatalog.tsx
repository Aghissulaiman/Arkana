"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  X,
  Edit3,
  Save,
  Loader2,
  RefreshCw,
  Trash2,
  Search,
} from "lucide-react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";

interface WastePrice {
  id: string;
  waste_type: string;
  price_per_kg: number;
  updated_at: string;
}

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

export default function PricingPage() {
  const supabase = createClientSupabaseClient();
  const [wastePrices, setWastePrices] = useState<WastePrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [wasteModal, setWasteModal] = useState<{
    open: boolean;
    data: WastePrice | null;
  }>({ open: false, data: null });
  const [formData, setFormData] = useState({
    waste_type: "",
    price_per_kg: "",
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchWastePrices();
  }, []);

  const fetchWastePrices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("price_catalog")
      .select("*")
      .order("waste_type", { ascending: true });

    if (error) {
      console.error("Error fetching prices:", error);
      toast.error("Gagal memuat data harga");
    } else {
      setWastePrices(data || []);
    }
    setLoading(false);
  };

  const handleEdit = (item: WastePrice) => {
    setFormData({
      waste_type: item.waste_type,
      price_per_kg: item.price_per_kg.toString(),
    });
    setWasteModal({ open: true, data: item });
  };

  const handleAdd = () => {
    setFormData({ waste_type: "", price_per_kg: "" });
    setWasteModal({ open: true, data: null });
  };

  const handleSave = async () => {
    if (!formData.waste_type || !formData.price_per_kg) {
      toast.error("Isi semua field yang diperlukan");
      return;
    }

    setSaving(true);
    const price = parseInt(formData.price_per_kg);

    if (wasteModal.data) {
      const { error } = await supabase
        .from("price_catalog")
        .update({ price_per_kg: price, updated_at: new Date().toISOString() })
        .eq("id", wasteModal.data.id);

      if (error) {
        toast.error("Gagal update harga: " + error.message);
      } else {
        toast.success("Harga berhasil diupdate");
        setWasteModal({ open: false, data: null });
        fetchWastePrices();
      }
    } else {
      const { error } = await supabase.from("price_catalog").insert({
        waste_type: formData.waste_type.toLowerCase(),
        price_per_kg: price,
      });

      if (error) {
        toast.error("Gagal tambah jenis: " + error.message);
      } else {
        toast.success("Jenis sampah berhasil ditambahkan");
        setWasteModal({ open: false, data: null });
        fetchWastePrices();
      }
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus jenis sampah ini?")) return;

    const { error } = await supabase
      .from("price_catalog")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Gagal menghapus: " + error.message);
    } else {
      toast.success("Jenis sampah berhasil dihapus");
      fetchWastePrices();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredPrices = wastePrices.filter(
    (item) =>
      item.waste_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (WASTE_LABELS[item.waste_type] || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-full font-sans text-slate-600">
      <Toaster position="top-right" richColors />

      {/* Page Header Area */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900">
            Katalog Harga Sampah
          </h2>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Kelola standarisasi harga per kilogram untuk operasional TrashFlow
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={fetchWastePrices}
            className="rounded-xl border-slate-200 bg-white text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
          >
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </Button>
          <Button
            onClick={handleAdd}
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl shadow-md shadow-emerald-200 transition-all border-none"
          >
            <Plus size={18} className="mr-2" />
            Tambah Jenis
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {/* Search Bar - Styled like Admin Header */}
        <div className="relative max-w-md group">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
            <Search size={16} />
          </div>
          <input
            type="text"
            placeholder="Cari jenis sampah..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all shadow-sm"
          />
        </div>

        {/* Table Container */}
        <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm shadow-slate-200/50">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="text-left px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Jenis Sampah
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Harga per kg
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Terakhir Update
                  </th>
                  <th className="text-right px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <p className="text-slate-400 font-medium">
                          Data katalog tidak ditemukan
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-700 capitalize text-[14px]">
                            {WASTE_LABELS[item.waste_type] || item.waste_type}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono tracking-wider mt-0.5">
                            ID: {item.waste_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="inline-flex items-center px-3 py-1 bg-emerald-50 rounded-lg">
                          <span className="text-[15px] font-bold text-emerald-600">
                            Rp {item.price_per_kg.toLocaleString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-[13px] font-medium text-slate-500">
                          {formatDate(item.updated_at)}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 rounded-xl transition-all"
                            title="Edit"
                          >
                            <Edit3 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all"
                            title="Hapus"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer Info */}
        <div className="flex justify-between items-center px-2">
          <p className="text-[12px] font-medium text-slate-400">
            Showing{" "}
            <span className="text-slate-600">{filteredPrices.length}</span> of{" "}
            <span className="text-slate-600">{wastePrices.length}</span>{" "}
            categories
          </p>
        </div>
      </div>

      {/* Modal - Styled like Admin UI */}
      {wasteModal.open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[4px]"
          onClick={() => setWasteModal({ open: false, data: null })}
        >
          <div
            className="bg-white rounded-[28px] max-w-md w-full shadow-2xl border border-slate-100 animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold text-slate-800">
                  {wasteModal.data ? "Edit Katalog" : "Tambah Katalog Baru"}
                </h3>
                <p className="text-xs font-medium text-slate-400 mt-0.5">
                  Update standarisasi harga sampah
                </p>
              </div>
              <button
                onClick={() => setWasteModal({ open: false, data: null })}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>

            <div className="p-8 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Jenis Sampah
                </label>
                <input
                  value={formData.waste_type}
                  onChange={(e) =>
                    setFormData({ ...formData, waste_type: e.target.value })
                  }
                  placeholder="Contoh: plastik, kertas, kaca"
                  disabled={!!wasteModal.data}
                  className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-medium focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all ${
                    wasteModal.data
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : "text-slate-700"
                  }`}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[12px] font-bold text-slate-500 uppercase tracking-wider ml-1">
                  Harga per Kilogram (IDR)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    Rp
                  </div>
                  <input
                    type="number"
                    value={formData.price_per_kg}
                    onChange={(e) =>
                      setFormData({ ...formData, price_per_kg: e.target.value })
                    }
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[14px] font-bold text-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 transition-all"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setWasteModal({ open: false, data: null })}
                  className="flex-1 px-4 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-500 hover:bg-slate-50 transition-all"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-3 bg-emerald-500 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 shadow-lg shadow-emerald-100 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Save size={16} />
                  )}
                  {saving ? "Menyimpan..." : "Simpan Perubahan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
