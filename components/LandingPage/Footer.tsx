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
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function Footer() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.1 });

  const socialIcons = [FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn];

  return (
    <motion.footer
      ref={sectionRef}
      className="mt-auto border-t border-white/10 bg-[#020617] text-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 py-6 sm:py-8 md:py-10">
        {/* MAIN CONTENT */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-10 mb-5 sm:mb-6">
          
          {/* COLUMN 1 - BRAND (full width di mobile) */}
          <div className="col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="space-y-2.5">
              <Link href="/" className="flex items-center gap-2 group w-fit">
                <div className="flex w-7 h-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 text-white">
                  <Leaf className="w-4 h-4" />
                </div>
                <span className="font-bold text-base sm:text-lg tracking-tight">
                  Trash<span className="text-emerald-500">Flow</span>
                </span>
              </Link>
              
              <p className="text-[10px] sm:text-xs text-slate-400 leading-relaxed max-w-xs">
                Menghubungkan masyarakat dan pengepul lokal untuk ekosistem pengelolaan sampah yang lebih cerdas dan bernilai ekonomi.
              </p>
              
              <div className="flex gap-1.5 pt-0.5">
                {socialIcons.map((Icon, idx) => (
                  <motion.a
                    key={idx}
                    href="#"
                    whileHover={{ y: -2 }}
                    className="w-6 h-6 sm:w-7 sm:h-7 bg-white/5 rounded-lg flex items-center justify-center text-slate-400 hover:bg-emerald-500 hover:text-white transition-all duration-300"
                  >
                    <Icon size={10} className="sm:w-3 sm:h-3" />
                  </motion.a>
                ))}
              </div>
            </div>
          </div>

          {/* COLUMN 2 & 3 - NAVIGASI + HUBUNGI KAMI (bersebelahan di mobile) */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 col-span-1 sm:col-span-2 lg:col-span-2">
            {/* Navigasi */}
            <div>
              <h4 className="font-bold text-white mb-2 sm:mb-3 uppercase tracking-[0.15em] text-[9px] sm:text-[10px]">
                Navigasi
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-slate-400">
                <li>
                  <Link href="#about" className="hover:text-emerald-400 transition-colors block">
                    Tentang Kami
                  </Link>
                </li>
                <li>
                  <Link href="#cara-kerja" className="hover:text-emerald-400 transition-colors block">
                    Cara Kerja
                  </Link>
                </li>
                <li>
                  <Link href="#mitra" className="hover:text-emerald-400 transition-colors block">
                    Mitra Agen
                  </Link>
                </li>
                <li>
                  <Link href="#kontak" className="hover:text-emerald-400 transition-colors block">
                    Kontak Kami
                  </Link>
                </li>
              </ul>
            </div>

            {/* Hubungi Kami */}
            <div>
              <h4 className="font-bold text-white mb-2 sm:mb-3 uppercase tracking-[0.15em] text-[9px] sm:text-[10px]">
                Hubungi
              </h4>
              <ul className="space-y-1.5 sm:space-y-2 text-[10px] sm:text-xs text-slate-400">
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <FaEnvelope className="text-emerald-500 text-[9px] sm:text-[10px] shrink-0" />
                  <span className="hover:text-white transition-colors truncate max-w-[120px] sm:max-w-none">
                    support@trashflow.id
                  </span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <FaPhoneAlt className="text-emerald-500 text-[9px] sm:text-[10px] shrink-0" />
                  <span>+62 812 3456 7890</span>
                </li>
                <li className="flex items-center gap-1.5 sm:gap-2">
                  <FaMapMarkerAlt className="text-emerald-500 text-[9px] sm:text-[10px] shrink-0" />
                  <span>Depok, Jawa Barat</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR - super compact */}
        <div className="pt-4 sm:pt-5 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-2">
          <p className="text-[8px] sm:text-[9px] font-medium text-slate-500 tracking-wide text-center">
            © {new Date().getFullYear()} TRASHFLOW TEAM.
          </p>
          <div className="flex gap-3 sm:gap-4 text-[7px] sm:text-[8px] font-bold text-slate-500 uppercase tracking-[0.15em]">
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-emerald-400 transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </motion.footer>
  );
}