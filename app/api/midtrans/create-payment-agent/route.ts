import { NextRequest, NextResponse } from "next/server";
import { createClientSupabaseClient } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, points_to_add, user_id, agent_id, payment_method } = body;

    if (!amount || !user_id || !agent_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const supabase = createClientSupabaseClient();
    const { data: agent } = await supabase
      .from("agents")
      .select("agent_name")
      .eq("id", agent_id)
      .single();

    const orderId = `AGENT-TOPUP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const snapPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        user_id: user_id,
        agent_id: agent_id,
        agent_name: agent?.agent_name || "Agent",
      },
      item_details: [
        {
          id: "POINTS_PACKAGE",
          name: `Top Up Balance +${points_to_add} poin`,
          price: amount,
          quantity: 1,
          category: "Top Up",
        },
      ],
      callbacks: {
        finish: `${process.env.NEXT_PUBLIC_APP_URL}/agent/topup/success?order_id=${orderId}`,
      },
    };

    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64")}`,
      },
      body: JSON.stringify(snapPayload),
    });

    const snapData = await response.json();

    if (!response.ok) {
      console.error("Midtrans error:", snapData);
      return NextResponse.json({ error: snapData.error_messages?.[0] || "Gagal membuat transaksi" }, { status: 500 });
    }

    // Simpan ke database
    await supabase.from("topup_requests").insert({
      order_id: orderId,
      user_id: user_id,
      agent_id: agent_id,
      amount: amount,
      points_to_add: points_to_add,
      payment_method: payment_method,
      status: "pending",
      midtrans_token: snapData.token,
      payment_url: snapData.redirect_url,
    });

    return NextResponse.json({
      token: snapData.token,
      payment_url: snapData.redirect_url,
      order_id: orderId,
    });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}