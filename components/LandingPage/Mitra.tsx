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

export default function MitraSection() {
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

  return (
    <section id="mitra" className="py-14 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-14">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-3xl pl-2 md:pl-4 lg:pl-6">
              <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
                Bangun Usaha
                <span className="text-primary"> Bersama Kami</span>
              </h2>

              <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
                Kami membuka kesempatan bagi pelaku usaha pengelolaan sampah
                untuk berkembang dengan sistem digital yang modern.
              </p>
            </div>
          </div>
        </div>

        {/* main unique layout */}
        <div className="grid lg:grid-cols-12 gap-6">
          {/* big left feature card */}
          <div className="lg:col-span-5">
            <div className="rounded-[32px] border border-border bg-card p-8 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
                  <Store className="w-7 h-7 text-primary" />
                </div>

                <h3 className="text-2xl md:text-3xl font-bold text-foreground leading-tight mb-4">
                  Jadi Mitra,
                  <br />
                  Perluas Jangkauan Bisnis
                </h3>

                <p className="text-muted-foreground leading-relaxed">
                  Dari bank sampah lokal hingga pengepul besar, semua bisa
                  menggunakan platform kami untuk menjangkau pelanggan baru.
                </p>
              </div>

              <button className="mt-8 h-11 px-6 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition w-fit">
                Gabung Sekarang
              </button>
            </div>
          </div>

          {/* right stacked benefits */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-5">
            {items.map((item, index) => {
              const Icon = item.icon;

              return (
                <Card
                  key={index}
                  className="rounded-3xl border border-border bg-card p-6 hover:border-primary/30 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>

                    <div>
                      <h4 className="text-lg font-semibold text-foreground mb-2">
                        {item.title}
                      </h4>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.desc}
                      </p>

                      <div className="mt-4 flex items-center gap-2 text-sm text-primary font-medium">
                        Detail
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
