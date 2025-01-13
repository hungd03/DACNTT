import { axiosInstance } from "@/lib/axiosInstance";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import { HiBars3BottomLeft } from "react-icons/hi2";

interface DashboardHeaderProps {
  openSidebar: boolean;
  setOpenSidebar: (open: boolean) => void;
}

const Header: React.FC<DashboardHeaderProps> = ({
  setOpenSidebar,
  openSidebar,
}) => {
  const [userInfo, setUserInfo] = useState(null);
  const fetchUser = async () => {
    await axiosInstance.get("/users/info").then((response) => {
      if (response?.data?.status) {
        setUserInfo(response?.data?.user);
      }
    });
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div className="flex px-4 bg-white shadow-md sticky top-0 w-full z-50 items-center justify-between">
      <Link href="/" className="flex items-center space-x-3 py-4">
        <FaShoppingCart className="text-red-500 text-3xl" />
        <div className="font-bold">
          <span className="text-3xl text-gray-800">IT</span>
          <span className="text-3xl text-gray-800">S</span>
          <span className="text-3xl text-gray-800">hop</span>
        </div>
      </Link>
      <div className="flex items-center space-x-4">
        {/* <div className="bg-orange-100 p-2 rounded">
            <TbHttpPost className="text-[#f34d13]"/>
        </div> */}
        <div
          onClick={() => setOpenSidebar(!openSidebar)}
          className="bg-red-100 cursor-pointer p-2 rounded"
        >
          <HiBars3BottomLeft className="text-[#f34d13]" />
        </div>
        <div className="flex items-center space-x-2 p-2">
          <img
            src="https://placehold.co/40x40"
            alt="user avatar"
            className="w-8 h-8 rounded-md"
          />
          <div className="flex flex-col">
            <span className="text-sm">Hello</span>
            <span className="text-sm font-bold">{userInfo?.fullName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
