import { Card } from "@/components/ui/card";
import { ArrowDownLeft, ArrowUpRight, Clock } from "lucide-react";

export default function RecentTransactions() {
  const transactions = [
    { title: "Jual Plastik & Kardus", date: "Hari ini, 10:30", pts: "+150", type: "earn" },
    { title: "Tukar Pulsa Telkomsel 50k", date: "Kemarin, 14:20", pts: "-500", type: "spend" },
    { title: "Jual Kertas Bekas", date: "28 April, 09:15", pts: "+80", type: "earn" },
    { title: "Jual Botol Kaca", date: "25 April, 16:45", pts: "+120", type: "earn" },
    { title: "Tukar Token Listrik", date: "20 April, 11:00", pts: "-1000", type: "spend" },
  ];

  return (
    <Card className="bg-white border-none shadow-xl shadow-slate-200/50 rounded-3xl p-6 sm:p-8 h-full flex flex-col">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Riwayat</h2>
        <button className="text-xs font-bold text-emerald-600 hover:text-emerald-700 uppercase tracking-wider transition-colors bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100">
          Lihat Semua
        </button>
      </div>
      
      <div className="flex flex-col gap-6 flex-1">
        {transactions.map((item, i) => (
          <div key={i} className="flex items-center justify-between group">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                item.type === 'earn' 
                  ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100' 
                  : 'bg-slate-50 text-slate-600 group-hover:bg-slate-100'
              }`}>
                {item.type === 'earn' ? <ArrowDownLeft className="w-6 h-6" /> : <ArrowUpRight className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-base">{item.title}</h4>
                <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {item.date}
                </p>
              </div>
            </div>
            <span className={`font-black text-lg ${item.type === 'earn' ? 'text-emerald-600' : 'text-slate-800'}`}>
              {item.pts}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
