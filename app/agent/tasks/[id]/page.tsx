"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { 
  Loader2, 
  MapPin, 
  Phone, 
  User, 
  Package,
  Truck,
  ArrowLeft,
  CheckCircle,
  Clock,
  Weight,
  Calendar
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from "sonner";

type PageProps = {
  params: Promise<{ id: string }>;
};

type Task = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  notes: string;
  waste_type: string;
  estimated_weight: number;
  created_at: string;
  status: string;
};

const WASTE_LABELS: Record<string, string> = {
  plastic: "Plastik",
  paper: "Kertas",
  cardboard: "Kardus",
  glass: "Kaca",
  aluminium: "Aluminium",
  metal: "Logam",
  electronic: "Elektronik",
  mixed: "Campuran",
};

export default function TaskDetailPage({ params }: PageProps) {
  const router = useRouter();
  const supabase = createClientSupabaseClient();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [actualWeight, setActualWeight] = useState<number>(0);
  const [actualWeightInput, setActualWeightInput] = useState("");
  const [taskId, setTaskId] = useState<string | null>(null);

  useEffect(() => {
    params.then((resolved) => {
      setTaskId(resolved.id);
    });
  }, [params]);

  useEffect(() => {
    if (!taskId) return;
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    if (!taskId) return;
    
    setLoading(true);
    
    // Ambil data user yang login (agent)
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      router.push("/login");
      return;
    }

    // Ambil data agent
    const { data: agentData } = await supabase
      .from("agents")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (!agentData) {
      toast.error("Anda tidak terdaftar sebagai agent");
      router.push("/agent/tasks");
      return;
    }

    // Ambil detail pickup request
    const { data: request, error: requestError } = await supabase
      .from("pickup_requests")
      .select(`
        *,
        users!pickup_requests_user_id_fkey (email)
      `)
      .eq("id", taskId)
      .eq("agent_id", agentData.id)
      .single();

    if (requestError || !request) {
      toast.error("Task tidak ditemukan");
      router.push("/agent/tasks");
      return;
    }

    // Ambil profile customer
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, phone")
      .eq("user_id", request.user_id)
      .single();

    setTask({
      id: request.id,
      customer: profile?.full_name || request.users?.email?.split("@")[0] || "Pengguna",
      phone: profile?.phone || "-",
      address: request.pickup_address,
      notes: request.notes || "",
      waste_type: WASTE_LABELS[request.waste_type] || request.waste_type,
      estimated_weight: request.estimated_weight,
      created_at: request.created_at,
      status: request.status,
    });

    setActualWeight(request.estimated_weight);
    setActualWeightInput(request.estimated_weight.toString());
    setLoading(false);
  };

  const handleComplete = async () => {
    const weight = parseFloat(actualWeightInput);
    if (isNaN(weight) || weight <= 0) {
      toast.error("Masukkan berat sampah yang valid");
      return;
    }

    setSubmitting(true);

    const { error } = await supabase
      .from("pickup_requests")
      .update({
        status: "completed",
        actual_weight: weight,
        completed_at: new Date().toISOString(),
      })
      .eq("id", taskId);

    if (error) {
      toast.error("Gagal menyelesaikan tugas: " + error.message);
    } else {
      toast.success("Penjemputan selesai! Poin telah diberikan ke user.");
      router.push("/agent/tasks");
    }
    setSubmitting(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-green-600" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-gray-500">Task tidak ditemukan</p>
        <Link href="/agent/tasks" className="mt-4 text-green-600 hover:underline">
          Kembali ke Tugas
        </Link>
      </div>
    );
  }

  const date = new Date(task.created_at);

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />
      
      <div className="max-w-3xl mx-auto px-4 py-6">
        
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-5 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm">Kembali</span>
        </button>

        {/* Status Banner */}
        <div className="mb-6">
          {task.status === "accepted" ? (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center gap-3">
              <Truck className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm font-semibold text-blue-800">Sedang Berjalan</p>
                <p className="text-xs text-blue-600">Tugas ini sedang dalam proses penjemputan</p>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
              <Clock className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-semibold text-yellow-800">Menunggu Konfirmasi</p>
                <p className="text-xs text-yellow-600">Segera konfirmasi penjemputan</p>
              </div>
            </div>
          )}
        </div>

        {/* Customer Info */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-green-600" />
              Informasi Customer
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Nama</p>
                <p className="font-medium">{task.customer}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400">Nomor Telepon</p>
                <p className="font-medium">{task.phone}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Info */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Detail Penjemputan
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400">Alamat</p>
                <p className="font-medium">{task.address}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-400">Jenis Sampah</p>
                  <p className="font-medium">{task.waste_type}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Estimasi Berat</p>
                  <p className="font-medium">{task.estimated_weight} kg</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-400">Tanggal Request</p>
                <p className="font-medium">
                  {date.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                  {" • "}
                  {date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
              {task.notes && (
                <div>
                  <p className="text-xs text-gray-400">Catatan</p>
                  <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">{task.notes}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Actual Weight Input */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Weight className="w-5 h-5 text-green-600" />
              Konfirmasi Berat Sampah
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-400 mb-1">Berat Aktual (kg)</p>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    value={actualWeightInput}
                    onChange={(e) => setActualWeightInput(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="0"
                  />
                  <span className="text-sm text-gray-500">kg</span>
                  <button
                    onClick={() => {
                      setActualWeightInput(task.estimated_weight.toString());
                    }}
                    className="text-xs text-green-600 hover:underline"
                  >
                    Gunakan estimasi ({task.estimated_weight} kg)
                  </button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => router.push("/agent/tasks")}
            className="flex-1"
          >
            Batal
          </Button>
          <Button
            onClick={handleComplete}
            disabled={submitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Selesaikan Penjemputan
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}