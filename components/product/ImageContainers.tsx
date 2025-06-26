"use client";

import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { ChevronLeft, ChevronRight, ZoomIn, Package } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Image {
  fileUrl: string;
  [key: string]: any;
}

interface ImageContainersProps {
  productImages: Image[];
  isCompact?: boolean;
}

// Autoplay plugin
const autoplay = (interval = 3000) => {
  return (slider: any) => {
    let timeout: ReturnType<typeof setTimeout>;
    let mouseOver = false;

    function clearNextTimeout() {
      clearTimeout(timeout);
    }

    function nextTimeout() {
      clearTimeout(timeout);
      if (!mouseOver && slider?.next) {
        timeout = setTimeout(() => {
          slider.next();
        }, interval);
      }
    }

    slider.on("created", () => {
      slider.container.addEventListener("mouseover", () => {
        mouseOver = true;
        clearNextTimeout();
      });
      slider.container.addEventListener("mouseout", () => {
        mouseOver = false;
        nextTimeout();
      });
      nextTimeout();
    });

    slider.on("dragStarted", clearNextTimeout);
    slider.on("animationEnded", nextTimeout);
    slider.on("updated", nextTimeout);
  };
};

const ImageContainers: React.FC<ImageContainersProps> = ({ productImages, isCompact = false }) => {
  const [loaded, setLoaded] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(0);

  const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
      created: () => setLoaded(true),
    },
    [autoplay(4000)]
  );

  const [thumbnailRef] = useKeenSlider<HTMLDivElement>({
    initial: 0,
    slides: {
      perView: isCompact ? 3 : 4,
      spacing: 8,
    },
  });

  if (!productImages || productImages.length === 0) {
    return null;
  }

  const goToSlide = (index: number) => {
    instanceRef.current?.moveToIdx(index);
    setSelectedImage(index);
  };

  const containerHeight = isCompact ? "h-48 lg:h-60" : "h-80";
  const thumbnailSize = isCompact ? "h-8 w-8" : "h-16 w-16";
  const spacing = isCompact ? "space-y-1" : "space-y-3";

  return (
    <div className={`${spacing} overflow-hidden ${isCompact ? 'h-48 lg:h-60' : 'h-full'} flex flex-col`}>
      {/* Main Image Slider */}
      <div className="relative group flex-1 min-h-0">
        <div 
          ref={sliderRef} 
          className={`keen-slider keen-slider-main rounded-lg overflow-hidden  shadow-sm ${containerHeight} w-full`}
        >
          {productImages.map((image, index) => (
            <div
              className="keen-slider__slide flex justify-center items-center relative"
              key={index}
            >
              <img
                src={image.fileUrl}
                alt={`Product Image ${index + 1}`}
                className={`max-w-full rounded-2xl max-h-full object-contain ${isCompact ? 'p-2' : 'p-6'}`}
              />
              <Button
                variant="secondary"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {loaded && instanceRef.current && productImages.length > 1 && (
          <>
            <Button
              variant="secondary"
              size="sm"
              className="absolute left-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => instanceRef.current?.prev()}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => instanceRef.current?.next()}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {/* Slide Indicators */}
        {productImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentSlide ? 'bg-green-600 w-4' : 'bg-white/60'
                }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnail Slider */}
      {productImages.length > 1 && (
        <div 
          ref={thumbnailRef} 
          className="keen-slider keen-slider-thumbnails flex-shrink-0" 
          style={{ margin: 0, padding: 0 }}
        >
          {productImages.map((image, index) => (
            <div
              key={index}
              className={`keen-slider__slide cursor-pointer transition-all ${
                index === selectedImage ? 'ring-2 ring-green-600' : ''
              }`}
              onClick={() => goToSlide(index)}
            >
              <div className={`aspect-square rounded-md overflow-hidden bg-gray-50 border ${thumbnailSize}`}>
                <img
                  src={image.fileUrl}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-contain p-1"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageContainers;
