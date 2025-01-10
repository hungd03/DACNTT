// src/app/auth/forgot-password/page.tsx
"use client";
import React from "react";
import { useFormik } from "formik";
import Link from "next/link";
import { forgotPasswordSchema } from "@/features/auth/utils/validations";
import { useResetFlow } from "@/features/auth/hooks/useResetFlow";

export default function ForgotPasswordPage() {
  const { isLoading, startResetFlow } = useResetFlow();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: forgotPasswordSchema,
    onSubmit: async (values) => {
      await startResetFlow(values.email);
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
              Reset Your Password
            </h1>
            <p className="text-gray-600 text-sm mb-8">
              Enter your email and we&apos;ll send you a link to reset your
              password. Please check it.
            </p>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  {...formik.getFieldProps("email")}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  placeholder="Email Address"
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-500">
                    {formik.errors.email}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`bg-orange-600 text-white hover:bg-orange-700 py-3 px-12 rounded-lg focus:outline-none focus:shadow-outline ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isLoading ? "Sending..." : "Send Email"}
              </button>
            </form>

            <div className="text-left mt-1">
              <Link
                href="/auth/login"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Back to{" "}
                <span className="text-decoration-line: underline">Login</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
