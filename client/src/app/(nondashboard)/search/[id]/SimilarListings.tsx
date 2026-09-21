"use client";

import Card from "@/components/Card";
import { PropertyCardSkeleton } from "@/components/Loading";
import { useFavorites } from "@/hooks/useFavorites";
import { useGetPropertiesQuery } from "@/state/api";
import type { Property } from "@/types/models";

const SimilarListings = ({ property }: { property: Property }) => {
  const { data: properties, isLoading } = useGetPropertiesQuery({
    coordinates: [property.location.coordinates.longitude, property.location.coordinates.latitude],
  });
  const { isFavorite, toggle, showFavoriteButton } = useFavorites();

  const similar = (properties ?? [])
    .filter((p) => p.id !== property.id)
    .sort(
      (a, b) =>
        Math.abs(a.pricePerMonth - property.pricePerMonth) -
        Math.abs(b.pricePerMonth - property.pricePerMonth),
    )
    .slice(0, 3);

  if (!isLoading && similar.length === 0) return null;

  return (
    <section className="border-t border-sand-200 bg-white py-16">
      <div className="container">
        <p className="section-eyebrow">Keep exploring</p>
        <h2 className="section-title">Similar homes nearby</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)
            : similar.map((p) => (
                <Card
                  key={p.id}
                  property={p}
                  propertyLink={`/search/${p.id}`}
                  isFavorite={isFavorite(p.id)}
                  onFavoriteToggle={() => toggle(p.id)}
                  showFavoriteButton={showFavoriteButton}
                />
              ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarListings;
