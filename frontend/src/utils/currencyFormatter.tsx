export const formatCurrency = (value: number): string => {
  const formattedValue = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(value);

  return formattedValue;
};
