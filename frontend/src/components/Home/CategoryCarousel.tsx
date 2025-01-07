"use client";

import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import Image from "next/legacy/image";
import Link from "next/link";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { axiosInstance } from "@/lib/axiosInstance";

interface CategoryImage {
  url: string;
  publicId: string;
}

interface SubCategory {
  order: number;
  _id: string;
  name: string;
  image: CategoryImage;
  parent: string;
  slug: string;
}

interface Category {
  _id: string;
  name: string;
  image: CategoryImage;
  children: SubCategory[];
  parent: null;
}

interface ApiResponse {
  success: boolean;
  data: Category[];
}

const CategoryCarousel = () => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const sliderRef = useRef<Slider>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get<ApiResponse>("/categories");
        if (response.data.success) {
          const allSubCategories = response.data.data.reduce(
            (acc, category) => {
              return [...acc, ...category.children];
            },
            [] as SubCategory[]
          );

          const sortedSubCategories = allSubCategories.sort(
            (a, b) => (a.order || 0) - (b.order || 0)
          );

          setSubCategories(sortedSubCategories);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 6,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h3 className="text-md lg:text-2xl font-bold">Browse By Categories</h3>
        {/* Navigation Buttons */}
        <div className="flex justify-end gap-2 mb-4">
          <button
            onClick={() => sliderRef.current?.slickPrev()}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => sliderRef.current?.slickNext()}
            className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Slider */}
        <Slider ref={sliderRef} {...settings}>
          {subCategories.map((subCategory) => (
            <Link
              href={`/categories/${subCategory?.slug}`}
              key={subCategory._id}
            >
              <div className="px-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mb-2 relative overflow-hidden">
                    <Image
                      src={subCategory.image.url}
                      alt={subCategory.name}
                      layout="fill"
                      objectFit="contain"
                      className="p-2"
                    />
                  </div>
                  <span className="text-sm text-center">
                    {subCategory.name}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default CategoryCarousel;
