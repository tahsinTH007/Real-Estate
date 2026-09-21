/**
 * API data models.
 *
 * These describe the JSON shapes the client actually receives from the API
 * (mock or Express), which differ from the raw Prisma models — e.g. the
 * server flattens PostGIS coordinates into `location.coordinates`.
 */

export type Highlight =
  | "HighSpeedInternetAccess"
  | "WasherDryer"
  | "AirConditioning"
  | "Heating"
  | "SmokeFree"
  | "CableReady"
  | "SatelliteTV"
  | "DoubleVanities"
  | "TubShower"
  | "Intercom"
  | "SprinklerSystem"
  | "RecentlyRenovated"
  | "CloseToTransit"
  | "GreatView"
  | "QuietNeighborhood";

export type Amenity =
  | "WasherDryer"
  | "AirConditioning"
  | "Dishwasher"
  | "HighSpeedInternet"
  | "HardwoodFloors"
  | "WalkInClosets"
  | "Microwave"
  | "Refrigerator"
  | "Pool"
  | "Gym"
  | "Parking"
  | "PetsAllowed"
  | "WiFi";

export type PropertyType =
  | "Rooms"
  | "Tinyhouse"
  | "Apartment"
  | "Villa"
  | "Townhouse"
  | "Cottage";

export type ApplicationStatus = "Pending" | "Denied" | "Approved";

export type PaymentStatus = "Pending" | "Paid" | "PartiallyPaid" | "Overdue";

export type UserRole = "tenant" | "manager";

export interface Coordinates {
  longitude: number;
  latitude: number;
}

export interface Location {
  id: number;
  address: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  coordinates: Coordinates;
}

export interface Manager {
  id: number;
  cognitoId: string;
  name: string;
  email: string;
  phoneNumber: string;
  image?: string;
}

export interface Tenant {
  id: number;
  cognitoId: string;
  name: string;
  email: string;
  phoneNumber: string;
  image?: string;
  favorites?: Property[];
}

export interface Property {
  id: number;
  name: string;
  description: string;
  pricePerMonth: number;
  securityDeposit: number;
  applicationFee: number;
  photoUrls: string[];
  amenities: Amenity[];
  highlights: Highlight[];
  isPetsAllowed: boolean;
  isParkingIncluded: boolean;
  beds: number;
  baths: number;
  squareFeet: number;
  propertyType: PropertyType;
  postedDate: string;
  averageRating: number | null;
  numberOfReviews: number | null;
  locationId: number;
  managerCognitoId: string;
  location: Location;
  manager?: Manager;
}

export interface Lease {
  id: number;
  startDate: string;
  endDate: string;
  rent: number;
  deposit: number;
  propertyId: number;
  tenantCognitoId: string;
  property?: Property;
  tenant?: Tenant;
  nextPaymentDate?: string;
}

export interface Payment {
  id: number;
  amountDue: number;
  amountPaid: number;
  dueDate: string;
  paymentDate: string;
  paymentStatus: PaymentStatus;
  leaseId: number;
}

export interface Application {
  id: number;
  applicationDate: string;
  status: ApplicationStatus;
  propertyId: number;
  tenantCognitoId: string;
  name: string;
  email: string;
  phoneNumber: string;
  message?: string | null;
  leaseId?: number | null;
  property: Property;
  tenant: Tenant;
  manager?: Manager;
  lease?: Lease | null;
}

/** Shape of the signed-in user as exposed to the UI. */
export interface AuthUser {
  cognitoInfo: {
    userId: string;
    username: string;
    email: string;
  };
  userInfo: Tenant | Manager;
  userRole: UserRole;
}
