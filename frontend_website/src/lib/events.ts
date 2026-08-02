import { EventData, EventTicket } from "./eventsData";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!;

const EVENT_SELECT =
  "id,slug,title,organizer,organizer_logo,image_url,category,city,city_label,location,venue,event_date,event_time,description,is_hot,facilities,social_media,terms,map_url,stage_image,stages,status,created_at,event_tickets(id,label,price,quantity,remaining,max_per_order,is_active)";

async function request<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
    },
  });
  if (!res.ok) throw new Error("Gagal memuat data event");
  return res.json() as Promise<T>;
}

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
  status: string | null;
  map_url: string | null;
  stage_image: string | null;
  stages: string[] | null;
  event_tickets: Array<Omit<EventTicket, "id"> & { id?: string }> | null;
}

export function formatEventDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  try {
    const d = new Date(iso.length <= 10 ? `${iso}T00:00:00` : iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  } catch {
    return iso;
  }
}

function formatPrice(n: number): string {
  return `Rp ${new Intl.NumberFormat("id-ID").format(Math.round(n || 0))}`;
}

export function mapEventRow(row: RawEventRow): EventData {
  const tickets = (row.event_tickets || [])
    .map((t) => ({
      id: t.id,
      label: t.label,
      price: Number(t.price) || 0,
      quantity: Number(t.quantity) || 0,
      remaining: Number(t.remaining ?? t.quantity) || 0,
      max_per_order: Number(t.max_per_order) || 5,
      is_active: t.is_active !== false,
    }))
    .filter((t) => t.is_active);

  const activeTickets = tickets.filter((t) => t.remaining > 0);
  const minPrice = activeTickets.length
    ? Math.min(...activeTickets.map((t) => t.price))
    : tickets.length
      ? Math.min(...tickets.map((t) => t.price))
      : 0;

  return {
    id: row.slug || row.id,
    title: row.title,
    organizer: row.organizer || "Concer TIX",
    organizerLogo: row.organizer_logo || "/logo/tix_logo.png?v=3",
    img: row.image_url || "/image_concer/banner_concer_1.png",
    category: row.category || "Music Concert",
    city: row.city || "",
    cityLabel: row.city_label || row.city || "",
    location: row.location || row.venue || "",
    date: formatEventDate(row.event_date),
    time: row.event_time || "-",
    price: formatPrice(minPrice),
    numericPrice: minPrice,
    isHot: !!row.is_hot,
    mapUrl: row.map_url || "",
    stageImage: row.stage_image || "",
    stages: Array.isArray(row.stages) ? row.stages : [],
    description: row.description || "",
    terms: Array.isArray(row.terms) ? row.terms : [],
    facilities: Array.isArray(row.facilities) ? row.facilities : [],
    socialMedia: Array.isArray(row.social_media) ? row.social_media : [],
    tickets,
  };
}

export async function getAllEvents(): Promise<EventData[]> {
  const rows = await request<RawEventRow[]>(
    `${SUPABASE_URL}/rest/v1/events?select=${encodeURIComponent(EVENT_SELECT)}&status=neq.cancelled&order=is_hot.desc,event_date.asc`
  );
  return (rows || []).map(mapEventRow);
}

export async function getEventBySlug(slug: string): Promise<EventData | null> {
  const rows = await request<RawEventRow[]>(
    `${SUPABASE_URL}/rest/v1/events?select=${encodeURIComponent(EVENT_SELECT)}&slug=eq.${encodeURIComponent(slug)}&status=neq.cancelled&limit=1`
  );
  return rows?.[0] ? mapEventRow(rows[0]) : null;
}

export async function getEventByTitle(title: string): Promise<EventData | null> {
  const rows = await request<RawEventRow[]>(
    `${SUPABASE_URL}/rest/v1/events?select=${encodeURIComponent(EVENT_SELECT)}&title=eq.${encodeURIComponent(title)}&status=neq.cancelled&limit=1`
  );
  return rows?.[0] ? mapEventRow(rows[0]) : null;
}
