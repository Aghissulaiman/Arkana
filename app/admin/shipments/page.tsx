import AdminSidebar from "@/components/Admin/NavbarAdmin";
import ShipmentTable from "@/components/Admin/ShipmentManagement/ShipmentTable";

export default function AdminShipmentsPage() {
  return (
    <AdminSidebar>
      <ShipmentTable />
    </AdminSidebar>
  );
}
