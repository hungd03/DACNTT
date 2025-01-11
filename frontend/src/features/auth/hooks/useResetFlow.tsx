/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { authApi } from "../api/auth.api";

export const useResetFlow = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startResetFlow = async (email: string) => {
    setIsLoading(true);
    try {
      const response = await authApi.forgotPassword({ email });
      if (response.data.status) {
        localStorage.setItem("resetEmail", email);
        // Khởi tạo flow reset password
        await authApi.initResetFlow(email);

        await toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1000)),
          {
            loading: "Sending...",
            success: response.data.msg,
            error: "Failed to send reset email",
          }
        );

        router.replace("/auth/verify-otp");
      }
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Something went wrong");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (otpString: string) => {
    setIsLoading(true);
    try {
      const email = localStorage.getItem("resetEmail");
      if (!email) {
        throw new Error("Email not found");
      }

      const response = await authApi.verifyOtp({ email, otp: otpString });
      if (response.data.status) {
        localStorage.setItem("resetToken", response.data.resetToken);

        await toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1000)),
          {
            loading: "Verifying...",
            success: response.data.msg,
            error: "Verification failed",
          }
        );

        router.replace("/auth/new-password");
      }
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Invalid OTP");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (newPassword: string) => {
    setIsLoading(true);
    try {
      const resetToken = localStorage.getItem("resetToken");
      if (!resetToken) {
        throw new Error("Reset token not found");
      }

      const response = await authApi.resetPassword({
        resetToken,
        newPassword,
      });

      if (response.data.status) {
        await toast.promise(
          new Promise((resolve) => setTimeout(resolve, 1000)),
          {
            loading: "Resetting password...",
            success: response.data.msg,
            error: "Failed to reset password",
          }
        );

        // Clear localStorage
        localStorage.removeItem("resetEmail");
        localStorage.removeItem("resetToken");

        router.replace("/auth/login");
      }
      return response;
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Failed to reset password");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const resendOtp = async () => {
    if (countdown > 0) return;

    setIsLoading(true);
    try {
      const email = localStorage.getItem("resetEmail");
      if (!email) throw new Error("Email not found");

      const response = await authApi.forgotPassword({ email });
      if (response.data.status) {
        toast.success("OTP resent successfully");
        setCountdown(60); // Start 60 second countdown
      }
    } catch (error: any) {
      toast.error(error.response?.data?.msg || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    countdown,
    startResetFlow,
    verifyOtp,
    resetPassword,
    resendOtp,
  };
};
