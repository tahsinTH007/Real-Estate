/**
 * Mock auth backed by the in-browser database and localStorage.
 */

import { getDb, nextId, persist } from "@/mock/db";
import {
  AuthError,
  type AuthService,
  type Session,
  type SignUpResult,
} from "./types";

const SESSION_KEY = "rentiful.session";
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

function writeSession(session: Session | null) {
  if (typeof window === "undefined") return;
  try {
    if (session) window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else window.localStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
  emit();
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockAuth: AuthService = {
  async getSession() {
    return readSession();
  },

  async signIn(email, password) {
    await delay(350);
    const db = getDb();
    const cred = db.credentials.find(
      (c) => c.email.toLowerCase() === email.trim().toLowerCase(),
    );
    if (!cred || cred.password !== password) {
      throw new AuthError("Incorrect email or password.");
    }
    const session: Session = {
      userId: cred.cognitoId,
      username: cred.username,
      email: cred.email,
      role: cred.role,
    };
    writeSession(session);
    return session;
  },

  async signUp({ username, email, password, role }): Promise<SignUpResult> {
    await delay(400);
    const db = getDb();
    const normalized = email.trim().toLowerCase();
    if (db.credentials.some((c) => c.email.toLowerCase() === normalized)) {
      throw new AuthError("An account with this email already exists.");
    }
    if (password.length < 8) {
      throw new AuthError("Password must be at least 8 characters.");
    }

    const cognitoId = `${role === "manager" ? "mgr" : "tnt"}-${nextId("user")}-${Date.now().toString(36)}`;
    db.credentials.push({ email: normalized, password, cognitoId, role, username });

    if (role === "manager") {
      db.managers.push({
        id: nextId("manager"),
        cognitoId,
        name: username,
        email: normalized,
        phoneNumber: "",
      });
    } else {
      db.tenants.push({
        id: nextId("tenant"),
        cognitoId,
        name: username,
        email: normalized,
        phoneNumber: "",
      });
      db.favorites[cognitoId] = [];
    }
    persist();

    writeSession({ userId: cognitoId, username, email: normalized, role });
    return { nextStep: "done" };
  },

  async confirmSignUp() {
    /* no email confirmation in mock mode */
  },

  async signOut() {
    await delay(150);
    writeSession(null);
  },

  subscribe(listener) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === SESSION_KEY) listener();
    };
    if (typeof window !== "undefined") window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      if (typeof window !== "undefined")
        window.removeEventListener("storage", onStorage);
    };
  },
};
