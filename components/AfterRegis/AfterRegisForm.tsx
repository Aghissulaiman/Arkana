"use client"

import { useState, useRef } from "react"
import { Camera, User, Mail, Phone, Calendar, Save, ArrowRight, ImagePlus, Loader2, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"

export function AfterRegisForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1500))
    setIsLoading(false)
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-96 bg-emerald-950 overflow-hidden z-0">
        <img
          src="https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=2000&auto=format&fit=crop"
          alt="Nature Background"
          className="w-full h-full object-cover opacity-30 mix-blend-overlay"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-950/80 via-emerald-900/60 to-slate-50" />
      </div>

      <div className="w-full max-w-3xl z-10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2 font-bold text-2xl text-white">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
              <Leaf className="size-6" />
            </div>
            Arkana.
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-xl border border-emerald-100/50 overflow-hidden">
          
          <div className="px-6 py-8 sm:px-10 text-center border-b border-slate-100">
            <div className="inline-flex items-center gap-2 mb-3">
              <div className="h-1 w-8 bg-emerald-500 rounded-full"></div>
              <span className="text-emerald-600 font-semibold text-xs uppercase tracking-wider">Langkah Terakhir</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">Lengkapi Profil Anda</h1>
            <p className="text-slate-500 max-w-lg mx-auto text-sm">
              Tambahkan foto dan informasi diri Anda untuk memaksimalkan pengalaman menukar sampah jadi poin.
            </p>
          </div>

          <form onSubmit={handleSave} className="p-6 sm:p-10">
            <div className="flex flex-col items-center mb-10">
              <Label className="text-slate-700 font-medium mb-3 self-start sm:self-center">Unggah Foto KTP</Label>
              <div 
                className="relative w-full max-w-md h-48 sm:h-56 rounded-2xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 flex flex-col items-center justify-center cursor-pointer hover:bg-emerald-50 hover:border-emerald-400 transition-colors group overflow-hidden"
                onClick={() => fileInputRef.current?.click()}
              >
                {photoPreview ? (
                  <>
                    <img src={photoPreview} alt="KTP Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                      <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-medium flex items-center gap-2">
                        <Camera className="w-4 h-4" /> Ubah Foto
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center text-emerald-600/70 group-hover:text-emerald-700 transition-colors text-center px-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-100/80 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                      <ImagePlus className="w-8 h-8" />
                    </div>
                    <span className="font-medium">Klik untuk unggah foto KTP</span>
                    <span className="text-xs text-slate-500 mt-1">Format: JPG, PNG (Max 5MB)</span>
                  </div>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handlePhotoChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-slate-700 font-medium ml-1">Nomor Telepon</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Phone className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input 
                    id="phone" 
                    type="tel" 
                    placeholder="+62 812 3456 7890" 
                    className="pl-10 h-11 border-slate-200 focus-visible:ring-emerald-500 bg-slate-50/50"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dob" className="text-slate-700 font-medium ml-1">Tanggal Lahir</Label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Calendar className="h-4 w-4 text-slate-400" />
                  </div>
                  <Input 
                    id="dob" 
                    type="date" 
                    className="pl-10 h-11 border-slate-200 focus-visible:ring-emerald-500 bg-slate-50/50 text-slate-600"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address" className="text-slate-700 font-medium ml-1">Alamat Lengkap</Label>
                <div className="relative">
                  <Textarea 
                    id="address" 
                    placeholder="Masukkan alamat domisili lengkap untuk keperluan penjemputan sampah..." 
                    className="min-h-[100px] border-slate-200 focus-visible:ring-emerald-500 bg-slate-50/50 resize-y p-3.5"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button 
                type="button"
                onClick={() => router.push('/home')}
                className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors w-full sm:w-auto text-center"
              >
                Lewati untuk sekarang
              </button>
              
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full sm:w-auto h-11 px-8 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98]"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    Simpan & Lanjutkan
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
