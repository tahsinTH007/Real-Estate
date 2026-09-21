import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** Use light text on dark backgrounds. */
  inverted?: boolean;
  showWordmark?: boolean;
  href?: string;
}

const Logo = ({
  className,
  inverted = false,
  showWordmark = true,
  href = "/",
}: LogoProps) => {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label="Rentiful home"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-brand-700 shadow-sm transition-transform group-hover:-rotate-3">
        <svg viewBox="0 0 32 32" className="h-8 w-8" aria-hidden="true">
          <path
            d="M8.5 15.5 16 9l7.5 6.5V23a1.5 1.5 0 0 1-1.5 1.5h-4v-6h-4v6h-4A1.5 1.5 0 0 1 8.5 23v-7.5Z"
            fill="#fff"
          />
          <circle cx="23" cy="9.5" r="2.5" fill="#f5b34a" />
        </svg>
      </span>
      {showWordmark && (
        <span
          className={cn(
            "font-display text-[1.35rem] font-semibold tracking-tight",
            inverted ? "text-white" : "text-ink",
          )}
        >
          Rentiful
        </span>
      )}
    </Link>
  );
};

export default Logo;
