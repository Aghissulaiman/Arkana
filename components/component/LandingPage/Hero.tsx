"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Background Gambar Sampah Didaur Ulang */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=2070&auto=format&fit=crop')",
          backgroundPosition: isMobile ? "center 30%" : "center",
          backgroundSize: "cover"
        }}
      />
      
      {/* Overlay hitam gelap */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Konten */}
      <div className="relative h-full min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-12 sm:py-20">
          <div className={`${isMobile ? "text-center" : "text-left"} max-w-2xl mx-auto lg:mx-0`}>
            <Badge 
              variant="secondary" 
              className={`mb-4 sm:mb-6 bg-primary/20 text-white border-primary/30 backdrop-blur-sm ${isMobile ? "text-xs" : "text-sm"}`}
            >
              #ZeroWasteMovement
            </Badge>

            <h1 className={`font-bold text-white mb-4 sm:mb-6 leading-tight ${isMobile ? "text-4xl" : "text-5xl lg:text-7xl"}`}>
              Ubah Sampah Jadi
              <span className="text-primary block mt-2 sm:mt-0 sm:inline sm:ml-3">
                Poin & Uang
              </span>
            </h1>

            <p className={`text-gray-200/90 mb-6 sm:mb-8 mx-auto ${isMobile ? "text-sm max-w-sm" : "text-base lg:text-lg max-w-lg"} ${!isMobile && "mx-0"}`}>
              Arkana menghubungkan masyarakat, pengepul, dan pabrik daur ulang
              dalam satu platform. Sampah jadi berkah untuk semua.
            </p>

            <div className={`flex ${isMobile ? "flex-col" : "flex-col sm:flex-row"} gap-3 sm:gap-4 ${isMobile ? "items-center" : "justify-start"}`}>
              <Button 
                size={isMobile ? "default" : "lg"} 
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white"
              >
                Mulai Jual Sampah
              </Button>
              <Button 
                size={isMobile ? "default" : "lg"} 
                variant="outline" 
                className="w-full sm:w-auto border-white text-white hover:bg-white/10 hover:text-white"
              >
                Pelajari Lebih Lanjut
              </Button>
            </div>

            <div className={`mt-6 sm:mt-8 flex ${isMobile ? "flex-wrap justify-center gap-4" : "items-center gap-4"} text-sm text-gray-300`}>
              <span className="font-semibold text-primary">2.500+</span>
              <span>warga sudah bergabung</span>
            </div>
          </div>
        </div>
      </div>

      {!isMobile && (
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
          </div>
        </div>
      )}
    </section>
  );
}