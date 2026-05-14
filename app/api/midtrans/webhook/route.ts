import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { order_id, transaction_status } = body;
    const supabase = await createServerSupabaseClient();

    const { data: topup } = await supabase
      .from("topup_requests")
      .select("*")
      .eq("order_id", order_id)
      .single();

    if (!topup) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (transaction_status === "capture" || transaction_status === "settlement") {
      await supabase
        .from("topup_requests")
        .update({ status: "success", completed_at: new Date().toISOString() })
        .eq("id", topup.id);

      // Tambah poin ke user
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance_points")
        .eq("user_id", topup.user_id)
        .single();

      await supabase
        .from("profiles")
        .update({ balance_points: (profile?.balance_points || 0) + topup.points_to_add })
        .eq("user_id", topup.user_id);
    } else if (transaction_status === "deny" || transaction_status === "cancel" || transaction_status === "expire") {
      await supabase
        .from("topup_requests")
        .update({ status: "failed" })
        .eq("id", topup.id);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}