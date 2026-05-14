import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabaseServer";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("Request body:", body);
    
    const { amount, points, user_id, payment_method } = body;

    // Validasi input
    if (!amount || amount < 10000) {
      return NextResponse.json({ error: "Minimal top up Rp 10.000" }, { status: 400 });
    }

    if (!user_id) {
      return NextResponse.json({ error: "User ID tidak ditemukan" }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();

    // Cek user session
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.id !== user_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Dapatkan user profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("full_name, email")
      .eq("user_id", user_id)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
    }

    // Buat order ID unik
    const orderId = `TOPUP-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

    // Simpan request ke database
    const { data: topup, error: insertError } = await supabase
      .from("topup_requests")
      .insert({
        user_id,
        order_id: orderId,
        amount,
        points_to_add: points,
        payment_method,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Gagal menyimpan request: " + insertError.message }, { status: 500 });
    }

    // Request ke Midtrans
    const auth = Buffer.from(MIDTRANS_SERVER_KEY + ":").toString("base64");
    
    const midtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        first_name: profile?.full_name?.split(" ")[0] || "Customer",
        email: profile?.email || user.email,
      },
      item_details: [
        {
          id: "topup_poin",
          price: amount,
          quantity: 1,
          name: `Top Up ${points} Poin`,
        },
      ],
      callbacks: {
        finish: `${APP_URL}/user/topup/success?order_id=${orderId}`,
        error: `${APP_URL}/user/topup?error=payment_failed`,
      },
    };

    console.log("Midtrans payload:", midtransPayload);

    const response = await fetch("https://app.sandbox.midtrans.com/snap/v1/transactions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(midtransPayload),
    });

    const data = await response.json();
    console.log("Midtrans response:", data);

    if (!response.ok) {
      console.error("Midtrans error:", data);
      return NextResponse.json({ error: data.error_messages?.[0] || "Gagal membuat pembayaran di Midtrans" }, { status: 400 });
    }

    // Update dengan token dan payment URL
    await supabase
      .from("topup_requests")
      .update({
        midtrans_token: data.token,
        payment_url: data.redirect_url,
        status: "processing",
      })
      .eq("id", topup.id);

    return NextResponse.json({
      success: true,
      token: data.token,
      payment_url: data.redirect_url,
      order_id: orderId,
    });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Internal server error: " + String(error) }, { status: 500 });
  }
}