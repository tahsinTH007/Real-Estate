"use client";

import { useMemo } from "react";
import { SearchX } from "lucide-react";
import Card from "@/components/Card";
import CardCompact from "@/components/CardCompact";
import EmptyState from "@/components/EmptyState";
import { CompactCardSkeleton, PropertyCardSkeleton } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { pluralize } from "@/lib/utils";
import { resetFilters, setActiveProperty, type SortBy } from "@/state";
import { useGetPropertiesQuery } from "@/state/api";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import type { Property } from "@/types/models";

function sortProperties(list: Property[], sortBy: SortBy) {
  const copy = [...list];
  switch (sortBy) {
    case "price-asc":
      return copy.sort((a, b) => a.pricePerMonth - b.pricePerMonth);
    case "price-desc":
      return copy.sort((a, b) => b.pricePerMonth - a.pricePerMonth);
    case "newest":
      return copy.sort(
        (a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime(),
      );
    case "rating":
      return copy.sort((a, b) => (b.averageRating ?? 0) - (a.averageRating ?? 0));
    default:
      // "Recommended": rating weighted by review count, newest as tiebreak.
      return copy.sort((a, b) => {
        const score = (p: Property) =>
          (p.averageRating ?? 0) * Math.log10((p.numberOfReviews ?? 0) + 10);
        return score(b) - score(a);
      });
  }
}

const Listings = () => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((s) => s.global.viewMode);
  const sortBy = useAppSelector((s) => s.global.sortBy);
  const filters = useAppSelector((s) => s.global.filters);
  const activeId = useAppSelector((s) => s.global.activePropertyId);
  const { isFavorite, toggle, showFavoriteButton } = useFavorites();

  const { data: properties, isLoading, isFetching, isError } = useGetPropertiesQuery(filters);

  const sorted = useMemo(
    () => sortProperties(properties ?? [], sortBy),
    [properties, sortBy],
  );

  if (isError) {
    return (
      <EmptyState
        icon={SearchX}
        title="Something went wrong"
        description="We couldn't load listings right now. Please try again."
        className="mt-4"
      />
    );
  }

  const gridClass =
    viewMode === "grid"
      ? "grid grid-cols-1 gap-4 sm:grid-cols-2"
      : "flex flex-col gap-4";

  return (
    <div className="py-4">
      <div className="mb-4 flex items-baseline justify-between gap-3 px-1">
        <h2 className="text-sm text-ink-muted">
          {isLoading ? (
            "Searching…"
          ) : (
            <>
              <span className="font-semibold text-ink">
                {pluralize(sorted.length, "home")}
              </span>{" "}
              in {filters.location || "this area"}
            </>
          )}
        </h2>
        {isFetching && !isLoading && (
          <span className="text-xs text-ink-faint">Updating…</span>
        )}
      </div>

      {isLoading ? (
        <div className={gridClass}>
          {Array.from({ length: 6 }).map((_, i) =>
            viewMode === "grid" ? <PropertyCardSkeleton key={i} /> : <CompactCardSkeleton key={i} />,
          )}
        </div>
      ) : sorted.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No homes match these filters"
          description="Try widening your price range, removing an amenity, or searching a nearby city."
          action={
            <Button variant="outline" onClick={() => dispatch(resetFilters())}>
              Clear filters
            </Button>
          }
        />
      ) : (
        <div className={gridClass}>
          {sorted.map((property) => {
            const shared = {
              property,
              isFavorite: isFavorite(property.id),
              onFavoriteToggle: () => toggle(property.id),
              showFavoriteButton,
              propertyLink: `/search/${property.id}`,
              active: activeId === property.id,
              onMouseEnter: () => dispatch(setActiveProperty(property.id)),
              onMouseLeave: () => dispatch(setActiveProperty(null)),
            };
            return viewMode === "grid" ? (
              <Card key={property.id} {...shared} />
            ) : (
              <CardCompact key={property.id} {...shared} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Listings;
