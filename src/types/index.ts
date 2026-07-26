/**
 * Type definitions for Concer TIX Application
 */

export interface Event {
  id: string;
  title: string;
  artist: string;
  category: string;
  location: string;
  city: string;
  date: string;
  price: number;
  image: string;
  isPopular?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'buyer' | 'promoter' | 'admin';
  createdAt: string;
}

export interface Ticket {
  id: string;
  eventId: string;
  ticketType: string;
  price: number;
  quantity: number;
  qrCode?: string;
  status: 'valid' | 'used' | 'cancelled';
}
