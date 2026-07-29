import { Navbar, Footer } from "@/components";
import MyTicketsView from "@/components/ticket/MyTicketsView";
import { getTickets } from "@/lib/ticketStore";

export const metadata = {
  title: "My Tickets - Concer TIX",
  description: "Your ticket purchase history and e-tickets",
};

export default function MyTicketsPage() {
  const tickets = getTickets();
  return (
    <>
      <Navbar />
      <main>
        <MyTicketsView tickets={tickets} />
      </main>
      <Footer />
    </>
  );
}
