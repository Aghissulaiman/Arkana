"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import {
  Loader2,
  Building2,
  MapPin,
  Phone,
  CheckCircle,
  Mail,
  ShieldAlert,
} from "lucide-react";

// Import komponen global dari landing page kamu
import Navbar from "@/components/LandingPage/Navbar";
import Footer from "@/components/LandingPage/Footer";

const WASTE_TYPES = [
  { value: "plastic", label: "Plastik" },
  { value: "paper", label: "Kertas" },
  { value: "cardboard", label: "Kardus" },
  { value: "glass", label: "Kaca" },
  { value: "aluminium", label: "Aluminium" },
  { value: "metal", label: "Logam" },
  { value: "electronic", label: "Elektronik" },
  { value: "mixed", label: "Campuran" },
];

export default function RegisterAgentPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [existingApplication, setExistingApplication] = useState<{
    status: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    agent_name: "",
    phone: "",
    address: "",
    service_area: "",
    waste_categories: [] as string[],
  });

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      setUserEmail(user.email || "");

      // Cek apakah sudah pernah mendaftar
      const { data: existing } = await supabase
        .from("agent_applications")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing) {
        setExistingApplication(existing);
        if (existing.status === "pending") {
          setSubmitted(true);
        } else if (existing.status === "approved") {
          router.push("/agent/dashboard");
        }
      }

      // Cek apakah user sudah menjadi agent
      const { data: agentData } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      if (agentData) {
        router.push("/agent/dashboard");
      }
    };

    getUser();
  }, [supabase, router]);

  const handleCheckboxChange = (wasteType: string) => {
    setFormData((prev) => ({
      ...prev,
      waste_categories: prev.waste_categories.includes(wasteType)
        ? prev.waste_categories.filter((w) => w !== wasteType)
        : [...prev.waste_categories, wasteType],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.waste_categories.length === 0) {
      setError("Pilih minimal satu jenis sampah");
      setLoading(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("User tidak ditemukan");
      setLoading(false);
      return;
    }

    // Cek apakah sudah punya application
    const { data: existing } = await supabase
      .from("agent_applications")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (existing) {
      setError("Anda sudah pernah mendaftar. Silakan tunggu konfirmasi admin.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase
      .from("agent_applications")
      .insert({
        user_id: user.id,
        agent_name: formData.agent_name,
        phone: formData.phone,
        address: formData.address,
        service_area: formData.service_area,
        waste_categories: formData.waste_categories,
        status: "pending",
      });

    if (insertError) {
      setError(insertError.message);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  // State tampilan ketika sukses submit formulir
  if (submitted) {
    return (
      <div className="min-h-screen bg-emerald-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 my-10">
          <div className="max-w-md w-full bg-white p-8 text-center rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.02)] border border-slate-100">
            <div className="w-20 h-20 bg-emerald-100/50 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
              <CheckCircle className="w-10 h-10 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 mb-2">
              Pendaftaran Berhasil!
            </h1>
            <p className="text-slate-500 text-sm font-medium leading-relaxed mb-8">
              Pendaftaran Anda sebagai agen telah kami terima di sistem
              TrashFlow. Silakan tunggu proses peninjauan dan konfirmasi dari
              pihak admin.
            </p>
            <Button
              onClick={() => router.push("/")}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-2xl font-bold transition-transform active:scale-95 shadow-sm"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-emerald-50 flex flex-col font-sans">
      {/* 1. Navigasi Landing Page */}
      <Navbar />

      {/* 2. Main Content Form Area */}
      <div className="flex-1 py-18 px-4">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Header Title Judul */}
          <div className="space-y-2 text-center md:text-left md:px-2">
            <h1 className="text-3xl md:text-4xl font-black tracking-tight text-slate-900">
              Kemitraan Agen
            </h1>
            <p className="text-slate-600/90 text-sm md:text-base font-medium">
              Isi formulir legalitas di bawah untuk mendaftarkan titik bank
              sampah Anda ke jaringan mitra TrashFlow.
            </p>
          </div>

          {/* Form Container Card */}
          <Card className="border-none shadow-[0_10px_40px_rgb(0,0,0,0.03)] rounded-[24px] overflow-hidden bg-white">
            <CardContent className="p-6 md:p-10">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Input: Email */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Email Akun
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <Input
                      value={userEmail}
                      disabled
                      className="pl-11 pr-4 py-6 bg-slate-50 border-none rounded-2xl text-sm font-medium text-slate-500 outline-none cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Input: Nama Agen */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Nama Agen / Bank Sampah{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <Input
                      className="pl-11 pr-4 py-6 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 font-medium"
                      placeholder="Contoh: Bank Sampah Hijau Lestari"
                      value={formData.agent_name}
                      onChange={(e) =>
                        setFormData({ ...formData, agent_name: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Input: No. Telepon */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    No. Telepon Operasional{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4.5 h-4.5" />
                    <Input
                      className="pl-11 pr-4 py-6 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 font-medium"
                      type="tel"
                      placeholder="Contoh: 08123456789"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Input: Alamat Lengkap */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Alamat Lengkap Operasional{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-4 text-slate-400 w-4.5 h-4.5" />
                    <textarea
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 font-medium h-24 resize-none"
                      placeholder="Nama jalan, nomor rumah, RT/RW, kelurahan, kecamatan, dan kota/kabupaten..."
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                {/* Input: Wilayah Layanan */}
                <div className="space-y-2">
                  <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Cakupan Wilayah Layanan Penjemputan{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <Input
                    className="px-4 py-6 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500/20 transition-all placeholder:text-slate-400 font-medium"
                    placeholder="Contoh: Depok, Beji, Cimanggis (Pisahkan dengan koma)"
                    value={formData.service_area}
                    onChange={(e) =>
                      setFormData({ ...formData, service_area: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Input: Jenis Sampah Checkbox */}
                <div className="space-y-3">
                  <Label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.1em]">
                    Kategori Sampah yang Diterima{" "}
                    <span className="text-rose-500">*</span>
                  </Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {WASTE_TYPES.map((waste) => {
                      const isChecked = formData.waste_categories.includes(
                        waste.value,
                      );
                      return (
                        <label
                          key={waste.value}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border border-transparent text-sm font-bold cursor-pointer select-none transition-all ${
                            isChecked
                              ? "bg-emerald-50 text-emerald-700 font-bold"
                              : "bg-slate-50 text-slate-600 hover:bg-slate-100/70"
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(waste.value)}
                            className="w-4.5 h-4.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500/20 checked:bg-emerald-600 accent-emerald-600"
                          />
                          <span>{waste.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Error Message Container */}
                {error && (
                  <div className="flex items-center gap-2 p-4 bg-rose-50 text-rose-600 rounded-2xl text-sm font-bold">
                    <ShieldAlert size={18} />
                    <p>{error}</p>
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white py-6 rounded-2xl font-bold transition-transform active:scale-95 shadow-sm mt-4 flex items-center justify-center"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    "Kirim Formulir Pendaftaran"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 3. Footer Landing Page */}
      <Footer />
    </div>
  );
}
