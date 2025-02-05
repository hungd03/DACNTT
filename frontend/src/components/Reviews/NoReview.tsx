import React, { useState } from "react";
import { MessageCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import ReviewDialog from "./ReviewDialog";
import { ProductComment } from "@/types/product";
import { useAuth } from "@/features/auth/hooks/useAuth";
import CustomAlertDialog from "../CustomAlertDialog";
import { useRouter } from "next/navigation";

interface NoReviewsProps {
  productInfo?: ProductComment;
}

const NoReviews = ({ productInfo }: NoReviewsProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  return (
    <div className="w-full max-w-lg mx-auto bg-white">
      <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
        <div className="bg-gray-100 p-4 rounded-full">
          <MessageCircle className="w-12 h-12 text-gray-400" />
        </div>

        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">
            No reviews yet
          </h3>
          <p className="text-gray-500 max-w-sm">
            Hãy là người đầu tiên chia sẻ trải nghiệm của bạn về sản phẩm này
          </p>
        </div>

        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white"
          onClick={() => {
            if (!user) {
              setShowLoginDialog(true);
            } else {
              setShowReviewDialog(true);
            }
          }}
        >
          Viết đánh giá
        </Button>
      </div>

      {/* Review Dialog */}
      <ReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        productInfo={productInfo}
      />

      <CustomAlertDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSubmit={() => router.push("/auth/login")}
        title="Want to leave a review? Sign in first!"
        description="You need to be logged in to share your feedback on this product"
        cancelText="Cancel"
        confirmText="Login"
      />
    </div>
  );
};

export default NoReviews;
