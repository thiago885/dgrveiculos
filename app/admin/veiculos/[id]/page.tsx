import { notFound } from "next/navigation";
import { getVehicleById } from "@/lib/vehicles";
import VehicleForm from "@/components/admin/VehicleForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditVeiculoPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = await getVehicleById(id).catch(() => null);
  if (!vehicle) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-zinc-900">Editar Veículo</h1>
        <p className="text-sm text-zinc-500 mt-1">
          {vehicle.marca} {vehicle.modelo} {vehicle.ano_fabricacao}
        </p>
      </div>
      <VehicleForm vehicle={vehicle} />
    </div>
  );
}
