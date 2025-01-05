const formatOrderDataForEmail = (orderData) => {
  // Lấy dữ liệu thuần từ document Mongoose
  const plainOrderData = orderData.toObject ? orderData.toObject() : orderData;

  return {
    orderId: plainOrderData.orderId,
    items: plainOrderData.items.map((item) => ({
      productName: item.productName,
      productImage: item.productImage,
      color: item.color,
      quantity: item.quantity,
      price: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(item.price),
    })),
    shippingAddress: plainOrderData.shippingAddress,
    billingAddress: plainOrderData.billingAddress,
    subtotal: new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(plainOrderData.subtotal),
    tax: new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(plainOrderData.tax),
    shippingCharge: new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(plainOrderData.shippingCharge),
    discount: new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(plainOrderData.discount),
    total: new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(plainOrderData.total),
    orderDate: new Date(plainOrderData.orderDate).toLocaleDateString("vi-VN"),
  };
};

module.exports = { formatOrderDataForEmail };
