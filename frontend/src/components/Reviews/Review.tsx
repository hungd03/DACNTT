"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, Star } from "lucide-react";
import { calculateRatings } from "@/utils/CalculateRating";
import ReviewDialog from "./ReviewDialog";
import StarFilter from "./StarFilter";
import NoReviews from "./NoReview";
import { useComments } from "@/features/comments/useComment";
import Pagination from "../Pagination";
import CommentItem from "@/components/Reviews/ReviewItem";

import { ReviewSkeleton } from "./ReviewSkeleton";
import Link from "next/link";
import { CommentListParams } from "@/types/comment";
import { ProductComment } from "@/types/product";
import CustomAlertDialog from "../CustomAlertDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";

interface ReviewComponentProps {
  productId: string;
  product?: ProductComment;
  limit: number;
}

const ReviewComponent = ({
  productId,
  product,
  limit,
}: ReviewComponentProps) => {
  const router = useRouter();
  const pathName = usePathname();
  const [expandedReplies, setExpandedReplies] = useState<
    Record<string, boolean>
  >({});
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const { user } = useAuth();
  const [page, setPage] = useState(1);

  // Query params for all reviews
  const allCommentsParams: CommentListParams = {
    productId,
    page: 1,
    limit: 1000,
  };

  // Query params for filtered reviews
  const filteredCommentsParams: CommentListParams = {
    productId,
    page,
    limit,
    ...(selectedStar && { star: selectedStar }),
  };

  // Separate query for all reviews (without filter)
  const { data: allCommentsData } = useComments(allCommentsParams);

  // Query for filtered reviews
  const { data: filteredCommentsData, isLoading } = useComments(
    filteredCommentsParams
  );

  const { averageRating, ratingDistribution } = calculateRatings(
    allCommentsData?.data || []
  );

  const reviews = filteredCommentsData?.data;
  const reviewCount = allCommentsData?.pagination?.total || 0;
  const productInfo = allCommentsData?.data[0]?.productId;
  const totalPages = filteredCommentsData?.pagination?.pages || 1;

  const toggleReplies = (reviewId: string) => {
    setExpandedReplies((prev) => ({
      ...prev,
      [reviewId]: !prev[reviewId],
    }));
  };

  const handleStarSelect = (star: number | null) => {
    setSelectedStar(star);
    setPage(1);
  };

  if (isLoading) {
    return <ReviewSkeleton />;
  }

  if (!allCommentsData?.data?.length) {
    return <NoReviews productInfo={product} />;
  }

  return (
    <div className="bg-white">
      <h2 className="text-xl md:text-2xl font-bold mb-10">
        Review of the product {productInfo?.name}
      </h2>

      {/* Rating Summary Section - Always shows stats from all reviews */}
      <div className="flex items-start w-full mb-6 px-8 gap-20">
        <div className="flex flex-col items-center mx-auto">
          <div className="flex items-center mb-1">
            <span className="text-3xl font-bold">{averageRating}/5</span>
          </div>
          <div className="flex items-center mb-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = Math.min(
                Math.max(averageRating - (star - 1), 0),
                1
              );
              return (
                <div key={star} className="relative w-6 h-6">
                  <Star className="w-6 h-6 absolute text-gray-300 fill-gray-300" />
                  <div
                    style={{ clipPath: `inset(0 ${100 - filled * 100}% 0 0)` }}
                  >
                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="text-sm text-gray-400">{reviewCount} đánh giá</div>
          {pathName?.includes("/reviews") && (
            <button
              onClick={() => {
                if (!user) {
                  setShowLoginDialog(true);
                } else {
                  setShowReviewDialog(true);
                }
              }}
              className="w-[15rem] bg-blue-600 text-white mt-0.5 py-2 px-6 rounded-lg hover:bg-blue-700"
            >
              Viết đánh giá
            </button>
          )}
        </div>

        <div className="">
          {Object.entries(ratingDistribution)
            .reverse()
            .map(([stars, percentage]) => (
              <div key={stars} className="flex items-center gap-2 mb-1">
                <span className="w-3">{stars}</span>
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <div className="w-[50rem] h-2 bg-gray-200 rounded">
                  <div
                    className="h-full bg-blue-600 rounded"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500 w-12">
                  {percentage}%
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* Reviews Section with Star Filter */}
      <div className="mt-8">
        {pathName?.includes("/reviews") && (
          <StarFilter
            header={"Filter by star"}
            selectedStar={selectedStar}
            onStarSelect={handleStarSelect}
          />
        )}

        <div className="space-y-6 mb-6">
          {reviews?.map((review) => (
            <div key={review._id}>
              <CommentItem comment={review} />
              {review.replies?.length > 0 && (
                <>
                  {!expandedReplies[review._id] ? (
                    <button
                      onClick={() => toggleReplies(review._id)}
                      className="text-blue-600 hover:text-blue-700 text-sm mt-2 ml-4 relative flex items-center"
                    >
                      ---- Xem phản hồi từ Shop{" "}
                      <ChevronDown className="ml-1 w-4 h-4" />
                    </button>
                  ) : (
                    <>
                      <CommentItem
                        comment={review.replies[0]}
                        isSellerReply={true}
                      />
                      <button
                        onClick={() => toggleReplies(review._id)}
                        className="text-blue-600 hover:text-blue-700 text-sm mt-2 ml-12 flex items-center"
                      >
                        Ẩn phản hồi <ChevronUp className="ml-1 w-4 h-4" />
                      </button>
                    </>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      {pathName?.includes("/reviews") && totalPages > 1 && (
        <div className="flex mt-20 justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            totalItems={reviewCount}
          />
        </div>
      )}

      {/* Action Buttons */}
      {!pathName?.includes("/reviews") && (
        <div className="grid grid-cols-2 gap-4">
          <Link
            href={`${productId}/reviews`}
            className="px-4 py-2 border text-center border-gray-300 rounded-md text-gray-700 hover:bg-slate-50 transition duration-300"
          >
            Xem {reviewCount} đánh giá
          </Link>
          <button
            onClick={() => {
              if (!user) {
                setShowLoginDialog(true);
              } else {
                setShowReviewDialog(true);
              }
            }}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300"
          >
            Viết đánh giá
          </button>
        </div>
      )}

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

export default ReviewComponent;
