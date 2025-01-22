export const USER = {
  ROLE: {
    ADMIN: "admin",
    CUSTOMER: "customer",
  },
  STATUS: {
    ACTIVE: "active",
    INACTIVE: "inactive",
    LOCKED: "locked",
  },
};

export const ORDER = {
  STATUS: {
    PENDING: "Pending",
    ONTHEWAY: "On the way",
    DELIVERED: "Delivered",
    REJECTED: "Rejected",
    CANCELLED: "Cancelled",
    RETURNED: "Returned",
  },
  PAYMENT_METHOD: {
    COD: "cod",
    VNPAY: "vnpay",
    MOMO: "momo",
  },
  PAYMENT_STATUS: {
    UNPAID: "Unpaid",
    PAID: "Paid",
    CANCELLED: "Cancelled",
  },
  RETURN_STATUS: {
    PENDING: "Pending",
    ACCEPTED: "Accepted",
    REJECTED: "Rejected",
  },
};

export const COUPON = {
  COUPON_TYPE: {
    SHOPPING: "shopping",
    SHIPPING: "shipping",
  },
  DISCOUNT_TYPE: {
    PERCENT: "percent",
    FIXED: "fixed",
  },
};
