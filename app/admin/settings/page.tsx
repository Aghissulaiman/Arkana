import AdminSidebar from "@/components/Admin/NavbarAdmin";
import SettingsPage from "@/components/Admin/Settings/SettingsPage";

export default function AdminSettingsPage() {
  return (
    <AdminSidebar>
      <SettingsPage />
    </AdminSidebar>
  );
}
