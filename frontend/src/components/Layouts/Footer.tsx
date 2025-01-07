import Link from "next/link";
import React from "react";
import {
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaMapMarkedAlt,
  FaPhone,
  FaShoppingCart,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className="py-6 md:py-12 bg-[#1f1f39]">
      <div className="xl:container mx-auto px-2 xl:px-4">
        <div className="flex flex-col gap-8 md:flex-row text-white justify-between items-start">
          <div className="mb-4 md:mb-0 w-full md:w-1/4">
            <Link href="/" className="flex items-center space-x-3 pb-4">
              <FaShoppingCart className="text-red-500 text-3xl" />
              <div className="font-bold">
                <span className="text-3xl text-white">IT</span>
                <span className="text-3xl text-white">S</span>
                <span className="text-3xl text-white">hop</span>
              </div>
            </Link>
            <p className="mb-2 mt-3 md:mt-8 text-white">
              Subscribe to our newsletter
            </p>
            <div className="flex mt-5 w-fit items-center mb-4 rounded-full p-1 bg-white">
              <input
                className="p-2 rounded-l-full focus:outline-none text-black"
                type="email"
                placeholder="Your Email Address..."
                name="newsletter"
              />
              <button className="bg-red-500 text-white p-2 rounded-r-full">
                Subscribe
              </button>
            </div>
            <div className="flex space-x-4 mt-5 md:mt-10">
              <Link href={"#"}>
                <FaFacebookF
                  size={10}
                  className="p-2 w-10 h-10 bg-white rounded-full text-black"
                />
              </Link>
              <Link href={"#"}>
                <FaTwitter
                  size={10}
                  className="p-2 w-10 h-10 bg-white rounded-full text-black"
                />
              </Link>
              <Link href={"#"}>
                <FaInstagram
                  size={10}
                  className="p-2 w-10 h-10 bg-white rounded-full text-black"
                />
              </Link>
              <Link href={"#"}>
                <FaYoutube
                  size={10}
                  className="p-2 w-10 h-10 bg-white rounded-full text-black"
                />
              </Link>
            </div>
          </div>
          <div className="flex flex-col md:flex-row w-full md-0 md:ms-5">
            <div className="mb-8 md:mb-0 w-full md:w-1/3">
              <h3 className="font-bold mb-2">Support</h3>
              <ul>
                <li className="mb-1">
                  <Link href={"#"}>FAQ</Link>
                </li>
                <li className="mb-1">
                  <Link href={"#"}>Return & Exchange</Link>
                </li>
                <li className="mb-1">
                  <Link href={"#"}>Shipping</Link>
                </li>
                <li className="mb-1">
                  <Link href={"#"}>Size Charts</Link>
                </li>
              </ul>
            </div>
            <div className="mb-8 md:mb-0 w-full md:w-1/3">
              <h3 className="font-bold mb-2">Legal</h3>
              <ul>
                <li className="mb-1">
                  <Link href={"#"}>Cookies Policy</Link>
                </li>
                <li className="mb-1">
                  <Link href={"#"}>Terms & Conditions</Link>
                </li>
                <li className="mb-1">
                  <Link href={"#"}>Privacy Policy</Link>
                </li>
                <li className="mb-1">
                  <Link href={"#"}>About Us</Link>
                </li>
                <li className="mb-1">
                  <Link href={"#"}>Contact Us</Link>
                </li>
              </ul>
            </div>
            <div className="mb-8 md:mb-0 w-full md:w-1/3">
              <h3 className="font-bold mb-2">Contact</h3>
              <p className="mb-1 flex items-center gap-3">
                <FaMapMarkedAlt size={30} /> Phòng C004, Số 19 Nguyễn Hữu Thọ,
                P.Tân Phong, Quận 7, Tp. Hồ Chí Minh
              </p>
              <p className="mb-1 flex items-center gap-3">
                <FaEnvelope /> it@tdtu.edu.vn
              </p>
              <p className="mb-1 flex items-center gap-3">
                <FaPhone /> (028) 37755046
              </p>
              <div className="flex space-x-3 mt-4">
                <img
                  src="/googleplay.jpg"
                  className="h-[40px] w-[130px] rounded-md"
                  alt="play store"
                />
                <img
                  src="/appstore.jpg"
                  className="h-[40px] w-[130px] rounded-md"
                  alt="app store"
                />
              </div>
            </div>
          </div>
        </div>
        <p className="text-center mt-8 text-sm text-white">
          © ITShop by 521H0064, All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
