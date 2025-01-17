/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useFormik } from "formik";
import * as Yup from "yup";
import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useAuth } from "@/features/auth/hooks/useAuth";

const ALLOWED_FORMATS = [
  "image/jpg",
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];
const FILE_SIZE = 2 * 1024 * 1024; // 2MB

const AccountInfo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string>("");
  const { user, login } = useAuth();

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: user?.fullName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      avatar: undefined as File | undefined,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Full Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      phone: Yup.string().required("Phone number is required"),
      avatar: Yup.mixed()
        .test("fileSize", "File too large", (value) => {
          if (!value) return true;
          return value && (value as File).size <= FILE_SIZE;
        })
        .test("fileFormat", "Unsupported Format", (value) => {
          if (!value) return true;
          return value && ALLOWED_FORMATS.includes((value as File).type);
        }),
    }),
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        let imageUrl = user?.avatar;

        // Upload image if there's a new one
        if (values.avatar) {
          const formData = new FormData();
          formData.append("image", values.avatar);

          const uploadResponse = await axiosInstance.post(
            "/upload/images",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          if (uploadResponse.data.status) {
            imageUrl = uploadResponse.data.data[0].url;
          }
        }

        // Update user info
        const updateResponse = await axiosInstance.put("/users/info", {
          fullName: values.name,
          phone: values.phone,
          avatar: imageUrl,
        });

        if (updateResponse.data.status) {
          toast.success(updateResponse.data.msg);
          // Fetch updated user info to update context
          const userResponse = await axiosInstance.get("/users/info");
          if (userResponse.data.status) {
            // Update auth context with new user data
            await login(Cookies.get("token") || "");
          }
        }
      } catch (error: any) {
        toast.error(error.response?.data?.msg || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      formik.setFieldValue("avatar", file);
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mx-auto p-4 sm:p-8 sm:pt-0">
      <h1 className="text-xl sm:text-2xl font-bold text-black mb-4 sm:mb-6">
        Account Information
      </h1>
      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Avatar Preview */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative w-32 h-32">
            <Image
              src={
                previewImage || user?.avatar || "https://placehold.co/100x100"
              }
              alt="Profile"
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col items-center">
            <label htmlFor="avatar" className="cursor-pointer">
              <div className="px-4 py-2 bg-gray-100 rounded-md hover:bg-gray-200 transition">
                Change Photo
              </div>
              <input
                id="avatar"
                name="avatar"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {formik.errors.avatar && (
              <p className="text-red-500 text-sm mt-1">
                {formik.errors.avatar as string}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...formik.getFieldProps("name")}
              className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.name}</p>
            )}
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              {...formik.getFieldProps("email")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm py-2 px-3"
              disabled
            />
          </div>

          {/* Phone Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...formik.getFieldProps("phone")}
              className={`mt-1 block w-full rounded-md shadow-sm py-2 px-3 ${
                formik.touched.phone && formik.errors.phone
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full sm:w-auto py-2 px-4 bg-orange-500 text-white font-semibold rounded-md shadow-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AccountInfo;
