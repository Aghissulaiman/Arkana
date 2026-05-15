import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Webhook received:", body);

    const { order_id, transaction_status, fraud_status, payment_type } = body;

    // Cek apakah order_id valid
    if (!order_id) {
      return NextResponse.json({ error: "No order_id" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Cari topup request berdasarkan order_id
    const { data: topup, error: findError } = await supabase
      .from("topup_requests")
      .select("*")
      .eq("order_id", order_id)
      .single();

    if (findError || !topup) {
      console.error("Order not found:", order_id);
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Cek apakah sudah diproses sebelumnya
    if (topup.status === "success") {
      console.log("Order already processed:", order_id);
      return NextResponse.json({ message: "Already processed" });
    }

    // Proses berdasarkan status transaksi
    let newStatus = topup.status;
    let addPoints = false;

    if (transaction_status === "capture") {
      // capture hanya untuk kartu kredit
      if (fraud_status === "accept") {
        newStatus = "success";
        addPoints = true;
      }
    } else if (transaction_status === "settlement") {
      // settlement untuk transfer bank, QRIS, e-wallet
      newStatus = "success";
      addPoints = true;
    } else if (transaction_status === "deny" || transaction_status === "cancel" || transaction_status === "expire") {
      newStatus = "failed";
    } else if (transaction_status === "pending") {
      newStatus = "pending";
    }

    // Update status topup request
    await supabase
      .from("topup_requests")
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
        completed_at: addPoints ? new Date().toISOString() : null,
      })
      .eq("id", topup.id);

    // Tambah poin jika transaksi sukses
    if (addPoints) {
      // Ambil poin saat ini
      const { data: profile } = await supabase
        .from("profiles")
        .select("balance_points")
        .eq("user_id", topup.user_id)
        .single();

      const newBalance = (profile?.balance_points || 0) + topup.points_to_add;

      // Update poin user
      await supabase
        .from("profiles")
        .update({ balance_points: newBalance })
        .eq("user_id", topup.user_id);

      console.log(`✅ Added ${topup.points_to_add} points to user ${topup.user_id}`);
      console.log(`💰 New balance: ${newBalance}`);
    }

    return NextResponse.json({ received: true, status: newStatus });
  } catch (error) {
    console.error("❌ Webhook error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}