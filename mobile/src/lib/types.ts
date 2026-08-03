export interface EventTicket {
  id: string;
  event_id: string;
  label: string;
  price: number;
  icon?: string | null;
  benefits?: string[] | null;
  quantity?: number;
  remaining?: number;
  max_per_order?: number;
  is_active?: boolean;
}

export interface EventFacility {
  icon: string;
  label: string;
}

export interface SocialMediaLink {
  platform: string;
  url: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  organizer: string;
  organizer_logo?: string | null;
  image_url?: string | null;
  category: string;
  city: string;
  city_label?: string | null;
  location?: string | null;
  venue?: string | null;
  event_date: string;
  event_time?: string | null;
  description?: string | null;
  is_hot?: boolean;
  facilities?: EventFacility[] | null;
  social_media?: SocialMediaLink[] | null;
  terms?: string[] | null;
  map_url?: string | null;
  stage_image?: string | null;
  stages?: string[] | null;
  status?: string;
  created_at?: string;
  event_tickets?: EventTicket[] | null;
  // Derived
  price?: number;
  numericPrice?: number;
  remaining?: number;
  max_per_order?: number;
}

export interface OrderAttendee {
  ticket_code: string;
  full_name: string;
  email: string;
  whatsapp: string;
  identity_type?: string | null;
  identity_number?: string | null;
  booker_name?: string | null;
  gender?: string | null;
  age?: number | null;
  domicile?: string | null;
}

export interface OrderItem {
  ticket_label: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  events?: EventSummary | null;
}

export interface EventSummary {
  title: string;
  event_date: string;
  event_time: string;
  location: string;
  image_url: string;
  slug: string;
}

export interface Order {
  id: string;
  order_code: string;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  total_amount: number;
  payment_method?: string | null;
  payment_token?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at?: string | null;
  event?: EventSummary | null;
  items: OrderItem[];
  attendees: OrderAttendee[];
}

export interface WristbandOrder {
  id: string;
  order_code: string;
  status: 'pending' | 'paid' | 'cancelled';
  variant: 'without_qr' | 'with_qr';
  quantity: number;
  unit_price: number;
  total_amount: number;
  customer_name: string;
  customer_whatsapp: string;
  shipping_address: string;
  user_id?: string | null;
  payment_method?: string | null;
  payment_token?: string | null;
  paid_at?: string | null;
  created_at: string;
  updated_at?: string | null;
}

export interface Profile {
  id: string;
  role?: string | null;
  display_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  phone?: string | null;
  created_at?: string;
}

export interface PaymentMethod {
  id: string;
  label: string;
  group: string;
  image: string;
  snapKey: string;
}

export const SUPPORT_WHATSAPP = '6281316936289';
