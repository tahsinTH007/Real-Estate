"use client";

import L from "leaflet";
import { Circle, MapContainer, Marker, TileLayer, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { TILE_ATTRIBUTION, TILE_URL } from "../Map";

const homeIcon = L.divIcon({
  className: "price-marker",
  html: `<span class="price-marker__pill" style="padding:6px 8px"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-9.5Z"/></svg></span>`,
  iconSize: [0, 0],
  iconAnchor: [0, 0],
});

interface SingleMarkerMapProps {
  latitude: number;
  longitude: number;
  label: string;
}

const SingleMarkerMap = ({ latitude, longitude }: SingleMarkerMapProps) => {
  return (
    <MapContainer
      center={[latitude, longitude]}
      zoom={14}
      zoomControl={false}
      scrollWheelZoom={false}
      className="h-full w-full"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <ZoomControl position="bottomright" />
      <Circle
        center={[latitude, longitude]}
        radius={350}
        pathOptions={{ color: "#27583e", fillColor: "#27583e", fillOpacity: 0.08, weight: 1.5 }}
      />
      <Marker position={[latitude, longitude]} icon={homeIcon} />
    </MapContainer>
  );
};

export default SingleMarkerMap;
