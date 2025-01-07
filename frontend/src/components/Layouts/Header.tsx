"use client";
import Link from "next/link";
import React from "react";
import { Search, Heart, ShoppingCart, User, Phone } from "lucide-react";
import dynamic from "next/dynamic";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useWishlist } from "@/features/wishlists/hooks/useWishlist";
import { useCart } from "@/features/cart/contexts/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Profile = dynamic(() => import("./Profile"), { ssr: false });
const CartSidebar = dynamic(() => import("../CartSidebar"), { ssr: false });

const Header = () => {
  const router = useRouter(); // Thêm useRouter
  const [searchQuery, setSearchQuery] = useState("");
  const { wishlistCount } = useWishlist();
  const { cartCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, user } = useAuth();

  const renderProfileContent = () => {
    if (!isLoggedIn || !user) {
      return (
        <div className="flex flex-col items-center p-4">
          <Link
            className="w-full py-2 px-3 bg-gray-200 text-center rounded-lg text-gray-700 hover:bg-gray-300 transition duration-300 mb-2"
            href="/auth/register"
          >
            Register your Account
          </Link>
          <p className="text-sm py-1">or</p>
          <Link
            className="w-full px-3 py-2 bg-blue-600 hover:bg-blue-700 transition duration-300 rounded-lg text-white text-center"
            href="/auth/login"
          >
            Login to your Account
          </Link>
        </div>
      );
    }

    return <Profile user={user} />;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/catalogsearch?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3">
              <ShoppingCart className="text-red-600 text-5xl" />
              <div className="font-semibold text-2xl">
                <span className="text-black">ITShop</span>
              </div>
            </Link>

            {/* Search Form */}
            <form
              onSubmit={handleSearch}
              className="flex-1 max-w-xl mx-8 relative"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Searching Products..."
                className="w-full pl-4 pr-10 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-2.5 text-gray-400 hover:text-blue-500 transition-colors duration-300"
              >
                <Search size={20} />
              </button>
            </form>

            {/* Icons */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center gap-2">
                <Phone size={20} className="text-blue-600" />
                <span className="text-sm">1800 1234</span>
              </div>

              {/* Wishlist */}
              <div className="relative group">
                <Link href="/wishlist">
                  <Heart
                    className="text-gray-600 hover:text-red-500 transition-colors duration-300"
                    size={24}
                  />
                  <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                </Link>
              </div>

              {/* Cart */}
              <div className="relative group">
                <ShoppingCart
                  onClick={() => setIsOpen(true)}
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                  size={24}
                />
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              </div>

              {/* Profile */}
              <div className="relative group">
                <User
                  className="text-gray-600 hover:text-blue-600 transition-colors duration-300 cursor-pointer"
                  size={24}
                />
                <div className="absolute top-6 -right-2 w-64 p-4 bg-white rounded-lg shadow-lg hidden group-hover:block">
                  {renderProfileContent()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CartSidebar isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Header;
