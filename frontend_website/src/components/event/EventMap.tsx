"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default function EventMap({ mapUrl, location }: { mapUrl: string; location: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const [latStr, lngStr] = (mapUrl || "").split(",").map((s) => parseFloat(s.trim()));
    const lat = parseFloat(latStr as unknown as string);
    const lng = parseFloat(lngStr as unknown as string);
    if (Number.isNaN(lat) || Number.isNaN(lng) || !containerRef.current) return;

    const map = L.map(containerRef.current, {
      center: [lat, lng],
      zoom: 16,
      scrollWheelZoom: false,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    const icon = L.divIcon({
      html: '<span class="material-symbols-outlined edm-pin">location_on</span>',
      className: "edm-wrap",
      iconSize: [34, 34],
      iconAnchor: [17, 32],
    });
    L.marker([lat, lng], { icon }).addTo(map).bindPopup(location).openPopup();
    setTimeout(() => map.invalidateSize(), 150);
    return () => {
      map.remove();
    };
  }, [mapUrl, location]);

  return (
    <div style={{ position: "relative" }}>
      <div ref={containerRef} style={{ height: 160, borderRadius: 12, zIndex: 0 }} />
      <style>{`
        .edm-wrap { background: transparent; border: none; }
        .edm-pin {
          font-size: 34px;
          color: #1ABC9C;
          font-variation-settings: 'FILL' 1;
          text-shadow: 0 1px 4px rgba(0,0,0,0.25);
        }
        .edm-wrap .leaflet-popup-content { font-size: 12px; font-weight: 600; }
      `}</style>
    </div>
  );
}
