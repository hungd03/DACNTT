"use client";
import Image from "next/image";
import React from "react";

interface PaymentMethodSelectionProps {
  selectedMethod: string;
  onMethodSelect: (methodId: string) => void;
}

const PaymentMethodSelection: React.FC<PaymentMethodSelectionProps> = ({
  selectedMethod,
  onMethodSelect,
}) => {
  const paymentMethods = [
    { id: "cod", name: "Cash On Delivery", icon: "/cod.png" },
    { id: "vnpay", name: "VNPay", icon: "/vnpay.jpg" },
    { id: "momo", name: "Momo", icon: "/momo.png" },
  ];

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-6">Select Payment Method</h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            onClick={() => onMethodSelect(method.id)}
            className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border-2 transition-all duration-200 ${
              selectedMethod === method.id
                ? "border-red-300 bg-red-50"
                : "border-gray-200 hover:border-gray-300 bg-white"
            }`}
          >
            <div className="w-12 h-12 mb-2 relative">
              <Image
                src={method.icon || "https://placehold.co/50x50"}
                alt={method.name}
                fill
                className="object-contain"
                sizes="(max-width: 48px) 100vw"
                priority={method.id === "cod"}
              />
            </div>
            <span className="text-sm text-gray-600 text-center">
              {method.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethodSelection;
