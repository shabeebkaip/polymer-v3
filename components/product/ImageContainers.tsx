"use client";

import React, { useState } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface Image {
  fileUrl: string;
  [key: string]: unknown;
}

interface ImageContainersProps {
  productImages: Image[];
  [key: string]: unknown;
  isCompact?: boolean;
}

// Autoplay plugin
const autoplay = (interval = 3000) => {
  return (slider: { on: (event: string, callback: () => void) => void; next: () => void }) => {
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

const ImageContainers: React.FC<ImageContainersProps> = ({ productImages }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    [autoplay(4000)]
  );

  if (!productImages || productImages.length === 0) {
    return null;
  }

  // Always very compact - slightly bigger size
  const containerHeight = "h-32 w-32"; // Fixed small square size
  
  return (
    <div className="w-32 h-32 flex-shrink-0">
      {/* Main Image Slider - Very Compact */}
      <div className="relative group w-full h-full">
        <div 
          ref={sliderRef} 
          className={`keen-slider keen-slider-main rounded-lg overflow-hidden shadow-md ${containerHeight} bg-gray-50`}
        >
          {productImages.map((image, index) => (
            <div
              className="keen-slider__slide flex justify-center items-center"
              key={index}
            >
              <img
                src={image.fileUrl}
                alt={`Product Image ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>

        {/* Minimal Slide Indicators - Only show if multiple images */}
        {productImages.length > 1 && (
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-1">
            {productImages.map((_, index) => (
              <div
                key={index}
                className={`w-1 h-1 rounded-full transition-all ${
                  index === currentSlide ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageContainers;
