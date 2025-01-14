"use client";
import ProductDetails from "@/components/Dashboard/Product/ProductDetails";
import ProductImages from "@/components/Dashboard/Product/ProductImages";
import OfferForm from "@/components/Dashboard/Product/ProductOffers";
import ProductVariants from "@/components/Dashboard/Product/ProductVariants";
import ProductVideos from "@/components/Dashboard/Product/ProductVideo";
import { useProduct } from "@/features/products/hooks/useProduct";
import { axiosInstance } from "@/lib/axiosInstance";
import { ProductDetail } from "@/types/product";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import {
  FaEllipsisV,
  FaExclamationCircle,
  FaImage,
  FaTh,
} from "react-icons/fa";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

interface TabProps {
  icon: JSX.Element;
  label: string;
  isActive: boolean;
  onClick: () => void;
  children?: React.ReactNode;
}

interface DropDownItemProps {
  label: string;
  onClick: () => void;
}

const Tab: React.FC<TabProps> = ({
  icon,
  label,
  isActive,
  onClick,
  children,
}) => {
  return (
    <div className="relative group w-1/4">
      <div
        onClick={onClick}
        className={`flex items-center px-4 py-2 rounded-lg cursor-pointer ${
          isActive ? "bg-[#f34d13] text-white" : "bg-white text-gray-500"
        } shadow-md`}
      >
        {icon}
        <span className="ms-3">{label}</span>
      </div>
      {children && (
        <div className="absolute hidden group-hover:block right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {children}
        </div>
      )}
    </div>
  );
};

const DropdownItem: React.FC<DropDownItemProps> = ({ label, onClick }) => (
  <div onClick={onClick} className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
    {label}
  </div>
);

const ProductsDashboardDetails = () => {
  const [activeTab, setActiveTab] = useState<string>("Information");
  const params = useParams();

  // Get the slug from params
  const slug = params?.slug?.[1];

  // Use the hook instead of manual fetching
  const {
    data: product,
    isLoading,
    error,
    refetch,
  } = useProduct(slug || "", "id");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedTab = localStorage.getItem("activeTab");
      if (storedTab) {
        setActiveTab(storedTab);
      }
    }
  }, []);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      localStorage.setItem("activeTab", tab);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error || !product) {
    return <div>Error: {error?.message || "Failed to load product"}</div>;
  }

  const productData = {
    name: product.name,
    brand: product.brand,
    category: product.category.name,
    subcategory: product.subcategory.name,
    basePrice: product.basePrice,
    status: product.status,
    description: product.description,
    seo: product.seo || { title: "", description: "", keywords: [] },
  };

  return (
    <>
      <div className="flex text-xl items-center gap-3 mb-4">
        <Link href="/dashboard">Dashboard</Link>
        <MdOutlineKeyboardArrowRight />
        <Link href="/dashboard/products">Product</Link>
        <MdOutlineKeyboardArrowRight />
        <span>View</span>
      </div>
      <div className="flex space-x-4 justify-between bg-gray-100">
        <Tab
          icon={<FaExclamationCircle />}
          label="Information"
          isActive={activeTab === "Information"}
          onClick={() => handleTabChange("Information")}
        />
        <Tab
          icon={<FaImage />}
          label="Images"
          isActive={activeTab === "Images"}
          onClick={() => handleTabChange("Images")}
        />
        <Tab
          icon={<FaTh />}
          label="Variation"
          isActive={activeTab === "Variation"}
          onClick={() => handleTabChange("Variation")}
        />
        <Tab
          icon={<FaEllipsisV />}
          label="More"
          isActive={false}
          onClick={() => {}}
        >
          <DropdownItem
            onClick={() => handleTabChange("Offers")}
            label="Offers"
          />
          <DropdownItem
            onClick={() => handleTabChange("Videos")}
            label="Videos"
          />
          {/* <DropdownItem onClick={() => handleTabChange("Seo")} label="Seo" /> */}
        </Tab>
      </div>

      <div className="mt-4">
        {activeTab === "Information" && (
          <ProductDetails product={productData} />
        )}
        {activeTab === "Images" && (
          <ProductImages
            productId={product._id}
            thumbnailImage={product.thumbnailImage}
            images={product.images}
            onUpdate={refetch}
          />
        )}
        {activeTab === "Variation" && (
          <ProductVariants
            productId={product._id}
            variations={product.variants}
            onUpdate={refetch} // Thay thế ở đây
          />
        )}
        {activeTab === "Offers" && (
          <OfferForm
            productId={product._id}
            offer={product.discount}
            onUpdate={refetch} // Thay thế ở đây
          />
        )}
        {/* {activeTab === "Seo" && (
          <SEOForm
            productId={product._id}
            seo={{
              title: product.seo?.title || "",
              description: product.seo?.description || "",
              keywords: product.seo?.keywords || [],
              seoImage: product.seo?.seoImage || null,
            }}
            onUpdate={refetch} // Thay thế ở đây
          />
        )} */}
        {activeTab === "Videos" && (
          <ProductVideos
            productId={product._id}
            videos={product.videos}
            onUpdate={refetch} // Thay thế ở đây
          />
        )}
      </div>
    </>
  );
};

export default ProductsDashboardDetails;
