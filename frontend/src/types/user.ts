// types/user.ts
export interface Address {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  street: string;
  ward: string;
  district: string;
  city: string;
}

export interface OrderHistory {
  orderId: string;
  date: Date;
  status: "Pending" | "On the way" | "Delivered" | "Delivered" | "Cancelled";
  totalAmount: number;
  couponUsage: string[];
}

export interface User {
  userId: string;
  _id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: {
    url: string;
    publicId: string;
  };
  status: string;
  role: string;
  createdAt: string;
}

export interface UpdateUserResponse {
  status: boolean;
  user: User;
}

export interface ChangePasswordData {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateUserData {
  fullName: string;
  email: string;
  phone: string;
  role?: string;
}

export interface UserPaginationResponse {
  status: boolean;
  users: {
    users: User[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}
