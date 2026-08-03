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
  const rows = await request<RawEventRow[]>(
    `${SUPABASE_URL}/rest/v1/events?select=${encodeURIComponent(EVENT_SELECT)}&status=neq.cancelled&order=is_hot.desc,event_date.asc`
  );
  return (rows || []).map(mapEventRow);
}

export async function getEventBySlug(slug: string): Promise<Event | null> {
  const rows = await request<RawEventRow[]>(
    `${SUPABASE_URL}/rest/v1/events?select=${encodeURIComponent(EVENT_SELECT)}&slug=eq.${encodeURIComponent(slug)}&status=neq.cancelled&limit=1`
  );
  return rows?.[0] ? mapEventRow(rows[0]) : null;
}

export function usePublicEvents() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEvents();
      setEvents(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat event');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { events, loading, error, reload: load };
}
