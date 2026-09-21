import * as z from "zod";
import { AMENITIES, HIGHLIGHTS, PROPERTY_TYPES } from "./constants";

export const propertySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(20, "Tell renters a little more (20+ characters)"),
  pricePerMonth: z.coerce.number().int().positive("Enter a monthly rent"),
  securityDeposit: z.coerce.number().int().min(0),
  applicationFee: z.coerce.number().int().min(0),
  isPetsAllowed: z.boolean(),
  isParkingIncluded: z.boolean(),
  photoUrls: z
    .array(z.instanceof(File))
    .min(1, "Add at least one photo"),
  amenities: z.array(z.enum(AMENITIES as [string, ...string[]])).min(1, "Pick at least one amenity"),
  highlights: z.array(z.enum(HIGHLIGHTS as [string, ...string[]])).min(1, "Pick at least one highlight"),
  beds: z.coerce.number().int().min(0).max(10),
  baths: z.coerce.number().min(0.5).max(10),
  squareFeet: z.coerce.number().int().positive("Enter the size"),
  propertyType: z.enum(PROPERTY_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "Choose a property type" }),
  }),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  country: z.string().min(1, "Country is required"),
  postalCode: z.string().min(1, "Postal code is required"),
});

export type PropertyFormData = z.infer<typeof propertySchema>;

export const applicationSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  message: z.string().optional(),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

export const settingsSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
});

export type SettingsFormData = z.infer<typeof settingsSchema>;

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signUpSchema = z
  .object({
    username: z.string().min(2, "Enter your name"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string(),
    role: z.enum(["tenant", "manager"]),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
