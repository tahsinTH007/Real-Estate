"use client";

import Link from "next/link";
import { CheckCircle2, Clock, Download, ExternalLink, FileText, Home, Search, XCircle } from "lucide-react";
import { toast } from "sonner";
import ApplicationCard from "@/components/ApplicationCard";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDate } from "@/lib/utils";
import { useGetApplicationsQuery, useGetAuthUserQuery } from "@/state/api";

const Applications = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const { data: applications, isLoading, isError } = useGetApplicationsQuery(
    { userId: authUser?.cognitoInfo.userId, userType: "tenant" },
    { skip: !authUser?.cognitoInfo.userId },
  );

  return (
    <div className="dashboard-container">
      <Header
        title="My applications"
        subtitle="Track every application you've sent and what happens next."
        actions={
          <Button asChild variant="outline">
            <Link href="/search">
              <Search /> Find more homes
            </Link>
          </Button>
        }
      />

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState icon={FileText} title="Couldn't load applications" description="Please refresh to try again." />
      ) : !applications?.length ? (
        <EmptyState
          icon={FileText}
          title="You haven't applied anywhere yet"
          description="Find a home you love and hit Apply — it only takes a minute."
          action={
            <Button asChild>
              <Link href="/search">
                <Search /> Browse homes
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-4">
          {applications.map((application) => (
            <ApplicationCard
              key={application.id}
              application={application}
              userType="tenant"
              propertyLink={`/search/${application.property.id}`}
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 text-sm">
                  {application.status === "Approved" && (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span className="text-ink-muted">
                        Approved — your lease runs until{" "}
                        <strong className="text-ink">{formatDate(application.lease?.endDate)}</strong>.
                      </span>
                    </>
                  )}
                  {application.status === "Pending" && (
                    <>
                      <Clock className="h-4 w-4 text-amber-600" />
                      <span className="text-ink-muted">
                        The manager is reviewing your application. Most reply within 48 hours.
                      </span>
                    </>
                  )}
                  {application.status === "Denied" && (
                    <>
                      <XCircle className="h-4 w-4 text-rose-600" />
                      <span className="text-ink-muted">
                        This one didn&apos;t work out — keep looking, there are more homes nearby.
                      </span>
                    </>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/search/${application.property.id}`}>
                      <ExternalLink /> Listing
                    </Link>
                  </Button>
                  {application.status === "Approved" && (
                    <>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/tenants/residences/${application.property.id}`}>
                          <Home /> My residence
                        </Link>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toast.info("Document downloads aren't available in the demo.")}
                      >
                        <Download /> Agreement
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </ApplicationCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Applications;
