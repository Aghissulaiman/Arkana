"use client";

import { ShieldAlert, ArrowLeft, Leaf, AlertTriangle, Lock } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TidakAdaAkses() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">
              TrashFlow
            </span>
          </div>
        </div>

        {/* Ilustrasi - Dinding dengan pintu terkunci */}
        <div className="relative mb-8 flex justify-center">
          <div className="relative">
            {/* Dinding/Batas */}
            <div className="w-48 h-48 bg-gradient-to-b from-slate-200 to-slate-300 rounded-2xl flex items-center justify-center relative overflow-hidden">
              {/* Pola bata */}
              <div className="absolute inset-0 opacity-20">
                <div className="absolute top-1/4 left-0 w-full h-4 bg-slate-400" />
                <div className="absolute top-1/2 left-0 w-full h-4 bg-slate-400" />
                <div className="absolute top-3/4 left-0 w-full h-4 bg-slate-400" />
                <div className="absolute left-1/4 top-0 w-4 h-full bg-slate-400" />
                <div className="absolute left-1/2 top-0 w-4 h-full bg-slate-400" />
                <div className="absolute left-3/4 top-0 w-4 h-full bg-slate-400" />
              </div>
              
              {/* Pintu terkunci */}
              <div className="relative z-10">
                <div className="w-24 h-32 bg-amber-800 rounded-lg shadow-lg relative">
                  {/* Gagang pintu */}
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 bg-amber-400 rounded-full" />
                  {/* Lubang kunci */}
                  <div className="absolute right-2 top-2/3 w-2 h-2 bg-amber-900 rounded-full" />
                  {/* Papan pintu */}
                  <div className="absolute inset-2 border border-amber-600 rounded-md" />
                </div>
                {/* Gembok */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <div className="w-1.5 h-4 bg-red-500 absolute -bottom-4 left-1/2 -translate-x-1/2 rounded-b" />
                </div>
              </div>
              
              {/* Tanda Dilarang */}
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <span className="text-white font-bold text-xl">!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-3">
          Akses Ditolak
        </h1>

        {/* Description */}
        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
          Maaf, kamu tidak punya izin untuk masuk ke area ini.
        </p>

        {/* Info Box */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <p className="text-sm font-semibold text-amber-700">
              Informasi Akses
            </p>
          </div>
          <p className="text-xs text-amber-600 text-left">
            Halaman ini memerlukan autentikasi atau role khusus.
          </p>
        </div>

        {/* Button - Kembali */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </button>

        {/* Decorative Text */}
        <p className="text-xs text-slate-400 mt-8">
          🔒 Akses Terbatas • Hubungi Admin 🔒
        </p>
      </div>
    </div>
  );
}