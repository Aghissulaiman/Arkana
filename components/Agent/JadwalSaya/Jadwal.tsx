"use client";

import { useState, useEffect } from "react";
import { createClientSupabaseClient } from "@/lib/supabaseClient";
import { Toaster, toast } from "sonner";
import {
  Loader2,
  Save,
  RefreshCw,
  Clock,
  Calendar,
  Coffee,
  CheckCircle,
  XCircle,
  Info,
  Copy,
} from "lucide-react";

type Schedule = {
  id?: string;
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
  break_start: string | null;
  break_end: string | null;
  notes: string | null;
};

const DAYS = [
  { value: 0, label: "Senin", short: "Sen" },
  { value: 1, label: "Selasa", short: "Sel" },
  { value: 2, label: "Rabu", short: "Rab" },
  { value: 3, label: "Kamis", short: "Kam" },
  { value: 4, label: "Jumat", short: "Jum" },
  { value: 5, label: "Sabtu", short: "Sab" },
  { value: 6, label: "Minggu", short: "Min" },
];

const DEFAULT_OPEN = "08:00";
const DEFAULT_CLOSE = "17:00";

export default function JadwalPage() {
  const supabase = createClientSupabaseClient();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [agentId, setAgentId] = useState<string | null>(null);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [copyFromDay, setCopyFromDay] = useState<number | null>(null);
  const [copyToDays, setCopyToDays] = useState<number[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Silakan login terlebih dahulu");
        return;
      }

      const { data: agentData, error: agentError } = await supabase
        .from("agents")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (agentError || !agentData) {
        toast.error("Data agent tidak ditemukan");
        setLoading(false);
        return;
      }

      setAgentId(agentData.id);

      const { data: scheduleData } = await supabase
        .from("agent_schedules")
        .select("*")
        .eq("agent_id", agentData.id);

      // Inisialisasi semua hari
      const initialSchedules: Schedule[] = DAYS.map(day => {
        const existing = scheduleData?.find(s => s.day_of_week === day.value);
        return existing || {
          day_of_week: day.value,
          is_open: true,
          open_time: DEFAULT_OPEN,
          close_time: DEFAULT_CLOSE,
          break_start: null,
          break_end: null,
          notes: null,
        };
      });

      setSchedules(initialSchedules);
    } catch (err) {
      console.error(err);
      toast.error("Gagal memuat data");
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = (day: number, field: keyof Schedule, value: any) => {
    setSchedules(prev =>
      prev.map(s => s.day_of_week === day ? { ...s, [field]: value } : s)
    );
  };

  const handleSave = async () => {
    if (!agentId) return;
    setSaving(true);

    try {
      for (const schedule of schedules) {
        const { data: existing } = await supabase
          .from("agent_schedules")
          .select("id")
          .eq("agent_id", agentId)
          .eq("day_of_week", schedule.day_of_week)
          .single();

        if (existing) {
          // Update
          await supabase
            .from("agent_schedules")
            .update({
              is_open: schedule.is_open,
              open_time: schedule.open_time,
              close_time: schedule.close_time,
              break_start: schedule.break_start,
              break_end: schedule.break_end,
              notes: schedule.notes,
              updated_at: new Date().toISOString(),
            })
            .eq("id", existing.id);
        } else {
          // Insert
          await supabase
            .from("agent_schedules")
            .insert({
              agent_id: agentId,
              day_of_week: schedule.day_of_week,
              is_open: schedule.is_open,
              open_time: schedule.open_time,
              close_time: schedule.close_time,
              break_start: schedule.break_start,
              break_end: schedule.break_end,
              notes: schedule.notes,
            });
        }
      }

      toast.success("Jadwal berhasil disimpan!");
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("Gagal menyimpan jadwal");
    } finally {
      setSaving(false);
    }
  };

  const copySchedule = () => {
    if (copyFromDay === null) {
      toast.error("Pilih hari sumber terlebih dahulu");
      return;
    }
    if (copyToDays.length === 0) {
      toast.error("Pilih minimal satu hari tujuan");
      return;
    }

    const sourceSchedule = schedules.find(s => s.day_of_week === copyFromDay);
    if (!sourceSchedule) return;

    setSchedules(prev =>
      prev.map(s => {
        if (copyToDays.includes(s.day_of_week)) {
          return {
            ...s,
            is_open: sourceSchedule.is_open,
            open_time: sourceSchedule.open_time,
            close_time: sourceSchedule.close_time,
            break_start: sourceSchedule.break_start,
            break_end: sourceSchedule.break_end,
          };
        }
        return s;
      })
    );

    toast.success(`Jadwal disalin ke ${copyToDays.length} hari`);
    setCopyFromDay(null);
    setCopyToDays([]);
  };

  const toggleCopyDay = (day: number) => {
    setCopyToDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" richColors />

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Jadwal Operasional</h1>
            <p className="text-sm text-gray-500 mt-1">
              Atur jam buka dan hari libur untuk penjemputan sampah
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Semua
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-start gap-3">
          <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-medium text-primary">Informasi Jadwal</p>
            <p className="text-xs text-primary/70 mt-1">
              User hanya bisa mengajukan penjemputan saat Anda buka. 
              Anda bisa mengatur jam operasional per hari dan jam istirahat.
            </p>
          </div>
        </div>

        {/* Copy Schedule Tool */}
        <div className="bg-white rounded-xl p-4 border border-gray-200">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Salin Jadwal ke Hari Lain
          </p>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={copyFromDay ?? ""}
              onChange={(e) => setCopyFromDay(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
            >
              <option value="">Pilih Hari Sumber</option>
              {DAYS.map(day => (
                <option key={day.value} value={day.value}>{day.label}</option>
              ))}
            </select>
            <span className="text-gray-400">→</span>
            <div className="flex flex-wrap gap-2">
              {DAYS.map(day => (
                <button
                  key={day.value}
                  onClick={() => toggleCopyDay(day.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    copyToDays.includes(day.value)
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {day.short}
                </button>
              ))}
            </div>
            <button
              onClick={copySchedule}
              disabled={copyFromDay === null || copyToDays.length === 0}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Salin
            </button>
          </div>
        </div>

        {/* Schedule Table */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Hari</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Status</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Jam Buka</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Jam Tutup</th>
                  <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500">Istirahat</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500">Catatan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {schedules.map((schedule) => {
                  const day = DAYS.find(d => d.value === schedule.day_of_week)!;
                  const isActive = schedule.is_open;

                  return (
                    <tr key={schedule.day_of_week} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-800">{day.label}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => updateSchedule(schedule.day_of_week, "is_open", !schedule.is_open)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-all ${
                            isActive
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-red-100 text-red-700 hover:bg-red-200"
                          }`}
                        >
                          {isActive ? (
                            <><CheckCircle className="w-3 h-3" /> Buka</>
                          ) : (
                            <><XCircle className="w-3 h-3" /> Tutup</>
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <input
                            type="time"
                            value={schedule.open_time}
                            onChange={(e) => updateSchedule(schedule.day_of_week, "open_time", e.target.value)}
                            disabled={!isActive}
                            className="w-28 px-2 py-1.5 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-gray-400"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-center">
                          <input
                            type="time"
                            value={schedule.close_time}
                            onChange={(e) => updateSchedule(schedule.day_of_week, "close_time", e.target.value)}
                            disabled={!isActive}
                            className="w-28 px-2 py-1.5 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100 disabled:text-gray-400"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="time"
                            value={schedule.break_start || ""}
                            onChange={(e) => updateSchedule(schedule.day_of_week, "break_start", e.target.value || null)}
                            disabled={!isActive}
                            placeholder="-"
                            className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                          />
                          <span className="text-gray-400 text-xs">-</span>
                          <input
                            type="time"
                            value={schedule.break_end || ""}
                            onChange={(e) => updateSchedule(schedule.day_of_week, "break_end", e.target.value || null)}
                            disabled={!isActive}
                            placeholder="-"
                            className="w-24 px-2 py-1.5 text-sm border border-gray-200 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                          />
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={schedule.notes || ""}
                          onChange={(e) => updateSchedule(schedule.day_of_week, "notes", e.target.value)}
                          disabled={!isActive}
                          placeholder="Catatan..."
                          className="w-full px-2 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:bg-gray-100"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Card */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-gray-800">Ringkasan Jadwal</p>
              <p className="text-xs text-gray-600">
                {schedules.filter(s => s.is_open).length} hari buka • 
                Rata-rata jam operasional: {
                  (() => {
                    const openHours = schedules.filter(s => s.is_open);
                    if (openHours.length === 0) return "Tidak buka";
                    const avgOpen = openHours.reduce((sum, s) => {
                      const open = s.open_time.split(":").map(Number);
                      const close = s.close_time.split(":").map(Number);
                      let hours = close[0] - open[0];
                      if (hours < 0) hours += 24;
                      return sum + hours;
                    }, 0) / openHours.length;
                    return `${Math.round(avgOpen)} jam/hari`;
                  })()
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}