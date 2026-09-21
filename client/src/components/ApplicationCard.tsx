"use client";

import Link from "next/link";
import { CalendarDays, Mail, MapPin, MessageSquareQuote, Phone } from "lucide-react";
import PropertyImage from "@/components/PropertyImage";
import StatusBadge from "@/components/StatusBadge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn, formatCurrency, formatDate, initials } from "@/lib/utils";
import type { Application } from "@/types/models";

interface ApplicationCardProps {
  application: Application;
  /** Whose perspective the card is rendered from. */
  userType: "manager" | "tenant";
  propertyLink?: string;
  children?: React.ReactNode;
  className?: string;
}

const ApplicationCard = ({
  application,
  userType,
  propertyLink,
  children,
  className,
}: ApplicationCardProps) => {
  const { property, lease } = application;
  const contact = userType === "manager" ? application.tenant : application.manager;
  const contactRole = userType === "manager" ? "Applicant" : "Property manager";

  return (
    <article className={cn("surface overflow-hidden", className)}>
      <div className="grid gap-6 p-5 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)] lg:gap-8 lg:p-6">
        {/* Property */}
        <div className="flex gap-4">
          <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded-xl bg-sand-100 sm:h-28 sm:w-40">
            <PropertyImage
              src={property.photoUrls?.[0]}
              alt={property.name}
              fill
              className="object-cover"
              sizes="160px"
            />
          </div>
          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <StatusBadge status={application.status} />
              <span className="text-xs text-ink-faint">
                Applied {formatDate(application.applicationDate)}
              </span>
            </div>
            <h3 className="line-clamp-1 text-base font-semibold text-ink">
              {propertyLink ? (
                <Link href={propertyLink} className="hover:text-brand-700">
                  {property.name}
                </Link>
              ) : (
                property.name
              )}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-ink-soft">
              <MapPin className="h-3.5 w-3.5" />
              {property.location?.city}, {property.location?.state}
            </p>
            <p className="mt-2 text-sm font-semibold text-ink">
              {formatCurrency(property.pricePerMonth)}
              <span className="text-xs font-normal text-ink-soft"> /month</span>
            </p>
          </div>
        </div>

        {/* Lease */}
        <div className="border-t border-sand-200 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Lease
          </p>
          {lease ? (
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Start</dt>
                <dd className="font-medium text-ink">{formatDate(lease.startDate)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">End</dt>
                <dd className="font-medium text-ink">{formatDate(lease.endDate)}</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Next payment</dt>
                <dd className="flex items-center gap-1 font-medium text-ink">
                  <CalendarDays className="h-3.5 w-3.5 text-ink-faint" />
                  {formatDate(lease.nextPaymentDate)}
                </dd>
              </div>
            </dl>
          ) : (
            <p className="text-sm text-ink-soft">
              {application.status === "Denied"
                ? "No lease was created."
                : "A lease is created once the application is approved."}
            </p>
          )}
        </div>

        {/* Contact */}
        <div className="border-t border-sand-200 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            {contactRole}
          </p>
          {contact ? (
            <div className="flex gap-3">
              <Avatar className="h-10 w-10">
                <AvatarFallback>{initials(contact.name)}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 space-y-1 text-sm">
                <p className="font-semibold text-ink">{contact.name}</p>
                {contact.phoneNumber && (
                  <a
                    href={`tel:${contact.phoneNumber}`}
                    className="flex items-center gap-1.5 text-ink-muted hover:text-brand-700"
                  >
                    <Phone className="h-3.5 w-3.5" /> {contact.phoneNumber}
                  </a>
                )}
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-1.5 truncate text-ink-muted hover:text-brand-700"
                >
                  <Mail className="h-3.5 w-3.5" /> {contact.email}
                </a>
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-soft">Unavailable</p>
          )}
        </div>
      </div>

      {application.message && userType === "manager" && (
        <div className="mx-5 mb-5 flex gap-2.5 rounded-xl bg-sand-50 px-4 py-3 text-sm text-ink-muted lg:mx-6">
          <MessageSquareQuote className="mt-0.5 h-4 w-4 shrink-0 text-ink-faint" />
          <p className="italic">“{application.message}”</p>
        </div>
      )}

      {children && (
        <div className="border-t border-sand-200 bg-sand-50/60 px-5 py-4 lg:px-6">
          {children}
        </div>
      )}
    </article>
  );
};

export default ApplicationCard;
