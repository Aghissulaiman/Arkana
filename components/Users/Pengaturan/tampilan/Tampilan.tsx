"use client";

import { useState, useEffect } from "react";
import {
  Monitor,
  Moon,
  Sun,
  ChevronRight,
  CheckCircle,
  Globe,
} from "lucide-react";

export default function Tampilan() {
  const [showMode, setShowMode] = useState(false);
  const [showFont, setShowFont] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("medium");
  const [language, setLanguage] = useState("id");

  // Load saved settings on mount
  useEffect(() => {
    // Load theme
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // Load font size
    const savedFontSize = localStorage.getItem("fontSize");
    if (savedFontSize) {
      setFontSize(savedFontSize);
      applyFontSize(savedFontSize);
    }

    // Load language
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage) {
      setLanguage(savedLanguage);
    }
  }, []);

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    if (size === "small") {
      root.style.fontSize = "14px";
    } else if (size === "medium") {
      root.style.fontSize = "16px";
    } else if (size === "large") {
      root.style.fontSize = "18px";
    }
  };

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleFontChange = (size: string) => {
    setFontSize(size);
    applyFontSize(size);
    localStorage.setItem("fontSize", size);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    // Di sini bisa ditambahkan logic untuk ganti bahasa seluruh aplikasi
  };

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  const fontOptions = [
    { value: "small", label: "Kecil", size: "text-sm" },
    { value: "medium", label: "Sedang", size: "text-base" },
    { value: "large", label: "Besar", size: "text-lg" },
  ];

  const languageOptions = [
    { value: "id", label: "Indonesia", flag: "🇮🇩" },
    { value: "en", label: "English", flag: "🇬🇧" },
  ];

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground mt-1">
          Sesuaikan tampilan aplikasi sesuai preferensi Anda
        </p>
      </div>

      {/* Alert Sukses */}
      {isSaved && (
        <div className="mb-4 p-3 bg-green-500/10 rounded-lg flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          Pengaturan tampilan disimpan
        </div>
      )}

      {/* Mode Tampilan */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowMode(!showMode)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              {isDarkMode ? (
                <Moon className="w-4 h-4 text-primary" />
              ) : (
                <Sun className="w-4 h-4 text-primary" />
              )}
            </div>
            <div>
              <h2 className="font-medium text-foreground">Mode Tampilan</h2>
              <p className="text-xs text-muted-foreground">
                {isDarkMode ? "Mode Gelap" : "Mode Terang"} • Saat ini aktif
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform ${showMode ? "rotate-90" : ""}`}
          />
        </div>

        {showMode && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="grid grid-cols-2 gap-3">
              <div
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  !isDarkMode
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/30"
                }`}
                onClick={() => {
                  if (isDarkMode) toggleDarkMode();
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Sun className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">
                    Mode Terang
                  </span>
                </div>
                <div className="w-full h-20 rounded bg-white border shadow-sm" />
                <p className="text-xs text-muted-foreground mt-2">
                  Putih terang
                </p>
              </div>

              <div
                className={`p-3 rounded-lg border cursor-pointer transition ${
                  isDarkMode
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/30"
                }`}
                onClick={() => {
                  if (!isDarkMode) toggleDarkMode();
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <Moon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">
                    Mode Gelap
                  </span>
                </div>
                <div className="w-full h-20 rounded bg-gray-900 border shadow-sm" />
                <p className="text-xs text-muted-foreground mt-2">
                  Lebih nyaman di malam hari
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowMode(false)}
              className="mt-4 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Ukuran Font */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowFont(!showFont)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Monitor className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Ukuran Font</h2>
              <p className="text-xs text-muted-foreground">
                {fontOptions.find((f) => f.value === fontSize)?.label} •
                Sesuaikan kenyamanan baca
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform ${showFont ? "rotate-90" : ""}`}
          />
        </div>

        {showFont && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="space-y-3">
              {fontOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    fontSize === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/30"
                  }`}
                  onClick={() => handleFontChange(option.value)}
                >
                  <div>
                    <p className={`${option.size} font-medium text-foreground`}>
                      Contoh teks
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {option.label}
                    </p>
                  </div>
                  {fontSize === option.value && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFont(false)}
              className="mt-4 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Bahasa */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowLanguage(!showLanguage)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Globe className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Bahasa</h2>
              <p className="text-xs text-muted-foreground">
                {languageOptions.find((l) => l.value === language)?.label} •
                Pilih bahasa aplikasi
              </p>
            </div>
          </div>
          <ChevronRight
            className={`w-4 h-4 text-muted-foreground transition-transform ${showLanguage ? "rotate-90" : ""}`}
          />
        </div>

        {showLanguage && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="space-y-2">
              {languageOptions.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition ${
                    language === option.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:bg-muted/30"
                  }`}
                  onClick={() => handleLanguageChange(option.value)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{option.flag}</span>
                    <span className="text-sm text-foreground">
                      {option.label}
                    </span>
                  </div>
                  {language === option.value && (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowLanguage(false)}
              className="mt-4 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Tombol Simpan */}
      <div className="mt-6 pt-4 border-t border-border">
        <button
          onClick={handleSave}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition"
        >
          Simpan Pengaturan
        </button>
      </div>
    </div>
  );
}
