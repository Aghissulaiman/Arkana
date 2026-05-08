import AgentSidebar from "@/components/Agent/NavbarAgent";

export default function AgentLayout({ children }: { children: React.ReactNode }) {
  return <AgentSidebar>{children}</AgentSidebar>;
}
