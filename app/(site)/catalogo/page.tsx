import { Suspense } from "react";
import VehicleFilters from "@/components/catalog/VehicleFilters";
import VehicleCard from "@/components/catalog/VehicleCard";
import VehicleCardSkeleton from "@/components/catalog/VehicleCardSkeleton";
import { getVehicles } from "@/lib/vehicles";
import type { Vehicle } from "@/types/vehicle";

interface PageProps {
  searchParams: Promise<{
    busca?: string;
    marca?: string;
    preco_max?: string;
    combustivel?: string;
    cambio?: string;
  }>;
}

async function VehicleGrid({ searchParams }: { searchParams: Awaited<PageProps["searchParams"]> }) {
  let vehicles: Vehicle[] = [];
  try {
    vehicles = await getVehicles({
      modelo: searchParams.busca,
      marca: searchParams.marca,
      preco_max: searchParams.preco_max ? Number(searchParams.preco_max) : undefined,
      combustivel: searchParams.combustivel,
      tipo_cambio: searchParams.cambio,
    });
  } catch {
    // Supabase not configured
  }

  if (vehicles.length === 0) {
    return (
      <div className="col-span-full text-center py-20">
        <p className="text-zinc-400 text-lg">Nenhum veículo encontrado.</p>
        <p className="text-zinc-400 text-sm mt-2">Tente ajustar os filtros ou entre em contato.</p>
      </div>
    );
  }

  return (
    <>
      {vehicles.map((v) => (
        <VehicleCard key={v.id} vehicle={v} />
      ))}
    </>
  );
}

export default async function CatalogoPage({ searchParams }: PageProps) {
  const params = await searchParams;

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <p className="text-sm font-semibold text-red-600 tracking-wider mb-1">Estoque</p>
          <h1 className="text-3xl font-black text-zinc-900">Todos os veículos</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar filters */}
          <aside className="lg:col-span-1">
            <div className="sticky top-24">
              <Suspense fallback={null}>
                <VehicleFilters />
              </Suspense>
            </div>
          </aside>

          {/* Grid */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              <Suspense
                fallback={Array.from({ length: 6 }).map((_, i) => (
                  <VehicleCardSkeleton key={i} />
                ))}
              >
                <VehicleGrid searchParams={params} />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
