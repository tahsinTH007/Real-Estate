"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";

const FALLBACK = "/placeholder.svg";

type PropertyImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string | null;
  alt: string;
};

/**
 * next/image with a graceful fallback for missing or broken photos.
 * Data/blob URLs (from in-browser uploads) bypass the optimizer.
 */
const PropertyImage = ({ src, alt, ...props }: PropertyImageProps) => {
  const [current, setCurrent] = useState(src || FALLBACK);

  useEffect(() => {
    setCurrent(src || FALLBACK);
  }, [src]);

  const unoptimized =
    current.startsWith("data:") || current.startsWith("blob:") || current === FALLBACK;

  return (
    <Image
      {...props}
      src={current}
      alt={alt}
      unoptimized={unoptimized || props.unoptimized}
      onError={() => setCurrent(FALLBACK)}
    />
  );
};

export default PropertyImage;
