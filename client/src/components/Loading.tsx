import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

/** Full-screen spinner for route-level transitions. */
const Loading = ({ label = "Loading" }: { label?: string }) => {
  return (
    <div className="flex min-h-[50vh] items-center justify-center gap-2 text-ink-muted">
      <Loader2 className="h-5 w-5 animate-spin text-brand-700" />
      <span className="text-sm font-medium">{label}…</span>
    </div>
  );
};

export default Loading;

/** Skeleton matching the vertical property card. */
export const PropertyCardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("surface overflow-hidden", className)}>
    <Skeleton className="aspect-[4/3] w-full rounded-none" />
    <div className="space-y-3 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <div className="flex gap-3 pt-1">
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-14" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  </div>
);

/** Skeleton matching the horizontal compact card. */
export const CompactCardSkeleton = () => (
  <div className="surface flex overflow-hidden">
    <Skeleton className="h-40 w-2/5 shrink-0 rounded-none" />
    <div className="flex-1 space-y-3 p-4">
      <Skeleton className="h-5 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-1/3" />
      <div className="flex gap-3 pt-2">
        <Skeleton className="h-4 w-12" />
        <Skeleton className="h-4 w-12" />
      </div>
    </div>
  </div>
);

export const CardGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <PropertyCardSkeleton key={i} />
    ))}
  </div>
);

export const TableSkeleton = ({ rows = 4 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);
