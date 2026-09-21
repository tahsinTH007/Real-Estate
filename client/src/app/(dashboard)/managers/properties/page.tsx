"use client";

import Link from "next/link";
import { useMemo } from "react";
import { Building2, DollarSign, FileClock, KeyRound, Plus, Users } from "lucide-react";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { CardGridSkeleton } from "@/components/Loading";
import StatCard from "@/components/StatCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import {
  useGetApplicationsQuery,
  useGetAuthUserQuery,
  useGetLeasesQuery,
  useGetManagerPropertiesQuery,
} from "@/state/api";

const Properties = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const cognitoId = authUser?.cognitoInfo.userId ?? "";

  const { data: properties, isLoading, isError } = useGetManagerPropertiesQuery(cognitoId, {
    skip: !cognitoId,
  });
  const { data: leases } = useGetLeasesQuery(undefined, { skip: !cognitoId });
  const { data: applications } = useGetApplicationsQuery(
    { userId: cognitoId, userType: "manager" },
    { skip: !cognitoId },
  );

  const now = Date.now();
  const activeLeases = useMemo(
    () => (leases ?? []).filter((l) => new Date(l.endDate).getTime() >= now),
    [leases, now],
  );
  const leasedIds = useMemo(
    () => new Set(activeLeases.map((l) => l.propertyId)),
    [activeLeases],
  );
  const monthlyRevenue = activeLeases.reduce((sum, l) => sum + l.rent, 0);
  const pendingApps = (applications ?? []).filter((a) => a.status === "Pending").length;
  const total = properties?.length ?? 0;
  const occupied = properties?.filter((p) => leasedIds.has(p.id)).length ?? 0;

  return (
    <div className="dashboard-container">
      <Header
        eyebrow={`Welcome back, ${authUser?.userInfo.name?.split(" ")[0] ?? "there"}`}
        title="Your properties"
        subtitle="An overview of your portfolio, occupancy and rent."
        actions={
          <Button asChild>
            <Link href="/managers/newproperty">
              <Plus /> New listing
            </Link>
          </Button>
        }
      />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-2xl" />)
        ) : (
          <>
            <StatCard icon={Building2} label="Listings" value={total} hint={`${total - occupied} vacant`} />
            <StatCard
              icon={Users}
              label="Occupancy"
              value={total ? `${Math.round((occupied / total) * 100)}%` : "—"}
              hint={`${occupied} of ${total} leased`}
              tone="sky"
            />
            <StatCard
              icon={DollarSign}
              label="Monthly rent roll"
              value={formatCurrency(monthlyRevenue)}
              hint={`${activeLeases.length} active leases`}
              tone="brand"
            />
            <StatCard
              icon={FileClock}
              label="Pending applications"
              value={pendingApps}
              hint={pendingApps ? "Awaiting your review" : "You're all caught up"}
              tone={pendingApps ? "amber" : "neutral"}
            />
          </>
        )}
      </div>

      {isLoading ? (
        <CardGridSkeleton count={8} />
      ) : isError ? (
        <EmptyState icon={Building2} title="Couldn't load your properties" description="Please refresh the page to try again." />
      ) : !properties?.length ? (
        <EmptyState
          icon={Building2}
          title="No listings yet"
          description="Publish your first property to start receiving applications."
          action={
            <Button asChild>
              <Link href="/managers/newproperty">
                <Plus /> Create a listing
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {properties.map((property) => {
            const lease = activeLeases.find((l) => l.propertyId === property.id);
            const pending = (applications ?? []).filter(
              (a) => a.propertyId === property.id && a.status === "Pending",
            ).length;
            return (
              <Card
                key={property.id}
                property={property}
                showFavoriteButton={false}
                propertyLink={`/managers/properties/${property.id}`}
                badge={
                  lease ? (
                    <Badge variant="success">
                      <KeyRound className="h-3 w-3" /> Leased
                    </Badge>
                  ) : (
                    <Badge variant="glass">Vacant</Badge>
                  )
                }
                footer={
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-soft">
                      {lease ? `Tenant: ${lease.tenant?.name ?? "—"}` : "No active lease"}
                    </span>
                    {pending > 0 && (
                      <Badge variant="warning">
                        {pending} pending
                      </Badge>
                    )}
                  </div>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Properties;
