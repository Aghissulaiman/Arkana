// // "use client";

// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { useState, useEffect } from "react";
// // import Link from "next/link";

// // export default function Hero() {
// //   const [isMobile, setIsMobile] = useState(false);

// //   useEffect(() => {
// //     const checkMobile = () => {
// //       setIsMobile(window.innerWidth < 768);
// //     };
// //     checkMobile();
// //     window.addEventListener("resize", checkMobile);
// //     return () => window.removeEventListener("resize", checkMobile);
// //   }, []);

// //   return (
// //     <section
// //       id="home"
// //       className="relative min-h-screen w-full overflow-hidden pt-8"
// //     >
// //       {/* Background Gambar */}
// //       <div
// //         className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
// //         style={{
// //           backgroundImage:
// //             "url('https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=2070&auto=format&fit=crop')",
// //           backgroundPosition: isMobile ? "center 30%" : "center",
// //           backgroundSize: "cover",
// //         }}
// //       />

// //       {/* Overlay */}
// //       <div className="absolute inset-0 bg-black/70" />

// //       {/* Konten - Tengah sempurna */}
// //       <div className="relative h-full min-h-screen flex items-center justify-center">
// //         <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
// //           <Badge
// //             variant="secondary"
// //             className={`mb-4 sm:mb-6 bg-primary/20 text-white border-primary/30 backdrop-blur-sm inline-flex ${isMobile ? "text-xs" : "text-sm"}`}
// //           >
// //             #ZeroWasteMovement
// //           </Badge>

// //           <h1
// //             className={`font-bold text-white mb-4 sm:mb-6 leading-tight ${isMobile ? "text-4xl" : "text-5xl lg:text-6xl xl:text-7xl"}`}
// //           >
// //             Ubah Sampah Jadi
// //             <span className="text-primary block sm:inline sm:ml-3">
// //               Poin & Uang
// //             </span>
// //           </h1>

// //           <p
// //             className={`text-gray-200/90 mb-7 sm:mb-8 ${isMobile ? "text-sm" : "text-base lg:text-lg"} max-w-2xl mx-auto`}
// //           >
// //             TrashFlow menghubungkan masyarakat, pengepul, dan pabrik daur ulang
// //             dalam satu platform. Sampah jadi berkah untuk semua.
// //           </p>

// //           <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
// //             <Link href="/login" passHref>
// //               <Button
// //                 size={isMobile ? "default" : "lg"}
// //                 className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-6 sm:px-8"
// //               >
// //                 Mulai Jual Sampah
// //               </Button>
// //             </Link>

// //             <Link href="#about" passHref>
// //               {" "}
// //               x
// //               <Button
// //                 size={isMobile ? "default" : "lg"}
// //                 variant="outline"
// //                 className="w-full sm:w-auto border-white text-black hover:bg-white/10 hover:text-white px-6 sm:px-8"
// //               >
// //                 Pelajari Lebih Lanjut
// //               </Button>
// //             </Link>
// //           </div>

// //           <div className="mt-7 sm:mt-8 flex flex-wrap justify-center items-center gap-4 text-sm text-gray-300">
// //             <span className="font-semibold text-primary">2.500+</span>
// //             <span>warga sudah bergabung</span>
// //           </div>
// //         </div>
// //       </div>

// //       {/* Scroll Indicator */}
// //       {!isMobile && (
// //         <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
// //           <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
// //             <div className="w-1 h-3 bg-primary rounded-full mt-2 animate-pulse" />
// //           </div>
// //         </div>
// //       )}
// //     </section>
// //   );
// // }

"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import Link from "next/link";

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
    <section
      id="home"
      className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center pt-32 pb-16"
    >
      {/* Background */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=2070&auto=format&fit=crop')",
          backgroundPosition: isMobile ? "center 30%" : "center",
        }}
      />
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[1px]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-12 text-center">
        <Badge
          variant="secondary"
          className="mb-8 bg-primary/20 text-primary-foreground border-primary/30 backdrop-blur-md px-4 py-1.5 text-[10px] sm:text-xs tracking-[0.2em] font-bold uppercase"
        >
          #ZeroWasteMovement
        </Badge>

        <h1
          className={`font-extrabold text-white mb-6 leading-[1.15] tracking-tight ${
            isMobile ? "text-4xl" : "text-6xl lg:text-7xl"
          }`}
        >
          Ubah Sampah Jadi
          <span className="text-primary block sm:inline sm:ml-4">
            Poin & Uang
          </span>
        </h1>

        <p
          className={`text-gray-300 mb-10 leading-relaxed mx-auto ${
            isMobile ? "text-sm max-w-[280px]" : "text-lg max-w-2xl"
          }`}
        >
          TrashFlow menghubungkan masyarakat, pengepul, dan pabrik daur ulang
          dalam satu platform. Sampah jadi berkah untuk semua.
        </p>

        {/* Buttons — selalu berdampingan (flex-row), hanya lebar yang beda */}
        <div className="flex flex-row gap-3 justify-center items-center">
          <Link href="/login" className="flex-1 sm:flex-none">
            <Button
              size="lg"
              className="w-full sm:w-auto sm:px-10 bg-primary hover:bg-primary/90 text-white h-12 sm:h-14 rounded-2xl font-bold shadow-lg shadow-primary/20 transition-transform active:scale-95 text-sm sm:text-base"
            >
              Mulai Jual Sampah
            </Button>
          </Link>

          <Link href="#about" className="flex-1 sm:flex-none">
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto sm:px-10 border-white/40 bg-white/5 text-white hover:bg-white hover:text-black h-12 sm:h-14 rounded-2xl font-semibold backdrop-blur-sm transition-all text-sm sm:text-base"
            >
              Pelajari Lebih
            </Button>
          </Link>
        </div>

        {/* Social proof */}
        <div className="mt-12 flex flex-col items-center gap-3">
          <div className="bg-white/5 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10">
            <p className="text-xs sm:text-sm text-gray-300">
              <span className="font-bold text-primary">2.500+</span> warga sudah
              bergabung
            </p>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
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
