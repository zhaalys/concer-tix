import { useCallback, useEffect, useState } from 'react';

import type { Event } from './types';
import { formatEventDate } from './format';
import { SUPABASE_KEY, SUPABASE_URL } from './supabase';

const EVENT_SELECT =
  'id,slug,title,organizer,organizer_logo,image_url,category,city,city_label,location,venue,event_date,event_time,description,is_hot,facilities,social_media,terms,map_url,stage_image,stages,status,created_at,event_tickets(id,label,price,icon,quantity,remaining,max_per_order,is_active,benefits)';

interface RawEventRow {
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
  facilities: { icon: string; label: string }[] | null;
  social_media: { platform: string; url: string }[] | null;
  terms: string[] | null;
  map_url: string | null;
  stage_image: string | null;
  stages: string[] | null;
  status: string | null;
  created_at: string | null;
  event_tickets:
    | Array<{
        id?: string;
        label: string;
        price: number;
        icon?: string | null;
        quantity?: number;
        remaining?: number;
        max_per_order?: number;
        is_active?: boolean;
        benefits?: string[] | null;
      }>
    | null;
}

const FALLBACK_EVENTS: Event[] = [
  {
    id: 'sound-of-downtown-vol-5',
    slug: 'sound-of-downtown-vol-5',
    title: 'Sound of Downtown Vol. 5',
    organizer: 'Boss Creator',
    organizer_logo: '/logo/tix_logo.png',
    image_url: '/image_concer/banner_concer_1.png',
    category: 'Music Concert',
    city: 'jabodetabek',
    city_label: 'DKI Jakarta & Sekitar',
    location: 'Lapangan Pussenif, Bandung',
    venue: 'Lapangan Pussenif',
    event_date: '28-30 Agustus 2026',
    event_time: '15:00 - 23:00 WIB',
    description: 'Festival musik terbesar di Bandung menghadirkan puluhan line up musisi nasional pilihan!',
    is_hot: true,
    map_url: 'https://maps.google.com',
    stage_image: '/stage/stage.png',
    stages: ['Main Stage', 'Indie Stage', 'Acoustic Corner'],
    terms: ['Wajib membawa KTP/Identitas resmi', 'Anak berusia di bawah 12 tahun wajib didampingi orang tua', 'Dilarang membawa senjata tajam, alkohol, dan obat terlarang'],
    facilities: [
      { icon: 'fastfood', label: 'Food Court' },
      { icon: 'local_parking', label: 'Area Parkir' },
      { icon: 'toilet', label: 'Toilet' },
      { icon: 'wifi', label: 'WiFi Gratis' },
    ],
    social_media: [
      { platform: 'Instagram', url: 'https://instagram.com/soundofdowntown' },
    ],
    event_tickets: [
      { id: 't1', event_id: 'sound-of-downtown-vol-5', label: 'Festival A (Standing)', price: 185000, quantity: 500, remaining: 240, max_per_order: 5, is_active: true, benefits: ['Akses Festival A', 'Front Stage'] },
      { id: 't2', event_id: 'sound-of-downtown-vol-5', label: 'VIP Seated', price: 450000, quantity: 200, remaining: 45, max_per_order: 4, is_active: true, benefits: ['VIP Lounge', 'Free Drink', 'Fast Track Entrance'] },
    ],
    numericPrice: 185000,
    price: 185000,
    remaining: 240,
    max_per_order: 5,
  },
  {
    id: 'hillsong-worship-nights-asia-tour-2026',
    slug: 'hillsong-worship-nights-asia-tour-2026',
    title: 'Hillsong Worship Nights Asia Tour 2026',
    organizer: 'Live Nation Asia',
    organizer_logo: '/logo/tix_logo.png',
    image_url: '/banner/banner_1.png',
    category: 'Music Concert',
    city: 'jabodetabek',
    city_label: 'DKI Jakarta & Sekitar',
    location: 'GBK Main Stadium, Jakarta',
    venue: 'GBK Main Stadium',
    event_date: '11 September 2026',
    event_time: '19:00 - 22:30 WIB',
    description: 'Tur konser megah Asia Tour 2026 Hillsong Worship di Stadion Gelora Bung Karno!',
    is_hot: true,
    map_url: 'https://maps.google.com',
    stage_image: '/stage/stage.png',
    stages: ['Main Arena'],
    terms: ['Wajib membawa e-ticket resmi', 'Dilarang membawa kamera profesional tanpa izin'],
    facilities: [
      { icon: 'fastfood', label: 'Food Court' },
      { icon: 'vip', label: 'Area VIP' },
      { icon: 'medical_services', label: 'Pos Kesehatan' },
    ],
    social_media: [],
    event_tickets: [
      { id: 't3', event_id: 'hillsong-worship-nights-asia-tour-2026', label: 'CAT 1 (Standing)', price: 850000, quantity: 1000, remaining: 350, max_per_order: 5, is_active: true, benefits: ['CAT 1 Floor'] },
      { id: 't4', event_id: 'hillsong-worship-nights-asia-tour-2026', label: 'VIP Tribune', price: 1750000, quantity: 300, remaining: 80, max_per_order: 4, is_active: true, benefits: ['VIP Tribune Seat', 'Official Merch Pack'] },
    ],
    numericPrice: 850000,
    price: 850000,
    remaining: 350,
    max_per_order: 5,
  },
  {
    id: 'pestapora-makassar-2026',
    slug: 'pestapora-makassar-2026',
    title: 'Latihan Pestapora Makassar 2026',
    organizer: 'Boss Creator',
    organizer_logo: '/logo/tix_logo.png',
    image_url: '/banner/banner_6.png',
    category: 'Festival',
    city: 'indonesia_timur',
    city_label: 'Makassar, Manado, Ambon',
    location: 'Celebes Convention Center, Makassar',
    venue: 'Celebes Convention Center',
    event_date: '26 Juli 2026',
    event_time: '16:00 - 23:00 WITA',
    description: 'Pesta musik nusantara menyapa warga Makassar!',
    is_hot: false,
    map_url: 'https://maps.google.com',
    stage_image: null,
    stages: ['Stage Makassar'],
    terms: ['Wajib membawa e-ticket'],
    facilities: [
      { icon: 'fastfood', label: 'Food Court' },
      { icon: 'toilet', label: 'Toilet' },
    ],
    social_media: [],
    event_tickets: [
      { id: 't5', event_id: 'pestapora-makassar-2026', label: 'Presale 1 (Standing)', price: 225000, quantity: 800, remaining: 120, max_per_order: 5, is_active: true, benefits: ['Presale Pass'] },
    ],
    numericPrice: 225000,
    price: 225000,
    remaining: 120,
    max_per_order: 5,
  },
];

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error('Gagal memuat data event');
  return res.json() as Promise<T>;
}

export function mapEventRow(row: RawEventRow): Event {
  const tickets = (row.event_tickets || [])
    .map((t) => ({
      id: t.id ?? '',
      event_id: row.id,
      label: t.label,
      price: Number(t.price) || 0,
      icon: t.icon ?? null,
      quantity: Number(t.quantity) || 0,
      remaining: Number(t.remaining ?? t.quantity) || 0,
      max_per_order: Number(t.max_per_order) || 5,
      is_active: t.is_active !== false,
      benefits: Array.isArray(t.benefits) ? t.benefits : [],
    }))
    .filter((t) => t.is_active);

  const activeTickets = tickets.filter((t) => t.remaining > 0);
  const minPrice = activeTickets.length
    ? Math.min(...activeTickets.map((t) => t.price))
    : tickets.length
      ? Math.min(...tickets.map((t) => t.price))
      : 0;
  const minRemaining = activeTickets.length
    ? Math.min(...activeTickets.map((t) => t.remaining))
    : 0;
  const maxPerOrder = activeTickets.length
    ? Math.max(...activeTickets.map((t) => t.max_per_order))
    : 5;

  return {
    id: row.slug || row.id,
    slug: row.slug || row.id,
    title: row.title,
    organizer: row.organizer || 'Concer TIX',
    organizer_logo: row.organizer_logo || '/logo/tix_logo.png',
    image_url: row.image_url || '/image_concer/banner_concer_1.png',
    category: row.category || 'Music Concert',
    city: row.city || '',
    city_label: row.city_label || row.city || '',
    location: row.location || row.venue || '',
    venue: row.venue || null,
    event_date: row.event_date ? formatEventDate(row.event_date) : '',
    event_time: row.event_time || '-',
    description: row.description || '',
    is_hot: !!row.is_hot,
    map_url: row.map_url || null,
    stage_image: row.stage_image || null,
    stages: Array.isArray(row.stages) ? row.stages : [],
    terms: Array.isArray(row.terms) ? row.terms : [],
    facilities: Array.isArray(row.facilities) ? row.facilities : [],
    social_media: Array.isArray(row.social_media) ? row.social_media : [],
    status: row.status || undefined,
    created_at: row.created_at || undefined,
    event_tickets: tickets,
    numericPrice: minPrice,
    price: minPrice,
    remaining: minRemaining,
    max_per_order: maxPerOrder,
  };
}

export async function getAllEvents(): Promise<Event[]> {
  try {
    const rows = await request<RawEventRow[]>(
      `${SUPABASE_URL}/rest/v1/events?select=${encodeURIComponent(
        EVENT_SELECT
      )}&status=neq.cancelled&order=is_hot.desc,event_date.asc`
    );
    if (rows && rows.length > 0) {
      return rows.map(mapEventRow);
    }
  } catch {
    // ignore
  }
  return FALLBACK_EVENTS;
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  try {
    const rows = await request<RawEventRow[]>(
      `${SUPABASE_URL}/rest/v1/events?select=${encodeURIComponent(
        EVENT_SELECT
      )}&slug=eq.${encodeURIComponent(slug)}&status=neq.cancelled&limit=1`
    );
    if (rows && rows.length > 0) {
      return mapEventRow(rows[0]);
    }
  } catch {
    // ignore
  }
  return FALLBACK_EVENTS.find((e) => e.slug === slug || e.id === slug) ?? FALLBACK_EVENTS[0];
}

export function usePublicEvents() {
  const [events, setEvents] = useState<Event[]>(FALLBACK_EVENTS);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch {
      setEvents(FALLBACK_EVENTS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { events, loading, error, reload: load };
}
