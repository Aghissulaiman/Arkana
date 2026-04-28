"use client";

import { useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Beranda", href: "#" },
    { name: "Tentang", href: "#tentang" },
    { name: "Cara Kerja", href: "#cara-kerja" },
    { name: "Untuk Mitra", href: "#mitra" },
    { name: "Kontak", href: "#kontak" },
  ];

  return (
    <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="font-bold text-xl text-gray-800">
              Arkana<span className="text-green-600">.</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-gray-600 hover:text-green-600 transition-colors duration-200 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <button className="px-4 py-2 text-gray-600 hover:text-green-600 font-medium transition-colors">
              Masuk
            </button>
            <button className="px-5 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-xl transition-all duration-200 shadow-md hover:shadow-lg">
              Jual Sampah
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              className="w-6 h-6 text-gray-700"
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

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-4 px-4">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-green-600 hover:bg-green-50 px-3 py-2 rounded-lg transition-colors font-medium"
              >
                {link.name}
              </Link>
            ))}
            <hr className="my-2 border-gray-200" />
            <button className="text-left text-gray-600 hover:text-green-600 px-3 py-2 font-medium">
              Masuk
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white font-medium px-4 py-2 rounded-xl transition-all text-center">
              Jual Sampah
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}