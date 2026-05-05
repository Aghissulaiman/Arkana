import Sidebar from "@/components/NavbarUmum";
import UserDashboard from "@/components/Users/HomePage/Dashboard";

export default function HomePage() {
  return (
    <>
    <Sidebar>
      <UserDashboard />
    </Sidebar>
    </>
  )
}