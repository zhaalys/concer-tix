export interface EventTicket {
  id?: string;
  label: string;
  price: number;
  quantity: number;
  remaining: number;
  max_per_order: number;
  is_active: boolean;
}

export interface EventData {
  id: string;
  title: string;
  organizer: string;
  organizerLogo: string;
  img: string;
  category: string;
  city: string;
  cityLabel: string;
  location: string;
  date: string;
  time: string;
  price: string;
  numericPrice: number;
  isHot?: boolean;
  mapUrl?: string;
  stageImage?: string;
  stages?: string[];
  description: string;
  terms: string[];
  facilities: { icon: string; label: string }[];
  socialMedia: { platform: string; url: string }[];
  tickets: EventTicket[];
}
