"use client";
import React from "react";

const PromotionCards = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [promotions, setPromotions] = React.useState([
    { image: "/promotions/promotion1.jpg", alt: "promotion1" },
    { image: "/promotions/promotion2.jpg", alt: "promotion2" },
    { image: "/promotions/promotion3.jpg", alt: "promotion3" },
  ]);
  return (
    <div className="xl:container px-2 xl:px-4 mx-auto my-16">
      <div className="flex flex-wrap lg:flex-nowrap justify-between gap-3 lg:space-x-4 items-center">
        {promotions?.map((item, index) => (
          <div key={index} className="w-full lg:w-1/3">
            <img src={item?.image} alt={item?.alt} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default PromotionCards;
