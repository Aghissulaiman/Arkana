"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  PackageCheck,
  Truck,
  Recycle,
  WalletCards,
} from "lucide-react";
import Image from "next/image";

export default function CaraKerjaSection() {
  const steps = [
    {
      icon: PackageCheck,
      title: "Sampah Dikumpulkan",
      desc: "Setelah pengguna membuat request, agen akan mengambil sampah dari lokasi dan melakukan pengecekan awal.",
      image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=800&auto=format",
    },
    {
      icon: Truck,
      title: "Masuk ke Mitra Pengelola",
      desc: "Sampah dikirim ke agen atau mitra resmi untuk proses pencatatan dan penimbangan.",
      image: "https://images.unsplash.com/photo-1604186837874-2e8e7f82c5e0?q=80&w=800&auto=format",
    },
    {
      icon: Recycle,
      title: "Dipilah & Didaur Ulang",
      desc: "Material bernilai seperti plastik, kertas, logam, dan kardus dipisahkan lalu disalurkan kembali.",
      image: "https://images.unsplash.com/photo-1528323273322-d81458248d40?q=80&w=800&auto=format",
    },
    {
      icon: WalletCards,
      title: "Nilai Masuk ke Akun",
      desc: "Hasil transaksi tercatat transparan dan saldo pengguna bertambah sesuai nilai sampah.",
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?q=80&w=800&auto=format",
    },
  ];

  return (
    <section id="cara-kerja" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-16">
          <div className="max-w-6xl mx-auto rounded-[32px] bg-card p-6 md:p-10">
            <div className="grid lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7">
                <div className="max-w-xl">
                  <Badge variant="primary" className="mb-4">
                    Cara Kerja
                  </Badge>
                  <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
                    Bagaimana Sampah Anda Kami
                    <span className="text-primary"> Proses</span>
                  </h2>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="max-w-sm lg:ml-auto">
                  <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                    Kami menunjukkan alur jelas bagaimana sampah diproses setelah
                    dijemput, mulai dari pencatatan hingga menghasilkan manfaat ekonomi
                    bagi pengguna.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TIMELINE WITH IMAGES */}
        <div className="relative max-w-5xl mx-auto">
          <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-border" />

          <div className="space-y-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const right = index % 2 !== 0;

              return (
                <div
                  key={index}
                  className="grid md:grid-cols-2 gap-6 items-center"
                >
                  {/* Kiri Desktop */}
                  <div className="hidden md:block">
                    {!right && (
                      <Card className="p-6 rounded-3xl border border-border bg-card hover:shadow-md transition-all">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {step.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>

                  {/* Gambar Kiri */}
                  <div className="hidden md:block">
                    {!right && (
                      <div className="rounded-2xl overflow-hidden">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={400}
                          height={240}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  {/* Kanan Desktop */}
                  <div className="hidden md:block">
                    {right && (
                      <div className="rounded-2xl overflow-hidden">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={400}
                          height={240}
                          className="w-full h-48 object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="hidden md:block">
                    {right && (
                      <Card className="p-6 rounded-3xl border border-border bg-card hover:shadow-md transition-all">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-foreground mb-2">
                              {step.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      </Card>
                    )}
                  </div>

                  {/* Mobile Version */}
                  <div className="md:hidden col-span-2">
                    <Card className="p-6 rounded-3xl border border-border bg-card">
                      <div className="mb-4 overflow-hidden rounded-xl">
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={600}
                          height={200}
                          className="w-full h-40 object-cover"
                        />
                      </div>
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {step.desc}
                          </p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* FOOTER */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="rounded-3xl border border-border bg-card p-8 text-center">
            <h3 className="text-xl font-semibold text-foreground mb-3">
              Setiap Sampah Memiliki Nilai
            </h3>
            <p className="text-muted-foreground leading-relaxed">
              Dengan sistem transparan, pengguna dapat mengetahui bahwa sampah
              benar-benar dikelola dan memberi manfaat nyata.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}