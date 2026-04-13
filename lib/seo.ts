export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://dgrveiculos.com.br";
export const SITE_NAME = "DGR Veículos";
export const SITE_DESCRIPTION =
  "Especialistas em seminovos de alto padrão em Santa Bárbara d'Oeste - SP. Qualidade, procedência e transparência em cada negócio. Financiamento facilitado.";
export const SITE_PHONE = "+5519998256619";
export const SITE_ADDRESS = {
  street: "Rua do Ósmio, 1459",
  city: "Santa Bárbara d'Oeste",
  state: "SP",
  country: "BR",
};
export const SITE_LOGO =
  "https://qafyuyhxmxaizprmatyz.supabase.co/storage/v1/object/public/img/dgr_logo.png";
export const SITE_OG_IMAGE =
  "https://qafyuyhxmxaizprmatyz.supabase.co/storage/v1/object/public/img/dgr_logo.png";

export function buildAutoDealerSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    logo: SITE_LOGO,
    image: SITE_OG_IMAGE,
    telephone: SITE_PHONE,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_ADDRESS.street,
      addressLocality: SITE_ADDRESS.city,
      addressRegion: SITE_ADDRESS.state,
      addressCountry: SITE_ADDRESS.country,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -22.7534,
      longitude: -47.4139,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "08:00",
        closes: "13:00",
      },
    ],
    sameAs: [
      "https://www.instagram.com/dgrveiculos",
      "https://www.facebook.com/dgrveiculos",
    ],
    priceRange: "$$",
  };
}

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: SITE_LOGO,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: SITE_PHONE,
      contactType: "sales",
      availableLanguage: "Portuguese",
    },
  };
}

export function buildVehicleSchema(vehicle: {
  marca: string;
  modelo: string;
  versao: string | null;
  ano_fabricacao: number;
  ano_modelo: number;
  quilometragem: number;
  combustivel: string;
  tipo_cambio: string;
  cor_exterior: string;
  preco_venda: number;
  preco_promocional: number | null;
  status_inventario: string;
  descricao_vendedor: string | null;
  fotos: string[];
  slug: string | null;
  id: string;
}) {
  const preco =
    vehicle.preco_promocional && vehicle.preco_promocional < vehicle.preco_venda
      ? vehicle.preco_promocional
      : vehicle.preco_venda;

  const availability =
    vehicle.status_inventario === "disponivel"
      ? "https://schema.org/InStock"
      : vehicle.status_inventario === "reservado"
      ? "https://schema.org/LimitedAvailability"
      : "https://schema.org/SoldOut";

  const url = `${SITE_URL}/catalogo/${vehicle.slug ?? vehicle.id}`;

  return {
    "@context": "https://schema.org",
    "@type": "Car",
    name: `${vehicle.marca} ${vehicle.modelo}${vehicle.versao ? " " + vehicle.versao : ""} ${vehicle.ano_fabricacao}`,
    description: vehicle.descricao_vendedor ?? undefined,
    brand: { "@type": "Brand", name: vehicle.marca },
    model: vehicle.modelo,
    vehicleModelDate: String(vehicle.ano_fabricacao),
    modelDate: String(vehicle.ano_modelo),
    color: vehicle.cor_exterior,
    fuelType: vehicle.combustivel,
    vehicleTransmission: vehicle.tipo_cambio,
    mileageFromOdometer: {
      "@type": "QuantitativeValue",
      value: vehicle.quilometragem,
      unitCode: "KMT",
    },
    image: vehicle.fotos,
    url,
    offers: {
      "@type": "Offer",
      url,
      price: preco,
      priceCurrency: "BRL",
      availability,
      seller: {
        "@type": "AutoDealer",
        name: SITE_NAME,
        telephone: SITE_PHONE,
      },
    },
  };
}
