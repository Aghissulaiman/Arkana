// "use client";

// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";

// export default function Hero() {
//   return (
//     <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
//       {/* Background berbeda: diagonal split */}
//       <div className="absolute inset-0">
//         <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-background to-background" />
//         <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/5 clip-diagonal" />
//       </div>

//       <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
//         {/* Layout berbeda: stacked dengan floating elements */}
//         <div className="text-center max-w-4xl mx-auto">
//           {/* Badge dengan desain berbeda */}
//           <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm px-4 py-2 rounded-full border border-primary/20 mb-8">
//             <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
//             <span className="text-sm font-medium text-primary">#ZeroWasteMovement</span>
//           </div>

//           {/* Heading dengan efek berbeda */}
//           <h1 className="text-6xl lg:text-8xl font-bold mb-8 leading-[1.1]">
//             <span className="text-foreground">Ubah Sampah</span>
//             <br />
//             <span className="bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
//               Jadi Poin & Uang
//             </span>
//           </h1>

//           {/* Deskripsi dengan width berbeda */}
//           <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
//             Arkana menghubungkan masyarakat, pengepul, dan pabrik daur ulang
//             dalam satu platform terintegrasi.
//           </p>

//           {/* CTA dengan layout horizontal */}
//           <div className="flex flex-wrap gap-4 justify-center mb-16">
//             <Button size="xl" className="shadow-2xl hover:shadow-primary/25 transition-shadow">
//               Mulai Jual Sampah
//             </Button>
//             <Button size="xl" variant="outline">
//               Tonton Video
//             </Button>
//           </div>

//           {/* Stats dengan desain horizontal bar */}
//           <div className="flex flex-wrap justify-center gap-8 border-t border-border/50 pt-10">
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary">10.000+</div>
//               <div className="text-sm text-muted-foreground mt-1">User Aktif</div>
//             </div>
//             <div className="w-px h-12 bg-border/50 hidden sm:block" />
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary">50+</div>
//               <div className="text-sm text-muted-foreground mt-1">Mitra Pengepul</div>
//             </div>
//             <div className="w-px h-12 bg-border/50 hidden sm:block" />
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary">100+ Ton</div>
//               <div className="text-sm text-muted-foreground mt-1">Sampah Didaur Ulang</div>
//             </div>
//             <div className="w-px h-12 bg-border/50 hidden sm:block" />
//             <div className="text-center">
//               <div className="text-3xl font-bold text-primary">Rp 2.5M</div>
//               <div className="text-sm text-muted-foreground mt-1">Pemasukan Warga</div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Decorative elements berbeda: floating circles */}
//       <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
//       <div className="absolute top-40 right-20 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
//       <div className="absolute bottom-1/2 left-1/3 w-48 h-48 bg-primary/15 rounded-full blur-2xl animate-pulse delay-1000" />
//     </section>
//   );
// }