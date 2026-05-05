"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Mail, Phone, MapPin, Edit3, Save } from "lucide-react";

export default function PersonalInfoForm() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      return;
    }

    // Save changes
    setIsLoading(true);
    // simulate api call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setIsEditing(false);
  };

  return (
    <Card className="bg-white rounded-3xl p-6 sm:p-10 border-none shadow-xl shadow-slate-200/50">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-800 tracking-tight">Informasi Pribadi</h2>
        {!isEditing && (
          <Button 
            type="button"
            onClick={() => setIsEditing(true)} 
            variant="outline" 
            className="flex items-center gap-2 rounded-xl text-emerald-600 border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
          >
            <Edit3 className="w-4 h-4" /> Edit
          </Button>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label className="text-slate-700 font-bold ml-1 text-sm uppercase tracking-wide">Nama Lengkap</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <User className={`h-5 w-5 ${isEditing ? 'text-emerald-500' : 'text-slate-400'}`} />
            </div>
            <Input 
              defaultValue="Budi Santoso"
              disabled={!isEditing}
              className={`pl-14 h-14 rounded-2xl border-slate-200 focus-visible:ring-emerald-500 font-semibold text-lg transition-colors ${!isEditing ? 'bg-slate-50 text-slate-500' : 'bg-white text-slate-800 shadow-sm'}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700 font-bold ml-1 text-sm uppercase tracking-wide">Alamat Email</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Mail className={`h-5 w-5 ${isEditing ? 'text-emerald-500' : 'text-slate-400'}`} />
            </div>
            <Input 
              defaultValue="budi.santoso@email.com"
              type="email"
              disabled={!isEditing}
              className={`pl-14 h-14 rounded-2xl border-slate-200 focus-visible:ring-emerald-500 font-semibold text-lg transition-colors ${!isEditing ? 'bg-slate-50 text-slate-500' : 'bg-white text-slate-800 shadow-sm'}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700 font-bold ml-1 text-sm uppercase tracking-wide">Nomor Telepon</Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Phone className={`h-5 w-5 ${isEditing ? 'text-emerald-500' : 'text-slate-400'}`} />
            </div>
            <Input 
              defaultValue="+62 812 3456 7890"
              type="tel"
              disabled={!isEditing}
              className={`pl-14 h-14 rounded-2xl border-slate-200 focus-visible:ring-emerald-500 font-semibold text-lg transition-colors ${!isEditing ? 'bg-slate-50 text-slate-500' : 'bg-white text-slate-800 shadow-sm'}`}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-slate-700 font-bold ml-1 text-sm uppercase tracking-wide">Alamat Domisili</Label>
          <div className="relative">
            <div className="absolute top-4 left-0 pl-5 pointer-events-none">
              <MapPin className={`h-5 w-5 ${isEditing ? 'text-emerald-500' : 'text-slate-400'}`} />
            </div>
            <textarea 
              defaultValue="Jl. Sudirman No. 45, Jakarta Selatan, 12345"
              disabled={!isEditing}
              className={`w-full pl-14 p-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:outline-none min-h-[140px] font-semibold text-lg resize-none transition-colors ${!isEditing ? 'bg-slate-50 text-slate-500' : 'bg-white text-slate-800 shadow-sm'}`}
            />
          </div>
        </div>

        {isEditing && (
          <div className="pt-6 flex justify-end">
            <Button 
              type="submit"
              disabled={isLoading}
              className="h-14 px-10 rounded-2xl font-bold shadow-xl transition-all text-lg flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 hover:scale-105"
            >
              {isLoading ? (
                "Menyimpan..."
              ) : (
                <>
                  <Save className="w-5 h-5" /> Simpan Perubahan
                </>
              )}
            </Button>
          </div>
        )}
      </form>
    </Card>
  );
}
