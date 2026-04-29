"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  PackageCheck,
  Truck,
  Recycle,
  WalletCards,
} from "lucide-react";

export default function CaraKerjaSection() {
  const steps = [
    {
      icon: PackageCheck,
      title: "Sampah Dikumpulkan",
      desc: "Setelah user melakukan request, agen akan mengambil sampah dari lokasi dan melakukan pengecekan jenis serta kondisi sampah.",
    },
    {
      icon: Truck,
      title: "Masuk ke Mitra Pengelola",
      desc: "Sampah yang sudah dikumpulkan dikirim ke agen atau mitra pengelola resmi untuk proses penimbangan dan pencatatan.",
    },
    {
      icon: Recycle,
      title: "Dipilah & Didaur Ulang",
      desc: "Material bernilai seperti plastik, kertas, logam, dan kardus dipisahkan lalu disalurkan ke industri daur ulang.",
    },
    {
      icon: WalletCards,
      title: "Nilai Masuk ke Akun",
      desc: "Hasil penjualan material tercatat transparan dan saldo pengguna akan bertambah sesuai nilai sampah.",
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10">
            Transparansi Proses
          </Badge>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Bagaimana Sampah Anda
            <span className="text-primary"> Diproses</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Kami memastikan setiap sampah yang dikirim memiliki alur jelas,
            tercatat, dan bernilai agar pengguna tahu ke mana sampah mereka
            pergi.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative max-w-5xl mx-auto">
          {/* center line */}
          <div className="hidden md:block absolute left-1/2 top-0 -translate-x-1/2 w-px h-full bg-border" />

          <div className="space-y-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const right = index % 2 !== 0;

              return (
                <div
                  key={index}
                  className={`grid md:grid-cols-2 gap-6 items-center ${
                    right ? "" : ""
                  }`}
                >
                  {/* left */}
                  <div
                    className={`${
                      right ? "md:order-1" : "md:order-0"
                    }`}
                  >
                    {!right && (
                      <Card className="p-6 rounded-3xl border border-border bg-card">
                        <div className="flex items-start gap-4">
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

                  {/* right */}
                  <div
                    className={`${
                      right ? "md:order-2" : "md:order-1"
                    }`}
                  >
                    {right && (
                      <Card className="p-6 rounded-3xl border border-border bg-card">
                        <div className="flex items-start gap-4">
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

                  {/* mobile all card */}
                  <div className="md:hidden col-span-2">
                    <Card className="p-6 rounded-3xl border border-border bg-card">
                      <div className="flex items-start gap-4">
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

        {/* Bottom */}
        <div className="mt-14 max-w-4xl mx-auto text-center rounded-3xl border border-border bg-card p-8">
          <h3 className="text-xl font-semibold text-foreground mb-3">
            Bukan Sekadar Buang Sampah
          </h3>

          <p className="text-muted-foreground">
            Setiap transaksi membantu daur ulang berjalan lebih baik sekaligus
            memberikan manfaat ekonomi kepada pengguna.
          </p>
        </div>
      </div>
    </section>
  );
}