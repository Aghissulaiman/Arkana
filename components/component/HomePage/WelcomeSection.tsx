import { Card } from "@/components/ui/card";
import { Recycle, Gift, TrendingUp, Sparkles } from "lucide-react";

export default function WelcomeSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-900 text-white shadow-2xl p-8 sm:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-teal-500/20 blur-3xl" />
        
        <div className="relative z-10 h-full flex flex-col justify-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-emerald-200 text-xs font-bold tracking-wider uppercase mb-6 self-start shadow-sm">
            <Sparkles className="w-4 h-4" /> Level: Pahlawan Bumi
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black mb-4 tracking-tight leading-tight">
            Halo Budi, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 to-teal-200">
              Terus hijaukan bumimu.
            </span>
          </h1>
          <p className="text-emerald-100/80 max-w-lg text-lg leading-relaxed mt-2">
            Setiap aksi kecilmu berdampak besar. Mari kita lihat pencapaian luar biasamu hari ini!
          </p>
        </div>
      </div>

      <div className="xl:col-span-1 flex flex-col gap-6">
        <Card className="flex-1 bg-white border-none shadow-xl shadow-slate-200/50 rounded-3xl p-8 relative overflow-hidden group hover:shadow-2xl hover:shadow-emerald-900/5 transition-all">
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 duration-500">
             <TrendingUp className="w-32 h-32 text-emerald-600" />
          </div>
          <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-2">Total Poin Kamu</p>
          <div className="text-6xl font-black text-slate-800 tracking-tight mt-2">
            2,450
          </div>
          <p className="text-emerald-600 font-semibold text-sm mt-6 flex items-center gap-1 bg-emerald-50 inline-flex px-3 py-1.5 rounded-lg w-max">
            <TrendingUp className="w-4 h-4" /> +150 dari bulan lalu
          </p>
        </Card>

        <div className="grid grid-cols-2 gap-6">
          <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-3xl p-6 flex flex-col justify-center items-center text-center hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center mb-4">
              <Recycle className="w-7 h-7 text-emerald-600" />
            </div>
            <div className="text-3xl font-black text-slate-800">15.2<span className="text-sm font-bold text-slate-400 ml-1">kg</span></div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Terkumpul</div>
          </Card>
          
          <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-3xl p-6 flex flex-col justify-center items-center text-center hover:scale-[1.02] transition-transform cursor-pointer">
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-4">
              <Gift className="w-7 h-7 text-teal-600" />
            </div>
            <div className="text-3xl font-black text-slate-800">3<span className="text-sm font-bold text-slate-400 ml-1">x</span></div>
            <div className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-wider">Ditukar</div>
          </Card>
        </div>
      </div>
    </div>
  );
}
