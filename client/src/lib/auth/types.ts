import type { UserRole } from "@/types/models";

export interface Session {
  userId: string;
  username: string;
  email: string;
  role: UserRole;
  /** JWT forwarded as a bearer token in API mode. */
  idToken?: string;
}

export interface SignUpInput {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export type SignUpResult = { nextStep: "done" | "confirm" };

export interface AuthService {
  getSession(): Promise<Session | null>;
  signIn(email: string, password: string): Promise<Session>;
  signUp(input: SignUpInput): Promise<SignUpResult>;
  confirmSignUp(email: string, code: string): Promise<void>;
  signOut(): Promise<void>;
  /** Subscribe to auth state changes. Returns an unsubscribe function. */
  subscribe(listener: () => void): () => void;
}

export class AuthError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AuthError";
  }
}
