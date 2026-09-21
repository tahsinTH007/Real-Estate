"use client";

import { usePathname, useRouter } from "next/navigation";
import { CheckCircle2, Clock, Heart, Mail, Phone, Share2 } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import { cn, formatCurrency, initials } from "@/lib/utils";
import { useGetApplicationsQuery, useGetAuthUserQuery } from "@/state/api";
import type { Property } from "@/types/models";

interface ContactWidgetProps {
  property: Property;
  onOpenModal: () => void;
}

const ContactWidget = ({ property, onOpenModal }: ContactWidgetProps) => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const { isFavorite, toggle, showFavoriteButton } = useFavorites();

  const isTenant = authUser?.userRole === "tenant";
  const isOwner =
    authUser?.userRole === "manager" &&
    authUser.cognitoInfo.userId === property.managerCognitoId;

  const { data: applications } = useGetApplicationsQuery(
    { userId: authUser?.cognitoInfo.userId, userType: "tenant" },
    { skip: !isTenant },
  );
  const existing = applications?.find((a) => a.propertyId === property.id);

  const handleApply = () => {
    if (!authUser) {
      router.push(`/signin?next=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isTenant) {
      toast.info("Sign in with a tenant account to apply.");
      return;
    }
    onOpenModal();
  };

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      if (navigator.share) {
        await navigator.share({ title: property.name, url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard.");
      }
    } catch {
      /* user cancelled */
    }
  };

  const manager = property.manager;

  return (
    <div className="surface p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-display text-3xl font-medium text-ink">
            {formatCurrency(property.pricePerMonth)}
            <span className="ml-1 text-sm font-normal text-ink-soft">/ month</span>
          </p>
          <p className="mt-1 text-xs text-ink-soft">
            {formatCurrency(property.securityDeposit)} deposit ·{" "}
            {formatCurrency(property.applicationFee)} application fee
          </p>
        </div>
        <div className="flex gap-1.5">
          {showFavoriteButton && (
            <Button
              variant="outline"
              size="icon-sm"
              onClick={() => toggle(property.id)}
              aria-label="Save to favorites"
            >
              <Heart
                className={cn(isFavorite(property.id) && "fill-rose-500 text-rose-500")}
              />
            </Button>
          )}
          <Button variant="outline" size="icon-sm" onClick={share} aria-label="Share">
            <Share2 />
          </Button>
        </div>
      </div>

      <div className="mt-5">
        {isOwner ? (
          <Button asChild variant="outline" size="lg" className="w-full">
            <a href={`/managers/properties/${property.id}`}>Manage this listing</a>
          </Button>
        ) : existing ? (
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3.5 text-sm",
              existing.status === "Approved"
                ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                : existing.status === "Denied"
                  ? "border-rose-200 bg-rose-50 text-rose-900"
                  : "border-amber-200 bg-amber-50 text-amber-900",
            )}
          >
            {existing.status === "Pending" ? (
              <Clock className="h-5 w-5 shrink-0" />
            ) : (
              <CheckCircle2 className="h-5 w-5 shrink-0" />
            )}
            <div>
              <p className="font-semibold">Application {existing.status.toLowerCase()}</p>
              <p className="text-xs opacity-80">
                {existing.status === "Pending"
                  ? "The manager is reviewing your application."
                  : "View details in your dashboard."}
              </p>
            </div>
          </div>
        ) : (
          <Button size="lg" className="w-full" onClick={handleApply}>
            {authUser ? "Apply now" : "Sign in to apply"}
          </Button>
        )}
        <p className="mt-2.5 text-center text-xs text-ink-faint">
          Free to apply · Most managers reply within 48 hours
        </p>
      </div>

      {manager && (
        <div className="mt-6 border-t border-sand-200 pt-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Listed by
          </p>
          <div className="flex items-center gap-3">
            <Avatar className="h-11 w-11">
              <AvatarFallback>{initials(manager.name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-ink">{manager.name}</p>
              <p className="text-xs text-ink-soft">Property manager</p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button asChild variant="outline" size="sm">
              <a href={`tel:${manager.phoneNumber}`}>
                <Phone /> Call
              </a>
            </Button>
            <Button asChild variant="outline" size="sm">
              <a href={`mailto:${manager.email}?subject=${encodeURIComponent(`Inquiry: ${property.name}`)}`}>
                <Mail /> Email
              </a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactWidget;
