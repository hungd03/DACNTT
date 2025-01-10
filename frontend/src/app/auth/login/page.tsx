"use client";
import React, { useState } from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { GoogleLogin } from "@react-oauth/google";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authApi } from "@/features/auth/api/auth.api";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/auth/utils/toast.utils";
import { loginSchema } from "@/features/auth/utils/validations";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      try {
        const response = await authApi.login(values);
        if (response.data.success) {
          await login(response.data.accessToken);
          showSuccessToast(response.data.msg);
          router.push(response.data.role === "customer" ? "/" : "/dashboard");
        }
      } catch (err) {
        showErrorToast(err);
      }
    },
  });

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await authApi.googleAuth(credentialResponse.credential);
      if (response.data.success) {
        await login(response.data.accessToken);
        showSuccessToast(response.data.msg);
        router.push(response.data.role === "customer" ? "/" : "/dashboard");
      }
    } catch (error) {
      showErrorToast(error);
    }
  };

  const handleGoogleError = () => {
    showErrorToast("Google login failed");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 pt-0 md:py-12">
      <div className="bg-white md:rounded-lg shadow-lg overflow-hidden flex flex-wrap md:flex-nowrap flex-col md:flex-row max-w-6xl w-full">
        {/* Left Side Image */}
        <div className="w-full md:w-1/2">
          <img
            src="/auth/slider1.jpg"
            alt="keyboards"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Right Side Form */}
        <div className="w-full md:w-1/2 p-10 md:p-16">
          <h2 className="text-3xl font-bold text-orange-600 mb-8">Log In</h2>
          <form onSubmit={formik.handleSubmit}>
            {/* Email Field */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-lg font-medium mb-2"
                htmlFor="email"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }`}
                id="email"
                type="email"
                placeholder="Email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm italic">
                  {formik.errors.email}
                </p>
              )}
            </div>
            {/* Password Field */}
            <div className="mb-8">
              <label
                className="block text-gray-700 text-lg font-medium mb-2"
                htmlFor="password"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                    formik.touched.password && formik.errors.password
                      ? "border-red-500"
                      : ""
                  }`}
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  {...formik.getFieldProps("password")}
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
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm italic text-left">
                  {formik.errors.password}
                </p>
              )}
              {/* Forget your password */}
              <div className="flex justify-between">
                <Link
                  href="/auth/forgot-password"
                  className="mt-2 text-[13px] text-decoration-line: underline text-gray-500 hover:text-gray-600 ml-auto"
                >
                  Forget your password
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-12 rounded-lg focus:outline-none focus:shadow-outline"
              >
                Log In
              </button>
            </div>
          </form>

          {/* Sign Up Link */}
          <p className="text-left text-[13px] text-gray-500 text-sm mt-2">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-[13px] text-decoration-line: underline text-orange-600 hover:text-orange-700 font-medium"
            >
              Sign Up
            </Link>
          </p>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="px-4 text-gray-500 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          {/* Google Login */}
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
              theme="outline"
              shape="rectangular"
              size="large"
              width="340"
              text="continue_with"
              locale="en"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
