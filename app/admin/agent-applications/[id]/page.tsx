import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { notFound, redirect } from "next/navigation";
import AgentDetailPage from "@/components/Admin/agentRequest/detailRequest";

// Next.js 15+ params adalah Promise
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect("/login");
  }
  
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  
  if (userData?.role !== "admin") {
    redirect("/admin");
  }
  
  return <AgentDetailPage id={id} />;
}