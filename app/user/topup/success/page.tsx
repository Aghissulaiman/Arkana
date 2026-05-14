"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { CheckCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function TopUpSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (orderId) {
      setTimeout(async () => {
        const supabase = createClientSupabaseClient();
        const { data } = await supabase
          .from("topup_requests")
          .select("status")
          .eq("order_id", orderId)
          .single();

        if (data?.status === "success") {
          setSuccess(true);
        }
        setLoading(false);
      }, 3000);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
        <p className="text-gray-500">Memverifikasi pembayaran...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Top Up Berhasil!</h1>
      <p className="text-gray-500 mb-6">Poin telah ditambahkan ke akun Anda.</p>
      <Link href="/user/topup">
        <button className="px-6 py-3 bg-primary text-white rounded-xl font-semibold">
          Top Up Lagi
        </button>
      </Link>
    </div>
  );
}