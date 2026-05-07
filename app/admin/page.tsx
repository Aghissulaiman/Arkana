import AdminSidebar from "@/components/Admin/NavbarAdmin";
import StatCards from "@/components/Admin/HomePage/StatCards";
import AdminDashboard from "@/components/Admin/HomePage/Dashboard";

export default function AdminPage() {
  return (
    <AdminSidebar>
      <div className="space-y-6">
        <StatCards />
        <AdminDashboard />
      </div>
    </AdminSidebar>
  );
}