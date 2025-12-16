"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Grid3x3 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PhotoGalleryProps {
  images: string[];
  cabinName: string;
  className?: string;
}

export function PhotoGallery({ images, cabinName, className }: PhotoGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const displayImages = images.slice(0, 5);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className={cn("relative", className)}>
        <div className="grid h-[360px] grid-cols-4 grid-rows-2 gap-2 md:h-[420px] lg:h-[480px]">
          {/* Main Image - Takes up 2 columns and 2 rows */}
          {displayImages[0] && (
            <button
              onClick={() => openLightbox(0)}
              className="group relative col-span-2 row-span-2 overflow-hidden rounded-tl-2xl rounded-bl-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              <Image
                src={displayImages[0]}
                alt={`${cabinName} - Main view`}
                fill
                priority
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>
          )}

          {/* Top Right Images */}
          {displayImages[1] && (
            <button
              onClick={() => openLightbox(1)}
              className="group relative overflow-hidden rounded-tr-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              <Image
                src={displayImages[1]}
                alt={`${cabinName} - View 2`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>
          )}

          {displayImages[2] && (
            <button
              onClick={() => openLightbox(2)}
              className="group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              <Image
                src={displayImages[2]}
                alt={`${cabinName} - View 3`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>
          )}

          {/* Bottom Right Images */}
          {displayImages[3] && (
            <button
              onClick={() => openLightbox(3)}
              className="group relative overflow-hidden focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              <Image
                src={displayImages[3]}
                alt={`${cabinName} - View 4`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
            </button>
          )}

          {displayImages[4] && (
            <button
              onClick={() => openLightbox(4)}
              className="group relative overflow-hidden rounded-br-2xl focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              <Image
                src={displayImages[4]}
                alt={`${cabinName} - View 5`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/10" />
              {images.length > 5 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <span className="text-lg font-semibold text-white">
                    +{images.length - 5} more
                  </span>
                </div>
              )}
            </button>
          )}
        </div>

        {/* Show All Photos Button */}
        <button
          onClick={() => openLightbox(0)}
          className="absolute bottom-6 right-6 flex items-center gap-2 rounded-lg border border-[#221F1F] bg-white px-4 py-2 font-sans text-sm font-semibold text-[#221F1F] shadow-md transition-colors hover:bg-gray-50"
        >
          <Grid3x3 className="h-4 w-4" />
          <span>Show all photos</span>
        </button>
      </div>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Current Image */}
          <div className="relative h-[80vh] w-[90vw]">
            <Image
              src={images[currentImageIndex]}
              alt={`${cabinName} - Image ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              sizes="90vw"
            />
          </div>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 rounded-full bg-white/10 p-2 text-white backdrop-blur transition-colors hover:bg-white/20"
            aria-label="Next image"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white backdrop-blur">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  );
}
