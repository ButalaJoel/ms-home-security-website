import Hero from "../components/home/Hero.tsx";
import { BrandStrip, DistributorBanner, FeaturedProducts, SolutionTiles, SpotlightRow, WhyUs } from "../components/home/HomeSections.tsx";

// Layout follows hikvision.com: full-width slider, spotlight cards, a dark feature block,
// solution tiles and a distributor banner before the footer.
export default function HomePage() {
  return (
    <>
      <Hero />
      <SpotlightRow />
      <FeaturedProducts />
      <WhyUs />
      <SolutionTiles />
      <BrandStrip />
      <DistributorBanner />
    </>
  );
}
