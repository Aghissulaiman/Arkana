import { Card } from "@/components/ui/card";
import { User, LogOut, Gift, Clock } from "lucide-react";
import Link from "next/link";

export default function SidebarMenu() {
  return (
    <Card className="bg-white rounded-3xl p-4 border-none shadow-xl shadow-slate-200/50 flex flex-col gap-2 h-full">
      <button className="flex items-center gap-4 w-full p-4 rounded-2xl bg-emerald-50 text-emerald-700 font-bold text-left transition-colors">
        <User className="w-5 h-5" /> Informasi Pribadi
      </button>
      <Link href="/home#tukar" className="flex items-center gap-4 w-full p-4 rounded-2xl text-slate-600 hover:bg-slate-50 font-semibold text-left transition-colors">
        <Gift className="w-5 h-5 text-slate-400" /> Tukar Poin
      </Link>
      <Link href="/home#riwayat" className="flex items-center gap-4 w-full p-4 rounded-2xl text-slate-600 hover:bg-slate-50 font-semibold text-left transition-colors">
        <Clock className="w-5 h-5 text-slate-400" /> Riwayat
      </Link>
      
      <div className="h-px bg-slate-100 my-4 mx-4" />
      
      <Link href="/login" className="flex items-center gap-4 w-full p-4 rounded-2xl text-rose-600 hover:bg-rose-50 font-bold text-left transition-colors mt-auto">
        <LogOut className="w-5 h-5" /> Keluar
      </Link>
    </Card>
  );
}
