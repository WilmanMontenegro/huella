"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface FarmMapProps {
  lat: number;
  lng: number;
  label: string;
  className?: string;
}

export function FarmMap({ lat, lng, label, className = "h-64 w-full" }: FarmMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView([lat, lng], 13);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    const icon = L.divIcon({
      className: "",
      html: `<div style="background:#1b6d24;width:14px;height:14px;border-radius:50%;border:3px solid #fff;box-shadow:0 2px 6px rgba(0,0,0,.3)"></div>`,
      iconSize: [14, 14],
      iconAnchor: [7, 7],
    });

    L.marker([lat, lng], { icon }).addTo(map).bindPopup(label);

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [lat, lng, label]);

  return (
    <div
      ref={containerRef}
      className={`overflow-hidden rounded-card border border-[#E5E0D5] ${className}`}
      aria-label={`Mapa de ${label}`}
    />
  );
}
