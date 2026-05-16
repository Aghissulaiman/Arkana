"use client";

import { Phone, Mail, MapPin, Send } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";

const contactInfo = [
  {
    icon: Phone,
    label: "Telepon",
    value: "+62 812 3456 7890",
    href: "tel:+6281234567890",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@TrashFlow.id",
    href: "mailto:support@TrashFlow.id",
  },
  {
    icon: MapPin,
    label: "Lokasi",
    value: "Depok, Indonesia",
    href: "https://maps.google.com/?q=Depok+Indonesia",
  },
];

const inputClass = `
  w-full 
  h-10 sm:h-11 
  px-3 sm:px-4 
  text-sm 
  border border-gray-200 
  rounded-lg 
  bg-gray-50 
  text-gray-900 
  placeholder:text-gray-300 
  outline-none 
  focus:border-green-500 
  focus:ring-1 
  focus:ring-green-500/20 
  focus:bg-white 
  transition-all 
  duration-200
`
  .replace(/\s+/g, " ")
  .trim();

const textareaClass = `
  w-full 
  px-3 sm:px-4 
  py-2.5 
  text-sm 
  border border-gray-200 
  rounded-lg 
  bg-gray-50 
  text-gray-900 
  placeholder:text-gray-300 
  outline-none 
  focus:border-green-500 
  focus:ring-1 
  focus:ring-green-500/20 
  focus:bg-white 
  transition-all 
  duration-200 
  resize-none
  min-h-[100px]
`
  .replace(/\s+/g, " ")
  .trim();

export default function KontakSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulasi pengiriman
    setTimeout(() => {
      setSubmitStatus({ success: true, message: "Pesan berhasil dikirim! Kami akan segera menghubungi Anda." });
      setIsSubmitting(false);
      
      // Reset status setelah 5 detik
      setTimeout(() => setSubmitStatus(null), 5000);
    }, 1500);
  };

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
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  const cardVariants = {
    hidden: { x: -20, opacity: 0 },
    visible: (index: number) => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: index * 0.1,
        type: "spring",
        damping: 15,
        stiffness: 80,
      },
    }),
    hover: {
      x: 5,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  const formVariants = {
    hidden: { x: 30, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 15,
        stiffness: 80,
        delay: 0.3,
      },
    },
  };

  return (
    <motion.section
      ref={sectionRef}
      id="kontak"
      className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 lg:gap-12"
        >
          {/* Left Section */}
          <div className="space-y-4 md:space-y-6">
            <motion.div variants={itemVariants} className="space-y-2 md:space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Ada pertanyaan?{" "}
                <span className="text-green-600 block sm:inline">
                  Hubungi Kami.
                </span>
              </h2>
              <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                Tim kami siap membantu Anda. Kirim pesan dan kami akan merespons
                dalam waktu 1×24 jam.
              </p>
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3"
            >
              {contactInfo.map(({ icon: Icon, label, value, href }, index) => (
                <motion.a
                  key={label}
                  custom={index}
                  variants={cardVariants}
                  whileHover="hover"
                  href={href}
                  target={label === "Lokasi" ? "_blank" : undefined}
                  rel={label === "Lokasi" ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/20 transition-all duration-200 group cursor-pointer"
                >
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-green-600" strokeWidth={2} />
                  </motion.div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-xs sm:text-sm font-medium text-gray-800 truncate sm:whitespace-normal">
                      {value}
                    </p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            <motion.div 
              variants={itemVariants}
              className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400"
            >
              {[
                { text: "Respon cepat", color: "bg-green-500" },
                { text: "Gratis konsultasi", icon: "check" },
                { text: "Support 24/7", icon: "info" },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ scale: 0 }}
                  animate={isInView ? { scale: 1 } : {}}
                  transition={{ delay: 0.8 + idx * 0.1, type: "spring" }}
                  className="flex items-center gap-1.5"
                >
                  <div className={`w-1.5 h-1.5 ${item.color || 'bg-green-500'} rounded-full`} />
                  <span>{item.text}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Right Section - Form */}
          <motion.div
            variants={formVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            <motion.div 
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={isInView ? { scale: 1, opacity: 1 } : {}}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mb-5"
              >
                <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-1 text-center">
                  Kirim pesan
                </h3>
                <p className="text-xs text-gray-400 text-center">
                  Isi formulir di bawah ini
                </p>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Nama Lengkap
                  </label>
                  <motion.input
                    whileFocus={{ scale: 1.01 }}
                    type="text"
                    placeholder="Budi Santoso"
                    className={inputClass}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Email
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="email"
                      placeholder="email@domain.com"
                      className={inputClass}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Telepon
                    </label>
                    <motion.input
                      whileFocus={{ scale: 1.01 }}
                      type="tel"
                      placeholder="+62 812 3456 7890"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">
                    Pesan
                  </label>
                  <motion.textarea
                    whileFocus={{ scale: 1.01 }}
                    rows={3}
                    placeholder="Tulis pesan Anda..."
                    className={textareaClass}
                    required
                  />
                </div>

                {submitStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-3 rounded-lg text-sm ${
                      submitStatus.success
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}

                <motion.button
                  type="submit"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full h-10 sm:h-11 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 ${
                    isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" strokeWidth={2} />
                      Kirim pesan
                    </>
                  )}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}