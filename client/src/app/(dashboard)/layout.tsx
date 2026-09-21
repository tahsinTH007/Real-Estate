"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AppSidebar, {
  SIDEBAR_WIDTH,
  SIDEBAR_WIDTH_COLLAPSED,
} from "@/components/AppSidebar";
import Loading from "@/components/Loading";
import Navbar from "@/components/Navbar";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { useGetAuthUserQuery } from "@/state/api";

const COLLAPSED_KEY = "rentiful.sidebar.collapsed";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser, isLoading, isFetching } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(COLLAPSED_KEY) === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const toggleCollapsed = () => {
    setCollapsed((c) => {
      try {
        window.localStorage.setItem(COLLAPSED_KEY, c ? "0" : "1");
      } catch {
        /* ignore */
      }
      return !c;
    });
  };

  // Route guard: signed-out users go to sign-in, and each role stays on its own side.
  useEffect(() => {
    if (isLoading) return;
    if (!authUser) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
      return;
    }
    const role = authUser.userRole;
    if (role === "manager" && pathname.startsWith("/tenants")) {
      router.replace("/managers/properties");
    } else if (role === "tenant" && pathname.startsWith("/managers")) {
      router.replace("/tenants/favorites");
    }
  }, [authUser, isLoading, pathname, router]);

  const wrongSide =
    authUser &&
    ((authUser.userRole === "manager" && pathname.startsWith("/tenants")) ||
      (authUser.userRole === "tenant" && pathname.startsWith("/managers")));

  if (isLoading || (isFetching && !authUser) || !authUser || wrongSide) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div style={{ paddingTop: NAVBAR_HEIGHT }}>
          <Loading label="Preparing your dashboard" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMenuClick={() => setMobileOpen(true)} />
      <AppSidebar
        userType={authUser.userRole}
        collapsed={collapsed}
        onToggleCollapsed={toggleCollapsed}
        mobileOpen={mobileOpen}
        onMobileOpenChange={setMobileOpen}
      />
      <main
        className="min-w-0 transition-[padding] duration-300"
        style={{
          paddingTop: NAVBAR_HEIGHT,
          // Sidebar offset only applies at lg+, handled via CSS var below.
          ["--sidebar-w" as string]: `${collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH}px`,
        }}
      >
        <div className="lg:pl-[var(--sidebar-w)]">
          <div className="mx-auto max-w-[1400px]">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
