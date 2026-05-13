// "use client";

import AgentVerificationList from "@/components/Admin/agentRequest/listRequest";
import AgentApplication from "@/components/Admin/agentRequest/listRequest";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { createClientSupabaseClient } from "@/lib/supabaseClient";
// import { Loader2, CheckCircle, XCircle, RefreshCw } from "lucide-react";

// type Application = {
//   id: string;
//   user_id: string;
//   agent_name: string;
//   phone: string;
//   address: string;
//   service_area: string;
//   waste_categories: string[];
//   status: string;
//   created_at: string;
//   user_email?: string;
// };

// export default function AgentApplicationsPage() {
//   const router = useRouter();
//   const supabase = createClientSupabaseClient();

//   const [applications, setApplications] = useState<Application[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [processing, setProcessing] = useState<string | null>(null);
//   const [isAdmin, setIsAdmin] = useState(false);

//   useEffect(() => {
//     checkAdminAndFetch();
//   }, []);

//   const checkAdminAndFetch = async () => {
//     setLoading(true);

//     // Cek role user
//     const { data: { user } } = await supabase.auth.getUser();

//     if (!user) {
//       router.push("/login");
//       return;
//     }

//     const { data: userData } = await supabase
//       .from("users")
//       .select("role")
//       .eq("id", user.id)
//       .single();

//     if (userData?.role !== "admin") {
//       setIsAdmin(false);
//       setLoading(false);
//       return;
//     }

//     setIsAdmin(true);
//     await fetchApplications();
//   };

//   const fetchApplications = async () => {
//     const { data, error } = await supabase
//       .from("agent_applications")
//       .select(`
//         *,
//         users!agent_applications_user_id_fkey (email)
//       `)
//       .eq("status", "pending")
//       .order("created_at", { ascending: false });

//     if (!error && data) {
//       const formatted = data.map((app: any) => ({
//         ...app,
//         user_email: app.users?.email || "",
//       }));
//       setApplications(formatted);
//     }
//     setLoading(false);
//   };

//   const handleApprove = async (application: Application) => {
//     setProcessing(application.id);

//     // 1. Update status application
//     await supabase
//       .from("agent_applications")
//       .update({ status: "approved", reviewed_at: new Date().toISOString() })
//       .eq("id", application.id);

//     // 2. Update role user menjadi agent
//     await supabase
//       .from("users")
//       .update({ role: "agent" })
//       .eq("id", application.user_id);

//     // 3. Insert ke tabel agents
//     await supabase.from("agents").insert({
//       user_id: application.user_id,
//       agent_name: application.agent_name,
//       phone: application.phone,
//       address: application.address,
//       service_area: application.service_area,
//       waste_categories: application.waste_categories,
//       balance_income: 0,
//       is_active: true,
//     });

//     setProcessing(null);
//     await fetchApplications();
//   };

//   const handleReject = async (application: Application) => {
//     setProcessing(application.id);

//     await supabase
//       .from("agent_applications")
//       .update({ status: "rejected", reviewed_at: new Date().toISOString() })
//       .eq("id", application.id);

//     setProcessing(null);
//     await fetchApplications();
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Loader2 className="w-8 h-8 animate-spin text-primary" />
//       </div>
//     );
//   }

//   if (!isAdmin) {
//     return (
//       <div className="p-8 text-center">
//         <div className="text-red-500 mb-2">Akses Ditolak</div>
//         <p className="text-muted-foreground">Halaman ini hanya untuk admin.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold">Pendaftaran Agen</h1>
//           <p className="text-muted-foreground">Kelola pendaftaran agen baru</p>
//         </div>
//         <Button variant="outline" size="sm" onClick={fetchApplications}>
//           <RefreshCw className="w-4 h-4 mr-2" />
//           Refresh
//         </Button>
//       </div>

//       {applications.length === 0 ? (
//         <Card>
//           <CardContent className="p-8 text-center">
//             <p className="text-muted-foreground">Tidak ada pendaftaran agen baru</p>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="grid gap-4">
//           {applications.map((app) => (
//             <Card key={app.id}>
//               <CardContent className="p-5">
//                 <div className="flex justify-between items-start">
//                   <div className="space-y-2 flex-1">
//                     <div className="flex items-center gap-2">
//                       <h3 className="font-bold text-lg">{app.agent_name}</h3>
//                       <Badge className="bg-yellow-100 text-yellow-700">Menunggu</Badge>
//                     </div>

//                     <p className="text-sm text-muted-foreground">
//                       Email: {app.user_email}
//                     </p>
//                     <p className="text-sm">📞 {app.phone}</p>
//                     <p className="text-sm">📍 {app.address}</p>
//                     <p className="text-sm">🗺️ Wilayah: {app.service_area}</p>
//                     <p className="text-sm">
//                       🗑️ Jenis sampah: {app.waste_categories?.map(w => {
//                         const labels: Record<string, string> = {
//                           plastic: "Plastik", paper: "Kertas", cardboard: "Kardus",
//                           glass: "Kaca", aluminium: "Aluminium", metal: "Logam",
//                           electronic: "Elektronik", mixed: "Campuran"
//                         };
//                         return labels[w] || w;
//                       }).join(", ")}
//                     </p>
//                     <p className="text-xs text-muted-foreground">
//                       Mendaftar: {new Date(app.created_at).toLocaleDateString("id-ID")}
//                     </p>
//                   </div>

//                   <div className="flex gap-2">
//                     <Button
//                       size="sm"
//                       className="bg-green-600 hover:bg-green-700"
//                       onClick={() => handleApprove(app)}
//                       disabled={processing === app.id}
//                     >
//                       {processing === app.id ? (
//                         <Loader2 className="w-4 h-4 animate-spin" />
//                       ) : (
//                         <CheckCircle className="w-4 h-4 mr-1" />
//                       )}
//                       Setujui
//                     </Button>
//                     <Button
//                       size="sm"
//                       variant="destructive"
//                       onClick={() => handleReject(app)}
//                       disabled={processing === app.id}
//                     >
//                       <XCircle className="w-4 h-4 mr-1" />
//                       Tolak
//                     </Button>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

export default function AgentApplicationsPage() {
  return <AgentVerificationList />;
}
