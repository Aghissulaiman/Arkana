import Sidebar from "@/components/NavbarUmum";
import UserDashboard from "@/components/Users/HomePage/Dashboard";
import Recommendations from "@/components/Users/HomePage/Rekomendasi";

export default function HomePage() {
  return (
    <>
    <Sidebar>
      <UserDashboard />
      <Recommendations/>
    </Sidebar>
    </>
  )
}