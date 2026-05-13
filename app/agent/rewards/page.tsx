"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { 
  Loader2, 
  Plus, 
  Edit2, 
  Trash2, 
  Coins, 
  Package, 
  Ticket, 
  DollarSign, 
  Heart,
  X,
  Upload,
  Eye,
  EyeOff
} from "lucide-react";

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

type FormData = {
  name: string;
  description: string;
  category: string;
  points_required: number;
  cash_value: number;
  stock: number;
  image_url: string;
  is_active: boolean;
};

const categories = [
  { value: "product", label: "Produk", icon: Package, color: "bg-blue-500" },
  { value: "voucher", label: "Voucher", icon: Ticket, color: "bg-purple-500" },
  { value: "cash", label: "Tarik Tunai", icon: DollarSign, color: "bg-green-500" },
  { value: "donation", label: "Donasi", icon: Heart, color: "bg-rose-500" },
];

export default function AgentRewardsPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAgent, setIsAgent] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    category: "product",
    points_required: 0,
    cash_value: 0,
    stock: 0,
    image_url: "",
    is_active: true,
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    checkAgentAndFetch();
  }, []);

  const checkAgentAndFetch = async () => {
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

    if (userData?.role !== "agent" && userData?.role !== "admin") {
      router.push("/user/home");
      return;
    }

    setIsAgent(true);
    await fetchRewards();
  };

  const fetchRewards = async () => {
    const { data } = await supabase
      .from("rewards")
      .select("*")
      .order("created_at", { ascending: false });
    
    setRewards(data || []);
    setLoading(false);
  };

  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("rewards")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Upload error:", uploadError);
      return null;
    }

    const { data: urlData } = supabase.storage
      .from("rewards")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    let imageUrl = formData.image_url;
    
    if (imageFile) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
      }
    }

    if (editingId) {
      await supabase
        .from("rewards")
        .update({
          name: formData.name,
          description: formData.description,
          category: formData.category,
          points_required: formData.points_required,
          cash_value: formData.cash_value,
          stock: formData.stock,
          image_url: imageUrl,
          is_active: formData.is_active,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editingId);
    } else {
      await supabase.from("rewards").insert({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        points_required: formData.points_required,
        cash_value: formData.cash_value,
        stock: formData.stock,
        image_url: imageUrl,
        is_active: formData.is_active,
      });
    }

    resetForm();
    await fetchRewards();
    setUploading(false);
  };

  const handleEdit = (reward: Reward) => {
    setEditingId(reward.id);
    setFormData({
      name: reward.name,
      description: reward.description || "",
      category: reward.category,
      points_required: reward.points_required,
      cash_value: reward.cash_value || 0,
      stock: reward.stock || 0,
      image_url: reward.image_url || "",
      is_active: reward.is_active,
    });
    setImagePreview(reward.image_url || "");
    setShowModal(true);
  };

  const handleDelete = async (id: string, imageUrl: string) => {
    if (!confirm("Yakin ingin menghapus reward ini?")) return;

    if (imageUrl) {
      const path = imageUrl.split("/").pop();
      if (path) {
        await supabase.storage.from("rewards").remove([`products/${path}`]);
      }
    }

    await supabase.from("rewards").delete().eq("id", id);
    await fetchRewards();
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    await supabase
      .from("rewards")
      .update({ is_active: !currentStatus })
      .eq("id", id);
    await fetchRewards();
  };

  const resetForm = () => {
    setShowModal(false);
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      category: "product",
      points_required: 0,
      cash_value: 0,
      stock: 0,
      image_url: "",
      is_active: true,
    });
    setImageFile(null);
    setImagePreview("");
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.value === category);
    if (cat) {
      const Icon = cat.icon;
      return <Icon className="w-4 h-4" />;
    }
    return <Package className="w-4 h-4" />;
  };

  const getCategoryColor = (category: string) => {
    const cat = categories.find(c => c.value === category);
    return cat?.color || "bg-gray-500";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!isAgent) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-red-500">Akses ditolak. Hanya untuk Agent.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Kelola Reward</h1>
            <p className="text-sm text-gray-500 mt-1">Tambah/edit produk yang bisa ditukar dengan poin</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Tambah Reward
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Reward</p>
            <p className="text-2xl font-bold text-gray-800">{rewards.length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Produk Aktif</p>
            <p className="text-2xl font-bold text-green-600">{rewards.filter(r => r.is_active).length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Produk Nonaktif</p>
            <p className="text-2xl font-bold text-gray-400">{rewards.filter(r => !r.is_active).length}</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500">Total Stok</p>
            <p className="text-2xl font-bold text-blue-600">{rewards.reduce((sum, r) => sum + (r.stock || 0), 0)}</p>
          </div>
        </div>

        {/* Rewards Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Gambar</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Nama</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Kategori</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Poin</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Harga</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Stok</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rewards.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-8 text-center text-gray-400">
                      Belum ada reward. Klik "Tambah Reward" untuk memulai.
                    </td>
                  </tr>
                ) : (
                  rewards.map((reward) => (
                    <tr key={reward.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden">
                          {reward.image_url ? (
                            <Image
                              src={reward.image_url}
                              alt={reward.name}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                              No img
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800 text-sm">{reward.name}</p>
                        <p className="text-xs text-gray-400 line-clamp-1">{reward.description}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs text-white ${getCategoryColor(reward.category)}`}>
                          {getCategoryIcon(reward.category)}
                          {categories.find(c => c.value === reward.category)?.label || reward.category}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-green-600" />
                          <span className="font-semibold text-gray-700">{reward.points_required.toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-gray-600">
                          {reward.cash_value > 0 ? `Rp${reward.cash_value.toLocaleString()}` : "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-sm ${(reward.stock || 0) <= 10 && (reward.stock || 0) > 0 ? 'text-orange-500' : 'text-gray-600'}`}>
                          {reward.category === "product" ? (reward.stock || 0) : "∞"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleActive(reward.id, reward.is_active)}
                          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            reward.is_active
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {reward.is_active ? (
                            <><Eye className="w-3 h-3" /> Aktif</>
                          ) : (
                            <><EyeOff className="w-3 h-3" /> Nonaktif</>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(reward)}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(reward.id, reward.image_url)}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                {editingId ? "Edit Reward" : "Tambah Reward Baru"}
              </h2>
              <button onClick={resetForm} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gambar Reward</label>
                <div className="flex gap-4 items-start">
                  <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {imagePreview ? (
                      <Image src={imagePreview} alt="Preview" width={96} height={96} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Preview</div>
                    )}
                  </div>
                  <div className="flex-1">
                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors w-fit">
                      <Upload className="w-4 h-4" />
                      <span className="text-sm">Pilih Gambar</span>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                    </label>
                    <p className="text-xs text-gray-400 mt-2">Format: JPG, PNG. Maks 2MB</p>
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama Reward *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Contoh: Tumbler Stainless"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Deskripsi produk..."
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Kategori *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Points Required */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Poin yang Dibutuhkan *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formData.points_required || ""}
                    onChange={(e) => setFormData({ ...formData, points_required: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="1000"
                  />
                </div>

                {/* Cash Value */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nilai Tunai (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.cash_value || ""}
                    onChange={(e) => setFormData({ ...formData, cash_value: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="25000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Stock */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Stok</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock || ""}
                    onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="50"
                  />
                  <p className="text-xs text-gray-400 mt-1">Kosongkan/tidak berlaku untuk voucher & donasi</p>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={formData.is_active ? "active" : "inactive"}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.value === "active" })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {uploading ? "Menyimpan..." : (editingId ? "Update" : "Simpan")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}