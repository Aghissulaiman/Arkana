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
          ? "bg-white/20 backdrop-blur-lg border-b border-white/30 shadow-sm"
          : "bg-white/05 backdrop-blur-xs shadow-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex justify-center gap-2 md:justify-start z-30">
            <a
              href="/"
              className="flex items-center gap-2 font-bold text-xlc text-emerald-900 transition-transform hover:scale-105"
            >
              <div className="flex size-8 items-center justify-center rounded-xl bg-linear-to-br from-emerald-400 to-emerald-600 text-white shadow-lg shadow-emerald-500/30">
                <Leaf className="size-5" />
              </div>
              TrashFlow
            </a>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors duration-200 font-medium ${
                  isScrolled
                    ? "text-muted-foreground hover:text-primary"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {!hideAuthButtons && (
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/login"
                className={`px-4 py-2 font-medium transition-colors ${
                  isScrolled
                    ? "text-muted-foreground hover:text-primary"
                    : "text-white/80 hover:text-white"
                }`}
              >
                Masuk
              </Link>
              <Link
                href="/login"
                className={`px-5 py-2 font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg ${
                  isScrolled
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "bg-primary text-white hover:bg-primary/90"
                }`}
              >
                Jual Sampah
              </Link>
            </div>
          )}

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`md:hidden p-2 rounded-lg transition-colors ${
              isScrolled ? "hover:bg-muted" : "hover:bg-white/10"
            }`}
          >
            <svg
              className={`w-6 h-6 ${isScrolled ? "text-foreground" : "text-white"}`}
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

      {isMobileMenuOpen && (
        <div className="md:hidden bg-background border-t border-border py-4 px-4 shadow-lg">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-primary hover:bg-muted px-3 py-2 rounded-lg transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            {!hideAuthButtons && (
              <>
                <hr className="my-2 border-border" />
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-muted-foreground hover:text-primary px-3 py-2 font-medium"
                >
                  Masuk
                </Link>
                <Link href="/login">
                  <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-4 py-2 rounded-xl w-full">
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
