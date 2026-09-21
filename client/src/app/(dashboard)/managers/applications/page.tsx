"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, Check, Download, FileText, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import ApplicationCard from "@/components/ApplicationCard";
import EmptyState from "@/components/EmptyState";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  useGetApplicationsQuery,
  useGetAuthUserQuery,
  useUpdateApplicationStatusMutation,
} from "@/state/api";
import type { ApplicationStatus } from "@/types/models";

type Tab = "all" | "pending" | "approved" | "denied";

const tabs: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "denied", label: "Denied" },
];

const Applications = () => {
  const { data: authUser } = useGetAuthUserQuery();
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [busyId, setBusyId] = useState<number | null>(null);

  const { data: applications, isLoading, isError } = useGetApplicationsQuery(
    { userId: authUser?.cognitoInfo.userId, userType: "manager" },
    { skip: !authUser?.cognitoInfo.userId },
  );
  const [updateApplicationStatus] = useUpdateApplicationStatusMutation();

  const handleStatusChange = async (id: number, status: ApplicationStatus) => {
    setBusyId(id);
    try {
      await updateApplicationStatus({ id, status }).unwrap();
    } catch {
      /* toast handled in api layer */
    } finally {
      setBusyId(null);
    }
  };

  const counts = {
    all: applications?.length ?? 0,
    pending: applications?.filter((a) => a.status === "Pending").length ?? 0,
    approved: applications?.filter((a) => a.status === "Approved").length ?? 0,
    denied: applications?.filter((a) => a.status === "Denied").length ?? 0,
  };

  const filtered = (tab: Tab) =>
    (applications ?? []).filter((a) => tab === "all" || a.status.toLowerCase() === tab);

  return (
    <div className="dashboard-container">
      <Header
        title="Applications"
        subtitle="Review applicants for your properties and approve or decline them."
      />

      {isLoading ? (
        <div className="space-y-4">
          <Skeleton className="h-11 w-96 max-w-full rounded-xl" />
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-48 w-full rounded-2xl" />
          ))}
        </div>
      ) : isError ? (
        <EmptyState icon={FileText} title="Couldn't load applications" description="Please refresh to try again." />
      ) : (
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)}>
          <TabsList className="h-auto flex-wrap">
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[11px] font-semibold",
                    t.value === "pending" && counts.pending > 0
                      ? "bg-amber-100 text-amber-800"
                      : "bg-sand-200 text-ink-muted",
                  )}
                >
                  {counts[t.value]}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value} className="mt-6 space-y-4">
              {filtered(t.value).length === 0 ? (
                <EmptyState
                  icon={FileText}
                  title={t.value === "pending" ? "No pending applications" : `No ${t.value === "all" ? "" : t.value} applications`}
                  description={
                    t.value === "pending"
                      ? "New applications will appear here as soon as renters apply."
                      : "Nothing to show in this category yet."
                  }
                />
              ) : (
                filtered(t.value).map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    userType="manager"
                    propertyLink={`/managers/properties/${application.property.id}`}
                  >
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-sm text-ink-muted">
                        {application.status === "Pending" && "Waiting for your decision."}
                        {application.status === "Approved" &&
                          "Approved — a 12-month lease has been created."}
                        {application.status === "Denied" && "You declined this application."}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/managers/properties/${application.property.id}`}>
                            <Building2 /> Property
                          </Link>
                        </Button>
                        {application.status === "Pending" && (
                          <>
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={busyId === application.id}
                              onClick={() => handleStatusChange(application.id, "Denied")}
                            >
                              <X /> Decline
                            </Button>
                            <Button
                              size="sm"
                              disabled={busyId === application.id}
                              onClick={() => handleStatusChange(application.id, "Approved")}
                            >
                              {busyId === application.id ? <Loader2 className="animate-spin" /> : <Check />}
                              Approve
                            </Button>
                          </>
                        )}
                        {application.status === "Approved" && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toast.info("Document downloads aren't available in the demo.")}
                          >
                            <Download /> Lease agreement
                          </Button>
                        )}
                      </div>
                    </div>
                  </ApplicationCard>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </div>
  );
};

export default Applications;
