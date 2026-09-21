"use client";

import { useEffect, useState } from "react";
import {
  ArrowUpDown,
  LayoutGrid,
  Loader2,
  MapPin,
  Rows3,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { PROPERTY_TYPES, PropertyTypeIcons, PropertyTypeLabels } from "@/lib/constants";
import { geocode } from "@/lib/geocode";
import { cn, formatPriceValue } from "@/lib/utils";
import {
  resetFilters,
  setSortBy,
  setViewMode,
  toggleFiltersFullOpen,
  type SortBy,
} from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import FiltersFull from "./FiltersFull";
import { countActiveFilters, useFilterUrl } from "./useFilterUrl";

const MIN_PRICES = [500, 1000, 1500, 2000, 3000, 5000, 8000];
const MAX_PRICES = [1000, 2000, 3000, 5000, 8000, 12000];

const sortOptions: { value: SortBy; label: string }[] = [
  { value: "recommended", label: "Recommended" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Top rated" },
];

const FiltersBar = () => {
  const dispatch = useAppDispatch();
  const { filters, applyFilters } = useFilterUrl();
  const isFiltersFullOpen = useAppSelector((s) => s.global.isFiltersFullOpen);
  const viewMode = useAppSelector((s) => s.global.viewMode);
  const sortBy = useAppSelector((s) => s.global.sortBy);
  const [searchInput, setSearchInput] = useState(filters.location);
  const [searching, setSearching] = useState(false);
  const [mobileFilters, setMobileFilters] = useState(false);

  useEffect(() => setSearchInput(filters.location), [filters.location]);

  const activeCount = countActiveFilters(filters);

  const handleLocationSearch = async () => {
    const q = searchInput.trim();
    if (!q) return;
    setSearching(true);
    const result = await geocode(q);
    setSearching(false);
    if (!result) {
      toast.error(`We couldn't find "${q}". Try a city name.`);
      return;
    }
    applyFilters({ location: result.label, coordinates: result.coordinates });
  };

  const setRange = (key: "priceRange", index: 0 | 1, value: string) => {
    const next = [...filters[key]] as [number | null, number | null];
    next[index] = value === "any" ? null : Number(value);
    applyFilters({ [key]: next } as Partial<typeof filters>);
  };

  const selectClass = "h-9 w-auto min-w-[7rem] rounded-full border-sand-300 bg-white text-xs font-medium";

  return (
    <div className="sticky top-0 z-30 border-b border-sand-200 bg-background/95 px-4 py-3 backdrop-blur sm:px-6">
      <div className="flex flex-wrap items-center gap-2">
        {/* Location */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLocationSearch();
          }}
          className="flex h-9 w-full items-center rounded-full border border-sand-300 bg-white pl-3 pr-1 shadow-sm focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20 sm:w-64"
        >
          <MapPin className="h-4 w-4 shrink-0 text-brand-700" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="City or neighborhood"
            className="h-full border-0 bg-transparent px-2 text-xs shadow-none focus-visible:ring-0"
            aria-label="Search location"
          />
          <button
            type="submit"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-700 text-white hover:bg-brand-800"
            aria-label="Search"
          >
            {searching ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Search className="h-3.5 w-3.5" />}
          </button>
        </form>

        {/* Quick filters (desktop) */}
        <div className="hidden items-center gap-2 md:flex">
          <Select
            value={filters.priceRange[0]?.toString() ?? "any"}
            onValueChange={(v) => setRange("priceRange", 0, v)}
          >
            <SelectTrigger className={selectClass}>
              <SelectValue>{formatPriceValue(filters.priceRange[0], true)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any min price</SelectItem>
              {MIN_PRICES.map((p) => (
                <SelectItem key={p} value={String(p)}>
                  ${p.toLocaleString()}+
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.priceRange[1]?.toString() ?? "any"}
            onValueChange={(v) => setRange("priceRange", 1, v)}
          >
            <SelectTrigger className={selectClass}>
              <SelectValue>{formatPriceValue(filters.priceRange[1], false)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any max price</SelectItem>
              {MAX_PRICES.map((p) => (
                <SelectItem key={p} value={String(p)}>
                  Up to ${p.toLocaleString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.beds} onValueChange={(v) => applyFilters({ beds: v })}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Beds" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any beds</SelectItem>
              {[1, 2, 3, 4].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}+ {n === 1 ? "bed" : "beds"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filters.baths} onValueChange={(v) => applyFilters({ baths: v })}>
            <SelectTrigger className={selectClass}>
              <SelectValue placeholder="Baths" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any baths</SelectItem>
              {[1, 2, 3].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n}+ {n === 1 ? "bath" : "baths"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.propertyType || "any"}
            onValueChange={(v) => applyFilters({ propertyType: v })}
          >
            <SelectTrigger className={cn(selectClass, "min-w-[8.5rem]")}>
              <SelectValue placeholder="Home type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any home type</SelectItem>
              {PROPERTY_TYPES.map((type) => {
                const Icon = PropertyTypeIcons[type];
                return (
                  <SelectItem key={type} value={type}>
                    <span className="flex items-center gap-2">
                      <Icon className="h-4 w-4 text-ink-soft" />
                      {PropertyTypeLabels[type]}
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* All filters */}
        <Button
          variant={isFiltersFullOpen ? "default" : "outline"}
          size="sm"
          className="hidden h-9 rounded-full lg:inline-flex"
          onClick={() => dispatch(toggleFiltersFullOpen())}
        >
          <SlidersHorizontal />
          All filters
          {activeCount > 0 && (
            <span
              className={cn(
                "ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold",
                isFiltersFullOpen ? "bg-white text-brand-800" : "bg-brand-700 text-white",
              )}
            >
              {activeCount}
            </span>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="h-9 rounded-full lg:hidden"
          onClick={() => setMobileFilters(true)}
        >
          <SlidersHorizontal />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-700 px-1.5 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </Button>

        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-9 rounded-full text-ink-soft"
            onClick={() => {
              dispatch(resetFilters());
              applyFilters({});
            }}
          >
            <X /> Clear
          </Button>
        )}

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">
          <Select value={sortBy} onValueChange={(v) => dispatch(setSortBy(v as SortBy))}>
            <SelectTrigger className={cn(selectClass, "gap-1.5")}>
              <ArrowUpDown className="h-3.5 w-3.5 text-ink-soft" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {sortOptions.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="hidden h-9 items-center rounded-full border border-sand-300 bg-white p-0.5 sm:flex">
            {(
              [
                { mode: "list", icon: Rows3, label: "List view" },
                { mode: "grid", icon: LayoutGrid, label: "Grid view" },
              ] as const
            ).map(({ mode, icon: Icon, label }) => (
              <button
                key={mode}
                type="button"
                aria-label={label}
                aria-pressed={viewMode === mode}
                onClick={() => dispatch(setViewMode(mode))}
                className={cn(
                  "flex h-7 w-8 items-center justify-center rounded-full transition-colors",
                  viewMode === mode ? "bg-ink text-white" : "text-ink-soft hover:text-ink",
                )}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <Sheet open={mobileFilters} onOpenChange={setMobileFilters}>
        <SheetContent side="left" className="w-full p-0 sm:max-w-md">
          <SheetTitle className="sr-only">Filters</SheetTitle>
          <div className="h-full overflow-y-auto">
            <FiltersFull onApplied={() => setMobileFilters(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FiltersBar;
