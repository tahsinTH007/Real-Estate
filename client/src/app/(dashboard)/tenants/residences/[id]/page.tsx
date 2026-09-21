"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CreditCard,
  Download,
  ExternalLink,
  FileText,
  Home,
  Mail,
  MapPin,
  Phone,
  Receipt,
  ShieldCheck,
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
  useGetAuthUserQuery,
  useGetLeasesQuery,
  useGetPaymentsQuery,
  useGetPropertyQuery,
} from "@/state/api";

const notAvailable = () => toast.info("Document downloads aren't available in the demo.");

const Residence = () => {
  const { id } = useParams<{ id: string }>();
  const propertyId = Number(id);
  const { data: authUser } = useGetAuthUserQuery();

  const { data: property, isLoading: propertyLoading } = useGetPropertyQuery(propertyId);
  const { data: leases, isLoading: leasesLoading } = useGetLeasesQuery(undefined, {
    skip: !authUser,
  });

  // The lease for *this* property (most recent first).
  const lease = [...(leases ?? [])]
    .filter((l) => l.propertyId === propertyId)
    .sort((a, b) => b.startDate.localeCompare(a.startDate))[0];

  const { data: payments, isLoading: paymentsLoading } = useGetPaymentsQuery(lease?.id ?? 0, {
    skip: !lease,
  });

  if (propertyLoading || leasesLoading) {
    return (
      <div className="dashboard-container space-y-6">
        <Skeleton className="h-5 w-32" />
        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    );
  }

  if (!property || !lease) {
    return (
      <div className="dashboard-container">
        <EmptyState
          icon={Home}
          title="No lease found for this home"
          description="If you were recently approved, give it a moment and refresh."
          action={
            <Button asChild variant="outline">
              <Link href="/tenants/residences">Back to residences</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const sortedPayments = [...(payments ?? [])].sort(
    (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime(),
  );
  const totalPaid = sortedPayments.reduce((s, p) => s + p.amountPaid, 0);
  const outstanding = sortedPayments
    .filter((p) => p.paymentStatus !== "Paid")
    .reduce((s, p) => s + (p.amountDue - p.amountPaid), 0);
  const leaseActive = new Date(lease.endDate) >= new Date();
  const manager = property.manager;

  return (
    <div className="dashboard-container">
      <Link
        href="/tenants/residences"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-soft hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" /> All residences
      </Link>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Residence card */}
        <section className="surface overflow-hidden">
          <div className="relative h-52 bg-sand-100">
            <PropertyImage
              src={property.photoUrls?.[0]}
              alt={property.name}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
            <div className="absolute inset-x-5 bottom-5 text-white">
              <Badge variant={leaseActive ? "success" : "secondary"} className="mb-2">
                <ShieldCheck className="h-3 w-3" /> {leaseActive ? "Active lease" : "Lease ended"}
              </Badge>
              <h1 className="font-display text-2xl font-medium sm:text-3xl">{property.name}</h1>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-white/80">
                <MapPin className="h-4 w-4" />
                {property.location.address}, {property.location.city}, {property.location.state}
              </p>
            </div>
          </div>

          <dl className="grid grid-cols-2 divide-x divide-sand-200 border-b border-sand-200 sm:grid-cols-4">
            {[
              { label: "Monthly rent", value: formatCurrency(lease.rent) },
              { label: "Lease start", value: formatDate(lease.startDate) },
              { label: "Lease end", value: formatDate(lease.endDate) },
              { label: "Next payment", value: formatDate(lease.nextPaymentDate) },
            ].map((item) => (
              <div key={item.label} className="px-5 py-4">
                <dt className="text-xs text-ink-soft">{item.label}</dt>
                <dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>

          <div className="flex flex-wrap gap-2 p-5">
            <Button asChild variant="outline" size="sm">
              <Link href={`/search/${property.id}`}>
                <ExternalLink /> View listing
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={notAvailable}>
              <Download /> Lease agreement
            </Button>
          </div>
        </section>

        {/* Manager + summary */}
        <div className="space-y-6">
          <section className="surface p-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
              Your property manager
            </p>
            {manager ? (
              <>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>{initials(manager.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-ink">{manager.name}</p>
                    <p className="text-xs text-ink-soft">Usually replies within a day</p>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Button asChild variant="outline" size="sm">
                    <a href={`tel:${manager.phoneNumber}`}>
                      <Phone /> Call
                    </a>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <a href={`mailto:${manager.email}`}>
                      <Mail /> Email
                    </a>
                  </Button>
                </div>
              </>
            ) : (
              <p className="text-sm text-ink-soft">Manager details unavailable.</p>
            )}
          </section>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <StatCard
              icon={CreditCard}
              label="Paid to date"
              value={formatCurrency(totalPaid)}
              hint={`${sortedPayments.filter((p) => p.paymentStatus === "Paid").length} payments`}
            />
            <StatCard
              icon={CalendarDays}
              label="Outstanding"
              value={formatCurrency(outstanding)}
              hint={outstanding ? "Includes this month" : "You're all paid up"}
              tone={outstanding ? "amber" : "neutral"}
            />
          </div>
        </div>
      </div>

      {/* Billing history */}
      <section className="surface mt-6 overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-sand-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-base font-semibold text-ink">Payment history</h2>
            <p className="text-sm text-ink-soft">Every rent payment for this lease.</p>
          </div>
          <Button variant="outline" size="sm" onClick={notAvailable}>
            <Download /> Download all
          </Button>
        </div>

        {paymentsLoading ? (
          <div className="p-5">
            <TableSkeleton rows={5} />
          </div>
        ) : sortedPayments.length === 0 ? (
          <EmptyState icon={Receipt} title="No payments yet" className="m-5" />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice</TableHead>
                <TableHead>Due</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Paid on</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <div className="flex items-center gap-2 font-medium text-ink">
                      <FileText className="h-4 w-4 text-ink-faint" />
                      {formatDate(payment.dueDate, { month: "long", year: "numeric" })} rent
                    </div>
                    <p className="pl-6 text-xs text-ink-faint">#{String(payment.id).padStart(5, "0")}</p>
                  </TableCell>
                  <TableCell className="text-ink-muted">{formatDate(payment.dueDate)}</TableCell>
                  <TableCell>
                    <StatusBadge status={payment.paymentStatus} />
                  </TableCell>
                  <TableCell className="text-ink-muted">
                    {payment.paymentStatus === "Paid" || payment.paymentStatus === "PartiallyPaid"
                      ? formatDate(payment.paymentDate)
                      : "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className="font-semibold text-ink">{formatCurrency(payment.amountPaid)}</span>
                    {payment.amountPaid !== payment.amountDue && (
                      <span className="block text-xs text-ink-faint">
                        of {formatCurrency(payment.amountDue)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" onClick={notAvailable} disabled={payment.amountPaid === 0}>
                      <Download /> PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
};

export default Residence;
