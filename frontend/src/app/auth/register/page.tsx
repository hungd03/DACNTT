// src/app/auth/register/page.tsx
"use client";
import React from "react";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerSchema } from "@/features/auth/utils/validations";
import { authApi } from "@/features/auth/api/auth.api";
import {
  showErrorToast,
  showSuccessToast,
} from "@/features/auth/utils/toast.utils";

export default function RegisterPage() {
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => {
      try {
        const response = await authApi.register(values);
        if (response.data.status) {
          showSuccessToast(response.data.msg);
          setTimeout(() => {
            router.push("/auth/login");
          }, 3000);
        }
      } catch (err) {
        showErrorToast(err);
      }
    },
  });

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
          <h2 className="text-3xl font-bold text-orange-600 mb-8">Sign Up</h2>
          <form onSubmit={formik.handleSubmit}>
            {/* Name Field */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-lg font-medium mb-2"
                htmlFor="fullName"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.fullName && formik.errors.fullName
                    ? "border-red-500"
                    : ""
                }`}
                id="fullName"
                type="text"
                placeholder="Name"
                {...formik.getFieldProps("fullName")}
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-red-500 text-sm italic">
                  {formik.errors.fullName}
                </p>
              )}
            </div>

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

            {/* Phone Field */}
            <div className="mb-6">
              <label
                className="block text-gray-700 text-lg font-medium mb-2"
                htmlFor="phone"
              >
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.phone && formik.errors.phone
                    ? "border-red-500"
                    : ""
                }`}
                id="phone"
                type="tel"
                placeholder="Your phone number"
                {...formik.getFieldProps("phone")}
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm italic">
                  {formik.errors.phone}
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
              <input
                className={`shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : ""
                }`}
                id="password"
                type="password"
                placeholder="Password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-sm italic">
                  {formik.errors.password}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
              >
                Sign Up
              </button>
            </div>
          </form>

          <p className="text-center text-gray-500 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-orange-600 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
