"use client";

import { useState } from "react";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Phone, 
  BookOpen, 
  ChevronRight,
  CheckCircle,
  Send,
  FileQuestion,
  AlertCircle,
  Headphones
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Bantuan() {
  const [showFaq, setShowFaq] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState<number | null>(null);
  const [showContact, setShowContact] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isSent, setIsSent] = useState(false);
  
  const [reportData, setReportData] = useState({
    subject: "",
    message: ""
  });

  const faqs = [
    {
      id: 1,
      question: "Bagaimana cara menjual sampah?",
      answer: "Anda dapat memilih menu 'Jual Sampah' di dashboard, pilih jenis sampah, estimasi berat, lalu tentukan jadwal penjemputan. Petugas akan datang ke lokasi Anda."
    },
    {
      id: 2,
      question: "Kapan poin akan masuk ke akun?",
      answer: "Poin akan masuk setelah petugas menimbang dan memverifikasi sampah yang Anda jual, biasanya dalam waktu 1x24 jam setelah penjemputan."
    },
    {
      id: 3,
      question: "Berapa minimal berat sampah untuk penjemputan?",
      answer: "Minimal berat sampah untuk penjemputan adalah 2 kg untuk area Jakarta dan sekitarnya."
    },
    {
      id: 4,
      question: "Bagaimana cara menukar poin?",
      answer: "Pilih menu 'Tukar Poin', pilih hadiah yang Anda inginkan, lalu klik 'Tukar'. Hadiah akan diproses dalam 3-5 hari kerja."
    },
    {
      id: 5,
      question: "Apakah ada biaya untuk penjemputan?",
      answer: "Tidak ada biaya penjemputan. Layanan penjemputan sampah TrashFlow GRATIS untuk semua pengguna."
    }
  ];

  const handleSendReport = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSent(true);
    setReportData({ subject: "", message: "" });
    setTimeout(() => setIsSent(false), 3000);
  };

  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-slate-50 font-sans py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-4 mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-[2rem] flex items-center justify-center mx-auto mb-6 transform rotate-12">
            <Headphones className="w-8 h-8 text-primary -rotate-12" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Pusat Bantuan</h1>
          <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
            Temukan jawaban untuk pertanyaan Anda, atau hubungi tim TrashFlow jika Anda membutuhkan bantuan lebih lanjut.
          </p>
        </div>

        {/* Alert Sukses */}
        {isSent && (
          <div className="animate-in fade-in slide-in-from-top-4 mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center gap-3 text-emerald-700 shadow-sm">
            <CheckCircle className="w-6 h-6 text-emerald-500 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Laporan Berhasil Terkirim!</h4>
              <p className="text-xs text-emerald-600 font-medium mt-0.5">Tim kami akan segera memproses laporan Anda dan membalas melalui email.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">

          {/* FAQ Card */}
          <div className={`bg-white border rounded-[2rem] overflow-hidden transition-all duration-500 ${showFaq ? "border-primary/20 shadow-xl" : "border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"}`}>
            <div 
              className="p-6 sm:p-8 flex items-center justify-between cursor-pointer group"
              onClick={() => setShowFaq(!showFaq)}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${showFaq ? "bg-primary text-white" : "bg-primary/10 text-primary group-hover:bg-primary/20"}`}>
                  <FileQuestion className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Pertanyaan Umum (FAQ)</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Jawaban cepat untuk pertanyaan yang sering diajukan
                  </p>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${showFaq ? "bg-slate-100 rotate-90" : "bg-slate-50 group-hover:bg-slate-100"}`}>
                <ChevronRight className={`w-5 h-5 ${showFaq ? "text-slate-900" : "text-slate-400"}`} />
              </div>
            </div>

            {showFaq && (
              <div className="p-6 sm:p-8 pt-0 animate-in slide-in-from-top-4 fade-in duration-300">
                <div className="space-y-4">
                  {faqs.map((faq) => {
                    const isSelected = selectedFaq === faq.id;
                    return (
                      <div key={faq.id} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isSelected ? "border-primary/20 bg-primary/5" : "border-slate-100 bg-white hover:border-slate-200"}`}>
                        <button
                          className="w-full p-5 text-left flex justify-between items-center gap-4 focus:outline-none"
                          onClick={() => setSelectedFaq(isSelected ? null : faq.id)}
                        >
                          <span className={`text-base font-bold ${isSelected ? "text-primary" : "text-slate-800"}`}>{faq.question}</span>
                          <div className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center transition-transform duration-300 ${isSelected ? "bg-primary text-white rotate-90" : "bg-slate-100 text-slate-400"}`}>
                            <ChevronRight className="w-4 h-4" />
                          </div>
                        </button>
                        {isSelected && (
                          <div className="p-5 pt-0 text-sm font-medium text-slate-600 leading-relaxed animate-in fade-in slide-in-from-top-2">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Hubungi Kami Card */}
          <div className={`bg-white border rounded-[2rem] overflow-hidden transition-all duration-500 ${showContact ? "border-primary/20 shadow-xl" : "border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"}`}>
            <div 
              className="p-6 sm:p-8 flex items-center justify-between cursor-pointer group"
              onClick={() => setShowContact(!showContact)}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${showContact ? "bg-blue-500 text-white" : "bg-blue-50 text-blue-500 group-hover:bg-blue-100"}`}>
                  <MessageCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Hubungi Kami</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Layanan pelanggan, email, telepon, atau media sosial
                  </p>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${showContact ? "bg-slate-100 rotate-90" : "bg-slate-50 group-hover:bg-slate-100"}`}>
                <ChevronRight className={`w-5 h-5 ${showContact ? "text-slate-900" : "text-slate-400"}`} />
              </div>
            </div>

            {showContact && (
              <div className="p-6 sm:p-8 pt-0 animate-in slide-in-from-top-4 fade-in duration-300 border-t border-slate-50 mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                      <Mail className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">Email Support</p>
                    <p className="text-xs font-semibold text-slate-500">support@trashflow.com</p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-colors">
                    <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                      <Phone className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">Telepon (Bebas Pulsa)</p>
                    <p className="text-xs font-semibold text-slate-500">(021) 1234-5678</p>
                  </div>
                  <div className="flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-green-200 transition-colors">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <MessageCircle className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-bold text-slate-900 mb-1">WhatsApp Live Chat</p>
                    <p className="text-xs font-semibold text-slate-500">0812-3456-7890</p>
                  </div>
                </div>

                <div className="bg-slate-900 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
                  <div>
                    <h3 className="text-white font-bold mb-1 text-center sm:text-left">Ikuti Media Sosial Kami</h3>
                    <p className="text-slate-400 text-xs font-medium text-center sm:text-left">Dapatkan info promo & tips daur ulang terbaru</p>
                  </div>
                  <div className="flex gap-4 justify-center sm:justify-start">
                    <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.016 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                    </a>
                    <a href="#" className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Laporkan Masalah Card */}
          <div className={`bg-white border rounded-[2rem] overflow-hidden transition-all duration-500 ${showReport ? "border-rose-200 shadow-xl shadow-rose-100" : "border-slate-100 shadow-sm hover:shadow-md hover:border-slate-200"}`}>
            <div 
              className="p-6 sm:p-8 flex items-center justify-between cursor-pointer group"
              onClick={() => setShowReport(!showReport)}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${showReport ? "bg-rose-500 text-white" : "bg-rose-50 text-rose-500 group-hover:bg-rose-100"}`}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold text-slate-900">Laporkan Masalah</h2>
                  <p className="text-sm font-medium text-slate-500 mt-1">
                    Laporkan bug sistem atau keluhan pelayanan
                  </p>
                </div>
              </div>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${showReport ? "bg-slate-100 rotate-90" : "bg-slate-50 group-hover:bg-slate-100"}`}>
                <ChevronRight className={`w-5 h-5 ${showReport ? "text-slate-900" : "text-slate-400"}`} />
              </div>
            </div>

            {showReport && (
              <div className="p-6 sm:p-8 pt-0 animate-in slide-in-from-top-4 fade-in duration-300">
                <form onSubmit={handleSendReport} className="space-y-6">
                  <div className="bg-rose-50/50 p-6 rounded-2xl border border-rose-100">
                    <div className="space-y-5">
                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">
                          Topik Masalah <span className="text-rose-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={reportData.subject}
                          onChange={(e) => setReportData({ ...reportData, subject: e.target.value })}
                          placeholder="Misal: Poin belum masuk setelah sampah dijemput"
                          className="w-full px-4 py-3 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-bold text-slate-700 block mb-2">
                          Detail Kendala <span className="text-rose-500">*</span>
                        </label>
                        <textarea
                          rows={4}
                          required
                          value={reportData.message}
                          onChange={(e) => setReportData({ ...reportData, message: e.target.value })}
                          placeholder="Jelaskan secara detail masalah yang Anda alami..."
                          className="w-full px-4 py-3 text-sm font-medium rounded-xl border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all shadow-sm resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-end pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowReport(false)}
                      className="px-6 h-12 rounded-xl text-sm font-bold border-slate-200 text-slate-600 hover:bg-slate-50"
                    >
                      Batal
                    </Button>
                    <Button
                      type="submit"
                      className="px-8 h-12 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-rose-500/20"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Laporan
                    </Button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Panduan Pengguna Card */}
          <div className="bg-white border border-slate-100 rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-slate-900">Buku Panduan Pengguna</h2>
                <p className="text-sm font-medium text-slate-500 mt-1">
                  Pelajari semua fitur TrashFlow selengkapnya di sini
                </p>
              </div>
            </div>
            <Button className="h-12 px-6 rounded-xl font-bold bg-slate-900 hover:bg-slate-800 text-white shrink-0 group-hover:scale-105 transition-transform">
              Baca Panduan <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
}