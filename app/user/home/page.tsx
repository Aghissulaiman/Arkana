import Sidebar from "@/components/Users/NavbarUser";
import UserDashboard from "@/components/Users/HomePage/Dashboard";
import Recommendations from "@/components/Users/HomePage/Rekomendasi";
// import Langganan from "@/components/Users/Langganan/Langganan"

export default function HomePage() {
  return (
    <>
      <Sidebar>
      <UserDashboard />
      <Recommendations />
      {/* <Langganan /> */}
      </Sidebar>
    </>
  );
}
