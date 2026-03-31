import { createClient } from "@/lib/supabase/server";
import { Car, TrendingUp, Eye, Star } from "lucide-react";

async function getStats() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase.from("vehicles").select("status_inventario, flag_destaque");
    if (error || !data) return { total: 0, disponiveis: 0, reservados: 0, destaques: 0 };
    return {
      total: data.length,
      disponiveis: data.filter((v) => v.status_inventario === "disponivel").length,
      reservados: data.filter((v) => v.status_inventario === "reservado").length,
      destaques: data.filter((v) => v.flag_destaque).length,
    };
  } catch {
    return { total: 0, disponiveis: 0, reservados: 0, destaques: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const cards = [
    { icon: Car, label: "Total no Estoque", value: stats.total, color: "text-blue-600 bg-blue-50" },
    { icon: TrendingUp, label: "Disponíveis", value: stats.disponiveis, color: "text-emerald-600 bg-emerald-50" },
    { icon: Eye, label: "Reservados", value: stats.reservados, color: "text-amber-600 bg-amber-50" },
    { icon: Star, label: "Destaques", value: stats.destaques, color: "text-red-600 bg-red-50" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-zinc-900">Dashboard</h1>
        <p className="text-sm text-zinc-500 mt-1">Visão geral do estoque</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-4 ${color}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="text-3xl font-black text-zinc-900 mb-1">{value}</div>
            <div className="text-sm text-zinc-500">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
