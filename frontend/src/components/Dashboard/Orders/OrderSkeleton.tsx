import React from "react";

const OrderSkeleton = () => {
  return (
    <div className="flex flex-col gap-4 mt-4 animate-pulse">
      {[1, 2, 3, 4].map((item) => (
        <div key={item} className="border rounded">
          <div className="px-4 py-2 bg-gray-50 flex items-center gap-2 text-sm border-b">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-20 bg-gray-200 rounded-full" />
              <div className="w-6 h-6 bg-gray-200 rounded-full" />
              <div className="h-2.5 w-32 bg-gray-200 rounded-full" />
            </div>
            <div className="h-2.5 w-40 bg-gray-200 rounded-full ml-auto" />
          </div>

          <div className="grid grid-cols-7 items-stretch border-b">
            <div className="flex flex-col gap-3 p-3 border-r">
              {[1, 2].map((product) => (
                <div key={product} className="flex gap-3 border-b mb-2">
                  <div className="w-[50px] h-[50px] bg-gray-200 rounded" />
                  <div className="flex flex-col gap-2">
                    <div className="h-2.5 w-32 bg-gray-200 rounded-full" />
                    <div className="h-2.5 w-20 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>

            {[...Array(6)].map((_, index) => (
              <div key={index} className="p-3 border-r flex items-center">
                <div className="h-2.5 w-20 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSkeleton;
