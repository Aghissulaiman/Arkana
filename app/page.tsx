// import CTA from "@/components/component/LandingPage/CTA";
import AgentMap from "@/components/component/LandingPage/Agent";
import CaraKerjaSection from "@/components/component/LandingPage/CaraKerja";
import Hero from "@/components/component/LandingPage/Hero";
import Navbar from "@/components/component/LandingPage/Navbar";
import AboutSection from "@/components/component/LandingPage/Tentang";

export default function arkana(){
  return (
  <>
  <Navbar/>
  <Hero/>
  {/* <CTA/> */}
  <AboutSection/>
  <CaraKerjaSection/>
  <AgentMap/>
  </>
  )
}