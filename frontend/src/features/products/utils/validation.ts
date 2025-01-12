import * as Yup from "yup";

export const productValidationSchema = Yup.object({
  name: Yup.string()
    .required("Product name is required")
    .min(3, "Product name must be at least 3 characters"),
  brand: Yup.string().required("Brand is required"),
  category: Yup.string().required("Category is required"),
  subcategory: Yup.string().required("Subcategory is required"),
  basePrice: Yup.number()
    .required("Base price is required")
    .min(0, "Price cannot be negative")
    .typeError("Price must be a number"),
  status: Yup.string().required("Status is required"),
  description: Yup.string().required("Description is required"),
});
