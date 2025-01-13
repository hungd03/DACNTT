import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ProductDescriptionProps {
  htmlContent: string;
}

const ProductDescription: React.FC<ProductDescriptionProps> = ({
  htmlContent,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxHeight = isExpanded ? "none" : "280px";

  return (
    <Card className="border-none shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">
        Product Description
      </h2>
      <CardContent className="p-6">
        <div className="space-y-6">
          {/* Description Container */}
          <div
            className="relative overflow-hidden transition-all duration-300"
            style={{ maxHeight }}
          >
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
              //   style={{
              //     // Reset some styles that might come from the HTML
              //     "& h2": {
              //       marginTop: "1.5rem",
              //       marginBottom: "1rem",
              //       fontSize: "1.3rem",
              //       fontWeight: "600",
              //       color: "rgb(17 24 39)",
              //     },
              //     "& p": {
              //       marginBottom: "1rem",
              //       lineHeight: "1.75",
              //       color: "rgb(55 65 81)",
              //     },
              //     "& ul": {
              //       marginTop: "1rem",
              //       marginBottom: "1rem",
              //       paddingLeft: "1.5rem",
              //     },
              //     "& li": {
              //       marginBottom: "0.5rem",
              //     },
              //     "& strong": {
              //       color: "rgb(17 24 39)",
              //       fontWeight: "600",
              //     },
              //     "& img": {
              //       borderRadius: "0.5rem",
              //       margin: "1.5rem 0",
              //     },
              //   }}
            />

            {/* Gradient Overlay when collapsed */}
            {!isExpanded && (
              <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
            )}
          </div>

          {/* Show More/Less Button */}
          <div className="flex justify-center pt-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  Show Less
                  <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Show more
                  <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductDescription;
