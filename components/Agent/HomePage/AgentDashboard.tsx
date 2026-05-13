import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, Clock, CheckCircle2 } from "lucide-react";

export default function AgentDashboard() {
  const activeTasks = [
    {
      id: "REQ-001",
      customer: "Ahmad Santoso",
      address: "Jl. Merdeka No. 45, Jakarta Selatan",
      distance: "2.4 km",
      time: "10:00 - 12:00",
      status: "pending",
    },
    {
      id: "REQ-002",
      customer: "Siti Rahma",
      address: "Komplek Harmoni Blok B/12, Jakarta Barat",
      distance: "5.1 km",
      time: "13:00 - 15:00",
      status: "pending",
    },
  ];

  const recentPickups = [
    {
      id: "REQ-000",
      customer: "Budi Jaya",
      address: "Jl. Sudirman No. 1, Jakarta Pusat",
      date: "Hari ini, 08:30",
      weight: "15 kg",
      points: "+150",
    },
  ];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Tugas Hari Ini */}
      <Card className="lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Tugas Penjemputan Hari Ini</CardTitle>
          <Badge variant="outline" className="bg-green-600/10 text-green-600 border-green-600/20">
            {activeTasks.length} Tugas
          </Badge>
        </CardHeader>
        <CardContent className="space-y-4">
          {activeTasks.map((task) => (
            <div key={task.id} className="p-4 rounded-xl border bg-card hover:bg-muted/50 transition-colors">
              <div className="flex flex-col sm:flex-row justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{task.id}</span>
                  </div>
                  <p className="font-medium">{task.customer}</p>
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                    <span>{task.address}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
                    <div className="flex items-center gap-1">
                      <Navigation className="w-3.5 h-3.5" />
                      {task.distance}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {task.time}
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col gap-2 shrink-0">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                    <MapPin className="w-4 h-4 mr-2" />
                    Navigasi
                  </Button>
                  <Button size="sm" variant="outline" className="w-full">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Selesai
                  </Button>
                </div>
              </div>
            </div>
          ))}
          {activeTasks.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p>Tidak ada tugas penjemputan saat ini</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Riwayat Terbaru */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Riwayat Terbaru</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentPickups.map((pickup) => (
            <div key={pickup.id} className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0">
              <div className="w-10 h-10 rounded-full bg-green-600/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{pickup.customer}</p>
                <p className="text-xs text-muted-foreground">{pickup.date}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Badge variant="secondary" className="text-[10px]">
                    {pickup.weight}
                  </Badge>
                  <span className="text-xs font-medium text-green-600">{pickup.points} pts</span>
                </div>
              </div>
            </div>
          ))}
          <Button variant="ghost" className="w-full text-xs text-green-600 hover:text-green-700 hover:bg-green-50">
            Lihat Semua Riwayat
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
