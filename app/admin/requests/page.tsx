import AdminSidebar from "@/components/Admin/NavbarAdmin";
import RequestTable from "@/components/Admin/RequestManagement/RequestTable";

export default function AdminRequestsPage() {
  return (
    <AdminSidebar>
      <RequestTable />
    </AdminSidebar>
  );
}
