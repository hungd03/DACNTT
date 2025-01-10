"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { resetPasswordSchema } from "@/features/auth/utils/validations";
import { useResetFlow } from "@/features/auth/hooks/useResetFlow";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import toast from "react-hot-toast";

export default function NewPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, resetPassword } = useResetFlow();
  // Kiểm tra resetToken khi component mount
  useEffect(() => {
    const resetToken = localStorage.getItem("resetToken");
    if (!resetToken) {
      toast.error("Invalid reset token. Please try again");
      router.replace("/auth/forgot-password");
    }
  }, [router]);

  const formik = useFormik({
    initialValues: {
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: resetPasswordSchema,
    onSubmit: async (values) => {
      await resetPassword(values.newPassword);
    },
  });

  return (
    <div className="flex justify-center items-center bg-gray-100 pt-0 md:py-12">
      <div className="bg-white md:rounded-lg shadow-lg overflow-hidden flex flex-wrap md:flex-nowrap flex-col md:flex-row max-w-[120vh] w-full min-h-[70vh]">
        {/* Left Side Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/auth/slider1.jpg"
            alt="keyboards"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right side form */}
        <div className="flex max-w-[120vh] w-full md:w-1/2 p-8 h-full min-h-[70vh]">
          <div className="w-full max-w-md">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              Create New Password
            </h1>
            <p className="text-gray-600 text-sm mb-8">
              Your new password must be different from previous used passwords.
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* New Password Field */}
              <div>
                <label
                  htmlFor="newPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                      formik.touched.newPassword && formik.errors.newPassword
                        ? "border-red-500"
                        : ""
                    }`}
                    id="newPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="New Password"
                    {...formik.getFieldProps("newPassword")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  >
                    {showPassword ? (
                      <FaRegEyeSlash size={16} />
                    ) : (
                      <FaRegEye size={16} />
                    )}
                  </button>
                </div>
                {formik.touched.newPassword && formik.errors.newPassword && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.newPassword}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  {...formik.getFieldProps("confirmPassword")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                    formik.touched.confirmPassword &&
                    formik.errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Confirm Password"
                />
                {formik.touched.confirmPassword &&
                  formik.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-500">
                      {formik.errors.confirmPassword}
                    </p>
                  )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`mt-10 w-full py-3 px-3 text-sm rounded-lg focus:outline-none focus:shadow-outline bg-orange-600 hover:bg-orange-700 text-white
                ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isLoading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
