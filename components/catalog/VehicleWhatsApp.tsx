"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/types/vehicle";
import { formatPrice, formatKm } from "@/lib/format";

interface VehicleWhatsAppProps {
  vehicle: Vehicle;
  phone?: string;
}

export default function VehicleWhatsApp({ vehicle, phone = "5519998256619" }: VehicleWhatsAppProps) {
  const preco = vehicle.preco_promocional && vehicle.preco_promocional < vehicle.preco_venda
    ? vehicle.preco_promocional
    : vehicle.preco_venda;

  const message = `Olá! Tenho interesse no veículo:\n\n*${vehicle.marca} ${vehicle.modelo} ${vehicle.versao || ""}*\nAno: ${vehicle.ano_fabricacao}/${vehicle.ano_modelo}\nKM: ${formatKm(vehicle.quilometragem)}\nPreço: ${formatPrice(preco)}\n\nPoderia me passar mais informações?`;

  const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
      <h3 className="font-semibold text-zinc-900 mb-1">Interessado neste veículo?</h3>
      <p className="text-sm text-zinc-500 mb-4">
        Clique abaixo para conversar diretamente com nosso consultor.
      </p>
      <Button
        asChild
        className="w-full bg-[#25D366] hover:bg-[#22c55e] text-white font-semibold gap-2"
        size="lg"
      >
        <a href={url} target="_blank" rel="noopener noreferrer">
          <MessageCircle className="h-5 w-5" />
          Tenho interesse — WhatsApp
        </a>
      </Button>
    </div>
  );
}
