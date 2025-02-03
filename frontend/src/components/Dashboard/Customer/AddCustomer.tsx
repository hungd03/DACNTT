"use client";
import React from "react";
import { useFormik } from "formik";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { useUser } from "@/features/user/useUser";
import { User } from "@/types/user";
import { customerValidationSchema } from "@/features/user/validation";

interface CustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: User;
  onSuccess?: () => void;
}

interface CustomerFormData {
  fullName: string;
  email: string;
  phone: string;
  status: string;
}

const AddCustomerDialog: React.FC<CustomerFormProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const { createUser, updateUser, isCreating, isUpdating } = useUser();

  const isEditing = Boolean(initialData?._id);
  const isLoading = isCreating || isUpdating;

  const formik = useFormik<CustomerFormData>({
    initialValues: {
      fullName: initialData?.fullName || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      status: initialData?.status || "",
    },
    validationSchema: customerValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEditing && initialData?._id) {
          await updateUser({
            userId: initialData._id,
            updateData: values,
          });
          toast.success("Customer updated successfully");
        } else {
          await createUser(values);
          toast.success("Customer created successfully");
        }
        onSuccess?.();
        formik.resetForm({});
        onClose();
      } catch (error) {
        toast.error(
          isEditing ? "Failed to update customer" : "Failed to create customer"
        );
        console.error("Form submission error:", error);
      }
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Edit Customer" : "Add New Customer"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label>Full name</label>
              <Input
                id="fullName"
                {...formik.getFieldProps("fullName")}
                placeholder="Enter full name"
                className={
                  formik.touched.fullName && formik.errors.fullName
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.fullName && formik.errors.fullName && (
                <div className="text-red-500 text-sm">
                  {formik.errors.fullName}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <label>Email</label>
              <Input
                id="email"
                {...formik.getFieldProps("email")}
                placeholder="Enter email"
                type="email"
                className={
                  formik.touched.email && formik.errors.email
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.email && formik.errors.email && (
                <div className="text-red-500 text-sm">
                  {formik.errors.email}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <label>Phone number</label>
              <Input
                id="phone"
                {...formik.getFieldProps("phone")}
                placeholder="Enter phone number"
                className={
                  formik.touched.phone && formik.errors.phone
                    ? "border-red-500"
                    : ""
                }
              />
              {formik.touched.phone && formik.errors.phone && (
                <div className="text-red-500 text-sm">
                  {formik.errors.phone}
                </div>
              )}
            </div>
            <div className="grid gap-2">
              <label>Status</label>
              <Select
                value={formik.values.status}
                onValueChange={(value) => formik.setFieldValue("status", value)}
              >
                <SelectTrigger
                  className={
                    formik.touched.status && formik.errors.status
                      ? "border-red-500"
                      : ""
                  }
                >
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="locked">Locked</SelectItem>
                </SelectContent>
              </Select>
              {formik.touched.status && formik.errors.status && (
                <div className="text-red-500 text-sm">
                  {formik.errors.status}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Customer"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddCustomerDialog;
