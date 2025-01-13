import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { useFormik } from "formik";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
import { productValidationSchema } from "@/features/products/utils/validation";
import { useCategories } from "@/features/category/hooks/useCategories";
import {
  useCreateProduct,
  useUpdateProduct,
} from "@/features/products/hooks/useProduct";
import { filterGroups } from "@/utils/filterGroups";
import ProductSpecs from "./ProductSpecs";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: any;
  onSuccess?: () => void;
}

interface ProductFormValues {
  name: string;
  brand: string;
  category: string;
  subcategory: string;
  basePrice: number;
  status: string;
  description: string;
  overSpecs: Array<{
    name: string;
    values: Array<string>;
  }>;
}

const ProductForm: React.FC<ProductFormProps> = ({
  isOpen,
  onClose,
  initialData,
  onSuccess,
}) => {
  const { createProduct, isLoading: isCreating } = useCreateProduct();
  const { updateProduct, isLoading: isUpdating } = useUpdateProduct(
    initialData?._id
  );
  const {
    parentCategories,
    subCategories,
    loading: categoriesLoading,
    fetchSubCategories,
    fetchParentCategories,
  } = useCategories();

  const isEditing = Boolean(initialData?._id);
  const isLoading = isCreating || isUpdating;

  const formik = useFormik<ProductFormValues>({
    initialValues: {
      name: initialData?.name || "",
      brand: initialData?.brand || "",
      category: initialData?.category || "",
      subcategory: initialData?.subcategory || "",
      basePrice: initialData?.basePrice || 0,
      status: initialData?.status || "",
      description: initialData?.description || "",
      overSpecs: initialData?.overSpecs || [],
    },
    validationSchema: productValidationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        if (isEditing) {
          console.log("Payload: ", values);
          await updateProduct(values);
        } else {
          await createProduct(values);
        }
        onSuccess?.();
        formik.resetForm({});
        onClose();
      } catch (error) {
        console.error("Form submission error:", error);
      }
    },
  });

  useEffect(() => {
    fetchParentCategories();
  }, []);

  useEffect(() => {
    const selectedCategory = formik.values.category;
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    }
  }, [formik.values.category]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="xl:w-[800px] xl:max-w-none sm:w-[400px] sm:max-w-[540px] p-0"
      >
        <SheetHeader className="p-6 border-b">
          <SheetTitle>
            {initialData ? "Edit Product" : "Add New Product"}
          </SheetTitle>
        </SheetHeader>

        <div className="overflow-y-auto h-[calc(100vh-10rem)]">
          <form onSubmit={formik.handleSubmit} className="space-y-6 p-6">
            <div className="space-y-6">
              <h2 className="text-lg font-semibold">Basic Information</h2>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    {...formik.getFieldProps("name")}
                    className={
                      formik.touched.name && formik.errors.name
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.touched.name && formik.errors.name && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.name}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input
                    id="brand"
                    {...formik.getFieldProps("brand")}
                    className={
                      formik.touched.brand && formik.errors.brand
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.touched.brand && formik.errors.brand && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.brand}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formik.values.category}
                    onValueChange={(value) =>
                      formik.setFieldValue("category", value)
                    }
                    disabled={categoriesLoading}
                  >
                    <SelectTrigger
                      className={
                        formik.touched.category && formik.errors.category
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {parentCategories.map((category) => (
                        <SelectItem key={category._id} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.category && formik.errors.category && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.category}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subcategory">Subcategory</Label>
                  <Select
                    value={formik.values.subcategory}
                    onValueChange={(value) =>
                      formik.setFieldValue("subcategory", value)
                    }
                    disabled={!formik.values.category || categoriesLoading}
                  >
                    <SelectTrigger
                      className={
                        formik.touched.subcategory && formik.errors.subcategory
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select subcategory" />
                    </SelectTrigger>
                    <SelectContent>
                      {subCategories.map((subcategory) => (
                        <SelectItem
                          key={subcategory._id}
                          value={subcategory._id}
                        >
                          {subcategory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formik.touched.subcategory && formik.errors.subcategory && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.subcategory}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="basePrice">Base Price</Label>
                  <Input
                    id="basePrice"
                    type="number"
                    {...formik.getFieldProps("basePrice")}
                    className={
                      formik.touched.basePrice && formik.errors.basePrice
                        ? "border-red-500"
                        : ""
                    }
                  />
                  {formik.touched.basePrice && formik.errors.basePrice && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.basePrice}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formik.values.status}
                    onValueChange={(value) =>
                      formik.setFieldValue("status", value)
                    }
                  >
                    <SelectTrigger
                      className={
                        formik.touched.status && formik.errors.status
                          ? "border-red-500"
                          : ""
                      }
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="Inactive">Inactive</SelectItem>
                      <SelectItem value="Out of stock">Out of stock</SelectItem>
                    </SelectContent>
                  </Select>
                  {formik.touched.status && formik.errors.status && (
                    <div className="text-red-500 text-sm">
                      {formik.errors.status}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Specifications</Label>
                <ProductSpecs
                  specifications={formik.values.overSpecs}
                  onChange={(specs) => formik.setFieldValue("overSpecs", specs)}
                  filterGroups={filterGroups}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <ReactQuill
                  theme="snow"
                  value={formik.values.description}
                  onChange={(content) =>
                    formik.setFieldValue("description", content)
                  }
                  modules={{
                    toolbar: [
                      [{ header: [1, 2, 3, 4, 5, 6, false] }],
                      ["bold", "italic", "underline", "strike"],
                      [{ list: "ordered" }, { list: "bullet" }],
                      [{ align: [] }],
                      ["link", "image"],
                      ["clean"],
                    ],
                  }}
                  //   className="min-h-[400px]"
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-500 text-sm">
                    {formik.errors.description}
                  </div>
                )}
              </div>
            </div>

            <SheetFooter>
              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  className="px-4 py-2"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="px-4 py-2"
                  disabled={isLoading || categoriesLoading}
                >
                  {isLoading ? "Saving..." : "Save Product"}
                </Button>
              </div>
            </SheetFooter>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ProductForm;
