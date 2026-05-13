"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  CreditCard,
  Zap,
  Crown,
  Clock,
  FileText
} from "lucide-react";
import { Toaster, toast } from "sonner";

type Subscription = {
  id: string;
  plan_type: string;
  status: string;
  start_date: string;
  end_date: string;
  trial_used: boolean;
};

type SubscriptionStatus = {
  is_active: boolean;
  plan_type: string;
  days_left: number;
  is_trial: boolean;
};

const PLANS = [
  {
    id: "monthly",
    name: "Bulanan",
    price: 50000,
    duration: "30 hari",
    duration_days: 30,
    icon: Calendar,
    color: "bg-blue-500",
    features: ["Akses penuh dashboard agent", "Menerima permintaan penjemputan", "Riwayat transaksi", "Support 24/7"],
  },
  {
    id: "yearly",
    name: "Tahunan",
    price: 500000,
    duration: "365 hari",
    duration_days: 365,
    icon: Crown,
    color: "bg-amber-500",
    features: ["Akses penuh dashboard agent", "Menerima permintaan penjemputan", "Riwayat transaksi", "Support 24/7", "Diskon 15%", "Prioritas layanan"],
    popular: true,
  },
];

export default function AgentSubscriptionPage() {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [status, setStatus] = useState<SubscriptionStatus | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchSubscription();
  }, []);

  const fetchSubscription = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      // Ambil agent_id
      const { data: agentData } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (!agentData) {
        router.push("/agent/dashboard");
        return;
      }

      // Ambil subscription terbaru
      const { data: subData } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("agent_id", agentData.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      setSubscription(subData);

      // Cek status subscription via function
      const { data: statusData } = await supabase
        .rpc("check_agent_subscription_status", { p_agent_id: agentData.id });

      setStatus(statusData as SubscriptionStatus);

    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (planId: string) => {
    setSelectedPlan(planId);
    setProcessing(true);

    const plan = PLANS.find(p => p.id === planId);
    if (!plan) return;

    // Simulasikan pembayaran (nanti integrasi dengan payment gateway)
    toast.info("Simulasi pembayaran. Dalam implementasi nyata akan diarahkan ke payment gateway.");
    
    setTimeout(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Ambil agent_id
      const { data: agentData } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", user?.id)
        .single();

      if (agentData) {
        // Buat subscription baru
        const { error } = await supabase
          .from("subscriptions")
          .insert({
            agent_id: agentData.id,
            plan_type: planId,
            status: "active",
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + plan.duration_days * 24 * 60 * 60 * 1000).toISOString(),
          });

        if (error) {
          toast.error("Gagal melakukan subscription: " + error.message);
        } else {
          toast.success(`Berhasil berlangganan paket ${plan.name}!`);
          await fetchSubscription();
        }
      }
      
      setSelectedPlan(null);
      setProcessing(false);
    }, 1500);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const isSubscribed = status?.is_active === true;
  const isTrial = status?.is_trial === true;
  const daysLeft = status?.days_left || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Langganan Agent</h1>
          <p className="text-sm text-gray-500 mt-1">
            Kelola langganan untuk mengakses layanan agent
          </p>
        </div>

        {/* Status Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  isSubscribed ? "bg-emerald-100" : "bg-red-100"
                }`}>
                  {isSubscribed ? (
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">
                    Status Langganan: 
                    <Badge className={`ml-2 ${isSubscribed ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>
                      {isSubscribed ? (isTrial ? "Uji Coba" : "Aktif") : "Tidak Aktif"}
                    </Badge>
                  </h3>
                  {isSubscribed && (
                    <p className="text-sm text-gray-500 mt-1">
                      {isTrial ? (
                        <>Masa uji coba tersisa <span className="font-semibold text-emerald-600">{daysLeft}</span> hari lagi</>
                      ) : (
                        <>Langganan berlaku hingga <span className="font-semibold">{new Date(subscription?.end_date || "").toLocaleDateString("id-ID")}</span></>
                      )}
                    </p>
                  )}
                </div>
              </div>
              {!isSubscribed && (
                <Button variant="outline" onClick={fetchSubscription} className="gap-2">
                  <RefreshCw size={16} />
                  Cek Status
                </Button>
              )}
            </div>

            {isSubscribed && subscription && (
              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-400">Mulai Langganan</p>
                  <p className="font-medium">{new Date(subscription.start_date).toLocaleDateString("id-ID")}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Berakhir</p>
                  <p className="font-medium">{new Date(subscription.end_date).toLocaleDateString("id-ID")}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Paket</p>
                  <p className="font-medium capitalize">{subscription.plan_type === "trial" ? "Uji Coba" : subscription.plan_type}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        {!isSubscribed && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-1 h-6 bg-emerald-500 rounded-full" />
              <h2 className="text-lg font-semibold text-gray-800">Pilih Paket Langganan</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {PLANS.map((plan) => {
                const Icon = plan.icon;
                const isSelected = selectedPlan === plan.id;
                return (
                  <Card key={plan.id} className={`overflow-hidden transition-all hover:shadow-lg ${
                    plan.popular ? "ring-2 ring-emerald-400" : ""
                  }`}>
                    {plan.popular && (
                      <div className="bg-emerald-500 text-white text-center text-xs py-1 font-semibold">
                        PALING POPULER
                      </div>
                    )}
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className={`w-10 h-10 rounded-xl ${plan.color} flex items-center justify-center mb-3`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-xl font-bold text-gray-800">{plan.name}</h3>
                          <p className="text-sm text-gray-500">{plan.duration}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-800">Rp {plan.price.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">
                            {plan.id === "monthly" ? "per bulan" : "per tahun"}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2 mb-6">
                        {plan.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle size={14} className="text-emerald-500" />
                            {feature}
                          </div>
                        ))}
                      </div>

                      <Button
                        onClick={() => handleSubscribe(plan.id)}
                        disabled={processing}
                        className={`w-full ${
                          plan.popular
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-gray-800 hover:bg-gray-900"
                        } text-white rounded-lg`}
                      >
                        {processing && selectedPlan === plan.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          "Pilih Paket"
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-semibold text-blue-800">Informasi Langganan</p>
              <p className="text-xs text-blue-700 mt-1">
                • Setiap agent baru mendapatkan uji coba gratis selama 1 bulan.<br />
                • Setelah masa uji coba habis, Anda perlu berlangganan untuk terus mengakses layanan agent.<br />
                • Pembayaran dapat dilakukan melalui transfer bank (bukti transfer akan diverifikasi admin).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tambahan komponen RefreshCw jika belum ada
function RefreshCw(props: any) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  );
}