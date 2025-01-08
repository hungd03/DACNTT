"use client";
import Carousel from "@/components/Home/Carousel";
import CategoryCarousel from "@/components/Home/CategoryCarousel";
import ProductCards from "@/components/ProductCards";
import PromotionCards from "@/components/Home/PromotionCards";
import { FaHeadset, FaHeart, FaLock, FaShippingFast } from "react-icons/fa";
import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import { ChevronRight } from "lucide-react";
import {
  useFlashSale,
  useProducts,
} from "@/features/products/hooks/useProduct";

export default function Home() {
  const { data: flashSaleData, isLoading: isFlashSaleLoading } =
    useFlashSale(5);
  const { data: featuredData, isLoading: isFeaturedLoading } = useProducts({
    page: 1,
    limit: 8,
  });

  const addToWishlist = async (id: string) => {
    await axiosInstance.post("/wishlist", { product: id }).then((data) => {
      if (data?.data?.status) {
        toast.success("Product Added To Wishlist");
      } else {
        toast.error("Failed to add product to wishlist");
      }
    });
  };

  const services = [
    {
      icon: <FaHeadset size={30} className="text-center text-[#f23e14]" />,
      title: "Professional Service",
      description: "Efficient customer support from passionate team",
    },
    {
      icon: <FaLock size={30} className="text-center text-[#f23e14]" />,
      title: "Secure Payment",
      description: "Different secure payment methods",
    },
    {
      icon: <FaShippingFast size={30} className="text-center text-[#f23e14]" />,
      title: "Fast Delivery",
      description: "Fast and convenient door to door delivery",
    },
    {
      icon: <FaHeart size={30} className="text-center text-[#f23e14]" />,
      title: "Quality & Savings",
      description: "Comprehensive quality control and affordable prices",
    },
  ];

  return (
    <div className="mb-8 ">
      <Carousel />
      <CategoryCarousel />
      <PromotionCards />

      {/* Flash Sales Section */}
      <div className="xl:container px-2 xl:px-4 mt-10 mx-auto ">
        <div className="bg-red-50 py-8">
          <div className="mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <h2 className="text-xl font-bold text-red-600">FLASH SALE</h2>
              </div>
              <a
                href="/offers"
                className="text-red-600 flex items-center hover:text-red-700 transition-colors"
              >
                Xem tất cả <ChevronRight size={20} />
              </a>
            </div>

            {isFlashSaleLoading ? (
              <div>Loading...</div>
            ) : (
              <ProductCards
                data={flashSaleData || []}
                isFlashSale={true}
                wishlistClicked={addToWishlist}
              />
            )}
          </div>
        </div>
      </div>

      {/* Featured Phones Section */}
      <div className="xl:container px-2 xl:px-4 mt-10 mx-auto">
        <div className="py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">FEATURED PHONES</h2>

              <a
                href="/all-products"
                className="text-gray-700 flex items-center hover:text-gray-900 transition-colors"
              >
                Xem tất cả <ChevronRight size={20} />
              </a>
            </div>
            {isFeaturedLoading ? (
              <div>Loading...</div>
            ) : (
              <ProductCards
                data={featuredData?.products || []}
                wishlistClicked={addToWishlist}
              />
            )}
          </div>
        </div>
      </div>

      {/* Services Sections */}
      <div className="mx-auto xl:container px-2 xl:px-4 mt-10">
        <div className="bg-gray-50 py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center space-y-3 p-4"
                >
                  <div className="mb-2">{service.icon}</div>
                  <span className="font-medium">{service.title}</span>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
