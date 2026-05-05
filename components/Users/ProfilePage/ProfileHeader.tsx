import { User, Camera } from "lucide-react";

export default function ProfileHeader() {
  return (
    <div className="relative rounded-3xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white shadow-xl overflow-hidden p-8 sm:p-12">
      <div className="absolute top-0 right-0 -mr-10 -mt-10 w-64 h-64 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-teal-500/20 blur-3xl" />
      
      <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full border-4 border-white/20 bg-emerald-50 flex items-center justify-center overflow-hidden shadow-lg">
            <User className="w-16 h-16 text-emerald-600" />
          </div>
          <button className="absolute bottom-0 right-0 p-3 bg-white rounded-full shadow-lg text-emerald-600 hover:text-emerald-700 hover:scale-110 transition-transform group-hover:-translate-y-1">
            <Camera className="w-5 h-5" />
          </button>
        </div>
        
        <div className="text-center sm:text-left flex-1">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-emerald-200 text-xs font-bold tracking-wider uppercase mb-4 shadow-sm">
            Pahlawan Bumi
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black mb-2 tracking-tight">Budi Santoso</h1>
          <p className="text-emerald-100/80 font-medium text-lg">Bergabung sejak April 2026</p>
        </div>
      </div>
    </div>
  );
}
