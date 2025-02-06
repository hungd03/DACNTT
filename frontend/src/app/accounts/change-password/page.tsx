"use client";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useUser } from "@/features/user/useUser";

const ChangePassword: React.FC = () => {
  const { changePassword, isChangingPassword } = useUser();
  const formik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      oldPassword: Yup.string().required("Old password is required"),
      newPassword: Yup.string()
        .min(6, "Password must be at least 6 characters long")
        .required("New password is required"),
      confirmPassword: Yup.string().required("Confirm password is required"),
    }),
    onSubmit: async (values) => {
      try {
        await changePassword(values);

        formik.resetForm({});
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error("Change password error:", error);
      }
    },
  });

  return (
    <div className="w-full p-8 pt-0">
      <h1 className="text-2xl font-bold text-black mb-6">
        Change Password
      </h1>
      <div className="px-0 pt-6 pb-8">
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm mb-2"
              htmlFor="oldPassword"
            >
              Old Password <span className="text-red-500">*</span>
            </label>
            <input
              id="oldPassword"
              name="oldPassword"
              type="password"
              className={`mt-1 block w-full border ${
                formik.touched.oldPassword && formik.errors.oldPassword
                  ? "border-red-500"
                  : "border-gray-300"
              } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
              placeholder="Old Password"
              value={formik.values.oldPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.oldPassword && formik.errors.oldPassword && (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.oldPassword}
              </div>
            )}
          </div>
          <div className="mb-4 sm:flex sm:space-x-4">
            <div className="w-full sm:w-1/2 mb-4 sm:mb-0">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="newPassword"
              >
                New Password <span className="text-red-500">*</span>
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                className={`mt-1 block w-full border ${
                  formik.touched.newPassword && formik.errors.newPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                placeholder="New Password"
                value={formik.values.newPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.newPassword && formik.errors.newPassword && (
                <div className="text-red-500 text-xs mt-1">
                  {formik.errors.newPassword}
                </div>
              )}
            </div>
            <div className="w-full sm:w-1/2">
              <label
                className="block text-gray-700 text-sm mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                className={`mt-1 block w-full border ${
                  formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                    ? "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm`}
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.touched.confirmPassword &&
                formik.errors.confirmPassword && (
                  <div className="text-red-500 text-xs mt-1">
                    {formik.errors.confirmPassword}
                  </div>
                )}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
            >
              {isChangingPassword ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
