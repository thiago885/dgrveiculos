import { createClient } from "@/lib/supabase/server";
import type { HeroBanner, TrustSection } from "@/types/banners";

export async function getHeroBanners(): Promise<HeroBanner[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("banners")
    .select("*")
    .eq("ativo", true)
    .order("ordem", { ascending: true });
  return data ?? [];
}

export async function getTrustSection(): Promise<TrustSection | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("trust_section")
    .select("*")
    .limit(1)
    .single();
  return data ?? null;
}
