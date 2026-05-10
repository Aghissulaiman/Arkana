"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, ArrowUpRight, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type DashboardStats = {
  total_points: number;
  total_transactions: number;
  total_waste_kg: number;
  current_month_points: number;
};

type UpcomingPickup = {
  id: string;
  waste_type: string;
  scheduled_date: string;
  scheduled_time: string;
  status: string;
};

type RecentPickup = {
  id: string;
  waste_type: string;
  weight_kg: number;
  points_earned: number;
  completed_date: string;
};

export default function HomeDashboard() {
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    total_points: 0,
    total_transactions: 0,
    total_waste_kg: 0,
    current_month_points: 0,
  });
  const [upcomingPickups, setUpcomingPickups] = useState<UpcomingPickup[]>([]);
  const [recentPickups, setRecentPickups] = useState<RecentPickup[]>([]);

  // Ambil user yang login
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      }
    };
    getUser();
  }, []);

  // Fetch data ketika userId sudah ada
  useEffect(() => {
    if (userId) {
      fetchDashboardData();
    }
  }, [userId]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // 1. Ambil statistik dari user_details
      const { data: userData, error: userError } = await supabase
        .from('user_details')
        .select('balance_points')
        .eq('user_id', userId)
        .single();

      if (userError && userError.code !== 'PGRST116') { // PGRST116 = not found
        console.error('Error fetching user details:', userError);
      }

      // 2. Ambil total transaksi completed
      const { count: totalTransactions, error: transError } = await supabase
        .from('requests')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'completed');

      if (transError) console.error('Error fetching transactions:', transError);

      // 3. Ambil total sampah dari requests completed
      const { data: completedRequests, error: requestsError } = await supabase
        .from('requests')
        .select('actual_weights')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .not('actual_weights', 'is', null);

      let totalWasteKg = 0;
      if (completedRequests && !requestsError) {
        completedRequests.forEach(req => {
          if (req.actual_weights) {
            Object.values(req.actual_weights).forEach((weight: any) => {
              totalWasteKg += parseFloat(weight) || 0;
            });
          }
        });
      }

      // 4. Ambil poin bulan ini dari transactions
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      const { data: monthTransactions, error: monthError } = await supabase
        .from('transactions')
        .select('amount')
        .eq('user_id', userId)
        .eq('type', 'earn')
        .gte('created_at', startOfMonth)
        .lte('created_at', endOfMonth);

      let currentMonthPoints = 0;
      if (monthTransactions && !monthError) {
        currentMonthPoints = monthTransactions.reduce((sum, t) => sum + (t.amount || 0), 0);
      }

      setStats({
        total_points: userData?.balance_points || 0,
        total_transactions: totalTransactions || 0,
        total_waste_kg: totalWasteKg,
        current_month_points: currentMonthPoints,
      });

      // 5. Ambil jadwal penjemputan yang akan datang
      const { data: upcomingData, error: upcomingError } = await supabase
        .from('requests')
        .select('id, estimated_weights, status, created_at')
        .eq('user_id', userId)
        .in('status', ['pending', 'accepted', 'picked_up'])
        .order('created_at', { ascending: true })
        .limit(4);

      if (!upcomingError && upcomingData) {
        const formattedUpcoming = upcomingData.map(req => {
          let wasteType = 'Mixed Waste';
          if (req.estimated_weights) {
            wasteType = Object.keys(req.estimated_weights).slice(0, 2).join(', ');
          }
          
          const date = new Date(req.created_at);
          const startHour = date.getHours().toString().padStart(2, '0');
          const endHour = (date.getHours() + 3).toString().padStart(2, '0');
          
          return {
            id: req.id,
            waste_type: wasteType,
            scheduled_date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
            scheduled_time: `${startHour}:00 - ${endHour}:00`,
            status: req.status === 'pending' ? 'Menunggu' : 
                    req.status === 'accepted' ? 'Diterima' : 'Penjemputan',
          };
        });
        setUpcomingPickups(formattedUpcoming);
      }

      // 6. Ambil riwayat penjemputan terbaru
      const { data: recentData, error: recentError } = await supabase
        .from('requests')
        .select('id, actual_weights, total_points, updated_at')
        .eq('user_id', userId)
        .eq('status', 'completed')
        .order('updated_at', { ascending: false })
        .limit(5);

      if (!recentError && recentData) {
        const formattedRecent = recentData.map(req => {
          let wasteType = 'Unknown';
          let weightKg = 0;
          
          if (req.actual_weights) {
            wasteType = Object.keys(req.actual_weights).slice(0, 2).join(', ');
            weightKg = Object.values(req.actual_weights).reduce((sum: number, w: any) => sum + (parseFloat(w) || 0), 0);
          }
          
          const updatedDate = new Date(req.updated_at);
          const now = new Date();
          const diffDays = Math.floor((now.getTime() - updatedDate.getTime()) / (1000 * 60 * 60 * 24));
          
          let dateText = '';
          if (diffDays === 0) dateText = 'Hari ini';
          else if (diffDays === 1) dateText = 'Kemarin';
          else if (diffDays < 7) dateText = `${diffDays} hari lalu`;
          else if (diffDays < 30) dateText = `${Math.floor(diffDays / 7)} minggu lalu`;
          else dateText = 'Bulan lalu';
          
          return {
            id: req.id,
            waste_type: wasteType,
            weight_kg: weightKg,
            points_earned: req.total_points || 0,
            completed_date: dateText,
          };
        });
        setRecentPickups(formattedRecent);
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('id-ID').format(num);
  };

  const formatWeight = (kg: number) => {
    return kg.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  };

  const STATS_DATA_CARDS = [
    { label: "Total Poin", value: formatNumber(stats.total_points), change: "+12%" },
    { label: "Transaksi", value: formatNumber(stats.total_transactions), change: "+3" },
    { label: "Sampah", value: formatWeight(stats.total_waste_kg), unit: "kg", change: "+15%" },
    { label: "Bulan Ini", value: formatNumber(stats.current_month_points), change: "+8%" },
  ];

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4 flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Kelola aktivitas sampah kamu dengan mudah</p>
        </div>
        <Button className="gap-2 rounded-xl shadow-md" asChild>
          <Link href="/dashboard/request-pickup">
            <Plus className="w-4 h-4" /> Penjemputan
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_DATA_CARDS.map((stat, i) => (
          <Card key={i} className="hover:shadow-md transition">
            <CardContent className="p-4 space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <span className="text-xs text-green-600 flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> {stat.change}
                </span>
              </div>
              <h2 className="text-xl font-bold">
                {stat.value}
                <span className="text-sm ml-1 text-muted-foreground">{stat.unit}</span>
              </h2>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Jadwal Penjemputan */}
          <div>
            <h2 className="text-lg font-semibold mb-3">Jadwal Penjemputan</h2>
            {upcomingPickups.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center text-muted-foreground">
                  Belum ada jadwal penjemputan
                </CardContent>
              </Card>
            ) : (
              <div className="grid sm:grid-cols-2 gap-4">
                {upcomingPickups.map((item) => (
                  <Card key={item.id} className="hover:shadow-md transition">
                    <CardContent className="p-4 space-y-2">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{item.waste_type}</p>
                          <p className="text-xs text-muted-foreground">{item.scheduled_date}</p>
                        </div>
                        <Badge variant="outline">{item.status}</Badge>
                      </div>
                      <div className="text-xs bg-muted px-2 py-1 rounded">
                        {item.scheduled_time}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Tips */}
          <Card className="bg-primary text-white">
            <CardContent className="p-5 space-y-3">
              <h3 className="font-semibold">Tips Pengelolaan Sampah</h3>
              <ul className="text-sm space-y-1 list-disc ml-4">
                <li>Pisahkan sampah organik & anorganik</li>
                <li>Pastikan botol bersih & kering</li>
                <li>Lipat kardus agar hemat tempat</li>
                <li>Simpan kertas di tempat kering</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Aktivitas</h2>
            <Link href="/dashboard/riwayat">
              <Button variant="ghost" size="sm" className="text-primary">
                Semua <ChevronRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {recentPickups.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                Belum ada aktivitas
              </CardContent>
            </Card>
          ) : (
            recentPickups.map((item) => (
              <Card key={item.id} className="hover:shadow-md transition cursor-pointer">
                <CardContent className="p-4 flex justify-between">
                  <div>
                    <p className="font-medium">{item.waste_type}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatWeight(item.weight_kg)} kg • {item.completed_date}
                    </p>
                  </div>
                  <p className="text-primary font-semibold">+{formatNumber(item.points_earned)}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}