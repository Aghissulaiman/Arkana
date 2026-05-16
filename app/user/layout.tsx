import NavbarUser from "@/components/Users/NavbarUser";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NavbarUser>{children}</NavbarUser>;
}
