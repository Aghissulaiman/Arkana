"use client";

import { Badge } from "@/components/ui/badge";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function KontakSection() {
  return (
    <section id="kontak" className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-14">
          <Badge className="mb-4 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10">
            Kontak Kami
          </Badge>

          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight mb-4">
            Mari Terhubung
            <span className="text-primary"> Bersama Kami</span>
          </h2>

          <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
            Punya pertanyaan, ingin menjadi mitra, atau butuh bantuan? Tim kami
            siap membantu Anda.
          </p>
        </div>

        {/* Content */}
        <div className="grid lg:grid-cols-12 gap-8">
          {/* kiri */}
          <div className="lg:col-span-5 space-y-5">
            <div className="rounded-3xl border border-border bg-card p-6 flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <p className="text-sm text-muted-foreground">
                  support@arkana.id
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <Phone className="w-5 h-5 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Telepon</h3>
                <p className="text-sm text-muted-foreground">
                  +62 812 3456 7890
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 flex gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5 text-primary" />
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">Lokasi</h3>
                <p className="text-sm text-muted-foreground">
                  Bekasi, Jawa Barat, Indonesia
                </p>
              </div>
            </div>
          </div>

          {/* kanan form */}
          <div className="lg:col-span-7">
            <div className="rounded-[32px] border border-border bg-card p-6 md:p-8">
              <h3 className="text-2xl font-semibold text-foreground mb-6">
                Kirim Pesan
              </h3>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <input
                  type="text"
                  placeholder="Nama Lengkap"
                  className="h-12 px-4 rounded-2xl bg-background border border-border outline-none focus:border-primary"
                />

                <input
                  type="email"
                  placeholder="Email"
                  className="h-12 px-4 rounded-2xl bg-background border border-border outline-none focus:border-primary"
                />
              </div>

              <input
                type="text"
                placeholder="Subjek"
                className="w-full h-12 px-4 rounded-2xl bg-background border border-border outline-none focus:border-primary mb-4"
              />

              <textarea
                rows={5}
                placeholder="Tulis pesan Anda..."
                className="w-full px-4 py-3 rounded-2xl bg-background border border-border outline-none focus:border-primary resize-none mb-5"
              />

              <button className="h-12 px-6 rounded-2xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition flex items-center gap-2">
                <Send className="w-4 h-4" />
                Kirim Pesan
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}