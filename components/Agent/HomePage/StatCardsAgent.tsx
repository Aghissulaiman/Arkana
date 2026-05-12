import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle2, Coins, MapPin, Weight } from "lucide-react";

export default function StatCardsAgent() {
  const stats = [
    {
      title: "Penjemputan Selesai",
      value: "142",
      change: "+12 bulan ini",
      icon: CheckCircle2,
      trend: "up",
    },
    {
      title: "Berat Sampah",
      value: "845 kg",
      change: "+45 kg bulan ini",
      icon: Weight,
      trend: "up",
    },

    {
      title: "Tugas Hari Ini",
      value: "5",
      change: "2 selesai, 3 pending",
      icon: MapPin,
      trend: "neutral",
    },
  ];

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <Card key={i}>
            <CardContent className="p-4 sm:p-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-green-600/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                  <span
                    className={`text-xs font-medium ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : stat.trend === "down"
                        ? "text-red-500"
                        : "text-muted-foreground"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
