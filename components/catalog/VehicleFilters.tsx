"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const MARCAS = ["Toyota", "Honda", "Chevrolet", "Volkswagen", "Ford", "Hyundai", "Fiat", "Renault", "BMW", "Mercedes-Benz", "Audi"];
const COMBUSTIVEIS = ["Flex", "Gasolina", "Diesel", "Elétrico", "Híbrido"];
const CAMBIOS = ["Automático", "Manual", "CVT", "Automatizado"];

export default function VehicleFilters() {
  const router = useRouter();
  const params = useSearchParams();

  const [busca, setBusca] = useState<string>(params.get("busca") || "");
  const [marca, setMarca] = useState<string>(params.get("marca") || "");
  const [precoMax, setPrecoMax] = useState<string>(params.get("preco_max") || "");
  const [combustivel, setCombustivel] = useState<string>(params.get("combustivel") || "");
  const [cambio, setCambio] = useState<string>(params.get("cambio") || "");

  function applyFilters() {
    const p = new URLSearchParams();
    if (busca) p.set("busca", busca);
    if (marca) p.set("marca", marca);
    if (precoMax) p.set("preco_max", precoMax);
    if (combustivel) p.set("combustivel", combustivel);
    if (cambio) p.set("cambio", cambio);
    router.push(`/catalogo?${p.toString()}`);
  }

  function clearFilters() {
    setBusca("");
    setMarca("");
    setPrecoMax("");
    setCombustivel("");
    setCambio("");
    router.push("/catalogo");
  }

  const hasFilters = busca || marca || precoMax || combustivel || cambio;

  return (
    <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <SlidersHorizontal className="h-4 w-4 text-zinc-500" />
        <h3 className="text-sm font-semibold text-zinc-900">Filtros</h3>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="ml-auto flex items-center gap-1 text-xs text-zinc-400 hover:text-red-600 transition-colors"
          >
            <X className="h-3 w-3" /> Limpar
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input
            placeholder="Buscar modelo..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
          />
        </div>

        <Select value={marca} onValueChange={(v) => setMarca(v ?? "")}>
          <SelectTrigger><SelectValue placeholder="Todas as marcas" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas as marcas</SelectItem>
            {MARCAS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={precoMax} onValueChange={(v) => setPrecoMax(v ?? "")}>
          <SelectTrigger><SelectValue placeholder="Preço máximo" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer preço</SelectItem>
            <SelectItem value="50000">Até R$ 50.000</SelectItem>
            <SelectItem value="80000">Até R$ 80.000</SelectItem>
            <SelectItem value="120000">Até R$ 120.000</SelectItem>
            <SelectItem value="200000">Até R$ 200.000</SelectItem>
            <SelectItem value="350000">Até R$ 350.000</SelectItem>
          </SelectContent>
        </Select>

        <Select value={combustivel} onValueChange={(v) => setCombustivel(v ?? "")}>
          <SelectTrigger><SelectValue placeholder="Combustível" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer combustível</SelectItem>
            {COMBUSTIVEIS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Select value={cambio} onValueChange={(v) => setCambio(v ?? "")}>
          <SelectTrigger><SelectValue placeholder="Câmbio" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="">Qualquer câmbio</SelectItem>
            {CAMBIOS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
          </SelectContent>
        </Select>

        <Button onClick={applyFilters} className="w-full bg-red-600 hover:bg-red-700 text-white">
          Buscar Veículos
        </Button>
      </div>
    </div>
  );
}
