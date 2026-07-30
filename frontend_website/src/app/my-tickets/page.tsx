import { Navbar, Footer } from "@/components";
import MyTicketsView from "@/components/ticket/MyTicketsView";

export const metadata = {
  title: "My Tickets - Concer TIX",
  description: "Your ticket purchase history and e-tickets",
};

export default function MyTicketsPage() {
  return (
    <>
      <Navbar />
      <MyTicketsView />
      <Footer />
    </>
  );
}
