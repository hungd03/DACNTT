"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
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
import { Eye, Edit, Trash2, Plus } from "lucide-react";
import ProductForm from "@/components/Dashboard/Product/AddProduct";
import Pagination from "@/components/Pagination";
import { formatCurrency } from "@/utils/currencyFormatter";
import {
  useProducts,
  useDeleteProduct,
} from "@/features/products/hooks/useProduct";
import { ProductDetail, ProductFormData } from "@/types/product";

const ProductsPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ProductFormData | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const router = useRouter();

  // Fetch products using the custom hook
  const { data, isLoading, error, refetch } = useProducts({
    page: currentPage,
    limit: itemsPerPage,
  });

  // Delete product functionality
  const { deleteProduct, isLoading: isDeleting } = useDeleteProduct();

  const handleAddNew = () => {
    setSelectedProduct(null);
    setIsDrawerOpen(true);
  };

  const handleEdit = (product: ProductFormData) => {
    setSelectedProduct(product);
    setIsDrawerOpen(true);
  };

  const handleDrawerClose = async () => {
    setIsDrawerOpen(false);
    setSelectedProduct(null);
    await refetch();
  };

  const handleView = (product: ProductDetail) => {
    router.push(`/dashboard/products/view/${product._id}`);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        await refetch();
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
    }
  };

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  if (error) {
    return (
      <div className="p-6 text-red-600">
        Error loading products: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
      <Card className="Filters border-none shadow-sm">
        <CardContent className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Products</h2>
            <Button onClick={handleAddNew} disabled={isLoading || isDeleting}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Product
            </Button>
          </div>

          {/* Products Table */}
          <div className="rounded-xl overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Image</TableHead>
                  <TableHead className="font-semibold">Product Name</TableHead>
                  <TableHead className="font-semibold">Brand</TableHead>
                  <TableHead className="font-semibold">Base Price</TableHead>
                  <TableHead className="font-semibold">Status</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      Loading products...
                    </TableCell>
                  </TableRow>
                ) : data?.products.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  data?.products.map((product) => (
                    <TableRow key={product._id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                          <img
                            src={product.thumbnailImage?.url}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-gray-900">
                        {product.name}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {product.brand}
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {formatCurrency(product.basePrice)}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            product.status === "Active"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-50 text-gray-700"
                          }`}
                        >
                          {product.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => handleView(product)}
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100"
                          >
                            <Eye className="h-4 w-4 text-gray-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100"
                            onClick={() => handleEdit(product)}
                            disabled={isDeleting}
                          >
                            <Edit className="h-4 w-4 text-blue-600" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 hover:bg-red-50 border-red-200 text-red-500"
                            onClick={() => handleDelete(product._id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {data && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.pagination.pages}
              onPageChange={handlePageChange}
              totalItems={data.pagination.total}
            />
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Product Form */}
      <ProductForm
        isOpen={isDrawerOpen}
        onClose={handleDrawerClose}
        initialData={selectedProduct}
      />
    </div>
  );
};

export default ProductsPage;
