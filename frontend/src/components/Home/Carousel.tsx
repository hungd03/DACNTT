"use client";
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Carousel = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const slides = [
    { image: "/banners/slider1.jpg", alt: "slider 1" },
    { image: "/banners/slider2.jpg", alt: "slider 2" },
    { image: "/banners/slider3.jpg", alt: "slider 3" },
  ];
  return (
    <div className="bg-gray-100 py-6">
      <div className="xl:container banner mx-auto overflow-hidden px-2 xl:px-4">
        <Slider {...settings}>
          {slides.map((item, index) => (
            <div key={index} className="h-[300px] lg:h-[400px]">
              <img
                src={item?.image}
                alt={item?.alt}
                className="w-full h-full rounded-md"
              />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Carousel;
