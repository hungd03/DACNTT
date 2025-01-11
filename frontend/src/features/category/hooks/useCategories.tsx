import { useState, useEffect } from "react";
import { categoryApi } from "../api/category.api";
import { toast } from "react-hot-toast";
import { Category } from "@/types/category";

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getAll();
      if (response.success) {
        setCategories(response.data as Category[]);
      }
    } catch (err) {
      setError("Failed to fetch categories");
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchParentCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryApi.getParent();
      if (response.success) {
        setParentCategories(response.data as Category[]);
      }
    } catch (err) {
      setError("Failed to fetch categories");
      toast.error("Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchSubCategories = async (categoryId: string) => {
    try {
      setLoading(true);
      const response = await categoryApi.getById(categoryId);
      if (response.success) {
        setSubCategories(response.data as Category[]);
      }
    } catch (err) {
      setError("Failed to fetch subcategories");
      toast.error("Failed to fetch subcategories");
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (formData: FormData) => {
    try {
      const response = await categoryApi.create(formData);
      if (response.success) {
        toast.success("Category created successfully");
        await fetchCategories();
        return true;
      }
      return false;
    } catch (err) {
      toast.error("Failed to create category");
      return false;
    }
  };

  const updateCategory = async (id: string, formData: FormData) => {
    try {
      const response = await categoryApi.update(id, formData);
      if (response.success) {
        toast.success("Category updated successfully");
        await fetchCategories();
        return true;
      }
      return false;
    } catch (err) {
      toast.error("Failed to update category");
      return false;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await categoryApi.delete(id);
      if (response.success) {
        toast.success("Category deleted successfully");
        await fetchCategories();
        return true;
      }
      return false;
    } catch (err) {
      toast.error("Failed to delete category that have subcategory");
      return false;
    }
  };

  return {
    categories,
    parentCategories,
    subCategories,
    loading,
    error,
    fetchCategories,
    fetchSubCategories,
    fetchParentCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
