"use client";
import React, { useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Trash2,
  Plus,
  Package,
} from "lucide-react";

import { useCategories } from "@/features/category/hooks/useCategories";
import { Category } from "@/types/category";
import CategoryForm from "@/components/Dashboard/Category/AddCategory";

const CategoriesPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedCategory, setSelectedCategory] =
    React.useState<Category | null>(null);
  const [expandedCategories, setExpandedCategories] = React.useState<
    Record<string, boolean>
  >({});

  const {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  } = useCategories();

  useEffect(() => {
    fetchCategories();
  }, []);

  const toggleExpand = (categoryId: string) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsDrawerOpen(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      await deleteCategory(categoryId);
    }
  };

  const CategoryRow = ({
    category,
    level = 0,
    isChild = false,
  }: {
    category: Category;
    level?: number;
    isChild?: boolean;
  }) => (
    <TableRow
      className={`
        group hover:bg-gray-50 
        ${isChild ? "bg-gray-50" : "bg-white"}
        ${category.isHide ? "bg-opacity-50" : ""}
      `}
    >
      <TableCell className="relative">
        <div className="flex items-center gap-2">
          {category.children?.length > 0 && (
            <button
              onClick={() => toggleExpand(category._id)}
              className="p-1 hover:bg-gray-200 rounded"
            >
              {expandedCategories[category._id] ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </button>
          )}
          {isChild && (
            <div className="absolute left-0 top-0 h-full w-1 bg-gray-200 group-hover:bg-gray-300" />
          )}
          <div
            className={`w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 ${
              isChild ? "ml-6" : ""
            }`}
          >
            <img
              src={category.image?.url}
              alt={`${category.name} preview`}
              className={`w-full h-full object-cover ${
                category.isHide ? "opacity-50" : ""
              }`}
            />
          </div>
        </div>
      </TableCell>
      <TableCell
        className={`font-medium ${
          category.isHide ? "text-gray-500" : "text-gray-900"
        }`}
      >
        <div className={isChild ? "ml-6" : ""}>
          <div className="flex items-center gap-2">
            {category.name}
            {category.isHide && (
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                Hidden
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">{category.slug}</div>
        </div>
      </TableCell>
      <TableCell className="text-gray-700">
        <div className={isChild ? "ml-6" : ""}>{category.order}</div>
      </TableCell>
      <TableCell>
        <div
          className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
            isChild ? "ml-6" : ""
          }`}
        >
          <span
            className={`bg-blue-50 text-blue-700 px-3 py-1 rounded-full ${
              category.isHide ? "opacity-50" : ""
            }`}
          >
            {category.countProduct} products
          </span>
        </div>
      </TableCell>
      <TableCell>
        <div className={isChild ? "ml-6" : ""}>
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              !category.isHide
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {category.isHide ? "Hidden" : "Visible"}
          </span>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className={`flex justify-end gap-2 ${isChild ? "ml-6" : ""}`}>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 hover:bg-gray-100"
            onClick={() => handleEdit(category)}
          >
            <Edit className="h-4 w-4 text-gray-600" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 hover:bg-red-50 border-red-200 text-red-500"
            onClick={() => handleDelete(category._id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const rootCategories = categories.filter((cat) => !cat.parent);

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Categories</h2>
            <Button
              onClick={() => {
                setSelectedCategory(null);
                setIsDrawerOpen(true);
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Category
            </Button>
          </div>

          <div className="rounded-xl overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Image</TableHead>
                  <TableHead className="font-semibold">Name</TableHead>
                  <TableHead className="font-semibold">Order</TableHead>
                  <TableHead className="font-semibold">Products</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rootCategories.map((category) => (
                  <React.Fragment key={category._id}>
                    <CategoryRow category={category} />
                    {expandedCategories[category._id] &&
                      category.children?.map((child) => (
                        <CategoryRow
                          key={child._id}
                          category={child}
                          isChild={true}
                        />
                      ))}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>

            {categories.length === 0 && (
              <div className="text-center py-12">
                <div className="flex flex-col items-center text-gray-500">
                  <Package className="h-12 w-12 mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-1">
                    No categories yet
                  </h3>
                  <p className="text-sm text-gray-400">
                    Add your first category to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <CategoryForm
        data={selectedCategory}
        isOpen={isDrawerOpen}
        onClose={() => {
          setIsDrawerOpen(false);
          setSelectedCategory(null);
        }}
        onSuccess={fetchCategories}
      />
    </div>
  );
};

export default CategoriesPage;
