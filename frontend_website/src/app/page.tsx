import { Navbar, HeroBanner, Categories, EventCards, EventSeruGrid, Banner2, CitiesGrid, Footer } from "@/components";

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
        <Categories />
        <EventCards />
        <Banner2 />
        <EventSeruGrid />
        <CitiesGrid />
      </main>
      <Footer />
    </>
  );
}
