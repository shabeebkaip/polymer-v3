"use client";

import React, { useState } from "react";
import { useKeenSlider, KeenSliderPlugin } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import Image from "next/image";
import { ImageContainersProps } from "@/types/product";

// Autoplay plugin
const autoplay: KeenSliderPlugin = (slider) => {
  let timeout: ReturnType<typeof setTimeout>;
  let mouseOver = false;

  function clearNextTimeout() {
    clearTimeout(timeout);
  }

  function nextTimeout() {
    clearTimeout(timeout);
    // Type assertion is safe here - we know this is a web slider with next() method
    const webSlider = slider as typeof slider & { next(): void };
    if (!mouseOver && webSlider.next) {
      timeout = setTimeout(() => {
        webSlider.next();
      }, 3000);
    }
  }

  slider.on("created", () => {
    // Type assertion is safe here - we know this is a web slider with container property
    const webSlider = slider as typeof slider & { container: HTMLElement };
    webSlider.container.addEventListener("mouseover", () => {
      mouseOver = true;
      clearNextTimeout();
    });
    webSlider.container.addEventListener("mouseout", () => {
      mouseOver = false;
      nextTimeout();
    });
    nextTimeout();
  });

  slider.on("dragStarted", clearNextTimeout);
  slider.on("animationEnded", nextTimeout);
  slider.on("updated", nextTimeout);
};

const ImageContainers: React.FC<ImageContainersProps & { fullWidth?: boolean }> = ({ productImages, fullWidth = false }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      initial: 0,
      slideChanged(slider) {
        setCurrentSlide(slider.track.details.rel);
      },
    },
    [autoplay]
  );

  if (!productImages || productImages.length === 0) {
    return null;
  }

  if (fullWidth) {
    return (
      <div className="relative w-full h-full">
        <div ref={sliderRef} className="keen-slider w-full h-full">
          {productImages.map((image, index) => (
            <div className="keen-slider__slide" key={index}>
              <Image
                src={image.fileUrl}
                alt={`Product Image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-contain"
                priority={index === 0}
              />
            </div>
          ))}
        </div>
        {productImages.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {productImages.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'w-5 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="w-32 h-32 flex-shrink-0">
      <div className="relative group w-full h-full">
        <div
          ref={sliderRef}
          className="keen-slider keen-slider-main rounded-lg overflow-hidden shadow-md h-32 w-32 bg-gray-50"
        >
          {productImages.map((image, index) => (
            <div
              className="keen-slider__slide flex justify-center items-center"
              key={index}
            >
              <Image
                src={image.fileUrl}
                alt={`Product Image ${index + 1}`}
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          ))}
        </div>
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
