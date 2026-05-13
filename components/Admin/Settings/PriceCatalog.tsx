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
      const { error } = await supabase
        .from("price_catalog")
        .insert({ waste_type: formData.waste_type.toLowerCase(), price_per_kg: price });

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

    const { error } = await supabase.from("price_catalog").delete().eq("id", id);
    if (error) {
      toast.error("Gagal menghapus: " + error.message);
    } else {
      toast.success("Jenis sampah berhasil dihapus");
      fetchWastePrices();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
  };

  const filteredPrices = wastePrices.filter(item =>
    item.waste_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (WASTE_LABELS[item.waste_type] || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Katalog Harga Sampah</h1>
              <p className="text-sm text-gray-500 mt-1">
                Kelola harga per kilogram untuk setiap jenis sampah
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={fetchWastePrices}
                className="rounded-lg border-gray-200"
              >
                <RefreshCw size={16} className="mr-2" />
                Refresh
              </Button>
              <Button
                onClick={handleAdd}
                className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm"
              >
                <Plus size={18} className="mr-2" />
                Tambah Jenis
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari jenis sampah..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Jenis Sampah
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Harga per kg
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Terakhir Update
                  </th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredPrices.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                      Tidak ada data
                    </td>
                  </tr>
                ) : (
                  filteredPrices.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800 capitalize">
                          {WASTE_LABELS[item.waste_type] || item.waste_type}
                        </span>
                        <p className="text-xs text-gray-400 font-mono mt-0.5">
                          {item.waste_type}
                        </p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-lg font-semibold text-emerald-600">
                          Rp {item.price_per_kg.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {formatDate(item.updated_at)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit3 size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={16} />
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
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-400">
            Menampilkan {filteredPrices.length} dari {wastePrices.length} jenis sampah
          </p>
        </div>
      </div>

      {/* Modal Edit/Add */}
      {wasteModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setWasteModal({ open: false, data: null })}>
          <div className="bg-white rounded-lg max-w-md w-full shadow-xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">
                  {wasteModal.data ? "Edit Harga" : "Tambah Jenis Sampah"}
                </h3>
                <p className="text-xs text-gray-500">
                  {wasteModal.data ? "Ubah harga per kilogram" : "Masukkan jenis sampah baru"}
                </p>
              </div>
              <button
                onClick={() => setWasteModal({ open: false, data: null })}
                className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Jenis Sampah
                </label>
                <input
                  value={formData.waste_type}
                  onChange={(e) => setFormData({ ...formData, waste_type: e.target.value })}
                  placeholder="Contoh: plastik, kertas, kaca"
                  disabled={!!wasteModal.data}
                  className={`w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    wasteModal.data ? "bg-gray-50 text-gray-500" : ""
                  }`}
                />
                {!wasteModal.data && (
                  <p className="text-[10px] text-gray-400 mt-1">
                    Gunakan huruf kecil, tanpa spasi
                  </p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">
                  Harga per Kilogram (Rp)
                </label>
                <input
                  type="number"
                  value={formData.price_per_kg}
                  onChange={(e) => setFormData({ ...formData, price_per_kg: e.target.value })}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setWasteModal({ open: false, data: null })}
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50"
                >
                  Batal
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}