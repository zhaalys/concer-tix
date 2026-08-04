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

export type AdminRole = "admin" | "super_admin";

export interface AdminProfile {
  id: string;
  email: string;
  role: AdminRole;
  display_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  created_at?: string;
}

export interface AdminUser {
  id: string;
  email: string;
  display_name: string | null;
  role: string;
  avatar_url: string | null;
  provider: string;
  created_at: string;
  last_sign_in_at: string | null;
  orders_count: number;
  orders_paid: number;
  total_spent: number;
}

export interface AdminOrderItem {
  ticket_label: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  events: { id: string; title: string; image_url: string | null; city: string | null; event_date: string | null } | null;
}

export interface AdminOrder {
  id: string;
  order_code: string;
  status: "pending" | "paid" | "cancelled" | "refunded";
  total_amount: number;
  payment_method: string | null;
  created_at: string;
  user_id: string | null;
  order_items: AdminOrderItem[];
  attendees: { email: string | null; full_name: string | null }[];
}

export interface OverviewStats {
  total_revenue: number;
  ticket_revenue: number;
  wristband_revenue: number;
  total_orders: number;
  ticket_orders: number;
  wristband_orders: number;
  tickets_sold: number;
  total_users: number;
  total_events: number;
  checked_in: number;
  recent_orders: Array<{
    id: string;
    order_code: string;
    status: string;
    total_amount: number;
    created_at: string;
    order_items: Array<{ ticket_label: string; quantity: number; events: { title: string } | null }>;
    attendees: Array<{ email: string | null; full_name: string | null }>;
  }>;
}

export interface AdminEventTicket {
  id?: string;
  label: string;
  price: number;
  quantity: number;
  remaining: number;
  max_per_order: number;
  is_active: boolean;
}

export interface AdminEvent {
  id: string;
  slug: string;
  title: string;
  organizer: string | null;
  organizer_logo: string | null;
  image_url: string | null;
  category: string | null;
  city: string | null;
  city_label: string | null;
  location: string | null;
  venue: string | null;
  event_date: string | null;
  event_time: string | null;
  description: string | null;
  is_hot: boolean;
  status: "upcoming" | "ongoing" | "completed" | "cancelled";
  facilities: { icon: string; label: string }[] | null;
  social_media: { platform: string; url: string }[] | null;
  terms: string[] | null;
  map_url: string | null;
  stage_image: string | null;
  stages: string[] | null;
  created_at: string;
  updated_at: string;
  event_tickets?: AdminEventTicket[];
}

export interface AdminPayment {
  id: string;
  order_code: string;
  type: "tiket" | "wristband";
  customer: string;
  description: string;
  status: string;
  amount: number;
  payment_method: string | null;
  payment_token: string | null;
  payment_url: string | null;
  paid_at: string | null;
  created_at: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "promo" | "warning" | "update";
  link: string | null;
  is_active: boolean;
  image_url: string | null;
  placement: "hero" | "banner" | "inline";
  object_fit: "cover" | "contain";
  banner_height: number | null;
  created_at: string;
  updated_at: string;
}

export interface HomeBanner {
  id: string;
  title: string;
  message: string;
  type: string;
  link: string | null;
  image_url: string;
  placement: "hero" | "banner";
  object_fit: "cover" | "contain";
  banner_height: number | null;
  created_at: string;
  updated_at: string;
}
