import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Upload, X, Edit, Trash2, Plus, Package } from "lucide-react";
import { useProductVariants } from "@/features/products/hooks/useProduct";
import { formatCurrency } from "@/utils/currencyFormatter";

interface ProductVariantsManagerProps {
  productId: string;
}

interface FormData {
  sku: string;
  color: string;
  storage: string;
  ram: string;
  price: string;
  stock: string;
}

const defaultFormData: FormData = {
  sku: "",
  color: "",
  storage: "",
  ram: "",
  price: "",
  stock: "",
};

const ProductVariantsManager: React.FC<ProductVariantsManagerProps> = ({
  productId,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [editingVariant, setEditingVariant] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);

  const {
    variants,
    isLoading,
    error,
    addVariant,
    updateVariant,
    deleteVariant,
  } = useProductVariants(productId);

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert("Only JPG and PNG files are allowed");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }
      setSelectedFile(file);
      event.target.value = "";
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();

      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append image if selected
      if (selectedFile) {
        formDataToSend.append("variantImage", selectedFile);
      } else if (!editingVariant) {
        alert("Please select an image");
        return;
      }

      if (editingVariant) {
        await updateVariant(editingVariant, formDataToSend);
      } else {
        await addVariant(formDataToSend);
      }

      handleModalClose();
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  const handleEdit = (variantId: string) => {
    const variant = variants.find((v) => v._id === variantId);
    if (!variant) return;

    setEditingVariant(variantId);
    setIsModalOpen(true);
    setCurrentImageUrl(variant.variantImage?.url || null);
    // Update form data state
    setFormData({
      sku: variant.sku,
      color: variant.color,
      storage: variant.storage.toString(),
      ram: variant.ram.toString(),
      price: variant.price.toString(),
      stock: variant.stock.toString(),
    });
  };

  const handleDelete = async (variantId: string) => {
    if (window.confirm("Are you sure you want to delete this variant?")) {
      try {
        await deleteVariant(variantId);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setEditingVariant(null);
    setFormData(defaultFormData);
    setCurrentImageUrl(null);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (isLoading) {
    return <div className="w-full p-6 text-center">Loading...</div>;
  }

  if (error) {
    return (
      <div className="w-full p-6 text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50 min-h-screen">
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              Product Variants
            </h2>
            <Button onClick={() => setIsModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Variant
            </Button>
          </div>

          <div className="rounded-xl overflow-hidden bg-white">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="font-semibold">Image</TableHead>
                  <TableHead className="font-semibold">SKU</TableHead>
                  <TableHead className="font-semibold">Color</TableHead>
                  <TableHead className="font-semibold">Storage</TableHead>
                  <TableHead className="font-semibold">RAM</TableHead>
                  <TableHead className="font-semibold">Price</TableHead>
                  <TableHead className="font-semibold">Stock</TableHead>
                  <TableHead className="text-right font-semibold">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {variants.map((variant) => (
                  <TableRow key={variant._id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                        <img
                          src={variant.variantImage?.url}
                          alt={`${variant.sku} preview`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-gray-900">
                      {variant.sku}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {variant.color}
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {variant.storage} GB
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {variant.ram} GB
                    </TableCell>
                    <TableCell className="text-gray-700">
                      {formatCurrency(variant.price)}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          variant.stock > 0
                            ? "bg-green-50 text-green-700"
                            : "bg-red-50 text-red-700"
                        }`}
                      >
                        {variant.stock} units
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:bg-gray-100"
                          onClick={() => handleEdit(variant._id)}
                        >
                          <Edit className="h-4 w-4 text-gray-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 hover:bg-red-50 border-red-200 text-red-500"
                          onClick={() => handleDelete(variant._id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {variants.length === 0 && (
              <div className="text-center py-12">
                <div className="flex flex-col items-center text-gray-500">
                  <Package className="h-12 w-12 mb-4 text-gray-400" />
                  <h3 className="text-lg font-medium mb-1">No variants yet</h3>
                  <p className="text-sm text-gray-400">
                    Add your first product variant to get started
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Modal Form */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {editingVariant ? "Edit Variant" : "Add New Variant"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* SKU & Color */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  name="sku"
                  value={formData.sku}
                  onChange={handleInputChange}
                  placeholder="Enter SKU"
                  className="w-full"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="Enter color"
                  className="w-full"
                  required
                />
              </div>
            </div>

            {/* Storage & RAM */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="storage">Storage (GB)</Label>
                <Input
                  id="storage"
                  name="storage"
                  type="number"
                  value={formData.storage}
                  onChange={handleInputChange}
                  placeholder="e.g., 128"
                  className="w-full"
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ram">RAM (GB)</Label>
                <Input
                  id="ram"
                  name="ram"
                  type="number"
                  value={formData.ram}
                  onChange={handleInputChange}
                  placeholder="e.g., 8"
                  className="w-full"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Price & Stock */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  className="w-full"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleInputChange}
                  placeholder="Enter stock quantity"
                  className="w-full"
                  required
                  min="0"
                />
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>
                Product Image
                {!editingVariant && <span className="text-red-500"> *</span>}
              </Label>
              {!selectedFile ? (
                <div
                  className="border-2 border-dashed rounded-lg p-6 h-40 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    name="image"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleFileSelect}
                    required={!editingVariant}
                  />
                  {editingVariant && currentImageUrl ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={currentImageUrl}
                        alt="Current variant"
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  ) : (
                    <>
                      <Upload className="w-10 h-10 mb-3 text-gray-400" />
                      <p className="text-sm text-center font-medium">
                        {editingVariant
                          ? "Click to change product image"
                          : "Click to upload product image"}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG or PNG, max 5MB
                      </p>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative w-40">
                  <div className="aspect-square w-full overflow-hidden rounded-lg border">
                    <img
                      src={URL.createObjectURL(selectedFile)}
                      alt="Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Variant"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductVariantsManager;
