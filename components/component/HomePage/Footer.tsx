"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-semibold text-slate-800">
              Arkana<span className="text-emerald-600">.</span>
            </span>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Arkana. All rights reserved.
          </p>

          <div className="flex gap-4 text-sm text-slate-500">
            <Link href="#" className="hover:text-emerald-600 transition">
              Privasi
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition">
              Ketentuan
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
