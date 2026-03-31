import { Suspense } from "react";
import HeroCarousel from "@/components/home/HeroCarousel";
import StatsSection from "@/components/home/StatsSection";
import TrustSection from "@/components/home/TrustSection";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import ContactSection from "@/components/home/ContactSection";

export default function HomePage() {
  return (
    <>
      <HeroCarousel />
      <StatsSection />
      <Suspense fallback={null}>
        <FeaturedVehicles />
      </Suspense>
      <TrustSection />
      <ContactSection />
    </>
  );
}
