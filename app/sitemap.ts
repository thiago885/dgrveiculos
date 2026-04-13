import { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: vehicles } = await supabase
    .from("vehicles")
    .select("slug, id, updated_at")
    .eq("status_inventario", "disponivel")
    .order("updated_at", { ascending: false });

  const vehicleUrls: MetadataRoute.Sitemap = (vehicles ?? []).map((v) => ({
    url: `${SITE_URL}/catalogo/${v.slug ?? v.id}`,
    lastModified: new Date(v.updated_at),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/catalogo`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    ...vehicleUrls,
  ];
}
