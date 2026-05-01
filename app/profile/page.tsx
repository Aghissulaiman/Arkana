"use client";

import Navbar from "@/components/component/ProfilePage/Navbar";
import Footer from "@/components/component/ProfilePage/Footer";
import ProfileHeader from "@/components/component/ProfilePage/ProfileHeader";
import SidebarMenu from "@/components/component/ProfilePage/SidebarMenu";
import PersonalInfoForm from "@/components/component/ProfilePage/PersonalInfoForm";

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-[#F4F7F6] font-sans selection:bg-emerald-200">
      <Navbar />
      
      <main className="pt-28 pb-20 px-4 sm:px-6 lg:px-8 max-w-[1100px] mx-auto flex flex-col gap-8">
        
        <ProfileHeader />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          
          <div className="md:col-span-1">
            <SidebarMenu />
          </div>

          <div className="md:col-span-2">
            <PersonalInfoForm />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
