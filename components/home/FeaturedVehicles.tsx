import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VehicleCard from "@/components/catalog/VehicleCard";
import { getFeaturedVehicles } from "@/lib/vehicles";
import type { Vehicle } from "@/types/vehicle";

export default async function FeaturedVehicles() {
  let vehicles: Vehicle[] = [];
  try {
    vehicles = await getFeaturedVehicles();
  } catch {
    // Supabase not configured yet — show empty state
  }

  if (vehicles.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-sm font-semibold text-red-600 tracking-wider mb-2">
              Seleção especial
            </p>
            <h2 className="text-3xl lg:text-4xl font-black text-zinc-900">
              Veículos em destaque
            </h2>
          </div>
          <Button asChild variant="outline" className="group self-start sm:self-auto">
            <Link href="/catalogo">
              Ver estoque completo
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => (
            <VehicleCard key={v.id} vehicle={v} />
          ))}
        </div>
      </div>
    </section>
  );
}
