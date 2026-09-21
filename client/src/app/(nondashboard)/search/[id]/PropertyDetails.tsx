"use client";

import { Car, CircleHelp, PawPrint, Receipt } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AmenityIcons, HighlightIcons } from "@/lib/constants";
import { formatCurrency, formatEnumString } from "@/lib/utils";
import type { Property } from "@/types/models";

const PropertyDetails = ({ property }: { property: Property }) => {
  return (
    <div className="space-y-12">
      {/* Amenities */}
      <section>
        <h2 className="text-lg font-semibold text-ink">Amenities</h2>
        <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {property.amenities.map((amenity) => {
            const Icon = AmenityIcons[amenity] ?? CircleHelp;
            return (
              <li
                key={amenity}
                className="flex items-center gap-3 rounded-xl border border-sand-200 bg-white px-3.5 py-3 text-sm text-ink"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
                  <Icon className="h-4 w-4" />
                </span>
                {formatEnumString(amenity)}
              </li>
            );
          })}
        </ul>
      </section>

      {/* Highlights */}
      <section>
        <h2 className="text-lg font-semibold text-ink">Highlights</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {property.highlights.map((highlight) => {
            const Icon = HighlightIcons[highlight] ?? CircleHelp;
            return (
              <span
                key={highlight}
                className="inline-flex items-center gap-1.5 rounded-full border border-sand-200 bg-sand-50 px-3 py-1.5 text-xs font-medium text-ink-muted"
              >
                <Icon className="h-3.5 w-3.5 text-brand-700" />
                {formatEnumString(highlight)}
              </span>
            );
          })}
        </div>
      </section>

      {/* Fees & policies */}
      <section>
        <h2 className="text-lg font-semibold text-ink">Fees & policies</h2>
        <p className="mt-1 text-sm text-ink-soft">
          Based on data provided by the property. Utilities may not be included.
        </p>
        <Tabs defaultValue="fees" className="mt-5">
          <TabsList>
            <TabsTrigger value="fees">
              <Receipt className="h-4 w-4" /> Move-in fees
            </TabsTrigger>
            <TabsTrigger value="pets">
              <PawPrint className="h-4 w-4" /> Pets
            </TabsTrigger>
            <TabsTrigger value="parking">
              <Car className="h-4 w-4" /> Parking
            </TabsTrigger>
          </TabsList>

          <TabsContent value="fees" className="mt-4">
            <dl className="divide-y divide-sand-200 overflow-hidden rounded-2xl border border-sand-200 bg-white">
              {[
                { label: "First month's rent", value: property.pricePerMonth },
                { label: "Security deposit", value: property.securityDeposit },
                { label: "Application fee", value: property.applicationFee },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between px-4 py-3 text-sm">
                  <dt className="text-ink-muted">{row.label}</dt>
                  <dd className="font-semibold text-ink">{formatCurrency(row.value)}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between bg-sand-50 px-4 py-3 text-sm">
                <dt className="font-semibold text-ink">Total due at move-in</dt>
                <dd className="font-bold text-brand-800">
                  {formatCurrency(
                    property.pricePerMonth + property.securityDeposit + property.applicationFee,
                  )}
                </dd>
              </div>
            </dl>
          </TabsContent>

          <TabsContent value="pets" className="mt-4">
            <div className="rounded-2xl border border-sand-200 bg-white p-5 text-sm">
              {property.isPetsAllowed ? (
                <>
                  <p className="font-semibold text-ink">Pets are welcome</p>
                  <p className="mt-1 text-ink-muted">
                    Cats and dogs are allowed. Ask the manager about any breed or weight limits and pet deposits.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-ink">No pets</p>
                  <p className="mt-1 text-ink-muted">
                    This property does not allow pets, with the exception of registered assistance animals.
                  </p>
                </>
              )}
            </div>
          </TabsContent>

          <TabsContent value="parking" className="mt-4">
            <div className="rounded-2xl border border-sand-200 bg-white p-5 text-sm">
              {property.isParkingIncluded ? (
                <>
                  <p className="font-semibold text-ink">Parking included</p>
                  <p className="mt-1 text-ink-muted">
                    At least one dedicated parking space is included with the lease at no extra cost.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold text-ink">Street parking only</p>
                  <p className="mt-1 text-ink-muted">
                    No dedicated parking is included. Check local permit requirements for street parking.
                  </p>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
};

export default PropertyDetails;
