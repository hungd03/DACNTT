import React from "react";
import ProductDescription from "./ProductDescription";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Cpu } from "lucide-react";
import { getStatusClass } from "@/utils/backgroundUtils";
import { formatCurrency } from "@/utils/currencyFormatter";

interface ProductDetailsProps {
  product: {
    name: string;
    brand: string;
    category: string;
    subcategory: string;
    basePrice: number;
    status: string;
    description: string;
    seo?: {
      title?: string; 
      description?: string; 
      keywords: string[];
    };
  };
}

const ProductDetails: React.FC<ProductDetailsProps> = ({ product }) => {
  return (
    <div className="w-full p-6 bg-gray-50 min-h-screen space-y-6">
      {/* Basic Information */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {product.name}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="secondary" className="text-sm">
                    {product.brand}
                  </Badge>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {product.category}
                  </span>
                  <span className="text-gray-500">•</span>
                  <span className="text-sm text-gray-500">
                    {product.subcategory}
                  </span>
                </div>
              </div>
              <Badge className={`text-sm ${getStatusClass(product.status)}`}>
                {product.status}
              </Badge>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatCurrency(product.basePrice) || 0}
                </span>
                <span className="text-sm text-gray-500">Base Price</span>
              </div>
            </div>

            <div className="prose max-w-none">
              <ProductDescription htmlContent={product.description} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* SEO Information */}
      <Card className="border-none shadow-sm">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">
              SEO Information
            </h2>
            {!product.seo && (
              <Badge variant="secondary" className="text-sm">
                Not Configured
              </Badge>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Title</h3>
              {product.seo?.title ? (
                <p className="mt-1 text-sm text-gray-900">
                  {product.seo.title}
                </p>
              ) : (
                <div className="mt-1 p-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                  <p className="text-sm text-gray-500">
                    No SEO title configured
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              {product.seo?.description ? (
                <p className="mt-1 text-sm text-gray-900">
                  {product.seo.description}
                </p>
              ) : (
                <div className="mt-1 p-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                  <p className="text-sm text-gray-500">
                    No SEO description configured
                  </p>
                </div>
              )}
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">Keywords</h3>
              {product.seo?.keywords && product.seo.keywords.length > 0 ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {product.seo.keywords.map((keyword) => (
                    <Badge key={keyword} variant="outline" className="text-xs">
                      <Cpu className="w-3 h-3 mr-1" />
                      {keyword}
                    </Badge>
                  ))}
                </div>
              ) : (
                <div className="mt-1 p-2 bg-gray-50 border border-dashed border-gray-300 rounded-md">
                  <p className="text-sm text-gray-500">
                    No keywords configured
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
