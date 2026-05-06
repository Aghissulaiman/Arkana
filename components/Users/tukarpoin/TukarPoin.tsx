"use client";

import { useState } from "react";
import { 
  Gift, 
  Trophy, 
  ChevronRight, 
  Search,
  CheckCircle,
  AlertCircle
} from "lucide-react";

export default function TukarPoin() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedReward, setSelectedReward] = useState<any>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const userPoints = 1250;

  const rewards = [
    { id: 1, name: "Voucher GoFood", points: 5000, stock: "Tersedia", category: "Voucher", image: "🎁" },
    { id: 2, name: "Pulsa Rp25.000", points: 2500, stock: "Tersedia", category: "Pulsa", image: "📱" },
    { id: 3, name: "E-Money Rp20.000", points: 2000, stock: "Habis", category: "E-Money", image: "💳" },
    { id: 4, name: "Voucher Tokopedia", points: 10000, stock: "Tersedia", category: "Voucher", image: "🛒" },
    { id: 5, name: "Voucher Shopee", points: 8000, stock: "Tersedia", category: "Voucher", image: "🛍️" },
    { id: 6, name: "Paket Sembako", points: 15000, stock: "Tersedia", category: "Sembako", image: "📦" },
    { id: 7, name: "Power Bank", points: 12000, stock: "Tersedia", category: "Elektronik", image: "🔋" },
    { id: 8, name: "Tumbler", points: 7500, stock: "Tersedia", category: "Perlengkapan", image: "🥤" },
  ];

  const filteredRewards = rewards.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRedeem = (reward: any) => {
    if (reward.points > userPoints) return;
    if (reward.stock === "Habis") return;
    setSelectedReward(reward);
    setShowConfirm(true);
  };

  const confirmRedeem = () => {
    setShowConfirm(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl font-semibold text-foreground">Tukar Poin</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Tukarkan poin Anda dengan hadiah menarik</p>
      </div>

      {/* Poin Saya */}
      <div className="mb-5 p-3 bg-primary/5 rounded-lg border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground">Poin Anda</p>
            <p className="text-2xl font-bold text-primary">{userPoints.toLocaleString()}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground">Butuh poin lagi?</p>
            <button className="text-xs text-primary hover:underline">Jual sampah →</button>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Cari hadiah..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
        />
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {filteredRewards.map((reward) => (
          <div
            key={reward.id}
            className={`border rounded-lg p-3 cursor-pointer transition hover:shadow-md ${
              reward.points > userPoints || reward.stock === "Habis"
                ? "opacity-50 cursor-not-allowed"
                : "hover:border-primary"
            }`}
            onClick={() => handleRedeem(reward)}
          >
            <div className="text-3xl mb-2">{reward.image}</div>
            <p className="text-sm font-medium text-foreground line-clamp-2">{reward.name}</p>
            <p className="text-xs text-primary font-semibold mt-2">{reward.points.toLocaleString()} poin</p>
            <p className="text-[10px] text-muted-foreground mt-1">{reward.stock}</p>
          </div>
        ))}
      </div>

      {/* Confirm Modal */}
      {showConfirm && selectedReward && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card rounded-xl p-5 max-w-sm mx-4 w-full">
            <h3 className="text-lg font-semibold text-foreground mb-2">Konfirmasi Tukar Poin</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Yakin ingin menukar <span className="font-medium text-foreground">{selectedReward.name}</span> dengan <span className="font-medium text-primary">{selectedReward.points.toLocaleString()} poin</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2 rounded-lg border border-border text-sm text-muted-foreground hover:bg-muted transition"
              >
                Batal
              </button>
              <button
                onClick={confirmRedeem}
                className="flex-1 py-2 rounded-lg bg-primary text-sm text-primary-foreground hover:bg-primary/90 transition"
              >
                Ya, Tukar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Toast */}
      {isSuccess && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 text-sm z-50">
          <CheckCircle className="w-4 h-4" />
          Berhasil ditukar! Voucher akan dikirim ke email Anda.
        </div>
      )}
    </div>
  );
}