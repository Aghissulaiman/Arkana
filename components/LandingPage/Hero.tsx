"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [floatingParticles, setFloatingParticles] = useState<any[]>([]);
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.95]);

  useEffect(() => {
    setIsClient(true);

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);

    const particles = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100 - 50,
      y: Math.random() * 100 - 50,
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 4,
      size: 4 + Math.random() * 12,
    }));
    setFloatingParticles(particles);

    setIsLoaded(true);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 14,
        stiffness: 100,
      },
    },
  };

  return (
    <section
      id="home"
      className="relative min-h-[100dvh] w-full overflow-hidden flex items-center justify-center pt-8 md:pt-24 pb-12"
    >
      {/* Animated Background Image with Zoom Effect */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 8, ease: "easeOut" }}
      >
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=2070&auto=format&fit=crop')",
            backgroundPosition: isMobile ? "center 30%" : "center",
          }}
        />
      </motion.div>

      {/* Dynamic Gradient Overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/75 to-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      />

      {/* Animated Radial Glow */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[500px] md:h-[500px] rounded-full bg-primary/10 blur-3xl pointer-events-none"
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.4, 0.3],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Floating Particles */}
      {isClient &&
        floatingParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full bg-primary/20 backdrop-blur-sm pointer-events-none"
            style={{
              width: particle.size,
              height: particle.size,
              left: `calc(50% + ${particle.x}%)`,
              top: `calc(50% + ${particle.y}%)`,
            }}
            animate={{
              y: [0, -30, 0, 30, 0],
              x: [0, 20, 0, -20, 0],
              opacity: [0, 0.5, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}

      {/* Content */}
      <motion.div
        style={{ opacity, scale }}
        className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-12 flex flex-col justify-center"
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isLoaded ? "visible" : "hidden"}
          className="text-center"
        >
          {/* Badge - Adjusted margin and layout safety */}
          <motion.div variants={itemVariants} className="mb-4 md:mb-6 ">
            <Badge
              variant="secondary"
              className="bg-primary/10 backdrop-blur-md border-primary/30 px-4 py-1.5 text-[10px] text-white sm:text-xs tracking-[0.15em] font-bold uppercase rounded-full"
            >
              #ZeroWasteMovement
            </Badge>
          </motion.div>

          {/* Main Heading - Tailored to fit desktop better */}
          <motion.h1
            variants={itemVariants}
            className={`font-black text-white mb-4 md:mb-5 leading-[1.15] tracking-tight ${
              isMobile ? "text-4xl" : "text-5xl lg:text-6xl xl:text-7xl"
            }`}
          >
            Ubah Sampah Jadi{" "}
            <motion.span
              className="text-primary block sm:inline relative inline-block text-nowrap"
              animate={{
                textShadow: [
                  "0 0 0px rgba(16, 185, 129, 0)",
                  "0 0 20px rgba(16, 185, 129, 0.4)",
                  "0 0 0px rgba(16, 185, 129, 0)",
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              Poin & Uang
              <motion.span
                className="absolute -bottom-1 left-0 w-full h-[3px] bg-primary rounded-full"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
              />
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={itemVariants}
            className={`text-gray-300 mb-6 md:mb-8 leading-relaxed mx-auto ${
              isMobile ? "text-sm max-w-sm" : "text-base md:text-lg max-w-2xl"
            }`}
          >
            TrashFlow menghubungkan masyarakat, pengepul, dan pabrik daur ulang
            dalam satu platform. Sampah jadi berkah untuk semua.
          </motion.p>

          {/* Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-row gap-4 justify-center items-center px-4 mb-10 md:mb-12"
          >
            <Link href="/login" className="flex-1 sm:flex-none sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  className="w-full sm:w-auto sm:px-8 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary shadow-lg shadow-primary/30 text-white h-11 sm:h-12 rounded-xl font-bold transition-all duration-300 text-sm relative overflow-hidden group"
                >
                  <span className="relative z-10">Mulai Jual Sampah</span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary/0 via-white/20 to-primary/0"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 1,
                    }}
                  />
                </Button>
              </motion.div>
            </Link>

            <Link href="#about" className="flex-1 sm:flex-none sm:w-auto">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto sm:px-8 border-white/20 bg-white/5 backdrop-blur-md text-white hover:bg-white hover:text-black hover:border-white h-11 sm:h-12 rounded-xl font-semibold transition-all duration-300 text-sm"
                >
                  Pelajari Lebih
                </Button>
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats Cards - Compact sizes */}
          <motion.div variants={itemVariants} className="max-w-2xl mx-auto">
            <div
              className={`flex ${
                isMobile
                  ? "flex-row gap-3 overflow-x-auto px-4 pb-2 snap-x snap-mandatory"
                  : "grid grid-cols-3 gap-4"
              }`}
            >
              {[
                { value: "2.500+", label: "Warga Bergabung" },
                { value: "99.9%", label: "Kepuasan Pelanggan" },
                { value: "24/7", label: "Layanan Support" },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -3 }}
                  className={`bg-white/5 backdrop-blur-md rounded-xl p-3 border border-white/10 ${
                    isMobile ? "min-w-[130px] snap-start" : ""
                  }`}
                >
                  <p className="text-xl md:text-2xl font-bold text-white">
                    {stat.value}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 pointer-events-auto hidden sm:block">
        <motion.div
          animate={{
            y: [0, 6, 0],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Link href="#about" scroll={false}>
            <div className="w-7 h-10 border-2 border-white/20 rounded-full flex justify-center cursor-pointer hover:border-primary/50 transition-colors backdrop-blur-sm">
              <ArrowDown className="w-3 h-3 text-white mt-1.5 animate-pulse" />
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Mobile Optimized Gradient Edge */}
      {isMobile && (
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/50 to-transparent pointer-events-none z-0" />
      )}
    </section>
  );
}
