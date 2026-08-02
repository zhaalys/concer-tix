"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Search, Loader2 } from "lucide-react";
import { TEXT, TEXT_MUTED, TEXT_FAINT, BORDER, BLUE } from "@/components/admin/AdminUI";

interface Suggestion {
  lat: string;
  lon: string;
  display_name: string;
}

interface MapPickerProps {
  value: string;
  onChange: (value: string) => void;
}

function parseCoords(value: string): { lat: number; lng: number } | null {
  if (!value) return null;
  const [lat, lng] = value.split(",").map((s) => parseFloat(s.trim()));
  if (Number.isNaN(lat) || Number.isNaN(lng) || lat === 0 || lng === 0) return null;
  return { lat, lng };
}

function formatCoords(value: string): string {
  const c = parseCoords(value);
  if (!c) return "";
  return `Lat ${c.lat.toFixed(5)}, Lng ${c.lng.toFixed(5)}`;
}

export default function MapPicker({ value, onChange }: MapPickerProps) {
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSug, setShowSug] = useState(false);
  const [searching, setSearching] = useState(false);
  const coords = parseCoords(value);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: coords ? [coords.lat, coords.lng] : [-2.5, 118],
      zoom: coords ? 16 : 5,
      scrollWheelZoom: false,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    map.on("click", (e: L.LeafletMouseEvent) => {
      const { lat, lng } = e.latlng;
      onChange(`${lat.toFixed(6)},${lng.toFixed(6)}`);
    });
    mapRef.current = map;
    if (coords) updateMarker(coords.lat, coords.lng);
    setTimeout(() => map.invalidateSize(), 150);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!coords) {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      return;
    }
    if (mapRef.current) {
      updateMarker(coords.lat, coords.lng);
      mapRef.current.flyTo([coords.lat, coords.lng], 16);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  function updateMarker(lat: number, lng: number) {
    const icon = L.divIcon({
      html: '<span class="material-symbols-outlined mp-pin">location_on</span>',
      className: "mp-marker-wrap",
      iconSize: [34, 34],
      iconAnchor: [17, 32],
    });
    if (markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
    } else if (mapRef.current) {
      markerRef.current = L.marker([lat, lng], { icon }).addTo(mapRef.current);
    }
  }

  useEffect(() => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=6&countrycodes=id&accept-language=id&q=${encodeURIComponent(query.trim())}`,
          { headers: { "Accept-Language": "id" } }
        );
        if (!res.ok) throw new Error("search failed");
        const data = (await res.json()) as Suggestion[];
        setSuggestions(data);
        setShowSug(true);
      } catch {
        setSuggestions([]);
      } finally {
        setSearching(false);
      }
    }, 450);
    return () => clearTimeout(t);
  }, [query]);

  function pick(s: Suggestion) {
    setQuery(s.display_name);
    setShowSug(false);
    onChange(`${parseFloat(s.lat).toFixed(6)},${parseFloat(s.lon).toFixed(6)}`);
  }

  return (
    <div>
      <div style={{ position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "8px 10px", background: "#FBFBFA" }}>
          {searching ? <Loader2 size={15} className="admin-spin" style={{ color: TEXT_FAINT, flexShrink: 0 }} /> : <Search size={15} style={{ color: TEXT_FAINT, flexShrink: 0 }} />}
          <input
            className="mp-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length && setShowSug(true)}
            placeholder="Cari lokasi, contoh: GBK, Gelora Bung Karno..."
          />
        </div>
        {showSug && suggestions.length > 0 && (
          <div className="mp-sug" style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: `1px solid ${BORDER}`, borderRadius: 8, boxShadow: "0 6px 20px rgba(0,0,0,0.08)", zIndex: 500, maxHeight: 220, overflowY: "auto" }}>
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pick(s)}
                style={{ display: "block", width: "100%", textAlign: "left", padding: "9px 12px", border: "none", background: "#fff", cursor: "pointer", fontSize: 13, color: TEXT, borderBottom: `1px solid ${BORDER}` }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#F3F6F8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
              >
                {s.display_name}
              </button>
            ))}
          </div>
        )}
      </div>

      <div ref={containerRef} style={{ height: 260, borderRadius: 10, overflow: "hidden", border: `1px solid ${BORDER}`, marginTop: 10 }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8 }}>
        <div style={{ fontSize: 12.5, color: coords ? "#0E9375" : TEXT_FAINT, fontWeight: 500 }}>
          {coords ? formatCoords(value) : "Belum pilih lokasi. Ketik nama tempat lalu pilih dari daftar, atau klik langsung di peta."}
        </div>
        {coords && (
          <button type="button" onClick={() => { setQuery(""); onChange(""); }} style={{ background: "none", border: "none", color: TEXT_MUTED, fontSize: 12.5, cursor: "pointer", padding: 0 }}>
            Hapus
          </button>
        )}
      </div>

      <style>{`
        .mp-input {
          flex: 1;
          border: none;
          outline: none;
          background: transparent;
          font-size: 13.5px;
          color: ${TEXT};
        }
        .mp-marker-wrap { background: transparent; border: none; }
        .mp-pin {
          font-size: 34px;
          color: ${BLUE};
          font-variation-settings: 'FILL' 1;
          text-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
      `}</style>
    </div>
  );
}
