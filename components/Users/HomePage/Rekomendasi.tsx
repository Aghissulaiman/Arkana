"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const RECOMMENDED_REWARDS = [
  {
    id: 1,
    name: "Voucher GoFood",
    points: "5.000",
    stock: "Tersedia",
    image: "/images/gofood.png",
  },
  {
    id: 2,
    name: "Pulsa Rp25.000",
    points: "2.500",
    stock: "Tersedia",
    image: "/images/pulsa.png",
  },
  {
    id: 3,
    name: "E-Money Rp20.000",
    points: "2.000",
    stock: "Habis",
    image: "/images/emoney.png",
  },
  {
    id: 4,
    name: "Voucher Tokopedia",
    points: "10.000",
    stock: "Tersedia",
    image: "/images/tokopedia.png",
  },
];

export default function Recommendations() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          Tukar Poin
        </h2>

        <Link href="/dashboard/tukar-poin">
        <Button variant="ghost" size="sm" className="text-sm text-primary">
          Lihat Semua <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {RECOMMENDED_REWARDS.map((item) => (
          <Card
            key={item.id}
            className={`rounded-2xl overflow-hidden transition hover:shadow-xl cursor-pointer ${
              item.stock === "Habis" ? "opacity-60" : ""
            }`}
          >
            {/* Image */}
            <div className="h-32 bg-muted flex items-center justify-center">
              <img
                src={item.image}
                alt={item.name}
                className="h-16 object-contain"
              />
            </div>

            {/* Content */}
            <div className="p-4 space-y-2">
              <p className="text-sm font-semibold leading-tight">
                {item.name}
              </p>

              <p className="text-base font-bold text-primary">
                {item.points} poin
              </p>

              <div className="pt-1">
                <Badge
                  variant={
                    item.stock === "Tersedia" ? "secondary" : "outline"
                  }
                  className="text-xs"
                >
                  {item.stock}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}