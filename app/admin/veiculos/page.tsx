import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getVehicles } from "@/lib/vehicles";
import type { Vehicle } from "@/types/vehicle";
import AdminVehicleTable from "@/components/admin/AdminVehicleTable";

export default async function AdminVeiculosPage() {
  let vehicles: Vehicle[] = [];
  try {
    vehicles = await getVehicles();
  } catch {
    // Supabase not configured
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-zinc-900">Veículos</h1>
          <p className="text-sm text-zinc-500 mt-1">{vehicles.length} veículo(s) no estoque</p>
        </div>
        <Button asChild className="bg-red-600 hover:bg-red-700 text-white gap-2">
          <Link href="/admin/veiculos/novo">
            <Plus className="h-4 w-4" /> Adicionar Veículo
          </Link>
        </Button>
      </div>

      <AdminVehicleTable vehicles={vehicles} />
    </div>
  );
}
