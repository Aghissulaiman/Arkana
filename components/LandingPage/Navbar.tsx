"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Leaf } from "lucide-react";

export default function Navbar({
  hideAuthButtons = false,
}: {
  hideAuthButtons?: boolean;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Beranda", href: "#home" },
    { name: "Tentang", href: "#about" },
    { name: "Cara Kerja", href: "#cara-kerja" },
    { name: "Untuk Mitra", href: "#mitra" },
    { name: "Kontak", href: "#kontak" },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 backdrop-blur-lg border-b border-slate-200/50 shadow-lg"
          : "bg-black/20 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* LOGO - SAMA DENGAN KOMPONEN LAIN */}
          <Link
            href="/"
            className="flex items-center gap-2.5 group"
          >
            <div className="w-8 h-8 bg-primary/20 rounded-xl flex items-center justify-center transition-all group-hover:scale-105 group-hover:bg-primary/30 shadow-sm">
              <Leaf className="w-5 h-5 text-primary" />
            </div>
            <span className={`font-black text-xl tracking-tight transition-colors ${
              isScrolled ? "text-slate-900" : "text-white"
            }`}>
              TrashFlow
            </span>
          </Link>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors duration-200 font-medium ${
                  isScrolled
                    ? "text-slate-600 hover:text-primary"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* DESKTOP AUTH BUTTONS */}
          {!hideAuthButtons && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className={`px-4 py-2 font-medium transition-colors ${
                  isScrolled
                    ? "text-slate-600 hover:text-primary"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Masuk
              </Link>
              <Link
                href="/login"
                className={`px-5 py-2 font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                  isScrolled
                    ? "bg-primary text-white hover:bg-primary/90"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                Jual Sampah
              </Link>
            </div>
          )}

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "hover:bg-slate-100" : "hover:bg-white/10"
            }`}
          >
            <svg
              className={`w-6 h-6 ${isScrolled ? "text-slate-700" : "text-white"}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 px-4 shadow-lg">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-slate-600 hover:text-primary hover:bg-slate-50 px-3 py-2.5 rounded-lg transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            {!hideAuthButtons && (
              <>
                <hr className="my-2 border-slate-100" />
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-slate-600 hover:text-primary px-3 py-2.5 font-medium"
                >
                  Masuk
                </Link>
                <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <button className="bg-primary hover:bg-primary/90 text-white font-semibold px-4 py-2.5 rounded-xl w-full">
                    Jual Sampah
                  </button>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}