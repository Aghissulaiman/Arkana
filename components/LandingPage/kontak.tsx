"use client";

import { Phone, Mail, MapPin, Send } from "lucide-react";

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
    value: "Bekasi, Indonesia",
    href: "https://maps.google.com/?q=Bekasi+Indonesia",
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted");
  };

  return (
    <section id="kontak" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-12">
          <div className="space-y-5 md:space-y-6">
            <div className="space-y-2 md:space-y-3">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
                Ada pertanyaan?{" "}
                <span className="text-green-600 block sm:inline">
                  Hubungi Kami.
                </span>
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Tim kami siap membantu Anda. Kirim pesan dan kami akan merespons
                dalam waktu 1×24 jam.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {contactInfo.map(({ icon: Icon, label, value, href }) => (
                <a
                  key={label}
                  href={href}
                  target={label === "Lokasi" ? "_blank" : undefined}
                  rel={label === "Lokasi" ? "noopener noreferrer" : undefined}
                  className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white hover:border-green-200 hover:bg-green-50/20 transition-all duration-200 group cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-green-50 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                    <Icon className="w-4 h-4 text-green-600" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
                      {label}
                    </p>
                    <p className="text-sm font-medium text-gray-800 truncate sm:whitespace-normal">
                      {value}
                    </p>
                  </div>
                </a>
              ))}
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                <span>Respon cepat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>Gratis konsultasi</span>
              </div>
              <div className="flex items-center gap-1.5">
                <svg
                  className="w-3 h-3 text-green-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm1 12h-2v-2h2v2zm0-4h-2V6h2v4z" />
                </svg>
                <span>Support 24/7</span>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm">
              <div className="mb-5">
                <h3 className="text-2xl font-semibold text-gray-900 mb-1 text-center">
                  Kirim pesan
                </h3>
                <p className="text-xs text-gray-400 text-center">
                  Isi formulir di bawah ini
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Nama
                    </label>
                    <input
                      type="text"
                      placeholder="Budi"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Email
                    </label>
                    <input
                      type="email"
                      placeholder="email@domain.com"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1.5">
                      Telepon
                    </label>
                    <input
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
                  <textarea
                    rows={3}
                    placeholder="Tulis pesan Anda..."
                    className={textareaClass}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
                >
                  <Send className="w-3.5 h-3.5" strokeWidth={2} />
                  Kirim pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
