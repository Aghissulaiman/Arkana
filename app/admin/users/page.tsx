import AdminSidebar from "@/components/Admin/NavbarAdmin";
import UserTable from "@/components/Admin/UserManagement/UserTable";

export default function AdminUsersPage() {
  return (
    <AdminSidebar>
      <UserTable />
    </AdminSidebar>
  );
}
