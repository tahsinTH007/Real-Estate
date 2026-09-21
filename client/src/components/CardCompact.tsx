"use client";

import Link from "next/link";
import { Bath, BedDouble, Car, PawPrint, Ruler, Star } from "lucide-react";
import { isNewListing } from "@/components/Card";
import FavoriteButton from "@/components/FavoriteButton";
import PropertyImage from "@/components/PropertyImage";
import { Badge } from "@/components/ui/badge";
import { bedsLabel, cn, formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/models";

export interface CardCompactProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  showFavoriteButton?: boolean;
  propertyLink?: string;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  active?: boolean;
}

const CardCompact = ({
  property,
  isFavorite = false,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
  className,
  onMouseEnter,
  onMouseLeave,
  active = false,
}: CardCompactProps) => {
  const content = (
    <>
      <div className="relative w-[38%] shrink-0 overflow-hidden bg-sand-100 sm:w-[42%]">
        <PropertyImage
          src={property.photoUrls?.[0]}
          alt={property.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 640px) 40vw, 240px"
        />
        {isNewListing(property.postedDate) && (
          <Badge className="absolute left-2.5 top-2.5 bg-accent-400 text-ink">New</Badge>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-between p-4">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="line-clamp-1 text-[15px] font-semibold text-ink group-hover:text-brand-700">
              {property.name}
            </h3>
            {!!property.averageRating && (
              <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-ink">
                <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
                {property.averageRating.toFixed(1)}
              </span>
            )}
          </div>
          <p className="mt-0.5 line-clamp-1 text-xs text-ink-soft">
            {property.location?.address}, {property.location?.city}
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-ink-muted">
            <span className="flex items-center gap-1">
              <BedDouble className="h-3.5 w-3.5 text-ink-faint" />
              {bedsLabel(property.beds)}
            </span>
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5 text-ink-faint" />
              {property.baths} ba
            </span>
            <span className="flex items-center gap-1">
              <Ruler className="h-3.5 w-3.5 text-ink-faint" />
              {property.squareFeet.toLocaleString()} sq ft
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-end justify-between gap-2">
          <p className="text-base font-bold text-ink">
            {formatCurrency(property.pricePerMonth)}
            <span className="text-xs font-normal text-ink-soft"> /mo</span>
          </p>
          <div className="flex gap-1 text-ink-faint">
            {property.isPetsAllowed && (
              <span className="chip py-0.5" title="Pets allowed">
                <PawPrint className="h-3 w-3" /> Pets
              </span>
            )}
            {property.isParkingIncluded && (
              <span className="chip py-0.5" title="Parking included">
                <Car className="h-3 w-3" /> Parking
              </span>
            )}
          </div>
        </div>
      </div>
    </>
  );

  const classes = cn(
    "group surface relative flex min-h-[10.5rem] overflow-hidden transition-all duration-300 hover:shadow-card-hover",
    active && "ring-2 ring-brand-500 ring-offset-2",
    className,
  );

  return (
    <div onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} className="relative">
      {propertyLink ? (
        <Link href={propertyLink} className={classes}>
          {content}
        </Link>
      ) : (
        <div className={classes}>{content}</div>
      )}
      {showFavoriteButton && onFavoriteToggle && (
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onFavoriteToggle}
          size="sm"
          className="absolute right-3 top-3"
        />
      )}
    </div>
  );
};

export default CardCompact;
