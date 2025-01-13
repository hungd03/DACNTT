"use client";
import React, { useEffect, useRef } from "react";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { categoryValidationSchema } from "@/features/category/utils/validation";
import { useCategories } from "@/features/category/hooks/useCategories";
import { Category } from "@/types/category";
import toast from "react-hot-toast";

interface CategoryFormProps {
  data?: Category | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryForm = ({
  data,
  isOpen,
  onClose,
  onSuccess,
}: CategoryFormProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { categories, createCategory, updateCategory, fetchCategories } =
    useCategories();
  useEffect(() => {
    fetchCategories();
  }, []);
  const formik = useFormik({
    initialValues: {
      name: data?.name || "",
      parent: data?.parent || "0",
      isHide: data?.isHide || false,
      image: null as File | null,
      existingImage: data?.image || null,
    },
    validationSchema: categoryValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();

        formData.append("name", values.name);
        formData.append("isHide", values.isHide.toString());
        if (values.parent !== "0") {
          formData.append("parent", values.parent);
        }

        if (values.image instanceof File) {
          formData.append("image", values.image);
        } else if (values.existingImage) {
          formData.append("image[url]", values.existingImage.url);
          formData.append("image[publicId]", values.existingImage.publicId);
        } else if (!data && !values.image) {
          toast.error("Please select an image");
          return;
        }

        let success;
        if (data?._id) {
          success = await updateCategory(data._id, formData);
        } else {
          success = await createCategory(formData);
        }

        if (success) {
          onSuccess();
          onClose();
          formik.resetForm();
        }
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      formik.setFieldValue("image", file);
    }
    if (event.target) {
      event.target.value = "";
    }
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
          formik.resetForm();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {data ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className={
                formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : ""
              }
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-red-500 text-sm">{formik.errors.name}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="parent">Parent Category</Label>
            <Select
              value={formik.values.parent || "0"}
              onValueChange={(value) =>
                formik.setFieldValue("parent", value === "0" ? null : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select parent category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">None</SelectItem>
                {categories
                  .filter(
                    (category) =>
                      category.parent === null && category._id !== data?._id
                  )
                  .map((category) => (
                    <SelectItem key={category._id} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="isHide"
              checked={formik.values.isHide}
              onCheckedChange={(checked) =>
                formik.setFieldValue("isHide", checked)
              }
            />
            <Label htmlFor="isHide">Hide Category</Label>
          </div>

          <div className="space-y-2">
            <Label>Category Image</Label>
            {!formik.values.image && !formik.values.existingImage ? (
              <div
                className="border-2 border-dashed rounded-lg p-6 h-40 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                />
                <Upload className="w-10 h-10 mb-3 text-gray-400" />
                <p className="text-sm text-center font-medium">
                  Click to upload category image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG or WebP, max 5MB
                </p>
              </div>
            ) : (
              <div className="relative w-40">
                <div className="aspect-square w-full overflow-hidden rounded-lg border">
                  <img
                    src={
                      formik.values.image
                        ? URL.createObjectURL(formik.values.image)
                        : data?.image?.url
                    }
                    alt="Preview"
                    className="w-full h-full object-contain"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => {
                    formik.setFieldValue("image", null);
                    formik.setFieldValue("existingImage", null);
                  }}
                  className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
              </div>
            )}
            {formik.touched.image && formik.errors.image && (
              <Alert variant="destructive">
                <AlertDescription>{formik.errors.image}</AlertDescription>
              </Alert>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-primary"
            >
              {formik.isSubmitting
                ? "Saving..."
                : data
                ? "Save Changes"
                : "Create Category"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryForm;
