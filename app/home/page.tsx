"use client";

import Navbar from "@/components/component/HomePage/Navbar";
import WelcomeSection from "@/components/component/HomePage/WelcomeSection";
import QuickActions from "@/components/component/HomePage/QuickActions";
import RecentTransactions from "@/components/component/HomePage/RecentTransactions";
import AgentMap from "@/components/component/HomePage/AgentMap";
import Footer from "@/components/component/HomePage/Footer";

export default function UserHomePage() {
  return (
    <div className="min-h-screen bg-[#F4F7F6] font-sans selection:bg-emerald-200">
      <Navbar />
      
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto flex flex-col gap-8">
        <WelcomeSection />
        <QuickActions />
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <RecentTransactions />
          </div>
          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-6 sm:p-8 h-full flex flex-col">
               <div className="flex items-center justify-between mb-8">
                 <h2 className="text-2xl font-black text-slate-800 tracking-tight">Cari Agen Terdekat</h2>
               </div>
               <div className="flex-1">
                 <AgentMap />
               </div>
            </div>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
