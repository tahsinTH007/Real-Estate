"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  DollarSign,
  Download,
  ExternalLink,
  FileText,
  MapPin,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import EmptyState from "@/components/EmptyState";
import { TableSkeleton } from "@/components/Loading";
import PropertyImage from "@/components/PropertyImage";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, initials } from "@/lib/utils";
import {
  useGetApplicationsQuery,
  useGetAuthUserQuery,
  useGetPropertyLeasesQuery,
  useGetPropertyQuery,
} from "@/state/api";
import type { Payment } from "@/types/models";

const currentMonthStatus = (payments: Payment[] | undefined): Payment["paymentStatus"] | "Pending" => {
  const now = new Date();
  const match = payments?.find((p) => {
    const d = new Date(p.dueDate);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  return match?.paymentStatus ?? "Pending";
};

const notAvailable = () =>
  toast.info("Document downloads aren't available in the demo.");

const PropertyTenants = () => {
  const { id } = useParams<{ id: string }>();
  const propertyId = Number(id);
  const { data: authUser } = useGetAuthUserQuery();

  const { data: property, isLoading: propertyLoading } = useGetPropertyQuery(propertyId);
  const { data: leases, isLoading: leasesLoading } = useGetPropertyLeasesQuery(propertyId);
  const { data: applications } = useGetApplicationsQuery(
    { userId: authUser?.cognitoInfo.userId, userType: "manager" },
    { skip: !authUser },
  );

  const now = new Date();
  const activeLeases = (leases ?? []).filter((l) => new Date(l.endDate) >= now);
  const pastLeases = (leases ?? []).filter((l) => new Date(l.endDate) < now);
  const propertyApps = (applications ?? []).filter((a) => a.propertyId === propertyId);
  const collectedThisMonth = activeLeases.reduce((sum, l) => {
    const status = currentMonthStatus(l.payments);
    return status === "Paid" ? sum + l.rent : sum;
  }, 0);

  if (propertyLoading) {
    return (
      <div className="dashboard-container space-y-6">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-64 w-full rounded-2xl" />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="dashboard-container">
        <EmptyState
          icon={Building2}
          title="Property not found"
          action={
            <Button asChild variant="outline">
              <Link href="/managers/properties">Back to properties</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <Link
        href="/managers/properties"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> All properties
      </Link>

      {/* Property hero */}
      <div className="surface mb-6 flex flex-col gap-5 p-5 sm:flex-row sm:items-center">
        <div className="relative h-36 w-full shrink-0 overflow-hidden rounded-xl bg-sand-100 sm:h-32 sm:w-48">
          <PropertyImage src={property.photoUrls?.[0]} alt={property.name} fill className="object-cover" sizes="200px" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            {activeLeases.length ? (
              <Badge variant="success">Leased</Badge>
            ) : (
              <Badge variant="secondary">Vacant</Badge>
            )}
            <span className="text-xs text-ink-faint">Listed {formatDate(property.postedDate)}</span>
          </div>
          <h1 className="mt-1.5 font-display text-2xl font-medium text-ink sm:text-3xl">
            {property.name}
          </h1>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-soft">
            <MapPin className="h-4 w-4" />
            {property.location.address}, {property.location.city}, {property.location.state}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <p className="font-display text-2xl font-medium text-ink">
            {formatCurrency(property.pricePerMonth)}
            <span className="text-sm font-normal text-ink-soft"> /mo</span>
          </p>
          <Button asChild variant="outline" size="sm">
            <Link href={`/search/${property.id}`}>
              <ExternalLink /> View public listing
            </Link>
          </Button>
        </div>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <StatCard icon={Users} label="Active tenants" value={activeLeases.length} tone="sky" />
        <StatCard
          icon={DollarSign}
          label="Collected this month"
          value={formatCurrency(collectedThisMonth)}
          hint={`of ${formatCurrency(activeLeases.reduce((s, l) => s + l.rent, 0))} due`}
        />
        <StatCard
          icon={FileText}
          label="Applications"
          value={propertyApps.length}
          hint={`${propertyApps.filter((a) => a.status === "Pending").length} pending`}
          tone="amber"
        />
      </div>

      {/* Tenants */}
      <section className="surface overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-sand-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Tenants & leases</h2>
            <p className="text-sm text-ink-soft">Everyone who currently rents or has rented this home.</p>
          </div>
          <Button variant="outline" size="sm" onClick={notAvailable}>
            <Download /> Export
          </Button>
        </div>

        {leasesLoading ? (
          <div className="p-5">
            <TableSkeleton />
          </div>
        ) : !leases?.length ? (
          <EmptyState
            icon={Users}
            title="No tenants yet"
            description="Approve an application and the lease will show up here."
            className="m-5"
          />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tenant</TableHead>
                <TableHead>Lease period</TableHead>
                <TableHead>Rent</TableHead>
                <TableHead>This month</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead className="text-right">Agreement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...activeLeases, ...pastLeases].map((lease) => {
                const active = new Date(lease.endDate) >= now;
                return (
                  <TableRow key={lease.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="text-xs">{initials(lease.tenant?.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold text-ink">{lease.tenant?.name}</p>
                          <p className="text-xs text-ink-soft">{lease.tenant?.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <p className="text-ink">{formatDate(lease.startDate)}</p>
                      <p className="text-xs text-ink-soft">to {formatDate(lease.endDate)}</p>
                    </TableCell>
                    <TableCell className="font-semibold text-ink">
                      {formatCurrency(lease.rent)}
                    </TableCell>
                    <TableCell>
                      {active ? (
                        <StatusBadge status={currentMonthStatus(lease.payments)} />
                      ) : (
                        <StatusBadge status="Ended" />
                      )}
                    </TableCell>
                    <TableCell className="text-ink-muted">{lease.tenant?.phoneNumber || "—"}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={notAvailable}>
                        <Download /> PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </section>

      {/* Applications for this property */}
      {propertyApps.length > 0 && (
        <section className="surface mt-6 overflow-hidden">
          <div className="border-b border-sand-200 p-5">
            <h2 className="text-base font-semibold text-ink">Recent applications</h2>
            <p className="text-sm text-ink-soft">
              Review and respond from the{" "}
              <Link href="/managers/applications" className="font-medium text-brand-700 hover:underline">
                applications page
              </Link>
              .
            </p>
          </div>
          <ul className="divide-y divide-sand-200">
            {propertyApps.map((app) => (
              <li key={app.id} className="flex items-center justify-between gap-4 px-5 py-3.5">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="text-xs">{initials(app.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-semibold text-ink">{app.name}</p>
                    <p className="text-xs text-ink-soft">Applied {formatDate(app.applicationDate)}</p>
                  </div>
                </div>
                <StatusBadge status={app.status} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
};

export default PropertyTenants;
