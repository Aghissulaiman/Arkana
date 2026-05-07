"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HowItWorks() {
  const steps = [
    {
      title: "Masyarakat",
      time: "5 menit",
      badges: ["Pilah Sampah", "Klik Jual", "Dapat Poin"],
      description: "Pisahkan sampah di rumah (botol plastik, kertas, dll), lalu klik tombol jual di web TrashFlow untuk dapat Poin.",
    },
    {
      title: "Mitra Pengepul",
      time: "30 menit",
      badges: ["Terima Notifikasi", "Jemput Sampah", "Setor ke Agent"],
      description: "Dapat data rumah yang mau jual sampah dari web. Tidak perlu keliling tanpa tujuan.",
    },
  ];

  const workflows = [
    {
      title: "Agent Logistik",
      steps: ["Sampah Terkumpul di Mitra", "Agent Datang dengan Truk", "Dikirim ke Pabrik Daur Ulang"],
    },
    {
      title: "Admin Pusat",
      steps: ["Pantau Transaksi", "Atur Harga", "Pastikan Sistem Berjalan Lancar"],
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-sm font-medium text-primary">Alur Kerja</span>
          </div>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
            Sistem Daur Ulang
            <span className="text-primary"> Terpadu</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            TrashFlow menghubungkan semua pihak dalam satu platform. 
            Setiap aksi tercatat, setiap transaksi transparan.
          </p>
        </div>

        {/* Grid 2 kolom - desain bergantian kiri-kanan */}
        <div className="space-y-12 mb-20">
          {steps.map((step, idx) => (
            <div key={step.title} className={`flex flex-col ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-center`}>
              <div className="flex-1 lg:w-1/2">
                <div className="relative">
                  <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl" />
                  <Card className="relative p-8 hover:shadow-xl transition-all duration-500">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <div className="text-sm text-primary font-medium mb-2">Step {idx + 1}</div>
                        <h3 className="text-2xl font-bold text-foreground">{step.title}</h3>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-primary">{step.time.split(' ')[0]}</div>
                        <div className="text-xs text-muted-foreground">{step.time.split(' ')[1]}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {step.badges.map((badge) => (
                        <Badge key={badge} variant="secondary">
                          {badge}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </Card>
                </div>
              </div>
              <div className="flex-1 lg:w-1/2 flex justify-center">
                <div className="w-32 h-32 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                    <div className="text-4xl">{idx === 0 ? "🏠" : "🛺"}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline style untuk Agent dan Admin */}
        <div className="relative mb-20">
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/0 via-primary/30 to-primary/0 hidden lg:block" />
          <div className="space-y-12">
            {workflows.map((work, idx) => (
              <div key={work.title} className={`flex flex-col ${idx % 2 === 0 ? "lg:flex-row" : "lg:flex-row-reverse"} gap-8 items-center`}>
                <div className="flex-1 lg:w-1/2">
                  <Card className="p-8 hover:shadow-xl transition-all duration-500">
                    <h3 className="text-xl font-bold text-foreground mb-6">{work.title}</h3>
                    <div className="space-y-4">
                      {work.steps.map((step, i) => (
                        <div key={step} className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold">
                            {i + 1}
                          </div>
                          <span className="text-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
                <div className="flex-1 lg:w-1/2 flex justify-center">
                  <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <div className="text-3xl">{idx === 0 ? "🚛" : "📊"}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tujuan TrashFlow */}
        <Card className="relative overflow-hidden p-10 text-center border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-primary/15 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-xl">🎯</span>
              <span className="text-sm font-medium text-primary">Tujuan Kami</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
              Sampah Jadi <span className="text-primary">Berkah</span>
            </h3>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              Sampah tidak hanya numpuk di selokan, tapi jadi duit buat warga dan jadi bahan baku buat pabrik.
              Semuanya lewat satu aplikasi web.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
}