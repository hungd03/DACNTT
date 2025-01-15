import Image from "next/image";
import { IoCloseCircleOutline } from "react-icons/io5";
import { Transition } from "@headlessui/react";
import { BsTrash3Fill } from "react-icons/bs";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/utils/currencyFormatter";
import { useCart } from "@/features/cart/CartContext";

interface CartSidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const CartSidebar: React.FC<CartSidebarProps> = ({ isOpen, setIsOpen }) => {
  const router = useRouter();
  const { items, removeItem } = useCart();

  // Calculate total amount
  const totalAmount = items.reduce((sum, item) => {
    return sum + (item.price || 0) * item.quantity;
  }, 0);

  const handleRemoveItem = async (productId: string, sku: string) => {
    try {
      await removeItem(productId, sku);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  return (
    <div
      className={`fixed inset-0 flex justify-end z-50 ${
        isOpen ? "block translate-x-100" : "hidden translate-x-0"
      }`}
    >
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black opacity-50"
        ></div>
      )}

      <Transition
        show={isOpen}
        enter="transform transition ease-in-out duration-300"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transform transition ease-in-out duration-300"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="w-[400px] bg-white h-full shadow-lg transform overflow-y-auto flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-800">Your Cart</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-red-500 transition-transform transform hover:scale-110"
            >
              <IoCloseCircleOutline size={24} />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {items.length > 0 ? (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.sku}`}
                  className="flex items-center border-b pb-4 mb-4"
                >
                  {item.variantImage && (
                    <Image
                      src={item.variantImage.url}
                      alt="cart item"
                      width={64}
                      height={64}
                      className="object-cover rounded-lg"
                    />
                  )}
                  <div className="ml-4 w-full">
                    <h3 className="text-sm font-semibold text-gray-800">
                      {item.name}
                    </h3>
                    {item.color && (
                      <p className="text-sm text-gray-600">
                        Color: {item.color}
                      </p>
                    )}
                    <p className="text-sm text-gray-600">
                      Price: {formatCurrency(item.price || 0)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.productId, item.sku)}
                    className="text-gray-400 hover:text-red-500 transition-all duration-200 ease-in-out ml-4"
                  >
                    <BsTrash3Fill size={20} />
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-10">
                <Image
                  src="/empty-cart.avif"
                  width={400}
                  height={400}
                  alt="Empty Cart"
                />
                <div className="mt-1 text-xl">Your cart is empty.</div>
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-medium font-bold text-gray-800">
                  SubTotal ({items.length} products)
                </span>
                <span className="text-base font-bold text-red-600">
                  {formatCurrency(totalAmount)}
                </span>
              </div>

              <button
                onClick={() => {
                  router.push("/cart");
                  setIsOpen(false);
                }}
                className="w-full bg-red-500 text-white font-medium py-3 rounded-lg shadow-md hover:bg-red-600"
              >
                View Cart
              </button>
            </div>
          )}
        </div>
      </Transition>
    </div>
  );
};

export default CartSidebar;
