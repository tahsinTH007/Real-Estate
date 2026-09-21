"use client";

import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Images, X } from "lucide-react";
import PropertyImage from "@/components/PropertyImage";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
  const photos = images.length ? images : ["/placeholder.svg"];
  const [index, setIndex] = useState(0);
  const [open, setOpen] = useState(false);

  const prev = useCallback(
    () => setIndex((i) => (i === 0 ? photos.length - 1 : i - 1)),
    [photos.length],
  );
  const next = useCallback(
    () => setIndex((i) => (i === photos.length - 1 ? 0 : i + 1)),
    [photos.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  const openAt = (i: number) => {
    setIndex(i);
    setOpen(true);
  };

  return (
    <>
      {/* Mobile carousel */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-sand-100 sm:hidden">
        {photos.map((src, i) => (
          <div
            key={src + i}
            className={cn(
              "absolute inset-0 transition-opacity duration-500",
              i === index ? "opacity-100" : "opacity-0",
            )}
          >
            <PropertyImage src={src} alt={`${alt} — photo ${i + 1}`} fill priority={i === 0} className="object-cover" sizes="100vw" />
          </div>
        ))}
        {photos.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={next}
              aria-label="Next photo"
              className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-ink shadow"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
            <div className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-medium text-white">
              {index + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Desktop mosaic */}
      <div className="container hidden sm:block">
        <div className="relative grid h-[420px] grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-3xl lg:h-[520px]">
          <button
            onClick={() => openAt(0)}
            className="group relative col-span-2 row-span-2 overflow-hidden bg-sand-100"
          >
            <PropertyImage
              src={photos[0]}
              alt={`${alt} — main photo`}
              fill
              priority
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="50vw"
            />
          </button>
          {[1, 2, 3, 4].map((i) => (
            <button
              key={i}
              onClick={() => openAt(Math.min(i, photos.length - 1))}
              className={cn(
                "group relative overflow-hidden bg-sand-100",
                photos.length < 3 && i === 1 && "col-span-2 row-span-2",
                photos.length === 3 && i <= 2 && "col-span-2",
                photos.length < 3 && i > 1 && "hidden",
                photos.length === 3 && i > 2 && "hidden",
                photos.length === 4 && i === 4 && "hidden",
                photos.length === 4 && i === 3 && "col-span-2",
              )}
            >
              <PropertyImage
                src={photos[i] ?? photos[0]}
                alt={`${alt} — photo ${i + 1}`}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="25vw"
              />
            </button>
          ))}

          <Button
            variant="inverse"
            size="sm"
            className="absolute bottom-4 right-4 shadow-card"
            onClick={() => openAt(0)}
          >
            <Images /> Show all {photos.length} photos
          </Button>
        </div>
      </div>

      {/* Lightbox */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-6xl border-0 bg-transparent p-0 shadow-none [&>button]:hidden">
          <DialogTitle className="sr-only">Photos of {alt}</DialogTitle>
          <div className="relative aspect-[3/2] w-full overflow-hidden rounded-2xl bg-ink">
            <PropertyImage
              src={photos[index]}
              alt={`${alt} — photo ${index + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/30"
            >
              <X className="h-5 w-5" />
            </button>
            {photos.length > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous photo"
                  className="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/30"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
                <button
                  onClick={next}
                  aria-label="Next photo"
                  className="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur hover:bg-white/30"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              </>
            )}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/60 px-3 py-1 text-xs font-medium text-white">
              {index + 1} / {photos.length}
            </div>
          </div>
          {photos.length > 1 && (
            <div className="mt-3 flex justify-center gap-2 overflow-x-auto pb-1">
              {photos.map((src, i) => (
                <button
                  key={src + i}
                  onClick={() => setIndex(i)}
                  className={cn(
                    "relative h-14 w-20 shrink-0 overflow-hidden rounded-lg border-2 transition-all",
                    i === index ? "border-white" : "border-transparent opacity-60 hover:opacity-100",
                  )}
                >
                  <PropertyImage src={src} alt="" fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ImageGallery;
