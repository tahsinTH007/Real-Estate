"use client";

import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { auth } from "@/lib/auth";
import { api } from "@/state/api";
import StoreProvider, { useAppDispatch } from "@/state/redux";

/** Refetch everything whenever the auth session changes (sign in / out). */
const AuthSync = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    return auth.subscribe(() => {
      dispatch(api.util.resetApiState());
    });
  }, [dispatch]);

  return <>{children}</>;
};

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <StoreProvider>
      <AuthSync>
        <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
      </AuthSync>
    </StoreProvider>
  );
};

export default Providers;
