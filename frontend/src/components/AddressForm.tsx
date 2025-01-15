/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { axiosInstance } from "@/lib/axiosInstance";
import toast from "react-hot-toast";

interface AddressFormProps {
  onClose: () => void;
  onAddAddress: (address: AddressFormValues) => void;
}

interface AddressFormValues {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  city: string;
  ward: string;
  district: string;
  street: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ onClose, onAddAddress }) => {
  const allowedDomains = ["gmail.com", "yahoo.com", "outlook.com"];
  const [cities, setCities] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const findByCode = (list: any[], code: string) =>
    list.find((item: { code: any }) => String(item.code) === code);
  const formik = useFormik<AddressFormValues>({
    initialValues: {
      _id: "",
      fullName: "",
      email: "",
      phone: "",
      city: "",
      ward: "",
      district: "",
      street: "",
    },
    validationSchema: Yup.object({
      fullName: Yup.string().required("Full Name is required"),
      phone: Yup.string()
        .required("Phone is required")
        .matches(/^[0-9]+$/, "Phone must be numeric"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required")
        .test(
          "is-valid-domain",
          "Email must belong to a valid domain",
          (value) => {
            if (!value) return false;
            const domain = value.split("@")[1];
            return allowedDomains.includes(domain);
          }
        ),
      city: Yup.string().required("City is required"),
      ward: Yup.string().required("Ward is required"),
      district: Yup.string().required("District is required"),
      street: Yup.string().required("Street Address is required"),
    }),
    onSubmit: async (values) => {
      const selectedCity = findByCode(cities, values.city);
      const selectedDistrict = findByCode(districts, values.district);
      const selectedWard = findByCode(wards, values.ward);

      const payload = {
        address: {
          fullName: values.fullName,
          email: values.email,
          phone: values.phone,
          street: values.street,
          city: selectedCity?.name,
          district: selectedDistrict?.name,
          ward: selectedWard?.name,
        },
      };

      try {
        const response = await axiosInstance.post("/users/address", payload);
        if (response?.data?.status) {
          toast.success(response?.data?.msg);
          console.log("Response after adding address:", response.data.user);
          onAddAddress({
            _id: response.data.user,
            fullName: values.fullName,
            email: values.email,
            phone: values.phone,
            street: values.street,
            city: selectedCity?.name,
            district: selectedDistrict?.name,
            ward: selectedWard?.name,
          });
          onClose();
        } else {
          toast.error(response?.data?.msg || "Failed to add address.");
        }
      } catch (error) {
        console.error("Error adding address:", error);
        toast.error("Failed to add address.");
      }
    },
  });

  const host = "https://provinces.open-api.vn/api/";

  // Fetch cities on component mount
  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${host}?depth=1`);
        setCities(response.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };

    fetchCities();
  }, []);

  // Fetch districts when a city is selected
  useEffect(() => {
    if (!formik.values.city) {
      setDistricts([]);
      setWards([]);
      return;
    }

    const fetchDistricts = async () => {
      try {
        const response = await axios.get(
          `${host}p/${formik.values.city}?depth=2`
        );
        setDistricts(response.data.districts);
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };

    fetchDistricts();
  }, [formik.values.city]);

  // Fetch wards when a district is selected
  useEffect(() => {
    if (!formik.values.district) {
      setWards([]);
      return;
    }

    const fetchWards = async () => {
      try {
        const response = await axios.get(
          `${host}d/${formik.values.district}?depth=2`
        );
        setWards(response.data.wards);
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    };

    fetchWards();
  }, [formik.values.district]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500 bg-opacity-50 min-h-screen p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Address</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.fullName}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <p className="text-red-500 text-sm">{formik.errors.fullName}</p>
              )}
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.phone}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm">{formik.errors.phone}</p>
              )}
            </div>
            {/* Cities */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cities <span className="text-red-500">*</span>
              </label>
              <select
                name="city"
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("district", "");
                  formik.setFieldValue("ward", "");
                }}
                onBlur={formik.handleBlur}
                value={formik.values.city}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>
                  Chọn tỉnh thành
                </option>
                {cities.map((city: any) => (
                  <option key={city.code} value={city.code}>
                    {city.name}
                  </option>
                ))}
              </select>
              {formik.touched.city && formik.errors.city && (
                <p className="text-red-500 text-sm">{formik.errors.city}</p>
              )}
            </div>
            {/* District */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                District <span className="text-red-500">*</span>
              </label>
              <select
                name="district"
                onChange={(e) => {
                  formik.handleChange(e);
                  formik.setFieldValue("ward", "");
                }}
                onBlur={formik.handleBlur}
                value={formik.values.district}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>
                  Chọn quận huyện
                </option>
                {districts.map((district: any) => (
                  <option key={district.code} value={district.code}>
                    {district.name}
                  </option>
                ))}
              </select>
              {formik.touched.district && formik.errors.district && (
                <p className="text-red-500 text-sm">{formik.errors.district}</p>
              )}
            </div>

            {/* Ward */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ward <span className="text-red-500">*</span>
              </label>
              <select
                name="ward"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.ward}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="" disabled>
                  Chọn phường xã
                </option>
                {wards.map((ward: any) => (
                  <option key={ward.code} value={ward.code}>
                    {ward.name}
                  </option>
                ))}
              </select>
              {formik.touched.ward && formik.errors.ward && (
                <p className="text-red-500 text-sm">{formik.errors.ward}</p>
              )}
            </div>
          </div>

          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mt-5">
              Street Address <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="street"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.street}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
            {formik.touched.street && formik.errors.street && (
              <p className="text-red-500 text-sm">{formik.errors.street}</p>
            )}
          </div>
          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-red-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Save Address
            </button>
            <button
              type="button"
              onClick={onClose}
              className="ml-4 text-gray-700 py-2 px-4 rounded-md shadow-sm hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
