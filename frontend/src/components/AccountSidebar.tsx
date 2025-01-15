"use client";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import React from "react";
import {
  FaBriefcase,
  FaLock,
  FaMapMarkerAlt,
  FaThLarge,
  FaUndo,
  FaUser,
} from "react-icons/fa";
import { useAuth } from "@/features/auth/hooks/useAuth";

const AccountSidebar = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  return (
    <aside className="w-1/4 bg-white p-6 rounded-lg shadow-md">
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <Image
            src={user?.avatar || "https://placehold.co/100x100"}
            alt="User profile"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="rounded-full object-cover"
            priority
          />
        </div>
        <h2 className="text-xl font-semibold">{user?.fullName}</h2>
        <p className="text-gray-500">{user?.phone || user?.email}</p>
      </div>
      <nav className="mt-8">
        <ul>
          <Link
            href={"/accounts/overview"}
            className={`flex items-center mb-4 ${
              pathname === "/accounts/overview"
                ? "text-red-500"
                : "text-gray-600"
            } hover:text-red-500 transition-colors`}
          >
            <FaThLarge className="mr-2" /> Overview
          </Link>
          <Link
            href={"/accounts/order-history"}
            className={`flex items-center mb-4 ${
              pathname === "/accounts/order-history"
                ? "text-red-500"
                : "text-gray-600"
            } hover:text-red-500 transition-colors`}
          >
            <FaBriefcase className="mr-2" /> Order History
          </Link>
          <Link
            href={"/accounts/return-orders"}
            className={`flex items-center mb-4 ${
              pathname === "/accounts/return-orders"
                ? "text-red-500"
                : "text-gray-600"
            } hover:text-red-500 transition-colors`}
          >
            <FaUndo className="mr-2" /> Return Orders
          </Link>
          <Link
            href={"/accounts/account-info"}
            className={`flex items-center mb-4 ${
              pathname === "/accounts/account-info"
                ? "text-red-500"
                : "text-gray-600"
            } hover:text-red-500 transition-colors`}
          >
            <FaUser className="mr-2" /> Account Info
          </Link>
          <Link
            href={"/accounts/change-password"}
            className={`flex items-center mb-4 ${
              pathname === "/accounts/change-password"
                ? "text-red-500"
                : "text-gray-600"
            } hover:text-red-500 transition-colors`}
          >
            <FaLock className="mr-2" /> Change Password
          </Link>
          <Link
            href={"/accounts/address"}
            className={`flex items-center mb-4 ${
              pathname === "/accounts/address"
                ? "text-red-500"
                : "text-gray-600"
            } hover:text-red-500 transition-colors`}
          >
            <FaMapMarkerAlt className="mr-2" /> Address
          </Link>
        </ul>
      </nav>
    </aside>
  );
};

export default AccountSidebar;
