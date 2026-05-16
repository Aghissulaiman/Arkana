"use client";

import Link from "next/link";
import { Leaf, ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <Link href="/" className="flex justify-center mb-8 group">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center transition-all group-hover:scale-105">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <span className="font-black text-xl tracking-tight text-slate-900">
              TrashFlow
            </span>
          </div>
        </Link>

        {/* Ilustrasi Robot */}
        <div className="relative mb-8 flex justify-center">
          <div className="w-40 h-40 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center relative">
            {/* Robot Body */}
            <div className="relative">
              {/* Robot Head */}
              <div className="w-24 h-24 bg-slate-700 rounded-2xl relative">
                {/* Robot Eyes */}
                <div className="absolute top-5 left-3 flex gap-3">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                </div>
                {/* Robot Mouth */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-1.5 bg-slate-500 rounded-full" />
                {/* Robot Antenna */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-1.5 h-5 bg-slate-600 rounded-full">
                  <div className="w-3 h-3 bg-red-400 rounded-full absolute -top-1 -left-0.5 animate-ping opacity-75" />
                </div>
              </div>
              {/* Robot Ears */}
              <div className="absolute -left-2 top-5 w-3 h-8 bg-slate-600 rounded-full" />
              <div className="absolute -right-2 top-5 w-3 h-8 bg-slate-600 rounded-full" />
            </div>
          </div>
          
          {/* Question Mark */}
          <div className="absolute -top-2 -right-4 w-10 h-10 bg-amber-400 rounded-full flex items-center justify-center shadow-lg animate-bounce">
            <span className="text-white font-bold text-xl">?</span>
          </div>
        </div>

        {/* 404 Number */}
        <div className="relative mb-4">
          <h1 className="text-7xl sm:text-8xl font-black text-slate-800 tracking-tighter">
            4
            <span className="text-primary relative inline-block">
              0
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary/30 rounded-full animate-pulse" />
            </span>
            4
          </h1>
        </div>

        {/* Title */}
        <h2 className="text-xl sm:text-2xl font-bold text-slate-800 mb-3">
          Wah, Halamannya Tersesat!
        </h2>

        {/* Description */}
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Sepertinya halaman yang kamu cari lagi jalan-jalan atau nggak ketemu. 
          Yuk balik lagi ke halaman sebelumnya.
        </p>

        {/* Button - Kembali */}
        <button
          onClick={() => window.history.back()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-primary/90 transition-all duration-200 shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Halaman Sebelumnya
        </button>

        {/* Decorative Text */}
        <p className="text-xs text-slate-400 mt-8">
          • • • Oopsie Daisy! • • •
        </p>
      </div>
    </div>
  );
}