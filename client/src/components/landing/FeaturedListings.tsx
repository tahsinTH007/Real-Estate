"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Card from "@/components/Card";
import { PropertyCardSkeleton } from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { useGetPropertiesQuery } from "@/state/api";

const FeaturedListings = () => {
  const { data: properties, isLoading } = useGetPropertiesQuery({});
  const { isFavorite, toggle, showFavoriteButton } = useFavorites();

  const featured = [...(properties ?? [])]
    .sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime())
    .slice(0, 6);

  return (
    <section className="container py-20 sm:py-24">
      <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="section-eyebrow">Fresh on the market</p>
          <h2 className="section-title">Newest homes this week</h2>
        </div>
        <Button asChild variant="outline" className="w-fit rounded-full">
          <Link href="/search">
            Browse all homes <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
          : featured.map((property, i) => (
              <motion.div
                key={property.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
              >
                <Card
                  property={property}
                  propertyLink={`/search/${property.id}`}
                  isFavorite={isFavorite(property.id)}
                  onFavoriteToggle={() => toggle(property.id)}
                  showFavoriteButton={showFavoriteButton}
                />
              </motion.div>
            ))}
      </div>
    </section>
  );
};

export default FeaturedListings;
