"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Store,
  Truck,
  WalletCards,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function MitraSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  const items = [
    {
      icon: Store,
      title: "Bank Sampah & Pengepul",
      desc: "Terhubung dengan lebih banyak pengguna yang membutuhkan layanan penjemputan.",
    },
    {
      icon: Truck,
      title: "Agen Lapangan",
      desc: "Dapatkan order pickup dan kelola jadwal langsung dari sistem.",
    },
    {
      icon: WalletCards,
      title: "Pendapatan Tambahan",
      desc: "Setiap transaksi tercatat rapi dan menghasilkan keuntungan baru.",
    },
    {
      icon: ShieldCheck,
      title: "Operasional Transparan",
      desc: "Data berat, transaksi, dan histori tersimpan aman dan mudah dipantau.",
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
      id="mitra"
      className="py-12 sm:py-14 md:py-16 lg:py-20 bg-background overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-12 md:mb-14"
        >
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl pl-2 sm:pl-3 md:pl-4 lg:pl-6">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-3 sm:mb-4">
                Bangun Usaha
                <span className="text-primary block sm:inline sm:ml-2">
                  Bersama Kami
                </span>
              </h2>

              <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed max-w-2xl">
                Kami membuka kesempatan bagi pelaku usaha pengelolaan sampah
                untuk berkembang dengan sistem digital yang modern.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Main unique layout */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid lg:grid-cols-12 gap-5 sm:gap-6"
        >
          {/* Big left feature card */}
          <motion.div variants={itemVariants} className="lg:col-span-5">
            <motion.div
              whileHover={{ y: -5 }}
              transition={{ type: "spring" as const, stiffness: 300 }}
              className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-6 md:p-8 h-full flex flex-col justify-between"
            >
              <div>
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-2xl sm:rounded-3xl bg-primary/10 flex items-center justify-center mb-4 sm:mb-5 md:mb-6"
                >
                  <Store className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-primary" />
                </motion.div>

                <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-tight mb-3 sm:mb-4">
                  Jadi Agent,
                  <br />
                  Perluas Jangkauan Bisnis
                </h3>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Dari bank sampah lokal hingga pengepul besar, semua bisa
                  menggunakan platform kami untuk menjangkau pelanggan baru.
                </p>
              </div>

              <Link href="/register-agent">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="mt-6 sm:mt-7 md:mt-8 h-10 sm:h-11 px-5 sm:px-6 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-medium hover:bg-primary/90 transition-all w-fit"
                >
                  Gabung Sekarang
                </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right stacked benefits */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  custom={index}
                  variants={cardVariants}
                  whileHover="hover"
                >
                  <Card className="rounded-2xl sm:rounded-3xl border border-border bg-card p-4 sm:p-5 md:p-6 hover:border-primary/30 transition-all duration-300 h-full cursor-pointer">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0"
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                      </motion.div>

                      <div className="flex-1">
                        <h4 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
                          {item.title}
                        </h4>

                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {item.desc}
                        </p>

                        <motion.div
                          whileHover={{ x: 5 }}
                          className="mt-3 sm:mt-4 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-primary font-medium cursor-pointer"
                        >
                          Detail
                          <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
                        </motion.div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Optional: Bottom CTA for mobile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-10 sm:mt-12 lg:hidden text-center"
        >
          <div className="inline-flex items-center gap-2 bg-primary/5 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 sm:py-3 border border-primary/10">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((_, i) => (
                <div
                  key={i}
                  className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-background"
                />
              ))}
            </div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Bergabung dengan <span className="font-semibold text-primary">50+</span> mitra aktif
            </p>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}