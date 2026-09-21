"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import PropertyImage from "@/components/PropertyImage";
import { bedsLabel, cn, formatCurrency } from "@/lib/utils";
import { setActiveProperty } from "@/state";
import { useGetPropertiesQuery } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import type { Property } from "@/types/models";

export const TILE_URL =
  "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
export const TILE_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

const priceIcon = (price: number, active: boolean) =>
  L.divIcon({
    className: cn("price-marker", active && "price-marker--active"),
    html: `<span class="price-marker__pill">${formatCurrency(price)}</span>`,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, -34],
  });

/** Fit the viewport to the current result set (or recenter on the search). */
const Viewport = ({
  properties,
  center,
}: {
  properties: Property[];
  center: [number, number];
}) => {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map((p) => [
          p.location.coordinates.latitude,
          p.location.coordinates.longitude,
        ]),
      );
      map.fitBounds(bounds, { padding: [56, 56], maxZoom: 14, animate: true });
    } else {
      map.setView([center[1], center[0]], 11, { animate: true });
    }
  }, [map, properties, center]);

  // Leaflet needs a nudge when its container is resized by layout changes.
  useEffect(() => {
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(map.getContainer());
    return () => observer.disconnect();
  }, [map]);

  return null;
};

const Map = () => {
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.global.filters);
  const activeId = useAppSelector((s) => s.global.activePropertyId);
  const { data: properties = [] } = useGetPropertiesQuery(filters);

  const center = useMemo<[number, number]>(
    () => filters.coordinates ?? [-118.2437, 34.0522],
    [filters.coordinates],
  );

  return (
    <MapContainer
      center={[center[1], center[0]]}
      zoom={11}
      zoomControl={false}
      scrollWheelZoom
      className="h-full w-full"
    >
      <TileLayer url={TILE_URL} attribution={TILE_ATTRIBUTION} />
      <ZoomControl position="bottomright" />
      <Viewport properties={properties} center={center} />

      {properties.map((property) => (
        <Marker
          key={property.id}
          position={[
            property.location.coordinates.latitude,
            property.location.coordinates.longitude,
          ]}
          icon={priceIcon(property.pricePerMonth, activeId === property.id)}
          zIndexOffset={activeId === property.id ? 1000 : 0}
          eventHandlers={{
            mouseover: () => dispatch(setActiveProperty(property.id)),
            mouseout: () => dispatch(setActiveProperty(null)),
          }}
        >
          <Popup closeButton={false} className="rentiful-popup">
            <Link href={`/search/${property.id}`} className="block w-56">
              <div className="relative h-32 w-full overflow-hidden rounded-t-xl bg-sand-100">
                <PropertyImage
                  src={property.photoUrls?.[0]}
                  alt={property.name}
                  fill
                  className="object-cover"
                  sizes="224px"
                />
              </div>
              <div className="p-3">
                <p className="line-clamp-1 text-sm font-semibold text-ink">{property.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft">
                  {bedsLabel(property.beds)} · {property.baths} ba ·{" "}
                  {property.squareFeet.toLocaleString()} sq ft
                </p>
                <p className="mt-1.5 text-sm font-bold text-ink">
                  {formatCurrency(property.pricePerMonth)}
                  <span className="text-xs font-normal text-ink-soft"> /mo</span>
                </p>
              </div>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;
