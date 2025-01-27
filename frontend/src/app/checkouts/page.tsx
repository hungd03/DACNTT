/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import AddressForm from "@/components/AddressForm";
import { axiosInstance } from "@/lib/axiosInstance";
import { formatCurrency } from "@/utils/currencyFormatter";
import { generateOrderSummary } from "@/utils/generateOrderSummary";
import { useRouter } from "next/navigation";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FaPlusCircle, FaChevronRight, FaTrashAlt } from "react-icons/fa";
import PaymentMethodSelection from "@/components/PaymentSelection";
import { useCart } from "@/features/cart/useCart";
import { Coupon } from "@/types/coupon";
import Loading from "../loading";

interface Address {
  _id: string;
  fullName: string;
  phone: string;
  email: string;
  street: string;
  addressLine2?: string;
  ward: string;
  district: string;
  city: string;
}

interface ShippingInfoProps {
  shippingAddresses: Address[];
  onAddNewAddress: () => void;
  onDeleteAddress: (index: number) => void;
  onSaveAndPay: () => void;
  onBackToCart: () => void;
  total: number;
  subtotal: number;
  shippingDiscount: number;
  shippingCharge: number;
  productDiscount: number;
  items: any[];
  selectedShippingAddress: Address | null;
  setSelectedShippingAddress: (value: Address | null) => void;
  selectedPaymentMethod: string;
  onPaymentMethodSelect: (methodId: string) => void;
}

const ShippingInfo: React.FC<ShippingInfoProps> = ({
  shippingAddresses,
  onAddNewAddress,
  onDeleteAddress,
  onSaveAndPay,
  onBackToCart,
  total,
  subtotal,
  shippingDiscount,
  shippingCharge,
  productDiscount,
  items,
  selectedShippingAddress,
  setSelectedShippingAddress,
  selectedPaymentMethod,
  onPaymentMethodSelect,
}) => {
  return (
    <div className="bg-gray-50">
      <div className="bg-gray-50 min-h-screen xl:container mx-auto px-2 xl:px-4 py-12">
        <div className="flex items-center mb-4">
          <FaChevronRight className="text-red-300 mr-2" />
          <h1 className="text-xl font-bold">
            Provide Your Shipping Information
          </h1>
        </div>
        <p className="text-sm text-gray-500 mb-6">
          Check your information before you continue
        </p>

        {/* Address Section */}
        <div className="flex flex-col lg:flex-row justify-between mb-6">
          <div className="w-full lg:pr-4 mb-6 lg:mb-0">
            {/* Shipping Address Section */}
            <div className="w-full mb-6">
              <h2 className="text-xl font-semibold mb-6">Shipping Address</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {shippingAddresses.map((address, index) => (
                  <AddressSection
                    key={index}
                    address={address}
                    onDelete={() => onDeleteAddress(index)}
                    isSelected={selectedShippingAddress?._id === address._id}
                    onSelect={() =>
                      setSelectedShippingAddress(
                        selectedShippingAddress?._id === address._id
                          ? null
                          : address
                      )
                    }
                  />
                ))}
              </div>
              <button
                onClick={onAddNewAddress}
                className="bg-red-100 text-red-500 px-4 py-2 mt-2 rounded flex items-center"
              >
                <FaPlusCircle className="mr-2" /> Add New
              </button>

              {/* Payment Method Selection */}
              <PaymentMethodSelection
                selectedMethod={selectedPaymentMethod}
                onMethodSelect={onPaymentMethodSelect}
              />
            </div>
          </div>

          {/* Cart Items Display */}
          <div className="w-full lg:w-3/6 lg:pl-4">
            <div className="mb-6">
              {items.map((item: any, index: number) => {
                return (
                  <div
                    key={index}
                    className="bg-white shadown-md p-4 rounded-md flex items-center"
                  >
                    <div>
                      <Image
                        src={
                          item?.variantImage?.url ||
                          "https://placehold.co/80x80"
                        }
                        alt={item?.name || "Product image"}
                        width={80}
                        height={80}
                        className="rounded-md"
                        objectFit="cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-[16px] font-semibold text-gray-800">
                        {item?.name}
                      </h2>
                      <p className="text-[15px] text-gray-600">
                        Color: {item?.color}
                      </p>
                      <p className="text-[15px] text-gray-600">
                        Quantity: {item?.quantity}
                      </p>
                      <p className="text-[15px] text-gray-600">
                        Price: {formatCurrency(item?.price * item?.quantity)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <CartSummary
              subtotal={subtotal}
              shippingDiscount={shippingDiscount}
              shippingCharge={shippingCharge}
              productDiscount={productDiscount}
              total={total}
            />
          </div>
        </div>
        {/* Back to Home and Save & Pay */}
        <div className="flex justify-between items-center mt-6">
          <button onClick={onBackToCart} className="text-red-500">
            Back to Cart
          </button>
          <button
            onClick={onSaveAndPay}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};

// eslint-disable-next-line react/display-name
const AddressSection = React.memo(
  ({
    address,
    onDelete,
    isSelected,
    onSelect,
  }: {
    address: Address;
    onDelete: () => void;
    isSelected: boolean;
    onSelect: () => void;
  }) => {
    return (
      <div
        onClick={onSelect}
        className={`relative cursor-pointer border-2 p-4 rounded-lg mb-4 transition-all duration-200 ${
          isSelected
            ? "border-red-300 bg-red-50"
            : "border-gray-200 hover:border-gray-300 bg-white"
        }`}
      >
        <button
          onClick={(e) => {
            e.stopPropagation(); // Ngăn chặn event click address
            onDelete();
          }}
          className="absolute top-2 right-2 text-red-500 hover:text-red-600"
        >
          <FaTrashAlt size={16} />
        </button>
        <div>
          <p className="font-medium">{address.fullName}</p>
          <p>{address.phone}</p>
          <p>{address.email}</p>
          <p>{`${address.street}, ${address.ward}, ${address.district}, ${address.city}`}</p>
          {address.addressLine2 && <p>{address.addressLine2}</p>}
        </div>
      </div>
    );
  }
);

const CartSummary: React.FC<{
  subtotal: number;
  shippingDiscount: number;
  shippingCharge: number;
  productDiscount: number;
  total: number;
}> = ({
  subtotal,
  shippingDiscount,
  shippingCharge,
  productDiscount,
  total,
}) => (
  <div className="bg-white p-4 rounded-lg">
    <h2 className="font-bold mb-4">Payment Details</h2>
    <div className="flex justify-between mb-2">
      <span>Subtotal</span>
      <span>{formatCurrency(subtotal)}</span>
    </div>
    <div className="flex justify-between mb-2">
      <span>Shipping Charge</span>
      <span>{formatCurrency(shippingCharge)}</span>
    </div>
    {shippingDiscount > 0 && (
      <div className="flex justify-between mb-2">
        <span>Shipping Discount Subtotal</span>
        <span className="text-red-600">
          -{formatCurrency(shippingDiscount)}
        </span>
      </div>
    )}

    {productDiscount > 0 && (
      <div className="flex justify-between mb-2">
        <span>Voucher Discount</span>
        <span className="text-red-600">-{formatCurrency(productDiscount)}</span>
      </div>
    )}
    <div className="flex justify-between">
      <span>Total Payment</span>
      <span className="font-bold">{formatCurrency(total)}</span>
    </div>
    <div className="text-right text-sm text-gray-500 mt-1">(VAT included)</div>
  </div>
);

const CheckoutForm: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [shippingAddresses, setShippingAddresses] = useState<Address[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [selectedShippingAddress, setSelectedShippingAddress] =
    useState<Address | null>(null);
  const { items } = useCart();
  const [shippingDiscount, setShippingDiscount] = useState(0);
  const [productDiscount, setProductDiscount] = useState(0);
  const [appliedCoupons, setAppliedCoupons] = useState<{
    shippingCoupon: Coupon | null;
    shoppingCoupon: Coupon | null;
  }>({
    shippingCoupon: null,
    shoppingCoupon: null,
  });

  const fetchAddressInfo = async () => {
    try {
      const response = await axiosInstance.get("/users/info");
      if (response?.data?.status) {
        const userData = response?.data?.user;
        if (userData) {
          const shippingAddresses = userData.shippingAddress || [];
          const processedShippingAddresses = shippingAddresses.map(
            (address: any) => ({
              _id: address._id,
              fullName: address.fullName,
              email: address.email,
              phone: address.phone,
              street: address.street,
              city: address.city,
              district: address.district,
              ward: address.ward,
            })
          );
          setShippingAddresses(processedShippingAddresses);
        }
      }
    } catch (error) {
      console.error("Error fetching user address info:", error);
    }
  };

  useEffect(() => {
    fetchAddressInfo();
  }, []);

  useEffect(() => {
    const savedCoupons = localStorage.getItem("appliedCoupons");
    if (savedCoupons) {
      const coupons = JSON.parse(savedCoupons);
      setAppliedCoupons(coupons);

      setShippingDiscount(coupons.shippingCoupon?.maximumDiscount || 0);
      setProductDiscount(coupons.shoppingCoupon?.maximumDiscount || 0);
    }
  }, []);

  const orderSummary = useMemo(
    () => generateOrderSummary(items, 25000, shippingDiscount, productDiscount),
    [items, shippingDiscount, productDiscount]
  );

  const handleAddAddress = (address: Address) => {
    setShippingAddresses([...shippingAddresses, address]);
  };

  const handleDeleteAddress = async (index: number) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );
    if (!confirmDelete) return;

    try {
      const addressId = shippingAddresses[index]._id;

      const response = await axiosInstance.delete(
        `/users/address/${addressId}`
      );

      if (response?.data?.status) {
        const updatedAddresses = shippingAddresses.filter(
          (_, i) => i !== index
        );
        setShippingAddresses(updatedAddresses);

        toast.success(response.data.msg);
      }
    } catch (error) {
      console.error("Error deleting shipping address:", error);
      toast.error("Failed to delete address.");
    }
  };

  const handleSaveAndPay = async () => {
    const data = {
      paymentMethod: selectedPaymentMethod,
      shippingAddress: selectedShippingAddress,
      items: items.map((item) => ({
        productId: item?.productId,
        productName: item?.name,
        productImage: item?.variantImage?.url,
        color: item?.color,
        price: item?.price,
        quantity: item?.quantity,
        sku: item?.sku,
      })),
      appliedCoupons: [
        ...(appliedCoupons.shippingCoupon
          ? [appliedCoupons.shippingCoupon.code]
          : []),
        ...(appliedCoupons.shoppingCoupon
          ? [appliedCoupons.shoppingCoupon.code]
          : []),
      ],
    };

    if (!selectedShippingAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    try {
      setIsLoading(true); // Bắt đầu loading
      const response = await axiosInstance.post("/orders", data);

      if (response?.data?.status) {
        localStorage.removeItem("appliedCoupons");
        if (response.data.url === "") {
          window.location.href = `/success?orderId=${response.data.data.orderId}&total=${response.data.data.total}`;
        } else {
          window.location.href = response.data.url;
        }
      }
    } catch (error) {
      console.error("Error creating order:", error);
      toast.error("Failed to create order. Please try again.");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };

  const handleBackToCart = () => router.push("/cart");

  return (
    <>
      {isLoading && <Loading />}
      <ShippingInfo
        shippingAddresses={shippingAddresses}
        onAddNewAddress={() => setIsAddressFormOpen(true)}
        onDeleteAddress={handleDeleteAddress}
        onSaveAndPay={handleSaveAndPay}
        onBackToCart={handleBackToCart}
        subtotal={orderSummary?.subtotal || 0}
        shippingDiscount={orderSummary?.shippingDiscount || 0}
        shippingCharge={orderSummary?.shippingCharge || 0}
        productDiscount={orderSummary?.discount || 0}
        total={orderSummary?.total || 0}
        items={items}
        selectedShippingAddress={selectedShippingAddress}
        setSelectedShippingAddress={setSelectedShippingAddress}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodSelect={setSelectedPaymentMethod}
      />
      {isAddressFormOpen && (
        <AddressForm
          onClose={() => setIsAddressFormOpen(false)}
          onAddAddress={handleAddAddress}
        />
      )}
    </>
  );
};

export default CheckoutForm;
