"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaHeart, FaLock, FaStar } from "react-icons/fa";
import ProductCards from "@/components/ProductCards";
import ProductTabs from "@/components/ProductTabs";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useParams } from "next/navigation";
import { useProduct } from "@/features/products/hooks/useProduct";

interface ProductVariant {
  _id: string;
  color: string;
  storage: number;
  price: number;
  stock: number;
  variantImage: {
    url: string;
  };
}

interface Product {
  _id: string;
  name: string;
  brand: string;
  basePrice: number;
  description: string;
  images: Array<{
    url: string;
    _id: string;
  }>;
  variants: ProductVariant[];
  ratings: {
    average: number;
    count: number;
  };
  relatedProducts: Array<{
    _id: string;
    name: string;
    brand: string;
    thumbnailImage: {
      url: string;
    };
    minPrice: number;
    maxPrice: number;
  }>;
}

const ProductDetail: React.FC = () => {
  const params = useParams();
  const { data: product, isLoading } = useProduct(
    params?.slug as string,
    "slug"
  );
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedStorage, setSelectedStorage] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    null
  );

  useEffect(() => {
    if (product?.images?.[0]?.url) {
      setSelectedImage(product.images[0].url);
    }
  }, [product]);

  // Get unique colors from variants
  const uniqueColors = Array.from(
    new Set(product?.variants?.map((variant) => variant.color) || [])
  );

  // Get available storage options for selected color
  const availableStorage =
    product?.variants
      ?.filter((variant) => variant.color === selectedColor)
      .map((variant) => variant.storage) || [];

  // Find selected variant based on color and storage
  useEffect(() => {
    if (selectedColor && selectedStorage && product?.variants) {
      const variant = product.variants.find(
        (v) => v.color === selectedColor && v.storage === selectedStorage
      );
      setSelectedVariant(variant || null);
    }
  }, [selectedColor, selectedStorage, product]);

  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleIncrease = () => {
    if (selectedVariant && quantity < selectedVariant.stock) {
      setQuantity((prev) => prev + 1);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="xl:container mx-auto px-2 xl:px-4 py-12">
      <div className="text-md flex items-center text-gray-500 mb-4">
        <Link href="/products">Products</Link>
        <MdOutlineKeyboardArrowRight />
        <Link href="#">{product?.brand}</Link>
        <MdOutlineKeyboardArrowRight />
        <Link href="#">{product?.name}</Link>
      </div>

      <div className="flex flex-col md:flex-row space-x-8">
        <div className="w-full md:w-1/3">
          {selectedImage && (
            <img
              src={selectedImage}
              className="mb-3 w-full h-[500px] aspect-square object-cover"
              alt="product image"
            />
          )}
          <Slider {...settings}>
            {product?.images?.map((item) => (
              <div
                key={item._id}
                className="w-1/4"
                onClick={() => setSelectedImage(item.url)}
              >
                <img
                  src={item.url}
                  className="border-2 cursor-pointer"
                  alt="Product thumbnail"
                />
              </div>
            ))}
          </Slider>
        </div>

        <div className="md:w-full">
          <h1 className="text-3xl font-bold mb-2">{product?.name}</h1>
          <p className="text-xl text-gray-700 mb-2">
            {formatCurrency(selectedVariant?.price || product?.basePrice || 0)}
          </p>

          <div className="flex items-center mb-4">
            {[...Array(5)].map((_, index) => (
              <FaStar
                key={index}
                className={`${
                  index < (product?.ratings?.average || 0)
                    ? "text-yellow-500"
                    : "text-gray-300"
                }`}
              />
            ))}
            <span className="ml-2 text-gray-600">
              ({product?.ratings?.count || 0} reviews)
            </span>
          </div>

          <div className="mb-4 flex items-center flex-wrap gap-3">
            <span className="font-bold">Color:</span>
            {uniqueColors.map((color) => (
              <button
                key={color}
                onClick={() => {
                  setSelectedColor(color);
                  setSelectedStorage(0);
                }}
                className={`px-4 py-2 text-md border border-gray-300 rounded-full text-gray-700 font-medium transition-colors duration-200 ${
                  color === selectedColor
                    ? "bg-gray-800 text-white border-gray-800"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {color}
              </button>
            ))}
          </div>

          {selectedColor && availableStorage.length > 0 && (
            <div className="mb-4 flex items-center flex-wrap gap-3">
              <span className="font-bold">Storage:</span>
              {availableStorage.map((storage) => (
                <button
                  key={storage}
                  onClick={() => setSelectedStorage(storage)}
                  className={`px-4 py-2 text-md border border-gray-300 rounded-full text-gray-700 font-medium transition-colors duration-200 ${
                    storage === selectedStorage
                      ? "bg-gray-800 text-white border-gray-800"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {storage}GB
                </button>
              ))}
            </div>
          )}

          <div className="mb-4 flex items-center">
            <span className="font-bold mr-4">Quantity: </span>
            <div className="inline-flex items-center">
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0 border border-gray-300 rounded-l transition-colors duration-200"
                onClick={handleDecrease}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-12 text-center border-t border-b border-gray-300 text-gray-700"
              />
              <button
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-2 py-0 border border-gray-300 rounded-r transition-colors duration-200"
                onClick={handleIncrease}
              >
                +
              </button>
            </div>
            {selectedVariant && (
              <span className="ml-4 text-gray-600">
                Available: {selectedVariant.stock}
              </span>
            )}
          </div>

          <div className="flex space-x-4">
            <button className="flex text-white bg-gradient-to-r from-blue-500 to-indigo-500 items-center px-6 py-3 border rounded-lg shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:from-blue-400 hover:to-indigo-400 focus:outline-none">
              <FaLock className="mr-2" />
              Add To Cart
            </button>
            <button className="flex items-center px-6 py-3 border rounded-lg bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg transform transition-all duration-300 ease-in-out hover:scale-105 hover:from-pink-400 hover:to-red-400 focus:outline-none">
              <FaHeart className="mr-2" />
              Favourite
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <ProductTabs data={product} />
      </div>

      {(product?.relatedProducts?.length ?? 0) > 0 && (
        <>
          <div className="my-5">
            <h2 className="text-4xl font-bold">Related Products</h2>
          </div>
          <ProductCards data={product?.relatedProducts ?? []} />
        </>
      )}
    </div>
  );
};

export default ProductDetail;
