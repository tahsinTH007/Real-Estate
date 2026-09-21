"use client";

import dynamic from "next/dynamic";
import { Compass, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Property } from "@/types/models";

const SingleMarkerMap = dynamic(() => import("./SingleMarkerMap"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-sand-200" />,
});

const PropertyLocation = ({ property }: { property: Property }) => {
  const { address, city, state, postalCode, coordinates } = property.location;
  const fullAddress = `${address}, ${city}, ${state} ${postalCode}`;

  return (
    <section>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ink">Location</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
            <MapPin className="h-4 w-4 text-ink-faint" />
            {fullAddress}
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Compass /> Get directions
          </a>
        </Button>
      </div>
      <div className="mt-4 h-[320px] overflow-hidden rounded-2xl border border-sand-200 shadow-card">
        <SingleMarkerMap
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          label={property.name}
        />
      </div>
    </section>
  );
};

export default PropertyLocation;
