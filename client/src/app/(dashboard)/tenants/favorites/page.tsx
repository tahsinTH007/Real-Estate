"use client";

import Link from "next/link";
import { CalendarDays, FileText, Heart, Home, Search } from "lucide-react";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { CardGridSkeleton } from "@/components/Loading";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useFavorites } from "@/hooks/useFavorites";
import { formatDate } from "@/lib/utils";
import {
  useGetApplicationsQuery,
  useGetAuthUserQuery,
  useGetLeasesQuery,
  useGetPropertiesQuery,
} from "@/state/api";

const Favorites = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const cognitoId = authUser?.cognitoInfo.userId ?? "";
  const { tenant, favoriteIds, toggle } = useFavorites();
  const ids = Array.from(favoriteIds);

  const {
    data: favoriteProperties,
    isLoading: propsLoading,
    isError,
  } = useGetPropertiesQuery({ favoriteIds: ids }, { skip: ids.length === 0 });
  const { data: applications } = useGetApplicationsQuery(
    { userId: cognitoId, userType: "tenant" },
    { skip: !cognitoId },
  );
  const { data: leases } = useGetLeasesQuery(undefined, { skip: !cognitoId });

  const tenantLoading = !tenant;
  const isLoading = tenantLoading || (ids.length > 0 && propsLoading);
  const activeLease = (leases ?? []).find((l) => new Date(l.endDate) >= new Date());
  const pending = (applications ?? []).filter((a) => a.status === "Pending").length;

  return (
    <div className="dashboard-container">
      <Header
        eyebrow={`Hi, ${authUser?.userInfo.name?.split(" ")[0] ?? "there"}`}
        title="Saved homes"
        subtitle="Compare the places you've saved and apply when you're ready."
        actions={
          <Button asChild variant="outline">
            <Link href="/search">
              <Search /> Explore more
            </Link>
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        {tenantLoading ? (
          Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : (
          <>
            <StatCard icon={Heart} label="Saved homes" value={ids.length} tone="rose" />
            <StatCard
              icon={FileText}
              label="Applications"
              value={applications?.length ?? 0}
              hint={pending ? `${pending} pending review` : "No pending applications"}
              tone="amber"
            />
            <StatCard
              icon={activeLease ? CalendarDays : Home}
              label={activeLease ? "Next rent due" : "Current home"}
              value={activeLease ? formatDate(activeLease.nextPaymentDate, { month: "short", day: "numeric" }) : "—"}
              hint={activeLease ? activeLease.property?.name : "No active lease"}
              tone="sky"
            />
          </>
        )}
      </div>

      {isLoading ? (
        <CardGridSkeleton count={4} />
      ) : isError ? (
        <EmptyState icon={Heart} title="Couldn't load favorites" description="Please refresh to try again." />
      ) : ids.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="Nothing saved yet"
          description="Tap the heart on any listing to keep it here for easy comparison."
          action={
            <Button asChild>
              <Link href="/search">
                <Search /> Browse homes
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {favoriteProperties?.map((property) => (
            <Card
              key={property.id}
              property={property}
              isFavorite
              onFavoriteToggle={() => toggle(property.id)}
              propertyLink={`/search/${property.id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
