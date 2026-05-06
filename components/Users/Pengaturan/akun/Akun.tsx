"use client";

import { useState } from "react";
import { 
  User, 
  Mail, 
  Settings, 
  Users, 
  CreditCard,
  ChevronRight,
  CheckCircle,
  Globe,
  Shield
} from "lucide-react";

export default function AkunSaya() {
  const [isSaved, setIsSaved] = useState(false);

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Akun</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pilih cara Anda ditampilkan dan konten yang Anda lihat di Arkana
        </p>
      </div>

      {/* Login as */}
      <div className="mb-6 p-4 bg-muted/30 rounded-lg">
        <p className="text-sm text-muted-foreground">Login sebagai</p>
        <p className="text-base font-medium text-foreground">ecowarrior@arkana.com</p>
      </div>

      {/* Akun Arkana Anda */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Akun Arkana Anda</h2>
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-semibold text-primary">EW</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Eco Warrior</p>
                <p className="text-xs text-muted-foreground">Ini adalah kehadiran publik Anda di Arkana</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Akun Anda */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Akun Anda</h2>
        <div className="border border-border rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Akun Google</p>
                <p className="text-xs text-muted-foreground">ecowarrior@arkana.com</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
          <div className="border-t border-border" />
          <div className="flex items-center justify-between p-4 hover:bg-muted/30 transition cursor-pointer">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">Keamanan</p>
                <p className="text-xs text-muted-foreground">Kelola password dan verifikasi 2 langkah</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>

      {/* Langganan */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-3">Langganan</h2>
        <div className="border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Arkana Basic</p>
              <p className="text-xs text-muted-foreground">Tanpa langganan</p>
            </div>
            <button className="text-sm text-primary hover:underline">
              Dapatkan Premium
            </button>
          </div>
          <div className="mt-3 pt-3 border-t border-border">
            <p className="text-xs text-muted-foreground">
              Arkana Premium menawarkan pengalaman tanpa iklan, poin berlipat, dan fitur eksklusif lainnya.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}