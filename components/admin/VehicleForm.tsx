"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { createClient } from "@/lib/supabase/client";
import type { Vehicle } from "@/types/vehicle";
import { generateVehicleSlug } from "@/lib/slug";
import ImageUpload from "./ImageUpload";
import { Sparkles, Save } from "lucide-react";

const COMBUSTIVEIS = ["Flex", "Gasolina", "Diesel", "Elétrico", "Híbrido"];
const CAMBIOS = ["Automático", "Manual", "CVT", "Automatizado"];
const OPCIONAIS_LIST = [
  "Ar-condicionado", "Direção elétrica", "Vidros elétricos", "Trava elétrica",
  "Airbag", "ABS", "Central multimídia", "Câmera de ré", "Sensor de estacionamento",
  "Teto solar", "Bancos em couro", "Rodas de liga leve", "Faróis de neblina",
  "GPS / Navegação", "Bluetooth", "Apple CarPlay / Android Auto", "Start-stop",
  "Piloto automático", "Faróis full LED", "Bancos elétricos",
];

interface VehicleFormProps {
  vehicle?: Vehicle;
}

export default function VehicleForm({ vehicle }: VehicleFormProps) {
  const router = useRouter();
  const isEdit = !!vehicle;

  const [loading, setLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const [marca, setMarca] = useState(vehicle?.marca || "");
  const [modelo, setModelo] = useState(vehicle?.modelo || "");
  const [versao, setVersao] = useState(vehicle?.versao || "");
  const [ano, setAno] = useState(String(vehicle?.ano_fabricacao || new Date().getFullYear()));
  const [anoModelo, setAnoModelo] = useState(String(vehicle?.ano_modelo || new Date().getFullYear()));
  const [preco, setPreco] = useState(String(vehicle?.preco_venda || ""));
  const [precoPromo, setPrecoPromo] = useState(String(vehicle?.preco_promocional || ""));
  const [km, setKm] = useState(String(vehicle?.quilometragem || ""));
  const [combustivel, setCombustivel] = useState(vehicle?.combustivel || "");
  const [cambio, setCambio] = useState(vehicle?.tipo_cambio || "");
  const [cor, setCor] = useState(vehicle?.cor_exterior || "");
  const [portas, setPortas] = useState(String(vehicle?.quantidade_portas || "4"));
  const [status, setStatus] = useState<Vehicle["status_inventario"]>(vehicle?.status_inventario || "disponivel");
  const [destaque, setDestaque] = useState(vehicle?.flag_destaque || false);
  const [descricao, setDescricao] = useState(vehicle?.descricao_vendedor || "");
  const [opcionais, setOpcionais] = useState<string[]>(vehicle?.features || []);
  const [fotos, setFotos] = useState<string[]>(vehicle?.fotos || []);

  function toggleOpcional(op: string) {
    setOpcionais((prev) =>
      prev.includes(op) ? prev.filter((x) => x !== op) : [...prev, op]
    );
  }

  async function generateDescription() {
    if (!marca || !modelo) {
      toast.error("Informe marca e modelo primeiro.");
      return;
    }
    setAiLoading(true);
    try {
      const res = await fetch("/api/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marca, modelo, versao, ano, km, combustivel, cambio: cambio, opcionais }),
      });
      const data = await res.json();
      if (data.description) {
        setDescricao(data.description);
        toast.success("Descrição gerada com sucesso!");
      } else {
        toast.error("Erro ao gerar descrição.");
      }
    } catch {
      toast.error("Erro ao conectar com a IA.");
    }
    setAiLoading(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const slug = isEdit && vehicle.slug
      ? vehicle.slug
      : generateVehicleSlug(marca, modelo, versao, Number(ano));

    const payload = {
      marca,
      modelo,
      versao: versao || null,
      ano_fabricacao: Number(ano),
      ano_modelo: Number(anoModelo),
      preco_venda: Number(preco),
      preco_promocional: precoPromo ? Number(precoPromo) : null,
      quilometragem: Number(km),
      combustivel,
      tipo_cambio: cambio,
      cor_exterior: cor,
      quantidade_portas: Number(portas),
      status_inventario: status,
      flag_destaque: destaque,
      descricao_vendedor: descricao || null,
      features: opcionais,
      fotos,
      foto_principal: fotos[0] || null,
      slug,
    };

    const supabase = createClient();
    let error;

    if (isEdit) {
      ({ error } = await supabase
        .from("vehicles")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", vehicle.id));
    } else {
      ({ error } = await supabase.from("vehicles").insert(payload));
    }

    if (error) {
      toast.error(`Erro ao salvar: ${error.message}`);
    } else {
      toast.success(isEdit ? "Veículo atualizado!" : "Veículo cadastrado!");
      router.push("/admin/veiculos");
      router.refresh();
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="midia">Fotos</TabsTrigger>
          <TabsTrigger value="opcionais">Opcionais</TabsTrigger>
        </TabsList>

        {/* Tab: Info */}
        <TabsContent value="info" className="space-y-6">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-zinc-900 mb-5">Dados básicos</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label>Marca *</Label>
                <Input value={marca} onChange={(e) => setMarca(e.target.value)} placeholder="Toyota" required />
              </div>
              <div className="space-y-1.5">
                <Label>Modelo *</Label>
                <Input value={modelo} onChange={(e) => setModelo(e.target.value)} placeholder="Corolla" required />
              </div>
              <div className="space-y-1.5">
                <Label>Versão</Label>
                <Input value={versao} onChange={(e) => setVersao(e.target.value)} placeholder="XEi 2.0" />
              </div>
              <div className="space-y-1.5">
                <Label>Ano de fabricação *</Label>
                <Input type="number" value={ano} onChange={(e) => setAno(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Ano do modelo *</Label>
                <Input type="number" value={anoModelo} onChange={(e) => setAnoModelo(e.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label>Preço de venda (R$) *</Label>
                <Input type="number" value={preco} onChange={(e) => setPreco(e.target.value)} placeholder="85000" required />
              </div>
              <div className="space-y-1.5">
                <Label>Preço promocional (R$)</Label>
                <Input type="number" value={precoPromo} onChange={(e) => setPrecoPromo(e.target.value)} placeholder="Opcional" />
              </div>
              <div className="space-y-1.5">
                <Label>Quilometragem *</Label>
                <Input type="number" value={km} onChange={(e) => setKm(e.target.value)} placeholder="45000" required />
              </div>
              <div className="space-y-1.5">
                <Label>Combustível *</Label>
                <Select value={combustivel} onValueChange={(v) => setCombustivel(v ?? "")} required>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {COMBUSTIVEIS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Câmbio *</Label>
                <Select value={cambio} onValueChange={(v) => setCambio(v ?? "")} required>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {CAMBIOS.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Cor</Label>
                <Input value={cor} onChange={(e) => setCor(e.target.value)} placeholder="Prata" />
              </div>
              <div className="space-y-1.5">
                <Label>Portas</Label>
                <Select value={portas} onValueChange={(v) => setPortas(v ?? "4")}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["2", "4"].map((n) => <SelectItem key={n} value={n}>{n} portas</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Status</Label>
                <Select value={status} onValueChange={(v) => setStatus((v ?? "disponivel") as Vehicle["status_inventario"])}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponivel">Disponível</SelectItem>
                    <SelectItem value="reservado">Reservado</SelectItem>
                    <SelectItem value="vendido">Vendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              <input
                type="checkbox"
                id="destaque"
                checked={destaque}
                onChange={(e) => setDestaque(e.target.checked)}
                className="w-4 h-4 accent-red-600"
              />
              <Label htmlFor="destaque" className="cursor-pointer">Exibir como destaque na home</Label>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-zinc-900">Descrição</h3>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={generateDescription}
                disabled={aiLoading}
                className="gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                {aiLoading ? "Gerando..." : "Gerar com IA"}
              </Button>
            </div>
            <Textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descreva o veículo de forma persuasiva..."
              rows={6}
            />
          </div>
        </TabsContent>

        {/* Tab: Fotos */}
        <TabsContent value="midia">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-zinc-900 mb-5">Fotos do veículo</h3>
            <ImageUpload fotos={fotos} onChange={setFotos} />
          </div>
        </TabsContent>

        {/* Tab: Opcionais */}
        <TabsContent value="opcionais">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-6">
            <h3 className="text-sm font-semibold text-zinc-900 mb-5">
              Selecione os opcionais do veículo
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {OPCIONAIS_LIST.map((op) => (
                <label key={op} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={opcionais.includes(op)}
                    onChange={() => toggleOpcional(op)}
                    className="w-4 h-4 accent-red-600"
                  />
                  <span className="text-sm text-zinc-700 group-hover:text-zinc-900">{op}</span>
                </label>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <div className="mt-6 flex gap-3 justify-end">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/admin/veiculos")}
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white gap-2"
          disabled={loading}
        >
          <Save className="h-4 w-4" />
          {loading ? "Salvando..." : isEdit ? "Salvar alterações" : "Cadastrar veículo"}
        </Button>
      </div>
    </form>
  );
}
