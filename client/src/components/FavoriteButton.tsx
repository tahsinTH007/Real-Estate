"use client";

import { Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
  size?: "sm" | "md";
  className?: string;
}

const FavoriteButton = ({ isFavorite, onToggle, size = "md", className }: FavoriteButtonProps) => {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle();
      }}
      aria-pressed={isFavorite}
      aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
      className={cn(
        "flex items-center justify-center rounded-full bg-white/90 text-ink shadow-sm backdrop-blur transition-all hover:scale-110 hover:bg-white active:scale-95",
        size === "md" ? "h-9 w-9" : "h-8 w-8",
        className,
      )}
    >
      <Heart
        className={cn(
          "transition-colors",
          size === "md" ? "h-[18px] w-[18px]" : "h-4 w-4",
          isFavorite ? "fill-rose-500 text-rose-500" : "text-ink-muted",
        )}
      />
    </button>
  );
};

export default FavoriteButton;
