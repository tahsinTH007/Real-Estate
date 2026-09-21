"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Star } from "lucide-react";
import Logo from "@/components/Logo";
import { useGetAuthUserQuery } from "@/state/api";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  const { data: authUser } = useGetAuthUserQuery();
  const router = useRouter();

  // Already signed in → straight to the dashboard.
  useEffect(() => {
    if (authUser) {
      router.replace(
        authUser.userRole === "manager" ? "/managers/properties" : "/tenants/favorites",
      );
    }
  }, [authUser, router]);

  return (
    <div className="grid min-h-screen lg:grid-cols-[1.05fr_1fr]">
      {/* Form side */}
      <div className="relative flex flex-col px-6 py-6 sm:px-10 lg:px-16">
        <Logo />
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">{children}</div>
        </div>
        <p className="text-xs text-ink-faint">
          © {new Date().getFullYear()} Rentiful · Demo application
        </p>
      </div>

      {/* Visual side */}
      <div className="relative hidden overflow-hidden lg:block">
        <Image
          src="https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1600&q=80"
          alt="Sunlit living room with plants"
          fill
          priority
          className="object-cover"
          sizes="50vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-950/85 via-brand-900/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <div className="mb-4 flex gap-0.5 text-accent-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <blockquote className="font-display text-3xl font-medium leading-snug">
            “I found my apartment in Silver Lake in two days. The map search and
            instant applications made the whole thing painless.”
          </blockquote>
          <p className="mt-5 text-sm text-white/80">
            Carol W. · Tenant in Los Angeles
          </p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
