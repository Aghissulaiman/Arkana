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
  FaClock,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* MAIN CONTENT - 4 Columns with better spacing */}
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* COLUMN 1 - BRAND & DESCRIPTION */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="flex size-8 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
                <Leaf className="size-5" />
              </div>
              <span className="font-semibold text-lg text-foreground">
                Trash<span className="text-primary">Flow</span>
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Platform yang membantu mengelola sampah menjadi lebih bernilai
              dengan sistem yang transparan dan berkelanjutan.
            </p>

            {/* Social Media Icons */}
            <div className="flex gap-3 mt-6">
              <a
                href="#"
                className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
              >
                <FaFacebookF size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
              >
                <FaTwitter size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
              >
                <FaInstagram size={14} />
              </a>
              <a
                href="#"
                className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition"
              >
                <FaLinkedinIn size={14} />
              </a>
            </div>
          </div>

          {/* COLUMN 2 - NAVIGASI */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="#AboutSection"
                  className="hover:text-primary transition"
                >
                  Tentang Kami
                </Link>
              </li>
              <li>
                <Link
                  href="#cara-kerja"
                  className="hover:text-primary transition"
                >
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="#mitra" className="hover:text-primary transition">
                  Mitra
                </Link>
              </li>
              <li>
                <Link href="#kontak" className="hover:text-primary transition">
                  Kontak
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3 - KONTAK */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Kontak</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <FaEnvelope className="text-primary text-sm" />
                <span>support@anantacycle.id</span>
              </li>
              <li className="flex items-center gap-3">
                <FaPhoneAlt className="text-primary text-sm" />
                <span>+62 812 3456 7890</span>
              </li>
              <li className="flex items-center gap-3">
                <FaMapMarkerAlt className="text-primary text-sm" />
                <span>Bekasi, Indonesia</span>
              </li>
            </ul>
          </div>

          {/* COLUMN 4 - JAM OPERASIONAL */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">
              Jam Operasional
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <FaClock className="text-primary text-sm" />
                <div>
                  <p>Senin - Jumat : 08:00 - 17:00</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    Sabtu - Minggu : Tutup
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-6 border-t border-border flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} AnantaCycle. All rights reserved.
          </p>
          <div className="flex gap-5 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-primary transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
