// import CTA from "@/components/component/LandingPage/CTA";
import AgentMap from "@/components/LandingPage/Agent";
import CaraKerjaSection from "@/components/LandingPage/CaraKerja";
import Footer from "@/components/LandingPage/Footer";
import Hero from "@/components/LandingPage/Hero";
import KontakSection from "@/components/LandingPage/kontak";
import MitraSection from "@/components/LandingPage/Mitra";
import Navbar from "@/components/LandingPage/Navbar";
import AboutSection from "@/components/LandingPage/Tentang";

export default function arkana(){
  return (
  <>
  <Navbar/>
  <Hero/>
  {/* <CTA/> */}
  <AboutSection/>
  <CaraKerjaSection/>
  <MitraSection/>
  <AgentMap/>
  <KontakSection/>
  <Footer/>
  </>
  )
}