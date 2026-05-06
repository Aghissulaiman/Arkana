"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Package, 
  Calendar, 
  Clock, 
  ClipboardList,
  Send,
  MapPin
} from "lucide-react";

interface PickupFormData {
  wasteType: string;
  estimatedWeight: string;
  notes: string;
  pickupDate: string;
  pickupTime: string;
}

// Data user (nanti dari API/session)
const USER_DATA = {
  name: "Eco Warrior",
  address: "Jl. Contoh No. 123, RT 01/RW 02, Kelurahan Sukamaju, Kecamatan Sukamakmur, Kota Jakarta Selatan"
};

export default function PickupRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<PickupFormData>({
    wasteType: "",
    estimatedWeight: "",
    notes: "",
    pickupDate: "",
    pickupTime: "",
  });

  const wasteTypes = [
    { id: "plastic", name: "Plastik", unit: "kg" },
    { id: "paper", name: "Kertas", unit: "kg" },
    { id: "glass", name: "Kaca", unit: "kg" },
    { id: "metal", name: "Logam", unit: "kg" },
    { id: "battery", name: "Baterai", unit: "kg" },
    { id: "electronic", name: "Elektronik", unit: "kg" },
    { id: "mixed", name: "Campuran", unit: "kg" },
  ];

  const handleChange = (field: keyof PickupFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setFormData({
          wasteType: "",
          estimatedWeight: "",
          notes: "",
          pickupDate: "",
          pickupTime: "",
        });
      }, 3000);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <Card className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
          <Send className="w-8 h-8 text-green-500" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Pengajuan Berhasil!</h3>
        <p className="text-sm text-muted-foreground">
          Petugas kami akan segera memproses penjemputan sampah Anda
        </p>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Ajukan Penjemputan</h1>
        <p className="text-sm text-muted-foreground">Isi form berikut untuk menjemput sampah Anda</p>
      </div>

      <Card className="p-5 space-y-5">
        {/* Alamat Terdaftar (Read Only) */}
        <div className="bg-muted/30 rounded-lg p-3 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-foreground">Alamat Penjemputan</span>
          </div>
          <p className="text-sm text-foreground">{USER_DATA.address}</p>
          <button className="text-[10px] text-primary mt-2 hover:underline">
            Ubah alamat di profil
          </button>
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
            {wasteTypes.map((type) => (
              <option key={type.id} value={type.name}>
                {type.name} ({type.unit})
              </option>
            ))}
          </select>
        </div>

        {/* Estimasi Berat */}
        <div>
          <label className="text-sm font-medium text-foreground block mb-2">
            Estimasi Berat
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
            <span className="px-3 py-2 text-sm bg-muted rounded-lg text-muted-foreground">kg</span>
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
            placeholder="Contoh: Sampah sudah dipilah dalam karung, letakkan di depan pagar"
            value={formData.notes}
            onChange={(e) => handleChange("notes", e.target.value)}
            className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
          />
        </div>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting} className="w-full gap-2">
          {isSubmitting ? (
            <>Memproses...</>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Ajukan Penjemputan
            </>
          )}
        </Button>

        <p className="text-[11px] text-muted-foreground text-center">
          *Berat aktual akan ditimbang oleh petugas saat penjemputan
        </p>
      </Card>
    </form>
  );
}