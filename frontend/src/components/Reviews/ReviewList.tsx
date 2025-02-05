"use client";
import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import StarFilter from "@/components/Reviews/StarFilter";
import { usePathname } from "next/navigation";
import Pagination from "@/components/Pagination";
import { CommentListParams } from "@/types/comment";
import { useComments } from "@/features/comments/useComment";
import ReportedReviewItem from "./ReportTableItem";
import ReviewTableItem from "./ReviewTableItem";
import { MessageCircle } from "lucide-react";
import { ReviewTableItemSkeleton } from "./ReviewSkeleton";

const ReviewList = ({ userId }: { userId?: string }) => {
  const pathname = usePathname();
  const [currentTab, setCurrentTab] = useState("all");
  const [selectedStar, setSelectedStar] = useState<number | null>(null);
  const showField = pathname.includes("dashboard");
  const [page, setPage] = useState(1);

  const params: CommentListParams = {
    userId: userId,
    star: selectedStar || undefined,
    commentType: currentTab,
  };

  const { data: commentsData, isLoading } = useComments(params);

  const handleStarSelect = (star: number | null) => {
    setSelectedStar(star);
    setPage(1);
  };

  return (
    <div className={`w-full space-y-6 ${showField ? "p-6 min-h-screen" : ""}`}>
      <div className="bg-white rounded-lg shadow-sm">
        <div className={`${showField ? "p-6" : ""}`}>
          {showField && (
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">Shop Reviews</h1>
            </div>
          )}

          <Tabs
            value={currentTab}
            onValueChange={setCurrentTab}
            className="w-full"
          >
            {showField && (
              <div>
                <TabsList className="w-full h-auto bg-transparent p-0 justify-start border-b border-gray-200">
                  <TabsTrigger
                    value="all"
                    className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:text-red-500 data-[state=active]:shadow-none bg-transparent"
                  >
                    Tất cả
                  </TabsTrigger>
                  <TabsTrigger
                    value="unreplied"
                    className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:text-red-500 data-[state=active]:shadow-none bg-transparent"
                  >
                    Chưa trả lời
                  </TabsTrigger>
                  <TabsTrigger
                    value="replied"
                    className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:text-red-500 data-[state=active]:shadow-none bg-transparent"
                  >
                    Đã trả lời
                  </TabsTrigger>
                  <TabsTrigger
                    value="report"
                    className="px-4 py-2 rounded-none border-b-2 border-transparent data-[state=active]:border-red-500 data-[state=active]:text-red-500 data-[state=active]:shadow-none bg-transparent"
                  >
                    Report
                  </TabsTrigger>
                </TabsList>

                {currentTab !== "report" && (
                  <StarFilter
                    selectedStar={selectedStar}
                    onStarSelect={handleStarSelect}
                  />
                )}
              </div>
            )}

            {currentTab !== "report" && (
              <div className="grid grid-cols-12 bg-gray-100 p-2 text-sm text-gray-400 rounded-lg">
                <div className="col-span-2">Thông tin Sản phẩm</div>
                <div className="text-center col-span-7">
                  Đánh giá của {showField ? "người mua" : "bạn"}
                </div>
                <div className="text-center col-span-3">Actions</div>
              </div>
            )}

            <TabsContent value="all" className="mt-0">
              {isLoading ? (
                <div>
                  <ReviewTableItemSkeleton />
                </div>
              ) : (
                commentsData?.data.map((review) => (
                  <ReviewTableItem key={review._id} review={review} />
                ))
              )}
            </TabsContent>

            <TabsContent value="unreplied" className="mt-0">
              {isLoading ? (
                <div>
                  <ReviewTableItemSkeleton />
                </div>
              ) : (
                commentsData?.data.map((review) => (
                  <ReviewTableItem key={review._id} review={review} />
                ))
              )}
            </TabsContent>

            <TabsContent value="replied" className="mt-0">
              {isLoading ? (
                <div>
                  <ReviewTableItemSkeleton />
                </div>
              ) : (
                commentsData?.data.map((review) => (
                  <ReviewTableItem key={review._id} review={review} />
                ))
              )}
            </TabsContent>

            <TabsContent value="report" className="mt-0">
              {isLoading ? (
                <div>
                  <ReviewTableItemSkeleton />
                </div>
              ) : (
                commentsData?.data.map((review) => (
                  <ReportedReviewItem key={review._id} review={review} />
                ))
              )}
            </TabsContent>
          </Tabs>

          {commentsData && commentsData.pagination.pages > 1 && (
            <div className="flex mt-10 justify-center">
              <Pagination
                currentPage={page}
                totalPages={commentsData.pagination.pages}
                onPageChange={setPage}
                totalItems={commentsData.pagination.total}
              />
            </div>
          )}

          {commentsData && commentsData.pagination.total === 0 && (
            <div className="w-full max-w-lg mx-auto bg-white">
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="bg-gray-100 p-4 rounded-full">
                  <MessageCircle className="w-12 h-12 text-gray-400" />
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">
                    No reviews yet
                  </h3>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewList;
