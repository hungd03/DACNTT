import { axiosInstance } from "@/lib/axiosInstance";

import { User } from "@/types/auth";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyOtpRequest,
  VerifyOtpResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "./auth.types";

export const authApi = {
  login: (data: LoginRequest) =>
    axiosInstance.post<LoginResponse>("/auth/login", data),

  register: (data: RegisterRequest) =>
    axiosInstance.post<RegisterResponse>("/auth/register", data),

  getUserInfo: () =>
    axiosInstance.get<{ status: boolean; user: User }>("/users/info"),

  forgotPassword: (data: ForgotPasswordRequest) =>
    axiosInstance.post<ForgotPasswordResponse>("/auth/forgot-password", data),

  verifyOtp: (data: VerifyOtpRequest) =>
    axiosInstance.post<VerifyOtpResponse>("/auth/verify-otp", data),

  resetPassword: (data: ResetPasswordRequest) =>
    axiosInstance.post<ResetPasswordResponse>("/auth/reset-password", data),

  googleAuth: (credential: string) =>
    axiosInstance.post<LoginResponse>("/auth/google-auth", { credential }),

  initResetFlow: (email: string) =>
    axiosInstance.post<{ status: boolean }>("/auth/init-reset-flow", { email }),
};
