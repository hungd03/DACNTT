import React, { useState } from "react";
import Image from "next/legacy/image";
import Link from "next/link";

type TabName = "Phones & Tablets" | "Monitors" | "Keyboards";

type TabData = {
  Phones_Tablets: {
    phones: string[];
    tablets: string[];
    accessories: string[];
    image: string;
  };
  Monitors: {
    brand: string[];
    size: string[];
    accessories: string[];
    image: string;
  };
  Keyboards: {
    brand: string[];
    connection: string[];
    accessories: string[];
    image: string;
  };
};

const tabData: TabData = {
  Phones_Tablets: {
    phones: ["Apple", "Samsung", "Xiaomi", "OPPO", "vivo", "Sony"],
    tablets: ["iPad", "Samsung", "Xiaomi", "Huawei", "Lenovo", "Nokia"],
    accessories: ["Chargers", "Cases", "Screen Protectors"],
    image: "/covers/mobile-tablet-cover.jpg",
  },
  Monitors: {
    brand: ["Samsung", "LG", "Dell", "Asus", "MSI", "ViewSonic"],
    size: ["22 inch", "24 inch", "27 inch", "29 inch", "32 inch"],
    accessories: ["Cables", "Monitor Stand"],
    image: "/covers/monitor-cover.jpg",
  },
  Keyboards: {
    brand: ["AKKO", "Dare-U", "Corsair", "E-Dra", "Razer", "Steelseries"],
    connection: ["Wireless", "Bluetooth"],
    accessories: ["Keycaps", "Dwarf Factory", "Kê tay"],
    image: "/covers/keyboard-cover.jpg",
  },
};

const MenuTabs = () => {
  const [activeTab, setActiveTab] = useState<TabName>("Phones & Tablets");

  const renderContent = () => {
    const data =
      tabData[activeTab === "Phones & Tablets" ? "Phones_Tablets" : activeTab];

    return (
      <div className="flex justify-between py-3 w-full">
        <div className="flex justify-between space-x-8 p-4 w-full">
          {/* Hình ảnh */}
          <div className="w-1/2">
            <Image
              src={data.image}
              width={800}
              height={600}
              alt="category"
              className="rounded-lg w-full object-cover h-[300px]"
            />
          </div>
          {/* Nội dung */}
          <div className="w-1/2 flex justify-between">
            {Object.entries(data).map(
              ([key, value]) =>
                key !== "image" && ( // Bỏ qua `image`
                  <div key={key} className="w-1/3 px-4">
                    {/* Tiêu đề */}
                    <h2 className="font-bold text-red-500 mb-2 capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </h2>
                    {/* Danh sách */}
                    {Array.isArray(value) ? (
                      <ul className="space-y-1">
                        {value.map((item: string, index: number) => (
                          <li
                            key={index}
                            className="text-black hover:text-red-500 cursor-pointer transition duration-200 ease-in-out"
                          >
                            <Link
                              className="text-md"
                              href={`/products?category=${item?.toLowerCase()}`}
                            >
                              {item}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                )
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Thanh điều hướng */}
      <nav className="flex justify-center space-x-8 py-4 border-b">
        {(["Phones & Tablets", "Monitors", "Keyboards"] as TabName[]).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-black text-md font-bold ${
                activeTab === tab
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : ""
              }`}
            >
              {tab}
            </button>
          )
        )}
      </nav>
      {/* Nội dung */}
      {renderContent()}
    </div>
  );
};

export default MenuTabs;
