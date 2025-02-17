// src/ImageCarousel.js
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

import { Navigation, Pagination, Scrollbar, A11y } from "swiper/modules";
import { imgBaseURL } from "../helper/Utility";

const images = [
  "https://assets-static-prod.displate.com/next-assets/public/images/pdp/HeroSlider/cupboard/bcg/2560.avif?v=MDQuMDQuMjAyNA==",
  "https://assets-static-prod.displate.com/next-assets/public/images/pdp/HeroSlider/dresser-zoom/bcg/2560.avif?v=MjEuMDUuMjAyNA==",
  "https://assets-static-prod.displate.com/next-assets/public/images/pdp/HeroSlider/couch/bcg/2560.avif?v=MDcuMDMuMjAyNA==",
];

const ImageCarousel = ({
  onSelectBackground,
  currentIndex,
  onNext,
  onPrev,
  productImg
}) => {
  return (
    <div className="thumbnails">
      <img src={imgBaseURL() + productImg} alt=""  style={{ width: 100, height: 64, }} />
      {images.map((image, index) => (
       <div className="outer_image">
         <img
          key={index}
          src={image}
          alt={`Background ${index}`}
          onClick={() => onSelectBackground(image)}
          style={{ width: 100, height: 64, }}
        />
        </div>
      ))}
    </div>
  );
};

export default ImageCarousel;
