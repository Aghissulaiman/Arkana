import { Card } from "@/components/ui/card";
import { Recycle, Gift, ArrowRight, Wallet, Leaf } from "lucide-react";
import Link from "next/link";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Link href="#jual-sampah" className="group">
        <Card className="p-8 border-none bg-emerald-600 text-white rounded-3xl hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 relative overflow-hidden h-full flex flex-col justify-between min-h-[220px]">
          <div className="absolute -right-4 -top-4 w-40 h-40 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="w-16 h-16 bg-white/20 rounded-2xl backdrop-blur-md flex items-center justify-center mb-6 shadow-sm">
            <Recycle className="w-8 h-8 text-white" />
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-2xl mb-2 tracking-tight">Jual Sampah</h3>
            <p className="text-emerald-100/90 text-sm leading-relaxed mb-6 font-medium">
              Panggil agen untuk menjemput, atau antar sendiri ke bank sampah terdekat.
            </p>
            <div className="flex items-center text-sm font-bold uppercase tracking-wider text-emerald-50 group-hover:text-white transition-colors">
              Mulai Sekarang <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>

      <Link href="#tukar-poin" className="group">
        <Card className="p-8 border-none bg-slate-900 text-white rounded-3xl hover:bg-slate-800 transition-all shadow-xl shadow-slate-900/20 relative overflow-hidden h-full flex flex-col justify-between min-h-[220px]">
          <div className="absolute -right-4 -top-4 w-40 h-40 bg-emerald-500/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
          <div className="w-16 h-16 bg-white/10 rounded-2xl backdrop-blur-md flex items-center justify-center mb-6 shadow-sm">
            <Gift className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="relative z-10">
            <h3 className="font-black text-2xl mb-2 tracking-tight">Tukar Poin</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-medium">
              Gunakan poinmu untuk pulsa, token listrik, atau saldo e-wallet favoritmu.
            </p>
            <div className="flex items-center text-sm font-bold uppercase tracking-wider text-slate-300 group-hover:text-white transition-colors">
              Lihat Katalog <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </div>
          </div>
        </Card>
      </Link>

      <div className="flex flex-col gap-6">
        <Card className="p-6 border-none bg-white shadow-xl shadow-slate-200/50 rounded-3xl flex items-center gap-5 flex-1 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200/60 transition-all">
          <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center shrink-0">
            <Wallet className="w-8 h-8 text-teal-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-xl tracking-tight">Tarik Tunai</h4>
            <p className="text-sm font-medium text-slate-500 mt-1">Cairkan poin ke rekening</p>
          </div>
        </Card>
        <Card className="p-6 border-none bg-white shadow-xl shadow-slate-200/50 rounded-3xl flex items-center gap-5 flex-1 cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:shadow-slate-200/60 transition-all">
          <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center shrink-0">
            <Leaf className="w-8 h-8 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-black text-slate-800 text-xl tracking-tight">Donasi Pohon</h4>
            <p className="text-sm font-medium text-slate-500 mt-1">Sumbang pohon dari poin</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
