"use client";

import Link from "next/link";
import { Bath, BedDouble, Ruler, Star } from "lucide-react";
import FavoriteButton from "@/components/FavoriteButton";
import PropertyImage from "@/components/PropertyImage";
import { Badge } from "@/components/ui/badge";
import { PropertyTypeLabels } from "@/lib/constants";
import { bedsLabel, cn, formatCurrency } from "@/lib/utils";
import type { Property } from "@/types/models";

export interface CardProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  showFavoriteButton?: boolean;
  propertyLink?: string;
  /** Extra badge shown on the photo, e.g. "Active lease". */
  badge?: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  active?: boolean;
}

export const isNewListing = (postedDate: string) =>
  Date.now() - new Date(postedDate).getTime() < 14 * 24 * 60 * 60 * 1000;

const Card = ({
  property,
  isFavorite = false,
  onFavoriteToggle,
  showFavoriteButton = true,
  propertyLink,
  badge,
  footer,
  className,
  onMouseEnter,
  onMouseLeave,
  active = false,
}: CardProps) => {
  const Wrapper = propertyLink ? Link : "div";
  const wrapperProps = propertyLink ? { href: propertyLink, scroll: true } : {};

  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        "group surface flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover",
        active && "ring-2 ring-brand-500 ring-offset-2",
        className,
      )}
    >
      <Wrapper {...(wrapperProps as { href: string })} className="relative block">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-100">
          <PropertyImage
            src={property.photoUrls?.[0]}
            alt={property.name}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink/40 to-transparent" />
        </div>

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant="glass">{PropertyTypeLabels[property.propertyType]}</Badge>
          {isNewListing(property.postedDate) && (
            <Badge className="bg-accent-400 text-ink">New</Badge>
          )}
          {badge}
        </div>

        <div className="absolute bottom-3 left-3 rounded-full bg-white/95 px-3 py-1 text-sm font-semibold text-ink shadow-sm backdrop-blur">
          {formatCurrency(property.pricePerMonth)}
          <span className="text-xs font-normal text-ink-soft"> /mo</span>
        </div>
      </Wrapper>

      {showFavoriteButton && onFavoriteToggle && (
        <FavoriteButton
          isFavorite={isFavorite}
          onToggle={onFavoriteToggle}
          className="absolute right-3 top-3"
        />
      )}

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 text-base font-semibold text-ink">
            {propertyLink ? (
              <Link href={propertyLink} className="hover:text-brand-700">
                {property.name}
              </Link>
            ) : (
              property.name
            )}
          </h3>
          {!!property.averageRating && (
            <span className="flex shrink-0 items-center gap-1 text-xs font-semibold text-ink">
              <Star className="h-3.5 w-3.5 fill-accent-400 text-accent-400" />
              {property.averageRating.toFixed(1)}
              <span className="font-normal text-ink-faint">
                ({property.numberOfReviews ?? 0})
              </span>
            </span>
          )}
        </div>
        <p className="mt-1 line-clamp-1 text-sm text-ink-soft">
          {property.location?.address}, {property.location?.city}
        </p>

        <div className="mt-3 flex items-center gap-4 text-xs font-medium text-ink-muted">
          <span className="flex items-center gap-1.5">
            <BedDouble className="h-4 w-4 text-ink-faint" />
            {bedsLabel(property.beds)}
          </span>
          <span className="flex items-center gap-1.5">
            <Bath className="h-4 w-4 text-ink-faint" />
            {property.baths} {property.baths === 1 ? "bath" : "baths"}
          </span>
          <span className="flex items-center gap-1.5">
            <Ruler className="h-4 w-4 text-ink-faint" />
            {property.squareFeet.toLocaleString()} sq ft
          </span>
        </div>

        {footer && <div className="mt-4 border-t border-sand-200 pt-4">{footer}</div>}
      </div>
    </article>
  );
};

export default Card;
