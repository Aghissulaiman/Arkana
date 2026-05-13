import AdminSidebar from "@/components/Admin/NavbarAdmin";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return <AdminSidebar>{children}</AdminSidebar>;
}
