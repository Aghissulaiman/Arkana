"use client";

import { Leaf, Recycle, Truck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  const values = [
    {
      icon: Recycle,
      title: "Pengelolaan Modern",
      desc: "Mengubah proses pengelolaan sampah menjadi lebih praktis, cepat, dan transparan melalui teknologi digital.",
    },
    {
      icon: Truck,
      title: "Jemput ke Lokasi",
      desc: "User dapat melakukan request penjemputan sampah langsung dari rumah tanpa harus datang ke tempat penampungan.",
    },
    {
      icon: ShieldCheck,
      title: "Aman & Terpercaya",
      desc: "Data pengguna, transaksi, dan proses penjemputan dikelola dengan sistem yang aman dan terpercaya.",
    },
    {
      icon: Leaf,
      title: "Peduli Lingkungan",
      desc: "Mendorong masyarakat untuk lebih peduli terhadap kebersihan dan daur ulang demi masa depan yang lebih hijau.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: (index: number) => ({
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        delay: index * 0.1,
        type: "spring" as const,
        damping: 15,
        stiffness: 80,
      },
    }),
    hover: {
      y: -5,
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      id="about"
      className="py-12 sm:py-16 md:py-20 bg-background overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center mb-10 sm:mb-14"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3 sm:mb-4">
            Solusi Digital Untuk
            <span className="text-primary block sm:inline sm:ml-2">
              Bank Sampah Modern
            </span>
          </h2>

          <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed px-2 sm:px-0">
            Kami menghadirkan platform yang menghubungkan masyarakat kota Depok
            dengan agen pengelola sampah terdekat. Proses setor, jemput, hingga
            transaksi dibuat lebih mudah dalam satu sistem terintegrasi.
          </p>
        </motion.div>

        {/* Content - FLEX dengan items-stretch */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col lg:flex-row gap-5 sm:gap-6 md:gap-8 items-stretch"
        >
          {/* Left - akan otomatis setinggi sibling-nya */}
          <motion.div variants={itemVariants} className="lg:w-1/2">
            <div className="relative rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 md:p-8 h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 sm:w-40 sm:h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-40 sm:h-40 bg-primary/5 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-primary mb-2 sm:mb-3">
                    VISI KAMI
                  </p>

                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-3 sm:mb-4">
                    Menjadikan Sampah Memiliki Nilai Lebih
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mb-5 sm:mb-6">
                    Dengan sistem digital, masyarakat dapat mengelola sampah
                    rumah tangga dengan lebih mudah sambil mendapatkan manfaat
                    ekonomi dan membantu menjaga lingkungan sekitar.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-auto">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="rounded-xl sm:rounded-2xl bg-muted p-3 sm:p-4"
                  >
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">1000+</p>
                    <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                      Pengguna Aktif
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="rounded-xl sm:rounded-2xl bg-muted p-3 sm:p-4"
                  >
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">120+</p>
                    <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                      Agen Terdaftar
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="rounded-xl sm:rounded-2xl bg-muted p-3 sm:p-4"
                  >
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">8+</p>
                    <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                      Kota Tersedia
                    </p>
                  </motion.div>

                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    className="rounded-xl sm:rounded-2xl bg-muted p-3 sm:p-4"
                  >
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-primary">24/7</p>
                    <p className="text-[11px] sm:text-sm text-muted-foreground mt-0.5 sm:mt-1">
                      Layanan Online
                    </p>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right - akan otomatis setinggi sibling-nya */}
          <motion.div variants={itemVariants} className="lg:w-1/2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 h-full">
              {values.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={index}
                    custom={index}
                    variants={cardVariants}
                    whileHover="hover"
                  >
                    <Card className="p-4 sm:p-5 md:p-6 rounded-xl sm:rounded-2xl border border-border bg-card hover:border-primary/30 transition-all duration-300 h-full cursor-pointer">
                      <motion.div 
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center mb-3 sm:mb-4"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                      </motion.div>

                      <h4 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
                        {item.title}
                      </h4>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}