"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Edit2, Trash2, Star, StarOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import type { Vehicle } from "@/types/vehicle";
import { formatPrice, formatKm } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

const statusLabel: Record<Vehicle["status_inventario"], { label: string; class: string }> = {
  disponivel: { label: "Disponível", class: "bg-emerald-100 text-emerald-700" },
  reservado: { label: "Reservado", class: "bg-amber-100 text-amber-700" },
  vendido: { label: "Vendido", class: "bg-zinc-100 text-zinc-500" },
};

export default function AdminVehicleTable({ vehicles: initial }: { vehicles: Vehicle[] }) {
  const [vehicles, setVehicles] = useState(initial);
  const [toDelete, setToDelete] = useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    const supabase = createClient();
    const { error } = await supabase.from("vehicles").delete().eq("id", toDelete.id);
    if (error) {
      toast.error("Erro ao excluir veículo.");
    } else {
      setVehicles((v) => v.filter((x) => x.id !== toDelete.id));
      toast.success("Veículo excluído com sucesso.");
      setToDelete(null);
    }
    setDeleting(false);
  }

  async function toggleDestaque(vehicle: Vehicle) {
    const supabase = createClient();
    const { error } = await supabase
      .from("vehicles")
      .update({ flag_destaque: !vehicle.flag_destaque })
      .eq("id", vehicle.id);
    if (error) {
      toast.error("Erro ao atualizar destaque.");
    } else {
      setVehicles((v) => v.map((x) => x.id === vehicle.id ? { ...x, flag_destaque: !x.flag_destaque } : x));
      toast.success(`Destaque ${!vehicle.flag_destaque ? "ativado" : "desativado"}.`);
    }
  }

  if (vehicles.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm p-12 text-center">
        <p className="text-zinc-400">Nenhum veículo cadastrado.</p>
        <Button asChild className="mt-4 bg-red-600 hover:bg-red-700 text-white">
          <Link href="/admin/veiculos/novo">Adicionar primeiro veículo</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-zinc-100 shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/80">
              <TableHead className="w-16">Foto</TableHead>
              <TableHead>Veículo</TableHead>
              <TableHead>Ano</TableHead>
              <TableHead>KM</TableHead>
              <TableHead>Preço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.map((v) => {
              const photo = v.foto_principal || v.fotos?.[0];
              const { label, class: cls } = statusLabel[v.status_inventario];
              const preco = v.preco_promocional && v.preco_promocional < v.preco_venda
                ? v.preco_promocional
                : v.preco_venda;
              return (
                <TableRow key={v.id} className="hover:bg-slate-50/50">
                  <TableCell>
                    <div className="relative w-14 h-10 rounded-lg overflow-hidden bg-zinc-100">
                      {photo ? (
                        <Image src={photo} alt={v.modelo} fill className="object-cover" sizes="56px" />
                      ) : (
                        <div className="w-full h-full bg-zinc-100" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-semibold text-zinc-900 text-sm">{v.modelo}</p>
                      <p className="text-xs text-zinc-400">{v.marca} {v.versao && `— ${v.versao}`}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-zinc-700">{v.ano_fabricacao}/{v.ano_modelo}</TableCell>
                  <TableCell className="text-sm text-zinc-700">{formatKm(v.quilometragem)}</TableCell>
                  <TableCell className="font-semibold text-sm text-zinc-900">{formatPrice(preco)}</TableCell>
                  <TableCell>
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${cls}`}>
                      {label}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleDestaque(v)}
                        title={v.flag_destaque ? "Remover destaque" : "Adicionar destaque"}
                      >
                        {v.flag_destaque ? (
                          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                        ) : (
                          <StarOff className="h-4 w-4 text-zinc-400" />
                        )}
                      </Button>
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/admin/veiculos/${v.id}`}>
                          <Edit2 className="h-4 w-4 text-zinc-500" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setToDelete(v)}>
                        <Trash2 className="h-4 w-4 text-red-400" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!toDelete} onOpenChange={(o) => !o && setToDelete(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Excluir veículo</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir{" "}
              <strong>{toDelete?.marca} {toDelete?.modelo}</strong>?
              Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setToDelete(null)} disabled={deleting}>
              Cancelar
            </Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
