"use client";

import { Leaf, Recycle, Truck, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

export default function AboutSection() {
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

  return (
    <section id="about" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          

          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Solusi Digital Untuk
            <span className="text-primary"> Bank Sampah Modern</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Kami menghadirkan platform yang menghubungkan masyarakat dengan agen
            pengelola sampah terdekat. Proses setor, jemput, hingga transaksi
            dibuat lebih mudah dalam satu sistem terintegrasi.
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-12 gap-8 items-center">
          {/* Left */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl border border-border bg-card p-8 h-full overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

              <div className="relative z-10">
                <p className="text-sm font-medium text-primary mb-3">
                  VISI KAMI
                </p>

                <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                  Menjadikan Sampah Memiliki Nilai Lebih
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  Dengan sistem digital, masyarakat dapat mengelola sampah
                  rumah tangga dengan lebih mudah sambil mendapatkan manfaat
                  ekonomi dan membantu menjaga lingkungan sekitar.
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-2xl font-bold text-primary">1000+</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Pengguna Aktif
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-2xl font-bold text-primary">120+</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Agen Terdaftar
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-2xl font-bold text-primary">8+</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Kota Tersedia
                    </p>
                  </div>

                  <div className="rounded-2xl bg-muted p-4">
                    <p className="text-2xl font-bold text-primary">24/7</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Layanan Online
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="lg:col-span-6 grid sm:grid-cols-2 gap-5">
            {values.map((item, index) => {
              const Icon = item.icon;

              return (
                <Card
                  key={index}
                  className="p-6 rounded-3xl border border-border bg-card hover:border-primary/30 transition-all"
                >
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>

                  <h4 className="font-semibold text-foreground mb-2">
                    {item.title}
                  </h4>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.desc}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}