import { CategoryResponse } from "@/types/category";
import { axiosInstance } from "@/lib/axiosInstance";

const BASE_URL = "/categories";

export const categoryApi = {
  getAll: async () => {
    const response = await axiosInstance.get<CategoryResponse>(BASE_URL);
    return response.data;
  },

  getParent: async () => {
    const response = await axiosInstance.get<CategoryResponse>(
      `${BASE_URL}/parents`
    );
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<CategoryResponse>(
      `${BASE_URL}/id/${id}`
    );
    return response.data;
  },

  create: async (data: FormData) => {
    const response = await axiosInstance.post<CategoryResponse>(
      BASE_URL,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  update: async (id: string, data: FormData) => {
    const response = await axiosInstance.put<CategoryResponse>(
      `${BASE_URL}/${id}`,
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete(`${BASE_URL}/${id}`);
    return response.data;
  },

  updateOrder: async (id: string, order: number) => {
    const response = await axiosInstance.patch(`${BASE_URL}/${id}/order`, {
      order,
    });
    return response.data;
  },

  toggleVisibility: async (id: string) => {
    const response = await axiosInstance.patch(`${BASE_URL}/${id}/visibility`);
    return response.data;
  },
};
