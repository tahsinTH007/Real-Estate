"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import {
  useAddFavoritePropertyMutation,
  useGetAuthUserQuery,
  useGetTenantQuery,
  useRemoveFavoritePropertyMutation,
} from "@/state/api";

/**
 * Shared favourite-toggling logic. Signed-out visitors are sent to sign in;
 * managers get a friendly nudge instead of an error.
 */
export function useFavorites() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: authUser } = useGetAuthUserQuery();
  const isTenant = authUser?.userRole === "tenant";
  const cognitoId = authUser?.cognitoInfo.userId ?? "";

  const { data: tenant } = useGetTenantQuery(cognitoId, { skip: !isTenant });
  const [addFavorite] = useAddFavoritePropertyMutation();
  const [removeFavorite] = useRemoveFavoritePropertyMutation();

  const favoriteIds = useMemo(
    () => new Set((tenant?.favorites ?? []).map((p) => p.id)),
    [tenant],
  );

  const isFavorite = useCallback(
    (propertyId: number) => favoriteIds.has(propertyId),
    [favoriteIds],
  );

  const toggle = useCallback(
    async (propertyId: number) => {
      if (!authUser) {
        router.push(`/signin?next=${encodeURIComponent(pathname)}`);
        return;
      }
      if (!isTenant) {
        toast.info("Switch to a tenant account to save favorites.");
        return;
      }
      if (favoriteIds.has(propertyId)) {
        await removeFavorite({ cognitoId, propertyId });
      } else {
        await addFavorite({ cognitoId, propertyId });
      }
    },
    [authUser, isTenant, favoriteIds, cognitoId, addFavorite, removeFavorite, router, pathname],
  );

  return {
    tenant,
    favoriteIds,
    isFavorite,
    toggle,
    /** Show the heart for visitors and tenants; hide it for managers. */
    showFavoriteButton: !authUser || isTenant,
  };
}
