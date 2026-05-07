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
  AlertCircle
} from "lucide-react";

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
    <div className="max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">Bantuan</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pusat bantuan TrashFlow. Temukan jawaban dan hubungi kami
        </p>
      </div>

      {/* Alert Sukses */}
      {isSent && (
        <div className="mb-4 p-3 bg-green-500/10 rounded-lg flex items-center gap-2 text-green-600 text-sm">
          <CheckCircle className="w-4 h-4" />
          Laporan berhasil dikirim. Tim kami akan segera merespon.
        </div>
      )}

      {/* FAQ */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowFaq(!showFaq)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <FileQuestion className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Pertanyaan Umum (FAQ)</h2>
              <p className="text-xs text-muted-foreground">
                Jawaban cepat untuk pertanyaan yang sering diajukan
              </p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showFaq ? "rotate-90" : ""}`} />
        </div>

        {showFaq && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="space-y-2">
              {faqs.map((faq) => (
                <div key={faq.id} className="border border-border rounded-lg overflow-hidden">
                  <button
                    className="w-full p-3 text-left flex justify-between items-center hover:bg-muted/30 transition"
                    onClick={() => setSelectedFaq(selectedFaq === faq.id ? null : faq.id)}
                  >
                    <span className="text-sm font-medium text-foreground">{faq.question}</span>
                    <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${selectedFaq === faq.id ? "rotate-90" : ""}`} />
                  </button>
                  {selectedFaq === faq.id && (
                    <div className="p-3 pt-0 text-sm text-muted-foreground border-t border-border">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowFaq(false)}
              className="mt-4 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Hubungi Kami */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowContact(!showContact)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Hubungi Kami</h2>
              <p className="text-xs text-muted-foreground">
                Email, Telepon, atau Media Sosial
              </p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showContact ? "rotate-90" : ""}`} />
        </div>

        {showContact && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Mail className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Email</p>
                  <p className="text-xs text-muted-foreground">support@TrashFlow.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <Phone className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">Telepon</p>
                  <p className="text-xs text-muted-foreground">(021) 1234-5678</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                <MessageCircle className="w-4 h-4 text-primary" />
                <div>
                  <p className="text-sm font-medium text-foreground">WhatsApp</p>
                  <p className="text-xs text-muted-foreground">0812-3456-7890</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs text-muted-foreground mb-2">Media Sosial</p>
              <div className="flex gap-3">
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.376.505A3.016 3.016 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.376-.505a3.016 3.016 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center hover:bg-primary/20 transition">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
                  </svg>
                </a>
              </div>
            </div>

            <button
              onClick={() => setShowContact(false)}
              className="mt-4 px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* Laporkan Masalah */}
      <div className="mb-4 border border-border rounded-lg overflow-hidden">
        <div 
          className="p-4 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition"
          onClick={() => setShowReport(!showReport)}
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Laporkan Masalah</h2>
              <p className="text-xs text-muted-foreground">
                Laporkan bug atau kendala yang Anda alami
              </p>
            </div>
          </div>
          <ChevronRight className={`w-4 h-4 text-muted-foreground transition-transform ${showReport ? "rotate-90" : ""}`} />
        </div>

        {showReport && (
          <div className="p-4 pt-0 border-t border-border">
            <form onSubmit={handleSendReport} className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Subjek
                </label>
                <input
                  type="text"
                  required
                  value={reportData.subject}
                  onChange={(e) => setReportData({ ...reportData, subject: e.target.value })}
                  placeholder="Contoh: Gagal mengajukan penjemputan"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground block mb-1">
                  Pesan
                </label>
                <textarea
                  rows={4}
                  required
                  value={reportData.message}
                  onChange={(e) => setReportData({ ...reportData, message: e.target.value })}
                  placeholder="Jelaskan masalah yang Anda alami..."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReport(false)}
                  className="px-4 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition flex items-center gap-2"
                >
                  <Send className="w-3.5 h-3.5" />
                  Kirim Laporan
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Panduan Pengguna */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-medium text-foreground">Panduan Pengguna</h2>
              <p className="text-xs text-muted-foreground">
                Pelajari cara menggunakan TrashFlow
              </p>
            </div>
          </div>
          <button className="text-sm text-primary hover:underline">
            Baca Panduan Lengkap →
          </button>
        </div>
      </div>
    </div>
  );
}