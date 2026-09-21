"use client";

import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { List, Map as MapIcon } from "lucide-react";
import Loading from "@/components/Loading";
import { Button } from "@/components/ui/button";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cleanParams, cn } from "@/lib/utils";
import { setFilters, type FiltersState } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import FiltersBar from "./FiltersBar";
import FiltersFull from "./FiltersFull";
import Listings from "./Listings";

const Map = dynamic(() => import("./Map"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse rounded-2xl bg-sand-200" />,
});

/** Parse ?query params into a partial FiltersState. */
function filtersFromParams(params: URLSearchParams): Partial<FiltersState> {
  const parsed: Record<string, unknown> = {};
  params.forEach((value, key) => {
    if (key === "priceRange" || key === "squareFeet") {
      parsed[key] = value.split(",").map((v) => (v === "" || v === "null" ? null : Number(v)));
    } else if (key === "coordinates") {
      parsed[key] = value.split(",").map(Number);
    } else if (key === "amenities") {
      parsed[key] = value.split(",").filter(Boolean);
    } else {
      parsed[key] = value;
    }
  });
  return cleanParams(parsed) as Partial<FiltersState>;
}

const SearchPageInner = () => {
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const isFiltersFullOpen = useAppSelector((s) => s.global.isFiltersFullOpen);
  const [mobileView, setMobileView] = useState<"list" | "map">("list");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    dispatch(setFilters(filtersFromParams(searchParams)));
    setReady(true);
    // Only hydrate from the URL on first load; the filter bar owns the URL after that.
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return <Loading />;

  return (
    <div
      className="flex flex-col"
      style={{ height: `calc(100vh - ${NAVBAR_HEIGHT}px)` }}
    >
      <FiltersBar />

      <div className="relative flex min-h-0 flex-1 gap-4 px-4 pb-4 sm:px-6">
        {/* Full filters panel */}
        <aside
          className={cn(
            "hidden shrink-0 overflow-hidden transition-all duration-300 lg:block",
            isFiltersFullOpen ? "w-[340px] opacity-100" : "w-0 opacity-0",
          )}
        >
          <div className="surface h-full w-[340px] overflow-y-auto">
            <FiltersFull />
          </div>
        </aside>

        {/* Listings */}
        <section
          className={cn(
            "min-w-0 flex-1 overflow-y-auto pr-1 lg:basis-[46%] lg:flex-none",
            mobileView === "map" && "hidden lg:block",
          )}
        >
          <Listings />
        </section>

        {/* Map */}
        <section
          className={cn(
            "relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-sand-200 shadow-card",
            mobileView === "list" && "hidden lg:block",
          )}
        >
          <Map />
        </section>

        {/* Mobile toggle */}
        <div className="pointer-events-none absolute inset-x-0 bottom-6 flex justify-center lg:hidden">
          <Button
            size="lg"
            className="pointer-events-auto rounded-full shadow-pill"
            onClick={() => setMobileView((v) => (v === "list" ? "map" : "list"))}
          >
            {mobileView === "list" ? (
              <>
                <MapIcon /> Show map
              </>
            ) : (
              <>
                <List /> Show list
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

const SearchPage = () => (
  <Suspense fallback={<Loading />}>
    <SearchPageInner />
  </Suspense>
);

export default SearchPage;
