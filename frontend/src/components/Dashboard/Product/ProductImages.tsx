import React, { useState, ChangeEvent, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Image as ImageIcon, AlertCircle, Save } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUpdateProduct } from "@/features/products/hooks/useProduct";

interface ProductImagesProps {
  productId: string;
  thumbnailImage?: {
    url: string;
    publicId: string;
  };
  images?: Array<{
    url: string;
    publicId: string;
  }>;
  onUpdate?: () => void;
}

interface FileWithPreview extends File {
  preview?: string;
}

const ProductImages: React.FC<ProductImagesProps> = ({
  productId,
  thumbnailImage: initialThumbnail,
  images: initialImages = [],
  onUpdate,
}) => {
  // States
  const [thumbnailImage, setThumbnailImage] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | undefined>(
    initialThumbnail?.url
  );
  const [productImages, setProductImages] = useState<FileWithPreview[]>([]);
  const [existingImages, setExistingImages] = useState(initialImages);

  // Refs
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imagesInputRef = useRef<HTMLInputElement>(null);

  // API hook
  const { updateProduct, isLoading, error } = useUpdateProduct(productId);

  const handleThumbnailSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert("Only JPG, PNG and WEBP files are allowed");
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        alert("File size should not exceed 1MB");
        return;
      }
      setThumbnailImage(file);
      setThumbnailPreview(URL.createObjectURL(file));
      event.target.value = "";
    }
  };

  const handleImagesSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter((file) => {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        alert(`File ${file.name} is not a valid image type`);
        return false;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert(`File ${file.name} exceeds 2MB size limit`);
        return false;
      }
      return true;
    });

    if (existingImages.length + productImages.length + validFiles.length > 8) {
      alert("Maximum 8 images allowed");
      return;
    }

    setProductImages([...productImages, ...validFiles]);
    event.target.value = "";
  };

  const removeNewImage = (index: number) => {
    setProductImages(productImages.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const handleSaveImages = async () => {
    try {
      const formData = new FormData();

      // Xử lý thumbnail image
      if (thumbnailImage) {
        // Chỉ append thumbnail mới nếu có
        formData.append("thumbnailImage", thumbnailImage);
      }
      // Không cần gửi lại thumbnail cũ, backend sẽ giữ nguyên nếu không có file mới

      // Xử lý product images
      if (existingImages.length > 0) {
        // Gửi danh sách ảnh hiện có để backend biết cần giữ lại những ảnh nào
        formData.append("images", JSON.stringify(existingImages));
      }

      // Thêm các ảnh mới vào formData
      productImages.forEach((image) => {
        formData.append("images", image);
      });

      // Debug log
      console.log("FormData contents:");
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value instanceof File ? value.name : value);
      }

      // Gọi API để update
      await updateProduct(formData);

      // Callback sau khi update thành công
      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error("Failed to save images:", error);
    }
  };

  // Clean up object URLs when component unmounts
  useEffect(() => {
    return () => {
      if (thumbnailPreview && !initialThumbnail?.url) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview, initialThumbnail]);

  const totalImagesCount = existingImages.length + productImages.length;

  return (
    <div className="w-full space-y-6 p-6 bg-gray-50">
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Thumbnail Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Product Thumbnail
                </h2>
              </div>

              {!thumbnailPreview ? (
                <div
                  onClick={() => thumbnailInputRef.current?.click()}
                  className="border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="file"
                    ref={thumbnailInputRef}
                    className="hidden"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleThumbnailSelect}
                  />
                  <ImageIcon className="w-12 h-12 mb-3 text-gray-400" />
                  <p className="text-sm font-medium mb-1">Upload Thumbnail</p>
                  <p className="text-xs text-gray-400">
                    Recommended size: 800x800px
                  </p>
                </div>
              ) : (
                <div className="relative w-48">
                  <div className="aspect-square w-full overflow-hidden rounded-lg border bg-gray-50">
                    <img
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <button
                    onClick={() => {
                      setThumbnailImage(null);
                      setThumbnailPreview(undefined);
                    }}
                    className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              )}
            </div>

            {/* Product Images Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-800">
                  Product Images
                </h2>
                <span className="text-sm text-gray-500">
                  {totalImagesCount}/8 images
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* Upload Button */}
                {totalImagesCount < 8 && (
                  <div
                    onClick={() => imagesInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed rounded-lg flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="file"
                      ref={imagesInputRef}
                      className="hidden"
                      accept="image/jpeg,image/png,image/webp"
                      multiple
                      onChange={handleImagesSelect}
                    />
                    <Upload className="w-8 h-8 mb-2 text-gray-400" />
                    <p className="text-sm font-medium">Add Images</p>
                  </div>
                )}

                {/* Existing Images */}
                {existingImages.map((image, index) => (
                  <div
                    key={`existing-${index}`}
                    className="relative aspect-square"
                  >
                    <div className="w-full h-full rounded-lg border overflow-hidden bg-gray-50">
                      <img
                        src={image.url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      onClick={() => removeExistingImage(index)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}

                {/* New Images Preview */}
                {productImages.map((image, index) => (
                  <div key={`new-${index}`} className="relative aspect-square">
                    <div className="w-full h-full rounded-lg border overflow-hidden bg-gray-50">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`New product image ${index + 1}`}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <button
                      onClick={() => removeNewImage(index)}
                      className="absolute -top-2 -right-2 bg-white rounded-full p-1.5 shadow-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Guidelines */}
            <Alert className="bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Images should be in JPG, PNG, WEBP format, maximum 2MB each.{" "}
              </AlertDescription>
            </Alert>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                onClick={handleSaveImages}
                disabled={
                  isLoading ||
                  (!thumbnailImage &&
                    productImages.length === 0 &&
                    existingImages.length === initialImages?.length)
                }
                className="flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isLoading ? "Saving..." : "Save Images"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductImages;
