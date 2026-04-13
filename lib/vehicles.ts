import { createClient } from "@/lib/supabase/server";
import type { Vehicle, VehicleFilters, VehicleInsert, VehicleUpdate } from "@/types/vehicle";

export async function getVehicles(filters?: VehicleFilters): Promise<Vehicle[]> {
  const supabase = await createClient();
  let query = supabase.from("vehicles").select("*").order("created_at", { ascending: false });

  if (filters?.marca) query = query.ilike("marca", `%${filters.marca}%`);
  if (filters?.modelo) query = query.ilike("modelo", `%${filters.modelo}%`);
  if (filters?.preco_min) query = query.gte("preco_venda", filters.preco_min);
  if (filters?.preco_max) query = query.lte("preco_venda", filters.preco_max);
  if (filters?.combustivel) query = query.eq("combustivel", filters.combustivel);
  if (filters?.tipo_cambio) query = query.eq("tipo_cambio", filters.tipo_cambio);
  if (filters?.ano_min) query = query.gte("ano_fabricacao", filters.ano_min);
  if (filters?.ano_max) query = query.lte("ano_fabricacao", filters.ano_max);

  const { data, error } = await query;
  if (error) throw error;
  return data as Vehicle[];
}

export async function getFeaturedVehicles(): Promise<Vehicle[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("flag_destaque", true)
    .eq("status_inventario", "disponivel")
    .order("created_at", { ascending: false })
    .limit(6);
  if (error) throw error;
  return data as Vehicle[];
}

export async function getVehicleBySlug(slug: string): Promise<Vehicle | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("vehicles")
    .select("*")
    .eq("slug", slug)
    .single();
  return data as Vehicle | null;
}

export async function getVehicleById(id: string): Promise<Vehicle | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Vehicle;
}

export async function createVehicle(vehicle: VehicleInsert): Promise<Vehicle> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .insert(vehicle)
    .select()
    .single();
  if (error) throw error;
  return data as Vehicle;
}

export async function updateVehicle(id: string, vehicle: VehicleUpdate): Promise<Vehicle> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("vehicles")
    .update({ ...vehicle, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data as Vehicle;
}

export async function deleteVehicle(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").delete().eq("id", id);
  if (error) throw error;
}

export { formatPrice, formatKm } from "./format";
