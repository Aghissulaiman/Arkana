"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Calendar, Weight, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HistoryPage() {
  const history = [
    {
      id: "REQ-000",
      customer: "Budi Jaya",
      address: "Jl. Sudirman No. 1, Jakarta Pusat",
      date: "07 Mei 2026, 08:30",
      weight: "15 kg",
      type: "Organik",
    },
    {
      id: "REQ-999",
      customer: "Warung Bu Ani",
      address: "Jl. Thamrin No. 4, Jakarta Pusat",
      date: "06 Mei 2026, 14:15",
      weight: "22 kg",
      type: "Campuran",
    },
    {
      id: "REQ-998",
      customer: "Klinik Sehat",
      address: "Jl. Diponegoro 10, Jakarta",
      date: "06 Mei 2026, 10:00",
      weight: "8 kg",
      type: "Anorganik",
    },
    {
      id: "REQ-997",
      customer: "SMA N 1 Jakarta",
      address: "Jl. Budi Utomo No. 7",
      date: "05 Mei 2026, 11:30",
      weight: "45 kg",
      type: "Kertas & Plastik",
    },
  ];

  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("q")?.toLowerCase() || "";

  const filteredHistory = useMemo(() => {
    if (!searchQuery) return history;
    return history.filter(item => 
      item.customer.toLowerCase().includes(searchQuery) ||
      item.id.toLowerCase().includes(searchQuery) ||
      item.address.toLowerCase().includes(searchQuery)
    );
  }, [searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 pt-8">
      <div className="space-y-4">
        {filteredHistory.map((item) => (
          <Card key={item.id} className="overflow-hidden border-0 rounded-2xl shadow-sm bg-background hover:shadow-md transition-all duration-300 hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row gap-4 sm:items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0 border border-primary/20">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                
                <div className="flex-1 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-foreground">{item.customer}</h3>
                    <Badge variant="outline" className="text-[9px] font-bold text-muted-foreground/70 bg-muted/30 border-border/50 px-1.5 py-0">{item.id}</Badge>
                  </div>
                  <p className="text-xs font-medium text-muted-foreground line-clamp-1">{item.address}</p>
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground/90 pt-1">
                    <span className="flex items-center gap-1 bg-muted/30 px-1.5 py-0.5 rounded border border-border/50">
                      <Calendar className="w-3 h-3 text-muted-foreground/70" />
                      {item.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Badge variant="secondary" className="font-bold bg-primary/10 text-primary px-1.5 py-0 rounded border-none text-[9px]">{item.type}</Badge>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-0 border-border/50">
                  <div className="flex items-center gap-1.5 text-xs font-bold bg-muted/30 px-3 py-2 rounded-lg border border-border/50 text-foreground/80">
                    <Weight className="w-3.5 h-3.5 text-primary" />
                    {item.weight}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
