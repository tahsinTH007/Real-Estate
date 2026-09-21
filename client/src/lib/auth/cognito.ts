/**
 * AWS Cognito auth via Amplify. Used when NEXT_PUBLIC_DATA_MODE=api and the
 * Cognito user pool env vars are set.
 */

import { Amplify } from "aws-amplify";
import {
  confirmSignUp as amplifyConfirmSignUp,
  fetchAuthSession,
  getCurrentUser,
  signIn as amplifySignIn,
  signOut as amplifySignOut,
  signUp as amplifySignUp,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import type { UserRole } from "@/types/models";
import { COGNITO } from "@/lib/config";
import {
  AuthError,
  type AuthService,
  type Session,
  type SignUpInput,
  type SignUpResult,
} from "./types";

let configured = false;
function ensureConfigured() {
  if (configured) return;
  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: COGNITO.userPoolId,
        userPoolClientId: COGNITO.userPoolClientId,
      },
    },
  });
  configured = true;
}

async function buildSession(): Promise<Session | null> {
  ensureConfigured();
  try {
    const [user, session] = await Promise.all([
      getCurrentUser(),
      fetchAuthSession(),
    ]);
    const idToken = session.tokens?.idToken;
    if (!idToken) return null;
    const payload = idToken.payload as Record<string, unknown>;
    return {
      userId: user.userId,
      username: user.username,
      email: String(payload.email ?? ""),
      role: (String(payload["custom:role"] ?? "tenant").toLowerCase() as UserRole),
      idToken: idToken.toString(),
    };
  } catch {
    return null;
  }
}

export const cognitoAuth: AuthService = {
  getSession: buildSession,

  async signIn(email, password) {
    ensureConfigured();
    try {
      await amplifySignIn({ username: email, password });
    } catch (err) {
      throw new AuthError((err as Error).message || "Sign in failed.");
    }
    const session = await buildSession();
    if (!session) throw new AuthError("Could not establish a session.");
    return session;
  },

  async signUp({ username, email, password, role }: SignUpInput): Promise<SignUpResult> {
    ensureConfigured();
    try {
      const result = await amplifySignUp({
        username,
        password,
        options: {
          userAttributes: { email, "custom:role": role },
        },
      });
      return {
        nextStep:
          result.nextStep.signUpStep === "CONFIRM_SIGN_UP" ? "confirm" : "done",
      };
    } catch (err) {
      throw new AuthError((err as Error).message || "Sign up failed.");
    }
  },

  async confirmSignUp(username, code) {
    ensureConfigured();
    try {
      await amplifyConfirmSignUp({ username, confirmationCode: code });
    } catch (err) {
      throw new AuthError((err as Error).message || "Confirmation failed.");
    }
  },

  async signOut() {
    ensureConfigured();
    await amplifySignOut();
  },

  subscribe(listener) {
    ensureConfigured();
    return Hub.listen("auth", () => listener());
  },
};
