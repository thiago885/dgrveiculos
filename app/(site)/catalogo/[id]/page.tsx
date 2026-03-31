import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getVehicleById } from "@/lib/vehicles";
import { formatPrice, formatKm } from "@/lib/format";
import VehicleGallery from "@/components/catalog/VehicleGallery";
import VehicleWhatsApp from "@/components/catalog/VehicleWhatsApp";
import { Separator } from "@/components/ui/separator";
import { Calendar, Fuel, Gauge, Settings2, Palette, Car, CheckCircle2, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) return { title: "Veículo não encontrado" };
  return {
    title: `${vehicle.marca} ${vehicle.modelo} ${vehicle.ano_fabricacao} — DGR Veículos`,
    description: vehicle.descricao_vendedor || `${vehicle.marca} ${vehicle.modelo} ${vehicle.versao} ${vehicle.ano_fabricacao}/${vehicle.ano_modelo}, ${formatKm(vehicle.quilometragem)}.`,
  };
}

export default async function VehicleDetailPage({ params }: PageProps) {
  const { id } = await params;
  const vehicle = await getVehicleById(id);
  if (!vehicle) notFound();

  const statusMap = {
    disponivel: { label: "Disponível", class: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    reservado: { label: "Reservado", class: "bg-amber-100 text-amber-700 border-amber-200" },
    vendido: { label: "Vendido", class: "bg-zinc-100 text-zinc-500 border-zinc-200" },
  };
  const status = statusMap[vehicle.status_inventario];

  const preco = vehicle.preco_promocional && vehicle.preco_promocional < vehicle.preco_venda
    ? vehicle.preco_promocional
    : vehicle.preco_venda;

  const specs = [
    { icon: Calendar, label: "Ano", value: `${vehicle.ano_fabricacao}/${vehicle.ano_modelo}` },
    { icon: Gauge, label: "Quilometragem", value: formatKm(vehicle.quilometragem) },
    { icon: Fuel, label: "Combustível", value: vehicle.combustivel },
    { icon: Settings2, label: "Câmbio", value: vehicle.tipo_cambio },
    { icon: Palette, label: "Cor", value: vehicle.cor_exterior },
    { icon: Car, label: "Portas", value: `${vehicle.quantidade_portas} portas` },
  ];

  return (
    <div className="pt-20 min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Voltar ao estoque
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <VehicleGallery fotos={vehicle.fotos} marca={vehicle.marca} modelo={vehicle.modelo} />
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="text-sm font-medium text-zinc-400">{vehicle.marca}</p>
                  <h1 className="text-2xl font-black text-zinc-900 leading-tight">
                    {vehicle.modelo}
                    {vehicle.versao && (
                      <span className="block text-base font-medium text-zinc-500 mt-0.5">
                        {vehicle.versao}
                      </span>
                    )}
                  </h1>
                </div>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${status.class} shrink-0`}>
                  {status.label}
                </span>
              </div>

              <Separator className="my-4" />

              <div>
                {vehicle.preco_promocional && vehicle.preco_promocional < vehicle.preco_venda && (
                  <p className="text-sm text-zinc-400 line-through mb-1">{formatPrice(vehicle.preco_venda)}</p>
                )}
                <div className="text-3xl font-black text-zinc-900 mb-1">{formatPrice(preco)}</div>
                <p className="text-xs text-zinc-400">+ taxas de transferência</p>
              </div>

              <Separator className="my-4" />

              <div className="grid grid-cols-2 gap-3">
                {specs.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-zinc-500" />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-400">{label}</p>
                      <p className="text-xs font-semibold text-zinc-900">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {vehicle.status_inventario !== "vendido" && (
              <VehicleWhatsApp vehicle={vehicle} />
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          {vehicle.descricao_vendedor && (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Sobre este veículo</h2>
              <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                {vehicle.descricao_vendedor}
              </p>
            </div>
          )}

          {vehicle.features && vehicle.features.length > 0 && (
            <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Opcionais</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {vehicle.features.map((op) => (
                  <div key={op} className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-red-600 shrink-0" />
                    <span className="text-sm text-zinc-700">{op}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
