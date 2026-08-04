import type { HomeBanner } from "@/types";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function getBanners(): Promise<HomeBanner[]> {
  try {
    const res = await fetch(`${BACKEND}/api/v1/banners`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    return json.success ? (json.data as HomeBanner[]) : [];
  } catch {
    return [];
  }
}
