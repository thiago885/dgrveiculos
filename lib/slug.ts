export function generateVehicleSlug(
  marca: string,
  modelo: string,
  versao: string | null | undefined,
  ano: number
): string {
  const parts = [marca, modelo, versao, String(ano)].filter(Boolean) as string[];
  return parts
    .join(" ")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
