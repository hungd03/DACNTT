import { toast } from "react-hot-toast";

export const showLoadingToast = (message: string) => toast.loading(message);

export const showSuccessToast = (message: string) =>
  toast.success(message, { duration: 2000 });

export const showErrorToast = (error: any) => {
  const errorMessage = error?.response?.data?.msg || "Something went wrong";
  toast.error(errorMessage, { duration: 3000 });
};

export const promiseToast = async <T>(
  promise: Promise<T>,
  {
    loading = "Loading...",
    success = "Success!",
    error = "Error occurred",
  }: {
    loading?: string;
    success?: string;
    error?: string;
  } = {}
) => {
  return toast.promise(promise, {
    loading,
    success,
    error,
  });
};
