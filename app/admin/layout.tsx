import AdminSidebar from "@/components/Admin/NavbarAdmin";

import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={inter.className}>
        <AdminSidebar>{children}</AdminSidebar>
      </body>
    </html>
  );
}
