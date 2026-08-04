import { Navbar, HeroBanner, EventCards, EventSeruGrid, Banner2, CitiesGrid, Footer } from "@/components";
import IconScroll from "@/components/home/IconScroll";
import { getBanners } from "@/lib/banners";
import type { HeroSlide } from "@/components/home/HeroBanner";

export const revalidate = 60;

export default async function Home() {
  const banners = await getBanners();

  const heroSlides: HeroSlide[] = banners
    .filter((b) => b.placement === "hero")
    .map((b) => ({
      img: b.image_url,
      alt: b.title || "Banner",
      link: b.link,
      objectFit: b.object_fit,
      height: b.banner_height,
    }));

  const banner2 = banners.find((b) => b.placement === "banner");

  return (
    <>
      <Navbar />
      <main
        style={{
          width: "100%",
          backgroundColor: "#f7f9fb",
        }}
      >
        <HeroBanner slides={heroSlides} />
        <IconScroll />
        <EventCards />
        <Banner2 src={banner2?.image_url} link={banner2?.link} />
        <EventSeruGrid />
        <CitiesGrid />
      </main>
      <Footer />
    </>
  );
}
