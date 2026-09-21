"use client";

import { Bath, BedDouble, CalendarClock, MapPin, Ruler, ShieldCheck, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PropertyTypeLabels } from "@/lib/constants";
import { bedsLabel, formatDate } from "@/lib/utils";
import type { Property } from "@/types/models";

const PropertyOverview = ({ property }: { property: Property }) => {
  const facts = [
    { icon: BedDouble, label: "Bedrooms", value: bedsLabel(property.beds) },
    { icon: Bath, label: "Bathrooms", value: `${property.baths} ${property.baths === 1 ? "bath" : "baths"}` },
    { icon: Ruler, label: "Size", value: `${property.squareFeet.toLocaleString()} sq ft` },
    { icon: CalendarClock, label: "Listed", value: formatDate(property.postedDate, { month: "short", day: "numeric" }) },
  ];

  return (
    <section>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="secondary">{PropertyTypeLabels[property.propertyType]}</Badge>
        <Badge variant="success">
          <ShieldCheck className="h-3 w-3" /> Verified listing
        </Badge>
      </div>

      <h1 className="mt-4 font-display text-3xl font-medium tracking-tight text-ink sm:text-4xl">
        {property.name}
      </h1>

      <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-ink-muted">
        <span className="flex items-center gap-1.5">
          <MapPin className="h-4 w-4 text-ink-faint" />
          {property.location.address}, {property.location.city}, {property.location.state}{" "}
          {property.location.postalCode}
        </span>
        {!!property.averageRating && (
          <span className="flex items-center gap-1.5 font-medium text-ink">
            <Star className="h-4 w-4 fill-accent-400 text-accent-400" />
            {property.averageRating.toFixed(1)}
            <span className="font-normal text-ink-soft">
              ({property.numberOfReviews ?? 0} reviews)
            </span>
          </span>
        )}
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {facts.map((f) => (
          <div key={f.label} className="rounded-2xl border border-sand-200 bg-white p-4">
            <f.icon className="mb-2 h-5 w-5 text-brand-700" />
            <dt className="text-xs text-ink-soft">{f.label}</dt>
            <dd className="mt-0.5 text-sm font-semibold text-ink">{f.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-10">
        <h2 className="text-lg font-semibold text-ink">About this home</h2>
        <p className="mt-3 whitespace-pre-line text-[15px] leading-7 text-ink-muted">
          {property.description}
        </p>
      </div>
    </section>
  );
};

export default PropertyOverview;
