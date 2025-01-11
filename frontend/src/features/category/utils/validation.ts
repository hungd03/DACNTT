import * as Yup from "yup";

interface FileValue {
  size?: number;
  type?: string;
}

export const categoryValidationSchema = Yup.object().shape({
  name: Yup.string()
    .required("Category name is required")
    .min(2, "Category name must be at least 2 characters")
    .max(50, "Category name must not exceed 50 characters"),
  parent: Yup.string().nullable(),
  isHide: Yup.boolean(),
  image: Yup.mixed<FileValue>()
    .test("fileSize", "File size is too large", (value) => {
      if (!value || typeof value === "string") return true;
      return (value as File)?.size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Unsupported file format", (value) => {
      if (!value || typeof value === "string") return true;
      return ["image/jpeg", "image/png", "image/webp"].includes(
        (value as File)?.type
      );
    })
    .nullable(),
  existingImage: Yup.mixed().when("image", {
    is: null,
    then: (schema) => schema.required("Image is required"),
    otherwise: (schema) => schema.nullable(),
  }),
});
