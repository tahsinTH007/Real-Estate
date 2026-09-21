"use client";

import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  AMENITIES,
  AmenityIcons,
  PROPERTY_TYPES,
  PropertyTypeIcons,
  PropertyTypeLabels,
} from "@/lib/constants";
import { cn, formatCurrency, formatEnumString } from "@/lib/utils";
import { initialState, setFiltersFullOpen, type FiltersState } from "@/state";
import { useAppDispatch } from "@/state/redux";
import { useFilterUrl } from "./useFilterUrl";

const PRICE_MAX = 200000;
const SQFT_MAX = 4000;

interface FiltersFullProps {
  onApplied?: () => void;
}

const FiltersFull = ({ onApplied }: FiltersFullProps) => {
  const dispatch = useAppDispatch();
  const { filters, applyFilters } = useFilterUrl();
  const [local, setLocal] = useState<FiltersState>(filters);

  // Keep the draft in sync when the applied filters change elsewhere.
  useEffect(() => setLocal(filters), [filters]);

  const update = (partial: Partial<FiltersState>) =>
    setLocal((prev) => ({ ...prev, ...partial }));

  const apply = () => {
    applyFilters(local);
    onApplied?.();
  };

  const reset = () => {
    const cleared = {
      ...initialState.filters,
      location: filters.location,
      coordinates: filters.coordinates,
    };
    setLocal(cleared);
    applyFilters(cleared);
  };

  const price: [number, number] = [local.priceRange[0] ?? 0, local.priceRange[1] ?? PRICE_MAX];
  const sqft: [number, number] = [local.squareFeet[0] ?? 0, local.squareFeet[1] ?? SQFT_MAX];

  const toggleAmenity = (amenity: string) =>
    update({
      amenities: local.amenities.includes(amenity)
        ? local.amenities.filter((a) => a !== amenity)
        : [...local.amenities, amenity],
    });

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-sand-200 px-5 py-4">
        <h2 className="text-base font-semibold text-ink">All filters</h2>
        <Button
          variant="ghost"
          size="icon-sm"
          className="hidden lg:inline-flex"
          onClick={() => dispatch(setFiltersFullOpen(false))}
          aria-label="Close filters"
        >
          <X />
        </Button>
      </div>

      <div className="flex-1 space-y-8 overflow-y-auto px-5 py-6">
        {/* Property type */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-ink">Home type</h3>
          <div className="grid grid-cols-3 gap-2">
            {PROPERTY_TYPES.map((type) => {
              const Icon = PropertyTypeIcons[type];
              const active = local.propertyType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => update({ propertyType: active ? "any" : type })}
                  className={cn(
                    "flex flex-col items-center gap-1.5 rounded-xl border px-2 py-3 text-xs font-medium transition-all",
                    active
                      ? "border-brand-600 bg-brand-50 text-brand-800"
                      : "border-sand-200 bg-white text-ink-muted hover:border-sand-300 hover:bg-sand-50",
                  )}
                >
                  <Icon className="h-5 w-5" />
                  {PropertyTypeLabels[type]}
                </button>
              );
            })}
          </div>
        </section>

        {/* Price */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Monthly rent</h3>
            <span className="text-xs font-medium text-ink-muted">
              {formatCurrency(price[0])} – {formatCurrency(price[1])}
              {price[1] === PRICE_MAX && "+"}
            </span>
          </div>
          <Slider
            min={0}
            max={PRICE_MAX}
            step={1000}
            value={price}
            onValueChange={([min, max]) =>
              update({
                priceRange: [min === 0 ? null : min, max === PRICE_MAX ? null : max],
              })
            }
          />
        </section>

        {/* Beds & baths */}
        <section className="grid grid-cols-2 gap-4">
          {(
            [
              { key: "beds", label: "Bedrooms", options: ["any", "1", "2", "3", "4"] },
              { key: "baths", label: "Bathrooms", options: ["any", "1", "2", "3"] },
            ] as const
          ).map((group) => (
            <div key={group.key}>
              <h3 className="mb-3 text-sm font-semibold text-ink">{group.label}</h3>
              <div className="flex flex-wrap gap-1.5">
                {group.options.map((opt) => {
                  const active = local[group.key] === opt;
                  return (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => update({ [group.key]: opt })}
                      className={cn(
                        "h-8 min-w-9 rounded-full border px-2.5 text-xs font-medium transition-all",
                        active
                          ? "border-ink bg-ink text-white"
                          : "border-sand-200 bg-white text-ink-muted hover:border-sand-300",
                      )}
                    >
                      {opt === "any" ? "Any" : `${opt}+`}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </section>

        {/* Square feet */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-ink">Size</h3>
            <span className="text-xs font-medium text-ink-muted">
              {sqft[0].toLocaleString()} – {sqft[1].toLocaleString()}
              {sqft[1] === SQFT_MAX && "+"} sq ft
            </span>
          </div>
          <Slider
            min={0}
            max={SQFT_MAX}
            step={50}
            value={sqft}
            onValueChange={([min, max]) =>
              update({
                squareFeet: [min === 0 ? null : min, max === SQFT_MAX ? null : max],
              })
            }
          />
        </section>

        {/* Amenities */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-ink">Amenities</h3>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((amenity) => {
              const Icon = AmenityIcons[amenity];
              const active = local.amenities.includes(amenity);
              return (
                <button
                  key={amenity}
                  type="button"
                  onClick={() => toggleAmenity(amenity)}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                    active
                      ? "border-brand-600 bg-brand-50 text-brand-800"
                      : "border-sand-200 bg-white text-ink-muted hover:border-sand-300 hover:bg-sand-50",
                  )}
                >
                  {active ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : <Icon className="h-3.5 w-3.5" />}
                  {formatEnumString(amenity)}
                </button>
              );
            })}
          </div>
        </section>

        {/* Available from */}
        <section>
          <h3 className="mb-3 text-sm font-semibold text-ink">Move-in date</h3>
          <Input
            type="date"
            value={local.availableFrom !== "any" ? local.availableFrom : ""}
            onChange={(e) => update({ availableFrom: e.target.value || "any" })}
          />
          <p className="mt-1.5 text-xs text-ink-faint">
            Only show homes that are free on this date.
          </p>
        </section>
      </div>

      <div className="flex gap-2 border-t border-sand-200 bg-white px-5 py-4">
        <Button variant="outline" className="flex-1" onClick={reset}>
          Reset
        </Button>
        <Button className="flex-1" onClick={apply}>
          Show results
        </Button>
      </div>
    </div>
  );
};

export default FiltersFull;
