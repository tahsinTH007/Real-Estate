"use client";

import Link from "next/link";
import { CalendarDays, Home, KeyRound, Search } from "lucide-react";
import Card from "@/components/Card";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { CardGridSkeleton } from "@/components/Loading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  useGetAuthUserQuery,
  useGetCurrentResidencesQuery,
  useGetLeasesQuery,
} from "@/state/api";

const Residences = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const cognitoId = authUser?.cognitoInfo.userId ?? "";

  const { data: residences, isLoading, isError } = useGetCurrentResidencesQuery(cognitoId, {
    skip: !cognitoId,
  });
  const { data: leases } = useGetLeasesQuery(undefined, { skip: !cognitoId });

  return (
    <div className="dashboard-container">
      <Header
        title="My residences"
        subtitle="Homes you currently rent, with lease details and payments."
      />

      {isLoading ? (
        <CardGridSkeleton count={2} />
      ) : isError ? (
        <EmptyState icon={Home} title="Couldn't load residences" description="Please refresh to try again." />
      ) : !residences?.length ? (
        <EmptyState
          icon={Home}
          title="No active leases"
          description="Once a manager approves your application, your new home will show up here."
          action={
            <Button asChild>
              <Link href="/search">
                <Search /> Find a home
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {residences.map((property) => {
            const lease = (leases ?? []).find(
              (l) => l.propertyId === property.id && new Date(l.endDate) >= new Date(),
            );
            return (
              <Card
                key={property.id}
                property={property}
                showFavoriteButton={false}
                propertyLink={`/tenants/residences/${property.id}`}
                badge={
                  <Badge variant="success">
                    <KeyRound className="h-3 w-3" /> Active lease
                  </Badge>
                }
                footer={
                  lease ? (
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-ink-soft">
                        <CalendarDays className="h-3.5 w-3.5" />
                        Next payment {formatDate(lease.nextPaymentDate, { month: "short", day: "numeric" })}
                      </span>
                      <span className="font-semibold text-ink">{formatCurrency(lease.rent)}/mo</span>
                    </div>
                  ) : undefined
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Residences;
