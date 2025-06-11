"use client";

import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface Image {
  fileUrl: string;
  [key: string]: any;
}

interface ImageContainersProps {
  productImages: Image[];
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

const ImageContainers: React.FC<ImageContainersProps> = ({ productImages }) => {
  const [loaded, setLoaded] = useState(false);

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
      created: () => setLoaded(true),
    },
    [autoplay(3000)]
  );

  if (!productImages || productImages.length === 0) return null;

  return (
    <div className="w-full  rounded-lg shadow p-4 overflow-hidden">
      <div ref={sliderRef} className="keen-slider">
        {productImages.map((image, index) => (
          <div
            className="keen-slider__slide flex justify-center items-center h-60"
            key={index}
          >
            <img
              src={image.fileUrl}
              alt={`Product Image ${index + 1}`}
              className="object-contain  rounded"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageContainers;
