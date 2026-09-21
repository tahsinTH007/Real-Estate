/**
 * RTK Query base query that routes requests to the in-browser mock API
 * instead of the network. Adds a little latency so loading states are
 * visible, exactly like a real backend would.
 */

import type { BaseQueryFn, FetchArgs } from "@reduxjs/toolkit/query";
import { auth } from "@/lib/auth";
import { handleRequest } from "./handlers";

export interface MockQueryError {
  status: number;
  data: { message: string };
}

const MIN_LATENCY = 120;
const MAX_LATENCY = 420;

export const mockBaseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  MockQueryError
> = async (args) => {
  const { url, method = "GET", body, params } =
    typeof args === "string" ? { url: args } : args;

  const session = await auth.getSession();
  const latency = MIN_LATENCY + Math.random() * (MAX_LATENCY - MIN_LATENCY);
  await new Promise((r) => setTimeout(r, latency));

  const res = await handleRequest({
    url,
    method,
    body,
    params: params as Record<string, unknown> | undefined,
    session: session ? { userId: session.userId, role: session.role } : null,
  });

  if ("error" in res) return { error: res.error };
  return { data: res.data };
};
