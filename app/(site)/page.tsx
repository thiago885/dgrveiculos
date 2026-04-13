import { Suspense } from "react";
import HeroCarousel from "@/components/home/HeroCarousel";
import StatsSection from "@/components/home/StatsSection";
import TrustSection from "@/components/home/TrustSection";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import ContactSection from "@/components/home/ContactSection";
import { getHeroBanners, getTrustSection } from "@/lib/banners";
import { buildAutoDealerSchema, buildOrganizationSchema, SITE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_OG_IMAGE } from "@/lib/seo";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${SITE_NAME} — Elite em Seminovos`,
    description: SITE_DESCRIPTION,
    images: [{ url: SITE_OG_IMAGE, width: 1200, height: 630, alt: SITE_NAME }],
  },
};

export default async function HomePage() {
  const [heroBanners, trustSection] = await Promise.all([
    getHeroBanners(),
    getTrustSection(),
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildAutoDealerSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(buildOrganizationSchema()) }}
      />
      <HeroCarousel slides={heroBanners} />
      <StatsSection />
      <Suspense fallback={null}>
        <FeaturedVehicles />
      </Suspense>
      <TrustSection data={trustSection} />
      <ContactSection />
    </>
  );
}
