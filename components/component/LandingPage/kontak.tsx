"use client";

import { Mail, Phone, MapPin } from "lucide-react";

export default function KontakSection() {
  return (
    <section id="kontak" className="py-24 bg-background">
      <div className="max-w-4xl mx-auto px-4">
        
        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Hubungi Kami
          </h2>

          <p className="text-muted-foreground text-sm md:text-base max-w-md mx-auto">
            Jika ada pertanyaan atau ingin bekerja sama, kirimkan pesan Anda.
          </p>
        </div>

        {/* CARD UTAMA */}
        <div className="rounded-[28px] border border-border bg-card p-6 md:p-8 shadow-sm">
          
          <div className="grid md:grid-cols-2 gap-8 items-start">
            
            {/* INFO (kiri tapi bukan kaku) */}
            <div className="space-y-6">
              
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm text-foreground">
                    support@arkana.id
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Telepon</p>
                  <p className="text-sm text-foreground">
                    +62 812 3456 7890
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Lokasi</p>
                  <p className="text-sm text-foreground">
                    Bekasi, Indonesia
                  </p>
                </div>
              </div>

            </div>

            {/* FORM */}
            <div className="space-y-4">
              
              <input
                type="text"
                placeholder="Nama"
                className="w-full h-11 px-3 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary transition"
              />

              <input
                type="email"
                placeholder="Email"
                className="w-full h-11 px-3 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary transition"
              />

              <textarea
                rows={4}
                placeholder="Pesan..."
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-xl outline-none focus:border-primary transition resize-none"
              />

              <button className="w-full h-11 text-sm bg-primary text-primary-foreground rounded-xl font-medium hover:opacity-90 transition">
                Kirim Pesan
              </button>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}