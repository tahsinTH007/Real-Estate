"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  ChevronsLeft,
  ChevronsRight,
  FileText,
  Heart,
  Home,
  type LucideIcon,
  Plus,
  Search,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/types/models";

interface NavLink {
  icon: LucideIcon;
  label: string;
  href: string;
  /** Also mark active for nested routes. */
  match?: string;
}

const links: Record<UserRole, NavLink[]> = {
  manager: [
    { icon: Building2, label: "Properties", href: "/managers/properties", match: "/managers/properties" },
    { icon: FileText, label: "Applications", href: "/managers/applications" },
    { icon: Plus, label: "New listing", href: "/managers/newproperty" },
    { icon: Settings, label: "Settings", href: "/managers/settings" },
  ],
  tenant: [
    { icon: Heart, label: "Favorites", href: "/tenants/favorites" },
    { icon: FileText, label: "Applications", href: "/tenants/applications" },
    { icon: Home, label: "Residences", href: "/tenants/residences", match: "/tenants/residences" },
    { icon: Settings, label: "Settings", href: "/tenants/settings" },
  ],
};

export const SIDEBAR_WIDTH = 248;
export const SIDEBAR_WIDTH_COLLAPSED = 76;

interface AppSidebarProps {
  userType: UserRole;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

const NavItems = ({
  userType,
  collapsed,
  onNavigate,
}: {
  userType: UserRole;
  collapsed: boolean;
  onNavigate?: () => void;
}) => {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links[userType].map((link) => {
        const isActive = link.match
          ? pathname.startsWith(link.match)
          : pathname === link.href;
        const item = (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              collapsed && "justify-center px-0",
              isActive
                ? "bg-brand-700 text-white shadow-sm"
                : "text-ink-muted hover:bg-sand-100 hover:text-ink",
            )}
          >
            <link.icon
              className={cn(
                "h-[18px] w-[18px] shrink-0",
                isActive ? "text-white" : "text-ink-soft group-hover:text-ink",
              )}
            />
            {!collapsed && <span>{link.label}</span>}
          </Link>
        );

        if (!collapsed) return item;
        return (
          <Tooltip key={link.href}>
            <TooltipTrigger asChild>{item}</TooltipTrigger>
            <TooltipContent side="right">{link.label}</TooltipContent>
          </Tooltip>
        );
      })}
    </nav>
  );
};

const QuickAction = ({ userType, collapsed }: { userType: UserRole; collapsed: boolean }) => {
  const isManager = userType === "manager";
  if (collapsed) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <Button asChild size="icon" className="mx-auto">
            <Link href={isManager ? "/managers/newproperty" : "/search"}>
              {isManager ? <Plus /> : <Search />}
            </Link>
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          {isManager ? "List a property" : "Explore homes"}
        </TooltipContent>
      </Tooltip>
    );
  }
  return (
    <div className="rounded-2xl bg-gradient-to-br from-brand-700 to-brand-900 p-4 text-white shadow-card">
      <p className="text-sm font-semibold">
        {isManager ? "Have a vacancy?" : "Looking for a new place?"}
      </p>
      <p className="mt-1 text-xs leading-relaxed text-white/75">
        {isManager
          ? "Publish a listing in a couple of minutes."
          : "Browse verified homes near you."}
      </p>
      <Button asChild variant="inverse" size="sm" className="mt-3 w-full">
        <Link href={isManager ? "/managers/newproperty" : "/search"}>
          {isManager ? <Plus /> : <Search />}
          {isManager ? "List a property" : "Explore homes"}
        </Link>
      </Button>
    </div>
  );
};

const AppSidebar = ({
  userType,
  collapsed,
  onToggleCollapsed,
  mobileOpen,
  onMobileOpenChange,
}: AppSidebarProps) => {
  return (
    <>
      {/* Desktop */}
      <aside
        className="fixed left-0 z-40 hidden flex-col border-r border-sand-200 bg-white transition-[width] duration-300 lg:flex"
        style={{
          top: NAVBAR_HEIGHT,
          height: `calc(100vh - ${NAVBAR_HEIGHT}px)`,
          width: collapsed ? SIDEBAR_WIDTH_COLLAPSED : SIDEBAR_WIDTH,
        }}
      >
        <div className={cn("flex-1 overflow-y-auto p-4", collapsed && "px-3")}>
          {!collapsed && (
            <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-faint">
              {userType === "manager" ? "Manage" : "My rentals"}
            </p>
          )}
          <NavItems userType={userType} collapsed={collapsed} />
        </div>
        <div className={cn("space-y-3 border-t border-sand-200 p-4", collapsed && "px-3")}>
          <QuickAction userType={userType} collapsed={collapsed} />
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapsed}
            className={cn("w-full text-ink-soft", collapsed ? "justify-center px-0" : "justify-start")}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronsRight /> : <ChevronsLeft />}
            {!collapsed && "Collapse"}
          </Button>
        </div>
      </aside>

      {/* Mobile */}
      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-72 p-0">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <div className="flex h-full flex-col">
            <div className="border-b border-sand-200 px-5 py-4">
              <p className="font-display text-lg font-semibold text-ink">
                {userType === "manager" ? "Manager dashboard" : "Tenant dashboard"}
              </p>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <NavItems
                userType={userType}
                collapsed={false}
                onNavigate={() => onMobileOpenChange(false)}
              />
            </div>
            <div className="border-t border-sand-200 p-4">
              <QuickAction userType={userType} collapsed={false} />
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AppSidebar;
