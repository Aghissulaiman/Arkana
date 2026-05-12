"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Loader2, Building2, MapPin, Phone, Package, CheckCircle } from "lucide-react";

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
  const [existingApplication, setExistingApplication] = useState<{ status: string } | null>(null);
  
  const [formData, setFormData] = useState({
    agent_name: "",
    phone: "",
    address: "",
    service_area: "",
    waste_categories: [] as string[],
  });

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
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
    setFormData(prev => ({
      ...prev,
      waste_categories: prev.waste_categories.includes(wasteType)
        ? prev.waste_categories.filter(w => w !== wasteType)
        : [...prev.waste_categories, wasteType]
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

    const { data: { user } } = await supabase.auth.getUser();
    
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

  if (submitted) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">Pendaftaran Berhasil!</h1>
        <p className="text-muted-foreground mb-6">
          Pendaftaran Anda sebagai agen telah kami terima. Silakan tunggu konfirmasi dari admin.
        </p>
        <Button onClick={() => router.push("/user/home")} className="bg-primary">
          Kembali ke Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Daftar Menjadi Agen</CardTitle>
          <p className="text-sm text-muted-foreground">
            Isi formulir berikut untuk menjadi agen bank sampah
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label>Email</Label>
              <Input value={userEmail} disabled className="bg-muted" />
            </div>

            <div>
              <Label>Nama Agen <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  placeholder="Contoh: Bank Sampah Hijau"
                  value={formData.agent_name}
                  onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label>No. Telepon <span className="text-red-500">*</span></Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  className="pl-9"
                  type="tel"
                  placeholder="08123456789"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Alamat Lengkap <span className="text-red-500">*</span></Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                <textarea
                  className="w-full pl-9 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={3}
                  placeholder="Jl. Contoh No. 123, RT 01/RW 02, Kelurahan, Kecamatan, Kota"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <Label>Wilayah Layanan <span className="text-red-500">*</span></Label>
              <Input
                placeholder="Contoh: Depok, Beji, Cimanggis"
                value={formData.service_area}
                onChange={(e) => setFormData({ ...formData, service_area: e.target.value })}
                required
              />
            </div>

            <div>
              <Label>Jenis Sampah yang Diterima <span className="text-red-500">*</span></Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {WASTE_TYPES.map((waste) => (
                  <label key={waste.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.waste_categories.includes(waste.value)}
                      onChange={() => handleCheckboxChange(waste.value)}
                      className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{waste.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}

            <Button type="submit" className="w-full bg-primary" disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Daftar sebagai Agen"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}