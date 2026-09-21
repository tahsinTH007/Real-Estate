import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface FiltersState {
  location: string;
  beds: string;
  baths: string;
  propertyType: string;
  amenities: string[];
  availableFrom: string;
  priceRange: [number | null, number | null];
  squareFeet: [number | null, number | null];
  coordinates: [number, number]; // [lng, lat]
}

export type SortBy = "recommended" | "price-asc" | "price-desc" | "newest" | "rating";

interface InitialStateTypes {
  filters: FiltersState;
  isFiltersFullOpen: boolean;
  viewMode: "grid" | "list";
  sortBy: SortBy;
  /** Property currently hovered in the list / map, for cross-highlighting. */
  activePropertyId: number | null;
}

export const initialState: InitialStateTypes = {
  filters: {
    location: "Dhaka, Bangladesh",
    beds: "any",
    baths: "any",
    propertyType: "any",
    amenities: [],
    availableFrom: "any",
    priceRange: [null, null],
    squareFeet: [null, null],
    coordinates: [90.4125, 23.8103],
  },
  isFiltersFullOpen: false,
  viewMode: "list",
  sortBy: "recommended",
  activePropertyId: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<FiltersState>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetFilters: (state) => {
      state.filters = {
        ...initialState.filters,
        location: state.filters.location,
        coordinates: state.filters.coordinates,
      };
    },
    toggleFiltersFullOpen: (state) => {
      state.isFiltersFullOpen = !state.isFiltersFullOpen;
    },
    setFiltersFullOpen: (state, action: PayloadAction<boolean>) => {
      state.isFiltersFullOpen = action.payload;
    },
    setViewMode: (state, action: PayloadAction<"grid" | "list">) => {
      state.viewMode = action.payload;
    },
    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload;
    },
    setActiveProperty: (state, action: PayloadAction<number | null>) => {
      state.activePropertyId = action.payload;
    },
  },
});

export const {
  setFilters,
  resetFilters,
  toggleFiltersFullOpen,
  setFiltersFullOpen,
  setViewMode,
  setSortBy,
  setActiveProperty,
} = globalSlice.actions;

export default globalSlice.reducer;
