"use client";

import { useEffect } from "react";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { CollectionPoint } from "@/lib/api";
import { MATERIAL_LABEL } from "./materials";

// Cornélio Procópio centro aproximado.
const CENTER: [number, number] = [-23.182, -50.647];
const DEFAULT_ZOOM = 13;

const iconRecyclable = L.divIcon({
  className: "",
  html: pinSvg("#16A34A"),
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -32],
});

const iconSpecial = L.divIcon({
  className: "",
  html: pinSvg("#EA580C"),
  iconSize: [28, 36],
  iconAnchor: [14, 36],
  popupAnchor: [0, -32],
});

function pinSvg(fill: string): string {
  return `<svg width="28" height="36" viewBox="0 0 24 32" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.4 0 0 5.4 0 12c0 8.4 12 20 12 20s12-11.6 12-20C24 5.4 18.6 0 12 0Z" fill="${fill}"/><circle cx="12" cy="12" r="4.5" fill="#FFFFFF"/></svg>`;
}

function FitBoundsToPoints({ points }: { points: CollectionPoint[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) {
      map.setView(CENTER, DEFAULT_ZOOM);
      return;
    }
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 15);
      return;
    }
    const bounds = L.latLngBounds(points.map((p) => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [points, map]);
  return null;
}

type Props = {
  points: CollectionPoint[];
};

export function MapView({ points }: Props) {
  return (
    <div className="overflow-hidden rounded-xl border border-line">
      <MapContainer
        center={CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={false}
        style={{ height: "420px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBoundsToPoints points={points} />
        {points.map((p) => (
          <Marker
            key={p.id}
            position={[p.lat, p.lng]}
            icon={p.type === "especial" ? iconSpecial : iconRecyclable}
          >
            <Popup>
              <div className="min-w-[200px]">
                <div className="text-[13px] font-semibold text-ink">
                  {p.name}
                </div>
                <div className="mt-0.5 text-[12px] text-ink-soft">
                  {p.address}
                </div>
                {p.accepted_materials.length > 0 && (
                  <div className="mt-1.5 text-[11px] text-ink-mute">
                    {p.accepted_materials
                      .map((m) => MATERIAL_LABEL[m] ?? m)
                      .join(" · ")}
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
