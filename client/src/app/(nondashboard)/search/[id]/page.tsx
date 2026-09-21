"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import { ChevronRight, SearchX } from "lucide-react";
import EmptyState from "@/components/EmptyState";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAuthUserQuery, useGetPropertyQuery } from "@/state/api";
import ApplicationModal from "./ApplicationModal";
import ContactWidget from "./ContactWidget";
import ImageGallery from "./ImageGallery";
import PropertyDetails from "./PropertyDetails";
import PropertyLocation from "./PropertyLocation";
import PropertyOverview from "./PropertyOverview";
import SimilarListings from "./SimilarListings";

const DetailSkeleton = () => (
  <div className="container py-6">
    <Skeleton className="h-[420px] w-full rounded-3xl lg:h-[520px]" />
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-4">
        <Skeleton className="h-5 w-40" />
        <Skeleton className="h-10 w-3/4" />
        <Skeleton className="h-5 w-1/2" />
        <div className="grid grid-cols-4 gap-3 pt-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-40 w-full" />
      </div>
      <Skeleton className="h-96 w-full rounded-2xl" />
    </div>
  </div>
);

const SingleListing = () => {
  const { id } = useParams<{ id: string }>();
  const propertyId = Number(id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: authUser } = useGetAuthUserQuery();
  const { data: property, isLoading, isError } = useGetPropertyQuery(propertyId, {
    skip: Number.isNaN(propertyId),
  });

  if (isLoading) return <DetailSkeleton />;

  if (isError || !property) {
    return (
      <div className="container py-20">
        <EmptyState
          icon={SearchX}
          title="We couldn't find that listing"
          description="It may have been rented or removed. Try browsing other homes nearby."
          action={
            <Button asChild>
              <Link href="/search">Back to search</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <>
      <div className="container py-4">
        <nav className="flex items-center gap-1.5 text-xs text-ink-soft" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-ink">Home</Link>
          <ChevronRight className="h-3 w-3" />
          <Link href="/search" className="hover:text-ink">Search</Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-medium text-ink">{property.location.city}</span>
        </nav>
      </div>

      <ImageGallery images={property.photoUrls} alt={property.name} />

      <div className="container grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-14">
        <div className="space-y-12">
          <PropertyOverview property={property} />
          <PropertyDetails property={property} />
          <PropertyLocation property={property} />
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <ContactWidget property={property} onOpenModal={() => setIsModalOpen(true)} />
        </aside>
      </div>

      <SimilarListings property={property} />
      <Footer />

      {authUser?.userRole === "tenant" && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          property={property}
        />
      )}
    </>
  );
};

export default SingleListing;
