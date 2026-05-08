import StatCardsAgent from "@/components/Agent/HomePage/StatCardsAgent";
import AgentDashboard from "@/components/Agent/HomePage/AgentDashboard";

export default function AgentPage() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard Agent</h1>
        <p className="text-sm text-muted-foreground">Ringkasan aktivitas dan tugas penjemputan Anda hari ini.</p>
      </div>
      
      <StatCardsAgent />
      <AgentDashboard />
    </div>
  );
}
