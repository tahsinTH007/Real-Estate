"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { debounce } from "lodash";
import { cleanParams } from "@/lib/utils";
import { setFilters, type FiltersState } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";

/** Serialise filters into the URL so searches are shareable and survive refresh. */
export function useFilterUrl() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const filters = useAppSelector((s) => s.global.filters);

  const updateUrl = useMemo(
    () =>
      debounce((next: FiltersState) => {
        const clean = cleanParams(next);
        const params = new URLSearchParams();
        Object.entries(clean).forEach(([key, value]) => {
          params.set(key, Array.isArray(value) ? value.join(",") : String(value));
        });
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
      }, 250),
    [router, pathname],
  );

  useEffect(() => () => updateUrl.cancel(), [updateUrl]);

  const applyFilters = useCallback(
    (partial: Partial<FiltersState>) => {
      const next = { ...filters, ...partial };
      dispatch(setFilters(partial));
      updateUrl(next);
    },
    [filters, dispatch, updateUrl],
  );

  return { filters, applyFilters };
}

/** Number of non-default filters currently active (for the badge). */
export function countActiveFilters(f: FiltersState) {
  let n = 0;
  if (f.beds !== "any") n++;
  if (f.baths !== "any") n++;
  if (f.propertyType !== "any") n++;
  if (f.amenities.length) n++;
  if (f.availableFrom !== "any") n++;
  if (f.priceRange[0] !== null || f.priceRange[1] !== null) n++;
  if (f.squareFeet[0] !== null || f.squareFeet[1] !== null) n++;
  return n;
}
