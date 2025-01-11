import * as Yup from "yup";
import { AUTH_CONSTANTS } from "./constants";
import { validateEmailDomain } from "./auth.utils";

export const loginSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address")
    .test(
      "is-valid-domain",
      "Email must belong to a valid domain",
      validateEmailDomain
    ),
  password: Yup.string()
    .required("Password is required")
    .min(
      AUTH_CONSTANTS.PASSWORD_MIN_LENGTH,
      `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`
    ),
});

export const registerSchema = Yup.object({
  fullName: Yup.string()
    .required("Name is required")
    .min(2, "Full Name must be at least 2 characters long"),
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address")
    .test(
      "is-valid-domain",
      "Email must belong to a valid domain",
      validateEmailDomain
    ),
  phone: Yup.string()
    .required("Phone is required")
    .matches(/^[0-9]{10}$/, "Phone must be a valid 10-digit number"),
  password: Yup.string()
    .required("Password is required")
    .min(
      AUTH_CONSTANTS.PASSWORD_MIN_LENGTH,
      `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`
    ),
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required("Email is required")
    .email("Invalid email address")
    .test(
      "is-valid-domain",
      "Email must belong to a valid domain",
      validateEmailDomain
    ),
});

export const resetPasswordSchema = Yup.object({
  newPassword: Yup.string()
    .required("New password is required")
    .min(
      AUTH_CONSTANTS.PASSWORD_MIN_LENGTH,
      `Password must be at least ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters long`
    ),
  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("newPassword")], "Passwords must match"),
});
