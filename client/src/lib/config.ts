/**
 * Runtime configuration derived from public env vars.
 *
 * The app runs fully in the browser against a mock API unless
 * NEXT_PUBLIC_DATA_MODE=api and an API base URL is provided.
 */

export type DataMode = "mock" | "api";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export const DATA_MODE: DataMode =
  process.env.NEXT_PUBLIC_DATA_MODE === "api" && API_BASE_URL ? "api" : "mock";

export const IS_MOCK = DATA_MODE === "mock";

export const COGNITO = {
  userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID ?? "",
  userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID ?? "",
};

export const HAS_COGNITO = !!(COGNITO.userPoolId && COGNITO.userPoolClientId);

export const APP_NAME = "Rentiful";
