"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Sparkles } from "lucide-react";
import { CustomFormField } from "@/components/FormField";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import {
  AMENITIES,
  AmenityIcons,
  HIGHLIGHTS,
  HighlightIcons,
  PROPERTY_TYPES,
  PropertyTypeIcons,
  PropertyTypeLabels,
} from "@/lib/constants";
import { geocode } from "@/lib/geocode";
import { propertySchema, type PropertyFormData } from "@/lib/schemas";
import { formatEnumString } from "@/lib/utils";
import { useCreatePropertyMutation, useGetAuthUserQuery } from "@/state/api";

const Section = ({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) => (
  <section className="grid gap-6 py-8 first:pt-0 last:pb-0 lg:grid-cols-[260px_minmax(0,1fr)]">
    <div>
      <h2 className="text-base font-semibold text-ink">{title}</h2>
      {description && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{description}</p>}
    </div>
    <div className="space-y-5">{children}</div>
  </section>
);

const NewProperty = () => {
  const router = useRouter();
  const [createProperty] = useCreatePropertyMutation();
  const { data: authUser } = useGetAuthUserQuery();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      name: "",
      description: "",
      pricePerMonth: 2500,
      securityDeposit: 2500,
      applicationFee: 40,
      isPetsAllowed: true,
      isParkingIncluded: true,
      photoUrls: [],
      amenities: [],
      highlights: [],
      beds: 1,
      baths: 1,
      squareFeet: 800,
      propertyType: "Apartment",
      address: "",
      city: "",
      state: "",
      country: "United States",
      postalCode: "",
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    if (!authUser?.cognitoInfo.userId) return;
    setSubmitting(true);
    try {
      // Resolve coordinates so the listing shows up on the map.
      const geo = await geocode(`${data.address}, ${data.city}, ${data.state}`);
      const fallback = await (geo ? null : geocode(`${data.city}, ${data.state}`));
      const coords = geo?.coordinates ?? fallback?.coordinates ?? [0, 0];

      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "photoUrls") {
          (value as File[]).forEach((file) => formData.append("photos", file));
        } else if (Array.isArray(value)) {
          formData.append(key, value.join(","));
        } else {
          formData.append(key, String(value));
        }
      });
      formData.append("managerCognitoId", authUser.cognitoInfo.userId);
      formData.append("longitude", String(coords[0]));
      formData.append("latitude", String(coords[1]));

      const created = await createProperty(formData).unwrap();
      router.push(`/managers/properties/${created.id}`);
    } catch {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-container">
      <Header
        title="List a new property"
        subtitle="Fill in the details below — you can edit everything later."
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="surface divide-y divide-sand-200 p-6 sm:p-8">
          <Section
            title="The basics"
            description="A clear name and an honest description are the best way to attract good applicants."
          >
            <CustomFormField name="name" label="Listing title" placeholder="e.g. Sunny Silver Lake loft with reservoir views" />
            <CustomFormField
              name="description"
              label="Description"
              type="textarea"
              placeholder="Describe the layout, light, neighborhood, transit and anything that makes it special."
            />
            <CustomFormField
              name="propertyType"
              label="Home type"
              type="select"
              options={PROPERTY_TYPES.map((t) => ({
                value: t,
                label: PropertyTypeLabels[t],
                icon: PropertyTypeIcons[t],
              }))}
            />
          </Section>

          <Section title="Size & layout">
            <div className="grid gap-5 sm:grid-cols-3">
              <CustomFormField name="beds" label="Bedrooms" type="number" min={0} description="0 for a studio" />
              <CustomFormField name="baths" label="Bathrooms" type="number" step={0.5} min={0.5} />
              <CustomFormField name="squareFeet" label="Square feet" type="number" min={1} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <CustomFormField name="isPetsAllowed" label="Pets allowed" type="switch" />
              <CustomFormField name="isParkingIncluded" label="Parking included" type="switch" />
            </div>
          </Section>

          <Section
            title="Pricing"
            description="Renters see all fees up front, so keep them accurate."
          >
            <div className="grid gap-5 sm:grid-cols-3">
              <CustomFormField name="pricePerMonth" label="Monthly rent" type="number" prefix="$" min={0} />
              <CustomFormField name="securityDeposit" label="Security deposit" type="number" prefix="$" min={0} />
              <CustomFormField name="applicationFee" label="Application fee" type="number" prefix="$" min={0} />
            </div>
          </Section>

          <Section
            title="Amenities & highlights"
            description="Select everything that applies. These power the search filters."
          >
            <CustomFormField
              name="amenities"
              label="Amenities"
              type="multi-select"
              options={AMENITIES.map((a) => ({
                value: a,
                label: formatEnumString(a),
                icon: AmenityIcons[a],
              }))}
            />
            <CustomFormField
              name="highlights"
              label="Highlights"
              type="multi-select"
              options={HIGHLIGHTS.map((h) => ({
                value: h,
                label: formatEnumString(h),
                icon: HighlightIcons[h],
              }))}
            />
          </Section>

          <Section
            title="Photos"
            description="Listings with 4+ bright photos get roughly twice as many applications."
          >
            <CustomFormField name="photoUrls" label="Upload photos" type="file" />
          </Section>

          <Section
            title="Address"
            description="We'll place the home on the map from this address."
          >
            <CustomFormField name="address" label="Street address" placeholder="2412 Griffith Park Blvd" />
            <div className="grid gap-5 sm:grid-cols-3">
              <CustomFormField name="city" label="City" placeholder="Los Angeles" />
              <CustomFormField name="state" label="State" placeholder="CA" />
              <CustomFormField name="postalCode" label="Postal code" placeholder="90039" />
            </div>
            <CustomFormField name="country" label="Country" />
          </Section>

          <div className="flex flex-col-reverse gap-3 pt-8 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-ink-faint">
              By publishing you confirm the information is accurate and you have the right to rent this property.
            </p>
            <Button type="submit" size="lg" disabled={submitting} className="sm:min-w-48">
              {submitting ? <Loader2 className="animate-spin" /> : <Sparkles />}
              Publish listing
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default NewProperty;
