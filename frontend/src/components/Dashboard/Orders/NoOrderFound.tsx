"use client";
import React from "react";

const NoOrderFound = () => {
  return (
    <div className="w-full h-[50vh] bg-white rounded-lg shadow-sm flex flex-col items-center justify-center py-12">
      <div className="w-30 h-30 mb-2">
        <img
          src="https://shopfront-cdn.tekoapis.com/static/empty_cart.png"
          alt="Empty Cart"
          className="object-contain"
        />
      </div>
      <p className="text-gray-500 mb-6">No Order Found</p>
    </div>
  );
};

export default NoOrderFound;
