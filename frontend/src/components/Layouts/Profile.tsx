import Link from "next/link";
import React from "react";
import {
  FaKey,
  FaLock,
  FaMapMarkedAlt,
  FaSignOutAlt,
  FaUndoAlt,
  FaUser,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/hooks/useAuth";

type MenuItems = {
  icon: JSX.Element;
  label: string;
  link: string;
};

// Cập nhật type User để phù hợp với dữ liệu từ API của bạn
type User = {
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: string;
};

type ProfileProps = {
  user: User;
};

const Profile: React.FC<ProfileProps> = ({ user }) => {
  const router = useRouter();
  const { logout } = useAuth();

  const menuItems: MenuItems[] = [
    {
      icon: <FaLock className="mr-2" />,
      label: "Order History",
      link: "/accounts/order-history",
    },
    {
      icon: <FaUndoAlt className="mr-2" />,
      label: "Return Orders",
      link: "/accounts/return-orders",
    },
    {
      icon: <FaUser className="mr-2" />,
      label: "Account Info",
      link: "/accounts/account-info",
    },
    {
      icon: <FaKey className="mr-2" />,
      label: "Change Password",
      link: "/accounts/change-password",
    },
    {
      icon: <FaMapMarkedAlt className="mr-2" />,
      label: "Address",
      link: "/accounts/address",
    },
    {
      icon: <FaSignOutAlt className="mr-2" />,
      label: "Logout",
      link: "",
    },
  ];

  const handleLogout = async () => {
    logout();
    router.push("/");
  };

  return (
    <div className="w-full">
      <div className="flex space-x-4 items-center border-b pb-3">
        <div>
          <img
            src={user.avatar || "https://placeholder.com/100x100"}
            alt="profile avatar"
            className="w-12 h-12 rounded-full"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold">{user.fullName}</h2>
          <p className="text sm text-gray-500">{user.phone || user.email}</p>
        </div>
      </div>
      <div className="mt-4">
        <ul className="space-y-4">
          {menuItems?.map((item, index) => {
            return item.label === "Logout" ? (
              <li className="mb-1 block" key={index}>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-700 hover:text-red-500 transition duration-300"
                >
                  {item.icon}
                  <span className="ms-2">{item.label}</span>
                </button>
              </li>
            ) : (
              <li className="mb-1 block" key={index}>
                <Link
                  href={item.link}
                  className="flex items-center text-gray-700 hover:text-red-500 transition duration-300"
                >
                  {item.icon}
                  <span className="ms-2">{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Profile;
