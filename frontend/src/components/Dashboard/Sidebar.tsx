"use client";
import React, { useState } from "react";
import Link from "next/link";
import { BiCategory, BiPurchaseTagAlt } from "react-icons/bi";
import { RiBox3Line, RiRefund2Line } from "react-icons/ri";
import { TbCreditCardRefund } from "react-icons/tb";
import { ImHome } from "react-icons/im";
import { usePathname } from "next/navigation";

interface DashboardSidebarProps {
  openSideBar: boolean;
}

const Sidebar: React.FC<DashboardSidebarProps> = ({ openSideBar }) => {
  const pathname = usePathname();
  const sideBarSections = [
    {
      title: "Product & Stocks",
      items: [
        {
          icon: <BiCategory size={20} />,
          label: "Categories",
          link: "/dashboard/categories",
        },
        {
          icon: <RiBox3Line size={20} />,
          label: "Products",
          link: "/dashboard/products",
        },
      ],
    },
    {
      title: "Orders",
      items: [
        {
          icon: <BiPurchaseTagAlt size={20} />,
          label: "View Orders",
          link: "/dashboard/orders",
        },
        {
          icon: <TbCreditCardRefund size={20} />,
          label: "Return Orders",
          link: "/dashboard/return",
        },
        {
          icon: <RiRefund2Line size={20} />,
          label: "Return & Refunds",
          link: "/dashboard/return-refunds",
        },
      ],
    },
  ];
  return (
    <div className="h-full bg-white shadow-md w-64">
      <div className="p-4 scroll h-[90vh] overflow-hidden overflow-y-scroll">
        <Link
          href={"/dashboard"}
          className={` ${
            pathname === "/dashboard"
              ? "bg-red-500 text-white font-semibold"
              : ""
          } flex items-center space-x-2 p-2 rounded-md cursor-pointer`}
        >
          <ImHome size={20} />
          <span className={`${!openSideBar && "hidden"} md:inline`}>
            Dashboard
          </span>
        </Link>
        {sideBarSections?.map((item, index) => (
          <div className="mt-4" key={index}>
            <h2 className="text-xs text-gray-500 font-semibold">
              {item?.title}
            </h2>
            <div className="mt-2">
              {item?.items.map((item, index) => (
                <Link
                  href={item.link}
                  key={index}
                  className={` ${
                    item?.link === pathname
                      ? "bg-red-500 text-white font-semibold"
                      : ""
                  } flex items-center space-x-2 p-2 rounded-md cursor-pointer`}
                >
                  {item.icon}
                  <span className="md:inline">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
