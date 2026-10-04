"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";

type ProductGalleryProps = {
  images: string[];
  alt: string;
  activeImageUrl?: string | null;
};

export function ProductGallery({
  images,
  alt,
  activeImageUrl,
}: ProductGalleryProps) {
  const galleryImages =
    images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80",
        ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!activeImageUrl) return;
    const matchIndex = images.indexOf(activeImageUrl);
    if (matchIndex >= 0) {
      setSelectedIndex(matchIndex);
    }
  }, [activeImageUrl, images]);

  const mainImage = galleryImages[selectedIndex] ?? galleryImages[0];

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-[4/5] overflow-hidden bg-secondary">
        <Image
          src={mainImage}
          alt={alt}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
      </div>

      <ul className="flex gap-2 overflow-x-auto pb-1" aria-label="Product images">
        {galleryImages.map((image, index) => {
          const isSelected = index === selectedIndex;
          return (
            <li key={image} className="shrink-0">
              <button
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`View image ${index + 1}`}
                aria-current={isSelected}
                className={cn(
                  "relative block size-16 overflow-hidden bg-secondary outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-gold/50 sm:size-20",
                  isSelected
                    ? "ring-1 ring-ink"
                    : "opacity-70 hover:opacity-100",
                )}
              >
                <Image
                  src={image}
                  alt=""
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
