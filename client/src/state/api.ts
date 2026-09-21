import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import { auth } from "@/lib/auth";
import { API_BASE_URL, IS_MOCK } from "@/lib/config";
import { cleanParams, withToast } from "@/lib/utils";
import { mockBaseQuery } from "@/mock/baseQuery";
import type {
  Application,
  AuthUser,
  Lease,
  Manager,
  Payment,
  Property,
  Tenant,
} from "@/types/models";
import type { FiltersState } from ".";

export type LeaseWithPayments = Lease & { payments?: Payment[] };

const apiBaseQuery = fetchBaseQuery({
  baseUrl: API_BASE_URL,
  prepareHeaders: async (headers) => {
    const session = await auth.getSession();
    if (session?.idToken) {
      headers.set("Authorization", `Bearer ${session.idToken}`);
    }
    return headers;
  },
});

const baseQuery: BaseQueryFn<string | FetchArgs, unknown, unknown> = IS_MOCK
  ? mockBaseQuery
  : apiBaseQuery;

export const api = createApi({
  baseQuery,
  reducerPath: "api",
  tagTypes: [
    "AuthUser",
    "Managers",
    "Tenants",
    "Properties",
    "PropertyDetails",
    "Leases",
    "Payments",
    "Applications",
  ],
  endpoints: (build) => ({
    getAuthUser: build.query<AuthUser | null, void>({
      providesTags: ["AuthUser"],
      queryFn: async (_, _api, _extra, fetchWithBQ) => {
        try {
          const session = await auth.getSession();
          if (!session) return { data: null };

          const base = session.role === "manager" ? "managers" : "tenants";
          let res = await fetchWithBQ(`${base}/${session.userId}`);

          // First sign-in: create the profile row for this Cognito user.
          if (res.error && (res.error as { status?: number }).status === 404) {
            res = await fetchWithBQ({
              url: base,
              method: "POST",
              body: {
                cognitoId: session.userId,
                name: session.username,
                email: session.email,
                phoneNumber: "",
              },
            });
          }
          if (res.error) return { error: res.error };

          return {
            data: {
              cognitoInfo: {
                userId: session.userId,
                username: session.username,
                email: session.email,
              },
              userInfo: res.data as Tenant | Manager,
              userRole: session.role,
            },
          };
        } catch (err) {
          return {
            error: {
              status: 500,
              data: { message: (err as Error).message || "Could not load user" },
            },
          };
        }
      },
    }),

    /* ---------------- properties ---------------- */
    getProperties: build.query<
      Property[],
      Partial<FiltersState> & { favoriteIds?: number[] }
    >({
      query: (filters) => {
        const params = cleanParams({
          location: filters.location,
          priceMin: filters.priceRange?.[0],
          priceMax: filters.priceRange?.[1],
          beds: filters.beds,
          baths: filters.baths,
          propertyType: filters.propertyType,
          squareFeetMin: filters.squareFeet?.[0],
          squareFeetMax: filters.squareFeet?.[1],
          amenities: filters.amenities?.join(","),
          availableFrom: filters.availableFrom,
          favoriteIds: filters.favoriteIds?.join(","),
          latitude: filters.coordinates?.[1],
          longitude: filters.coordinates?.[0],
        });
        return { url: "properties", params };
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch properties." });
      },
    }),

    getProperty: build.query<Property, number>({
      query: (id) => `properties/${id}`,
      providesTags: (_r, _e, id) => [{ type: "PropertyDetails", id }],
    }),

    getPropertyLeases: build.query<LeaseWithPayments[], number>({
      query: (propertyId) => `properties/${propertyId}/leases`,
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch property leases." });
      },
    }),

    createProperty: build.mutation<Property, FormData>({
      query: (newProperty) => ({
        url: "properties",
        method: "POST",
        body: newProperty,
      }),
      invalidatesTags: (result) => [
        { type: "Properties", id: "LIST" },
        { type: "Managers", id: result?.manager?.id },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Property published!",
          error: "Failed to create property.",
        });
      },
    }),

    /* ---------------- tenants ---------------- */
    getTenant: build.query<Tenant, string>({
      query: (cognitoId) => `tenants/${cognitoId}`,
      providesTags: (result) => [{ type: "Tenants", id: result?.id }],
    }),

    getCurrentResidences: build.query<Property[], string>({
      query: (cognitoId) => `tenants/${cognitoId}/current-residences`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch current residences." });
      },
    }),

    updateTenantSettings: build.mutation<
      Tenant,
      { cognitoId: string } & Partial<Tenant>
    >({
      query: ({ cognitoId, ...updatedTenant }) => ({
        url: `tenants/${cognitoId}`,
        method: "PUT",
        body: updatedTenant,
      }),
      invalidatesTags: (result) => [{ type: "Tenants", id: result?.id }, "AuthUser"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Settings saved.",
          error: "Failed to update settings.",
        });
      },
    }),

    addFavoriteProperty: build.mutation<
      Tenant,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: "POST",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Saved to favorites.",
          error: "Failed to add to favorites.",
        });
      },
    }),

    removeFavoriteProperty: build.mutation<
      Tenant,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result) => [
        { type: "Tenants", id: result?.id },
        { type: "Properties", id: "LIST" },
      ],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Removed from favorites.",
          error: "Failed to remove from favorites.",
        });
      },
    }),

    /* ---------------- managers ---------------- */
    getManagerProperties: build.query<Property[], string>({
      query: (cognitoId) => `managers/${cognitoId}/properties`,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: "Properties" as const, id })),
              { type: "Properties", id: "LIST" },
            ]
          : [{ type: "Properties", id: "LIST" }],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to load your properties." });
      },
    }),

    updateManagerSettings: build.mutation<
      Manager,
      { cognitoId: string } & Partial<Manager>
    >({
      query: ({ cognitoId, ...updatedManager }) => ({
        url: `managers/${cognitoId}`,
        method: "PUT",
        body: updatedManager,
      }),
      invalidatesTags: (result) => [{ type: "Managers", id: result?.id }, "AuthUser"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Settings saved.",
          error: "Failed to update settings.",
        });
      },
    }),

    /* ---------------- leases & payments ---------------- */
    getLeases: build.query<Lease[], void>({
      query: () => "leases",
      providesTags: ["Leases"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch leases." });
      },
    }),

    getPayments: build.query<Payment[], number>({
      query: (leaseId) => `leases/${leaseId}/payments`,
      providesTags: ["Payments"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch payment info." });
      },
    }),

    /* ---------------- applications ---------------- */
    getApplications: build.query<
      Application[],
      { userId?: string; userType?: string }
    >({
      query: (params) => {
        const queryParams = new URLSearchParams();
        if (params.userId) queryParams.append("userId", params.userId);
        if (params.userType) queryParams.append("userType", params.userType);
        return `applications?${queryParams.toString()}`;
      },
      providesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, { error: "Failed to fetch applications." });
      },
    }),

    updateApplicationStatus: build.mutation<
      Application,
      { id: number; status: string }
    >({
      query: ({ id, status }) => ({
        url: `applications/${id}/status`,
        method: "PUT",
        body: { status },
      }),
      invalidatesTags: ["Applications", "Leases", { type: "Properties", id: "LIST" }],
      async onQueryStarted({ status }, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: `Application ${status.toLowerCase()}.`,
          error: "Failed to update application.",
        });
      },
    }),

    createApplication: build.mutation<Application, Partial<Application>>({
      query: (body) => ({
        url: "applications",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Applications"],
      async onQueryStarted(_, { queryFulfilled }) {
        await withToast(queryFulfilled, {
          success: "Application submitted!",
          error: "Failed to submit application.",
        });
      },
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
  useGetPropertyQuery,
  useGetCurrentResidencesQuery,
  useGetManagerPropertiesQuery,
  useCreatePropertyMutation,
  useGetTenantQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetLeasesQuery,
  useGetPropertyLeasesQuery,
  useGetPaymentsQuery,
  useGetApplicationsQuery,
  useUpdateApplicationStatusMutation,
  useCreateApplicationMutation,
} = api;
