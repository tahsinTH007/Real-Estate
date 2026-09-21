"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Building2,
  LayoutDashboard,
  LogOut,
  Menu,
  Plus,
  RotateCcw,
  Search,
  Settings,
} from "lucide-react";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { IS_MOCK } from "@/lib/config";
import { NAVBAR_HEIGHT } from "@/lib/constants";
import { cn, initials } from "@/lib/utils";
import { resetDb } from "@/mock/db";
import { api, useGetAuthUserQuery } from "@/state/api";
import { useAppDispatch } from "@/state/redux";

interface NavbarProps {
  /** "transparent" sits over the landing hero and turns solid on scroll. */
  variant?: "solid" | "transparent";
  onMenuClick?: () => void;
}

const publicLinks = [
  { href: "/search", label: "Explore homes" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/signup?role=manager", label: "For managers" },
];

const Navbar = ({ variant = "solid", onMenuClick }: NavbarProps) => {
  const { data: authUser, isLoading } = useGetAuthUserQuery();
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const [scrolled, setScrolled] = useState(false);

  const isDashboard = pathname.startsWith("/managers") || pathname.startsWith("/tenants");
  const transparent = variant === "transparent" && !scrolled;

  useEffect(() => {
    if (variant !== "transparent") return;
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [variant]);

  const role = authUser?.userRole;
  const dashboardHref = role === "manager" ? "/managers/properties" : "/tenants/favorites";
  const settingsHref = role === "manager" ? "/managers/settings" : "/tenants/settings";

  const handleSignOut = async () => {
    await auth.signOut();
    dispatch(api.util.resetApiState());
    toast.success("Signed out. See you soon!");
    router.push("/");
  };

  const handleReset = () => {
    resetDb();
    dispatch(api.util.resetApiState());
    toast.success("Demo data reset to defaults.");
  };

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        transparent
          ? "bg-transparent"
          : "border-b border-sand-200/80 bg-white/85 shadow-[0_1px_0_rgba(28,25,23,0.02)] backdrop-blur-xl",
      )}
      style={{ height: NAVBAR_HEIGHT }}
    >
      <div
        className={cn(
          "mx-auto flex h-full items-center justify-between gap-4",
          isDashboard ? "px-4 sm:px-6" : "container",
        )}
      >
        {/* Left */}
        <div className="flex items-center gap-3">
          {isDashboard && onMenuClick && (
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={onMenuClick}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Logo inverted={transparent} />
          {isDashboard && role && (
            <Badge variant="secondary" className="ml-1 hidden capitalize sm:inline-flex">
              {role}
            </Badge>
          )}
        </div>

        {/* Center — public nav */}
        {!isDashboard && (
          <nav className="hidden items-center gap-1 md:flex">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-3.5 py-2 text-sm font-medium transition-colors",
                  transparent
                    ? "text-white/85 hover:bg-white/10 hover:text-white"
                    : "text-ink-muted hover:bg-sand-100 hover:text-ink",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}

        {/* Right */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isLoading ? (
            <Skeleton className="h-9 w-24 rounded-full" />
          ) : authUser ? (
            <>
              <Button
                asChild
                variant={transparent ? "inverse" : "default"}
                size="sm"
                className="hidden h-9 rounded-full px-4 sm:inline-flex"
              >
                <Link href={role === "manager" ? "/managers/newproperty" : "/search"}>
                  {role === "manager" ? (
                    <>
                      <Plus /> List a property
                    </>
                  ) : (
                    <>
                      <Search /> Explore homes
                    </>
                  )}
                </Link>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(
                    "flex items-center gap-2 rounded-full border p-1 pr-3 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    transparent
                      ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
                      : "border-sand-200 bg-white text-ink hover:bg-sand-50",
                  )}
                >
                  <Avatar className="h-7 w-7">
                    <AvatarImage src={authUser.userInfo?.image} />
                    <AvatarFallback className="text-xs">
                      {initials(authUser.userInfo?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden max-w-[120px] truncate text-sm font-medium md:block">
                    {authUser.userInfo?.name?.split(" ")[0]}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-sm font-semibold text-ink">
                        {authUser.userInfo?.name}
                      </span>
                      <span className="truncate text-xs text-ink-soft">
                        {authUser.userInfo?.email}
                      </span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push(dashboardHref)}>
                    <LayoutDashboard /> Dashboard
                  </DropdownMenuItem>
                  {role === "manager" ? (
                    <DropdownMenuItem onClick={() => router.push("/managers/newproperty")}>
                      <Building2 /> List a property
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem onClick={() => router.push("/search")}>
                      <Search /> Explore homes
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => router.push(settingsHref)}>
                    <Settings /> Settings
                  </DropdownMenuItem>
                  {IS_MOCK && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={handleReset}>
                        <RotateCcw /> Reset demo data
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className={cn(
                  "h-9 rounded-full px-4",
                  transparent && "text-white hover:bg-white/10 hover:text-white",
                )}
              >
                <Link href="/signin">Sign in</Link>
              </Button>
              <Button
                asChild
                variant={transparent ? "inverse" : "default"}
                size="sm"
                className="h-9 rounded-full px-4"
              >
                <Link href="/signup">Get started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
