import {
  Bath,
  Building2,
  Bus,
  Cable,
  Car,
  Castle,
  CigaretteOff,
  Dumbbell,
  Flame,
  Hammer,
  Home,
  LucideIcon,
  Maximize,
  Microwave,
  Mountain,
  PawPrint,
  Phone,
  Refrigerator,
  Rows3,
  Snowflake,
  Sprout,
  Trees,
  Tv,
  Utensils,
  VolumeX,
  Warehouse,
  WashingMachine,
  Waves,
  Wifi,
} from "lucide-react";
import type { Amenity, Highlight, PropertyType } from "@/types/models";

export const AMENITIES: Amenity[] = [
  "WasherDryer",
  "AirConditioning",
  "Dishwasher",
  "HighSpeedInternet",
  "HardwoodFloors",
  "WalkInClosets",
  "Microwave",
  "Refrigerator",
  "Pool",
  "Gym",
  "Parking",
  "PetsAllowed",
  "WiFi",
];

export const AmenityIcons: Record<Amenity, LucideIcon> = {
  WasherDryer: WashingMachine,
  AirConditioning: Snowflake,
  Dishwasher: Utensils,
  HighSpeedInternet: Wifi,
  HardwoodFloors: Rows3,
  WalkInClosets: Maximize,
  Microwave: Microwave,
  Refrigerator: Refrigerator,
  Pool: Waves,
  Gym: Dumbbell,
  Parking: Car,
  PetsAllowed: PawPrint,
  WiFi: Wifi,
};

export const HIGHLIGHTS: Highlight[] = [
  "HighSpeedInternetAccess",
  "WasherDryer",
  "AirConditioning",
  "Heating",
  "SmokeFree",
  "CableReady",
  "SatelliteTV",
  "DoubleVanities",
  "TubShower",
  "Intercom",
  "SprinklerSystem",
  "RecentlyRenovated",
  "CloseToTransit",
  "GreatView",
  "QuietNeighborhood",
];

export const HighlightIcons: Record<Highlight, LucideIcon> = {
  HighSpeedInternetAccess: Wifi,
  WasherDryer: WashingMachine,
  AirConditioning: Snowflake,
  Heating: Flame,
  SmokeFree: CigaretteOff,
  CableReady: Cable,
  SatelliteTV: Tv,
  DoubleVanities: Maximize,
  TubShower: Bath,
  Intercom: Phone,
  SprinklerSystem: Sprout,
  RecentlyRenovated: Hammer,
  CloseToTransit: Bus,
  GreatView: Mountain,
  QuietNeighborhood: VolumeX,
};

export const PROPERTY_TYPES: PropertyType[] = [
  "Apartment",
  "Townhouse",
  "Villa",
  "Cottage",
  "Tinyhouse",
  "Rooms",
];

export const PropertyTypeIcons: Record<PropertyType, LucideIcon> = {
  Rooms: Home,
  Tinyhouse: Warehouse,
  Apartment: Building2,
  Villa: Castle,
  Townhouse: Home,
  Cottage: Trees,
};

export const PropertyTypeLabels: Record<PropertyType, string> = {
  Rooms: "Studio / Room",
  Tinyhouse: "Tiny house",
  Apartment: "Apartment",
  Villa: "Villa",
  Townhouse: "Townhouse",
  Cottage: "Cottage",
};

export const NAVBAR_HEIGHT = 64; // px

/** Quick-fill accounts shown on the sign-in page in mock mode. */
export const DEMO_ACCOUNTS = [
  {
    role: "tenant" as const,
    label: "Tenant",
    name: "Sadia Rahman",
    email: "sadia@rentiful.bd",
    description: "Browse listings, save favorites, apply and track a lease.",
  },
  {
    role: "manager" as const,
    label: "Manager",
    name: "Md. Rahim Chowdhury",
    email: "rahim@rentiful.bd",
    description: "Manage Dhaka listings, review applications and tenants.",
  },
];
