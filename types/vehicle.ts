export type VehicleStatus = "disponivel" | "reservado" | "vendido";

export interface Vehicle {
  id: string;
  marca: string;
  modelo: string;
  versao: string | null;
  ano_fabricacao: number;
  ano_modelo: number;
  preco_venda: number;
  preco_promocional: number | null;
  quilometragem: number;
  combustivel: string;
  tipo_cambio: string;
  cor_exterior: string;
  quantidade_portas: number;
  placa_final: string | null;
  chassi_vin: string | null;
  renavam: string | null;
  status_inventario: VehicleStatus;
  flag_destaque: boolean;
  descricao_vendedor: string | null;
  features: string[];
  fotos: string[];
  foto_principal: string | null;
  slug: string | null;
  created_at: string;
  updated_at: string;
}

export type VehicleInsert = Omit<Vehicle, "id" | "created_at" | "updated_at">;
export type VehicleUpdate = Partial<VehicleInsert>;

export interface VehicleFilters {
  marca?: string;
  modelo?: string;
  preco_min?: number;
  preco_max?: number;
  combustivel?: string;
  tipo_cambio?: string;
  ano_min?: number;
  ano_max?: number;
}
