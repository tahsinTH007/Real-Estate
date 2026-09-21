import { HAS_COGNITO, IS_MOCK } from "@/lib/config";
import { mockAuth } from "./mock";
import type { AuthService } from "./types";

export * from "./types";

const useCognito = !IS_MOCK && HAS_COGNITO;

/**
 * Resolve the concrete provider. Cognito is loaded on demand so the Amplify
 * bundle never ships in mock mode.
 */
let cognitoPromise: Promise<AuthService> | null = null;
function provider(): Promise<AuthService> {
  if (!useCognito) return Promise.resolve(mockAuth);
  if (!cognitoPromise) {
    cognitoPromise = import("./cognito").then((m) => m.cognitoAuth);
  }
  return cognitoPromise;
}

export const auth: AuthService = {
  getSession: () => provider().then((p) => p.getSession()),
  signIn: (email, password) => provider().then((p) => p.signIn(email, password)),
  signUp: (input) => provider().then((p) => p.signUp(input)),
  confirmSignUp: (email, code) =>
    provider().then((p) => p.confirmSignUp(email, code)),
  signOut: () => provider().then((p) => p.signOut()),
  subscribe: (listener) => {
    let unsubscribe: () => void = () => {};
    let cancelled = false;
    provider().then((p) => {
      if (cancelled) return;
      unsubscribe = p.subscribe(listener);
    });
    return () => {
      cancelled = true;
      unsubscribe();
    };
  },
};
