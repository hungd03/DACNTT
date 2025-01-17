/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { FiPlus, FiTrash } from "react-icons/fi";
import AddressForm from "@/components/AddressForm";
import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";

const AddressList: React.FC = () => {
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [addresses, setAddresses] = useState<any[]>([]);

  const fetchAddressInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/info");
      if (response?.data?.status) {
        setAddresses(response?.data?.user.shippingAddress || []);
      }
    } catch (err) {
      console.error("Error fetching user address info:", err);
    }
  };

  useEffect(() => {
    fetchAddressInfo();
  }, []);

  const handleAddNewAddressClick = () => {
    setIsAddressFormOpen(true);
  };

  const handleDeleteAddressClick = async (index: number) => {
    const confirmDelete = window.confirm(
      "Are you sure want to delete this address?"
    );
    if (!confirmDelete) return;

    try {
      const addressId = addresses[index]._id;

      const response = await axiosInstance.delete(
        `/users/address/${addressId}`
      );

      if (response?.data?.status) {
        const updateedAdresses = addresses.filter((_, i) => i !== index);
        setAddresses(updateedAdresses);
      }

      toast.success(response.data.msg);
    } catch (err) {
      console.error(`Error deleting address:`, err);
      toast.error("Failed to delete address.");
    }
  };

  const handleCloseAddressForm = () => {
    setIsAddressFormOpen(false);
  };

  const handleAddAddress = async (newAddress: any) => {
    setAddresses((prevAddresses) => [...prevAddresses, { ...newAddress }]);
    await fetchAddressInfo();
    setIsAddressFormOpen(false);
    setIsAddressFormOpen(false);
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-black mb-8">Addresses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Hiển thị danh sách địa chỉ */}
        {addresses.length === 0
          ? ""
          : addresses.map((address, index) => (
              <div
                key={index}
                className="relative bg-white p-6 rounded-lg shadow-md border border-gray-200"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-lg font-semibold mb-2">
                      {address.fullName}
                    </h2>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {address.email}, {address.phone}, {address.street},{" "}
                      {address.ward}, {address.district},{" "}
                      {address.city}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteAddressClick(index);
                    }}
                    className="absolute top-4 right-4 w-6 h-6 flex items-center justify-center border border-red-500 rounded-full text-red-500 hover:bg-red-100"
                  >
                    <FiTrash size={16} />
                  </button>
                </div>
              </div>
            ))}

        {/* Nút thêm địa chỉ mới */}
        <div className="relative bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200 hover:bg-gray-200">
          <button
            className="w-full text-gray-500 py-4 rounded-xl flex items-center justify-center space-x-3"
            onClick={handleAddNewAddressClick}
          >
            <div className="w-6 h-6 flex items-center justify-center rounded-full bg-gray-600">
              <FiPlus size={16} className="text-white" />
            </div>
            <span className="text-bold">Add New Address</span>
          </button>
        </div>
      </div>

      {/* Hiển thị form AddressForm khi isAddressFormOpen là true */}
      {isAddressFormOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center">
          <AddressForm
            onClose={handleCloseAddressForm}
            onAddAddress={handleAddAddress}
          />
        </div>
      )}
    </div>
  );
};

export default AddressList;
