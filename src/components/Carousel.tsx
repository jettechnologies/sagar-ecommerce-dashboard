import React, { useState, useEffect, useRef, useCallback } from "react";
import arrowLeft from "@/assets/icons/arrowLeft.svg";
import arrowRight from "@/assets/icons/arrowRight.svg";
import { twMerge } from "tailwind-merge";

type CarrouselProps = {
  content: React.ReactNode[];
  hasDots?: boolean;
  hasArrows?:boolean;
  autoPlayInterval?: number;
  autoPlay?: boolean;
  className?: string;
};

const Carrousel: React.FC<CarrouselProps> = 
({ content, 
  hasDots = false, 
  hasArrows = false, 
  autoPlay = true, 
  autoPlayInterval = 3000,
  className }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideInterval = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % content.length);
  }, [content.length])

  const previousSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide - 1 + content.length) % content.length);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const startAutoPlay = useCallback(() => {
    if (autoPlayInterval > 0) {
      slideInterval.current = setInterval(() => {
        nextSlide();
      }, autoPlayInterval);
    }
  }, [autoPlayInterval, nextSlide]);

  const stopAutoPlay = () => {
    if (slideInterval.current) {
      clearInterval(slideInterval.current);
      slideInterval.current = null;
    }
  };

  useEffect(() => {
    if(autoPlay){
      startAutoPlay()
    }
    return () => {
      stopAutoPlay();
    };
  }, [startAutoPlay, autoPlay]);

  useEffect(() => {
    if(autoPlay){
      stopAutoPlay();
      startAutoPlay();
    }
  }, [currentSlide, startAutoPlay, autoPlay]);

  

  return (
    <div className={twMerge("relative h-full", className)}>
      {content?.map((slide, index) => (
        <div
          key={index}
          className={`absolute h-full w-full transition-opacity duration-300 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide}
        </div>
      ))}

    <div className="relative h-full inset-0 z-[-1]">{content[currentSlide]}</div>

    {hasArrows && <><div className="absolute left-0 bottom-0 top-0 flex items-center justify-start">
      <button className="overflow-hidden" onClick={previousSlide}>
        <img
          className="transition-transform hover:scale-150"
          src={arrowLeft}
          alt="previous"
        />
      </button>
    </div>

    <div className="absolute right-0 top-0 bottom-0 flex items-center justify-end">
      <button className="overflow-hidden" onClick={nextSlide}>
        <img
          className="overflow-hidden transition-transform hover:scale-150"
          src={arrowRight}
          alt="next"
        />
      </button>
    </div></>}

    {hasDots && <div className="absolute bottom-4 flex justify-center items-center w-full rounded-full">
      <div className="h-2 flex rounded-full bg-gray-400 overflow-hidden">
        {content?.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setCurrentSlide(index);
              goToSlide(index)
            }}
            className={`h-full w-10 ${
              index === currentSlide ? "bg-white" : ""
            }`}
          ></button>
        ))}
      </div>
    </div>}
  </div>

  );
};

export default Carrousel;
