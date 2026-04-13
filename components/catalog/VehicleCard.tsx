import Link from "next/link";
import Image from "next/image";
import { Fuel, Gauge, Calendar, Settings2 } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { formatKm, formatPrice } from "@/lib/format";

const statusLabel: Record<Vehicle["status_inventario"], { label: string; color: string }> = {
  disponivel: { label: "Disponível", color: "bg-emerald-100 text-emerald-700" },
  reservado: { label: "Reservado", color: "bg-amber-100 text-amber-700" },
  vendido: { label: "Vendido", color: "bg-zinc-100 text-zinc-500" },
};

interface VehicleCardProps {
  vehicle: Vehicle;
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { label, color } = statusLabel[vehicle.status_inventario];
  const photo = vehicle.foto_principal || vehicle.fotos?.[0] || "/placeholder-car.jpg";

  return (
    <Link href={`/catalogo/${vehicle.slug ?? vehicle.id}`} className="group block">
      <div className="bg-white rounded-2xl overflow-hidden border border-zinc-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[16/10] overflow-hidden bg-zinc-50">
          <Image
            src={photo}
            alt={`${vehicle.marca} ${vehicle.modelo}`}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${color}`}>
              {label}
            </span>
          </div>
          {vehicle.flag_destaque && (
            <div className="absolute top-3 right-3">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-red-600 text-white">
                Destaque
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="mb-3">
            <p className="text-xs font-medium text-zinc-400 mb-0.5">{vehicle.marca}</p>
            <h3 className="text-lg font-bold text-zinc-900 leading-tight">
              {vehicle.modelo}
              {vehicle.versao && (
                <span className="text-sm font-medium text-zinc-500 ml-1">{vehicle.versao}</span>
              )}
            </h3>
          </div>

          {/* Specs */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Calendar className="h-3.5 w-3.5" />
              <span className="text-xs">{vehicle.ano_fabricacao}/{vehicle.ano_modelo}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Gauge className="h-3.5 w-3.5" />
              <span className="text-xs">{formatKm(vehicle.quilometragem)}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Fuel className="h-3.5 w-3.5" />
              <span className="text-xs">{vehicle.combustivel}</span>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Settings2 className="h-3.5 w-3.5" />
              <span className="text-xs">{vehicle.tipo_cambio}</span>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between pt-3 border-t border-zinc-50">
            <div>
              {vehicle.preco_promocional && vehicle.preco_promocional < vehicle.preco_venda ? (
                <>
                  <p className="text-xs text-zinc-400 line-through">{formatPrice(vehicle.preco_venda)}</p>
                  <p className="text-xl font-black text-red-600">{formatPrice(vehicle.preco_promocional)}</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-zinc-400 mb-0.5">Preço</p>
                  <p className="text-xl font-black text-zinc-900">{formatPrice(vehicle.preco_venda)}</p>
                </>
              )}
            </div>
            <span className="text-xs font-semibold text-red-600 group-hover:underline">
              Ver detalhes →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
