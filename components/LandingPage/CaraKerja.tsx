"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  PackageCheck,
  Truck,
  Recycle,
  WalletCards,
  Leaf,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function CaraKerjaSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });

  const steps = [
    {
      icon: PackageCheck,
      title: "Sampah Dikumpulkan",
      desc: "Setelah pengguna membuat request, agen akan mengambil sampah dari lokasi dan melakukan pengecekan awal.",
      image:
        "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format&fit=crop",
    },
    {
      icon: Truck,
      title: "Dijemput Agen",
      desc: "Sampah yang telah dijadwalkan akan langsung dijemput oleh agen TrashFlow langsung dari lokasi Anda.",
      image:
        "https://images.unsplash.com/photo-1774977867718-e926bedc8740?q=80&w=800&auto=format&fit=crop",
    },
    {
      icon: Recycle,
      title: "Dikelola Agen / Bank Sampah",
      desc: "Material bernilai seperti plastik, kertas, dan logam dipilah serta ditimbang secara transparan di bank sampah.",
      image:
        "https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=2070&auto=format&fit=crop",
    },
    {
      icon: WalletCards,
      title: "Nilai Masuk ke Akun",
      desc: "Hasil transaksi tercatat transparan dan saldo pengguna bertambah sesuai nilai sampah.",
      image:
        "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?q=80&w=800&auto=format&fit=crop",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
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
    hidden: { x: -30, opacity: 0 },
    visible: (right: boolean) => ({
      x: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 80,
      },
    }),
    hover: {
      y: -5,
      boxShadow: "0 20px 25px -12px rgba(0, 0, 0, 0.1)",
      transition: {
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const imageVariants = {
    hidden: { x: 30, opacity: 0, scale: 0.9 },
    visible: (right: boolean) => ({
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 15,
        stiffness: 80,
        delay: 0.1,
      },
    }),
    hover: {
      scale: 1.02,
      transition: {
        type: "spring" as const,
        stiffness: 300,
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      id="cara-kerja"
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-10 sm:mb-12 md:mb-16"
        >
          <div className="max-w-6xl mx-auto rounded-2xl sm:rounded-3xl bg-card p-5 sm:p-6 md:p-8 lg:p-10">
            <div className="grid lg:grid-cols-12 gap-6 md:gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="max-w-xl">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                    Bagaimana Sampah Anda Kami
                    <span className="text-primary block sm:inline sm:ml-2">
                      Proses
                    </span>
                  </h2>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="max-w-sm lg:ml-auto">
                  <p className="text-sm sm:text-base md:text-lg text-muted-foreground leading-relaxed">
                    Kami menunjukkan alur jelas bagaimana sampah diproses
                    setelah dijemput, mulai dari pencatatan hingga menghasilkan
                    manfaat ekonomi bagi pengguna.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* TIMELINE WITH IMAGES */}
        <div className="relative max-w-5xl mx-auto">
          {/* Vertical Line - Hidden on mobile */}
          <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-border to-transparent" />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="space-y-6 sm:space-y-8"
          >
            {steps.map((step, index) => {
              const Icon = step.icon;
              const right = index % 2 !== 0;

              return (
                <div
                  key={index}
                  className="grid md:grid-cols-2 gap-4 sm:gap-6 items-center"
                >
                  {/* Left Side Desktop */}
                  <motion.div
                    variants={itemVariants}
                    className="hidden md:block"
                  >
                    {!right && (
                      <motion.div
                        custom={right}
                        variants={cardVariants}
                        whileHover="hover"
                      >
                        <Card className="p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-border bg-card transition-all">
                          <div className="flex gap-3 sm:gap-4">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0"
                            >
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            </motion.div>
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
                                {step.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Image Left */}
                  <motion.div
                    variants={imageVariants}
                    custom={right}
                    whileHover="hover"
                    className="hidden md:block"
                  >
                    {!right && (
                      <div className="rounded-xl sm:rounded-2xl overflow-hidden">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={400}
                          height={240}
                          className="w-full h-40 sm:h-44 md:h-48 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                  </motion.div>

                  {/* Right Side Desktop */}
                  <motion.div
                    variants={itemVariants}
                    className="hidden md:block"
                  >
                    {right && (
                      <div className="rounded-xl sm:rounded-2xl overflow-hidden">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={400}
                          height={240}
                          className="w-full h-40 sm:h-44 md:h-48 object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    variants={itemVariants}
                    className="hidden md:block"
                  >
                    {right && (
                      <motion.div
                        custom={right}
                        variants={cardVariants}
                        whileHover="hover"
                      >
                        <Card className="p-4 sm:p-5 md:p-6 rounded-2xl sm:rounded-3xl border border-border bg-card transition-all">
                          <div className="flex gap-3 sm:gap-4">
                            <motion.div
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0"
                            >
                              <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                            </motion.div>
                            <div>
                              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5 sm:mb-2">
                                {step.title}
                              </h3>
                              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                {step.desc}
                              </p>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    )}
                  </motion.div>

                  {/* Mobile Version */}
                  <motion.div
                    variants={itemVariants}
                    className="md:hidden col-span-2"
                  >
                    <motion.div
                      whileHover={{ y: -3 }}
                      transition={{ type: "spring" as const, stiffness: 300 }}
                    >
                      <Card className="p-4 sm:p-5 rounded-2xl border border-border bg-card">
                        <div className="mb-3 sm:mb-4 overflow-hidden rounded-xl">
                          <Image
                            src={step.image}
                            alt={step.title}
                            width={600}
                            height={200}
                            className="w-full h-32 sm:h-36 object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="flex gap-3 sm:gap-4">
                          <motion.div
                            whileHover={{ rotate: 360 }}
                            transition={{ duration: 0.5 }}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center shrink-0"
                          >
                            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                          </motion.div>
                          <div>
                            <h3 className="text-sm sm:text-base md:text-lg font-semibold text-foreground mb-1 sm:mb-2">
                              {step.title}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  </motion.div>
                </div>
              );
            })}
          </motion.div>
        </div>

        {/* FOOTER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-12 sm:mt-16 md:mt-20 max-w-5xl mx-auto"
        >
          <motion.div
            whileHover={{ y: -5 }}
            className="rounded-2xl sm:rounded-3xl border border-border bg-card p-6 sm:p-8 md:p-10 lg:p-14 text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 1, duration: 0.5 }}
            >
              <Badge
                variant="secondary"
                className="mb-4 sm:mb-6 bg-primary/10 text-primary border-primary/20 backdrop-blur-sm inline-flex px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs"
              >
                #StartContribute
              </Badge>
            </motion.div>

            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-foreground mb-2 sm:mb-3">
              Setiap Sampah<span className="text-primary"> Memiliki Nilai</span>
            </h3>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed mx-auto max-w-md">
              Dengan sistem transparan, pengguna dapat mengetahui bahwa sampah
              benar-benar dikelola dan memberi manfaat nyata.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <motion.a
                href="/login"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 bg-primary hover:bg-primary/90 text-white text-sm font-semibold rounded-xl transition-all"
              >
                Mulai Kelola Sampah
                <ArrowRight className="w-4 h-4" />
              </motion.a>

              <motion.a
                href="#cara-kerja"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-5 sm:px-6 py-2.5 sm:py-3 border border-border hover:bg-muted text-foreground text-sm font-semibold rounded-xl transition-all"
              >
                Pelajari Cara Kerja
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}