import { Navbar, HeroBanner, EventCards, EventSeruGrid, Banner2, CitiesGrid, Footer } from "@/components";
import IconScroll from "@/components/home/IconScroll";

export default function Home() {
  return (
    <>
      <Navbar />
      <main
        style={{
          width: "100%",
          backgroundColor: "#f7f9fb",
        }}
      >
        <HeroBanner />
        <IconScroll />
        <EventCards />
        <Banner2 />
        <EventSeruGrid />
        <CitiesGrid />
      </main>
      <Footer />
    </>
  );
}
