export interface TicketData {
  ticketCode: string;
  orderId: string;
  eventTitle: string;
  eventDate: string;
  eventTime: string;
  eventLocation: string;
  category: string;
  price: number;
  holderName: string;
  email: string;
  purchasedAt: string;
  paymentMethod: string;
  status: "success" | "pending";
}

// Simple in-memory store untuk demo (FE only)
let tickets: TicketData[] = [
  {
    ticketCode: "TIX-DEMO-001",
    orderId: "ORDER-DEMO001",
    eventTitle: "Hillsong Worship Nights Asia Tour 2026",
    eventDate: "11 Sep 2026",
    eventTime: "19:00 - 22:00",
    eventLocation: "GBK Basketball Hall, Jakarta",
    category: "Reguler",
    price: 120000,
    holderName: "Demo User",
    email: "demo@example.com",
    purchasedAt: "29 Jul 2026, 20:20",
    paymentMethod: "BCA Virtual Account",
    status: "success",
  },
];

export function getTickets(): TicketData[] {
  return tickets;
}

export function addTicket(ticket: TicketData): void {
  tickets = [ticket, ...tickets];
}

export function generateTicketCode(): string {
  return `TIX-${Date.now().toString(36).toUpperCase()}`;
}
