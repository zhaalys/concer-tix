import Navbar from "./components/Navbar";
import HeroBanner from "./components/HeroBanner";
import Categories from "./components/Categories";
import EventCards from "./components/EventCards";
import EventSeruGrid from "./components/EventSeruGrid";
import Banner2 from "./components/Banner2";
import CitiesGrid from "./components/CitiesGrid";
import Footer from "./components/Footer";

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
