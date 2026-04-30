"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 py-12">
        
        {/* TOP */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          
          {/* BRAND */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-primary-foreground font-bold">A</span>
              </div>

              <span className="font-semibold text-lg text-foreground">
                Arkana<span className="text-primary">.</span>
              </span>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Platform yang membantu mengelola sampah menjadi lebih bernilai
              dengan sistem yang transparan.
            </p>
          </div>

          {/* NAV */}
          <div>
            <p className="font-medium text-foreground mb-3">Navigasi</p>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link href="#AboutSection" className="hover:text-primary transition">
                Tentang
              </Link>
              <Link href="#cara-kerja" className="hover:text-primary transition">
                Cara Kerja
              </Link>
              <Link href="#mitra" className="hover:text-primary transition">
                Mitra
              </Link>
              <Link href="#kontak" className="hover:text-primary transition">
                Kontak
              </Link>
            </div>
          </div>

          {/* CONTACT */}
          <div>
            <p className="font-medium text-foreground mb-3">Kontak</p>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>support@arkana.id</p>
              <p>+62 812 3456 7890</p>
              <p>Bekasi, Indonesia</p>
            </div>
          </div>

        </div>

        {/* BOTTOM */}
        <div className="pt-5 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Arkana. All rights reserved.
          </p>

          <div className="flex gap-5 text-xs text-muted-foreground">
            <Link href="#" className="hover:text-primary transition">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition">
              Terms
            </Link>
          </div>

        </div>
      </div>
    </footer>
  );
}