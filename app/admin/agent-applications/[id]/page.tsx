"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import AgentDetailView from "@/components/Admin/agentRequest/detailRequest";
import { Loader2 } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function Page({ params }: PageProps) {
  // 1. Tambahkan pengecekan aman untuk params
  const resolvedParams = params ? use(params) : null;
  const id = resolvedParams?.id;

  const router = useRouter();
  const supabase = createClientSupabaseClient();

  const [app, setApp] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    // Jangan lakukan fetch jika id belum ada
    if (!id) return;

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("agent_applications")
          .select(
            `
            *,
            users!agent_applications_user_id_fkey (email)
          `,
          )
          .eq("id", id)
          .single();

        if (error) throw error;
        setApp(data);
      } catch (err) {
        console.error("Error fetching detail:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id, supabase]);

  // Fungsi Handler (Approve/Reject) tetap sama seperti sebelumnya...
  const handleApprove = async () => {
    if (processing || !id) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("agent_applications")
        .update({ status: "approved" })
        .eq("id", id);
      if (error) throw error;
      router.push("/admin/verify/agents");
    } catch (err) {
      alert("Gagal menyetujui aplikasi");
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (processing || !id) return;
    setProcessing(true);
    try {
      const { error } = await supabase
        .from("agent_applications")
        .update({ status: "rejected" })
        .eq("id", id);
      if (error) throw error;
      router.push("/admin/verify/agents");
    } catch (err) {
      alert("Gagal menolak aplikasi");
      setProcessing(false);
    }
  };

  // State loading jika ID atau data belum siap
  if (!id || loading)
    return (
      <div className="p-20 flex justify-center">
        <Loader2 className="animate-spin text-emerald-600" />
      </div>
    );

  if (!app) return <div className="p-20 text-center">Data tidak ditemukan</div>;

  return (
    <AgentDetailView
      data={app}
      isProcessing={processing}
      onApprove={handleApprove}
      onReject={handleReject}
      onBack={() => router.back()}
    />
  );
}
