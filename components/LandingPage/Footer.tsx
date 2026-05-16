"use client";

import { Leaf } from "lucide-react";
import Link from "next/link";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-[#020617] text-white">
      <div className="max-w-7xl mx-auto px-24 py-16">
        {/* MAIN CONTENT - 3 COLUMNS */}
        <div className="grid md:grid-cols-3 gap-16 mb-12">
          {/* COLUMN 1 - BRAND & MISSION */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="flex size-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/20">
                <Leaf className="size-6" />
              </div>
              <span className="font-bold text-2xl tracking-tight">
                Trash<span className="text-emerald-500">Flow</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Menghubungkan masyarakat dan pengepul lokal untuk ekosistem
              pengelolaan sampah yang lebih cerdas, transparan, dan bernilai
              ekonomi.
            </p>
            <div className="flex gap-3 pt-2">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all duration-300 border border-white/10"
                  >
                    <Icon size={16} />
                  </a>
                ),
              )}
            </div>
          </div>

          {/* COLUMN 2 - QUICK LINKS */}
          <div className="md:justify-self-center">
            <h4 className="font-bold text-white mb-6 uppercase tracking-[0.15em] text-xs">
              Navigasi
            </h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li>
                <Link
                  href="#AboutSection"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="#cara-kerja"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link
                  href="#mitra"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Mitra Agen
                </Link>
              </li>
              <li>
                <Link
                  href="#kontak"
                  className="hover:text-emerald-400 transition-colors"
                >
                  Kontak Kami
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 - CONTACT INFO */}
          <div className="md:justify-self-end">
            <h4 className="font-bold text-white mb-6 uppercase tracking-[0.15em] text-xs">
              Hubungi Kami
            </h4>
            <ul className="space-y-5 text-sm text-slate-400">
              <li className="flex items-center gap-4">
                <FaEnvelope className="text-emerald-500" />
                <span className="hover:text-white transition-colors">
                  support@trashflow.id
                </span>
              </li>
              <li className="flex items-center gap-4">
                <FaPhoneAlt className="text-emerald-500" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-4">
                <FaMapMarkerAlt className="text-emerald-500" />
                <span>Kota Depok, Jawa Barat</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[11px] font-medium text-slate-500 tracking-wide">
            © {new Date().getFullYear()} TRASHFLOW TEAM. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-8 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
