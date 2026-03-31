import VehicleForm from "@/components/admin/VehicleForm";

export default function NovoVeiculoPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-zinc-900">Novo Veículo</h1>
        <p className="text-sm text-zinc-500 mt-1">Preencha as informações do veículo</p>
      </div>
      <VehicleForm />
    </div>
  );
}
