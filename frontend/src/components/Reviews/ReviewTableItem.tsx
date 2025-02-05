import React, { useState } from "react";
import { Star, User, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import ReviewDialog from "./ReviewDialog";
import { Comment } from "@/types/comment";
import { useCommentMutations } from "@/features/comments/useComment";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface ReviewReplyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: string) => Promise<void>;
  review: Comment;
}

const StarRating = ({ star }: { star: number }) => (
  <div className="flex">
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={16}
        fill={i < star ? "#FFD700" : "none"}
        color={i < star ? "#FFD700" : "#D1D5DB"}
      />
    ))}
  </div>
);

const truncateText = (text: string, limit: number) => {
  if (text.length <= limit) return text;
  return text.slice(0, limit) + "...";
};

const ReviewReplyDialog: React.FC<ReviewReplyDialogProps> = ({
  isOpen,
  onClose,
  review,
  onSubmit,
}) => {
  const [replyContent, setReplyContent] = useState("");

  const handleSubmit = () => {
    if (!replyContent.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi");
      return;
    }
    onSubmit(replyContent);
    setReplyContent("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Reply</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium">{review.author.fullName}</span>
              <StarRating star={review.star} />
            </div>
            <p className="text-sm text-gray-600">{review.content}</p>
          </div>

          <div className="relative">
            <Textarea
              placeholder="Nhập phản hồi của bạn"
              className="min-h-[200px] resize-none pr-16 pb-8 ring-0 border-2 focus-visible:ring-offset-0 focus-visible:ring-0"
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              maxLength={200}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
              {replyContent.length}/200
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose} className="px-4">
            Hủy
          </Button>
          <Button
            onClick={handleSubmit}
            className="px-4 bg-red-500 hover:bg-red-600"
          >
            Hoàn thành
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ReviewTableItem = ({ review }: { review: Comment }) => {
  const pathname = usePathname();
  const showField = pathname.includes("/dashboard");
  const [isExpanded, setIsExpanded] = useState(false);
  const TEXT_LIMIT = 50;

  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const { createReply } = useCommentMutations();

  const hasReports = review.report && review.report.length > 0;

  const handleReply = async (content: string) => {
    try {
      await createReply.mutateAsync({
        commentId: review._id,
        data: { content },
      });
      toast.success("Phản hồi đã được gửi thành công");
      setIsReplyDialogOpen(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi phản hồi");
    }
  };

  return (
    <div className={`border rounded-lg mb-3 mt-3 `}>
      <div
        className={`flex justify-between px-3 py-1 bg-gray-50 border-b text-sm`}
      >
        <div className="flex items-center gap-2">
          {showField && (
            <span className="flex items-center">
              Người mua:{" "}
              <Avatar className="w-6 h-6 inline-block align-middle mx-1 object-cover">
                <AvatarImage src={review.author.avatar?.url} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>{" "}
              {review.author.fullName}
              {hasReports && (
                <Badge
                  variant="outline"
                  className="ml-2 bg-red-100 text-red-700 border-red-200 gap-1"
                >
                  <AlertTriangle className="h-3 w-3" />
                  Reported
                </Badge>
              )}
            </span>
          )}
        </div>

        <div className="text-gray-500">
          <Link
            href={`/all-products/${review.productId.slug}`}
            className="text-sm text-gray-500 hover:text-blue-600 text-end"
          >
            Xem chi tiết sản phẩm
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-12 p-4">
        <div className="col-span-2 border-r">
          <div className="flex gap-2">
            <img
              src={
                review.productId?.thumbnailImage?.url ||
                "https://placehold.co/60x60"
              }
              alt="Product"
              className="w-16 h-16 object-cover"
            />
            <div className="text-sm text-gray-600 uppercase">
              {review.productId.name}
            </div>
          </div>
        </div>

        <div className="col-span-7 border-r px-4">
          <StarRating star={review.star} />
          <p className="mt-2 text-sm whitespace-pre-line">{review.content}</p>
          <div className="text-gray-500 text-sm mt-2">
            {format(new Date(review.createdAt), "HH:mm dd/M/yyyy", {
              locale: vi,
            })}
          </div>
        </div>

        <div className="col-span-3 px-4">
          {showField ? (
            review.replies && review.replies.length > 0 ? (
              <div className="text-left">
                {review.replies.map((reply, index) => {
                  const shouldShowMore = reply.content.length > TEXT_LIMIT;
                  return (
                    <div key={index}>
                      <div className="text-sm text-gray-600">
                        <span>
                          {isExpanded
                            ? reply.content
                            : truncateText(reply.content, TEXT_LIMIT)}
                        </span>
                        {shouldShowMore && (
                          <button
                            className="inline-flex text-xs text-blue-600 hover:underline ml-1"
                            onClick={() => setIsExpanded(!isExpanded)}
                          >
                            {isExpanded ? "Thu gọn" : "Xem thêm"}
                          </button>
                        )}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {format(new Date(reply.createdAt), "HH:mm dd/M/yyyy", {
                          locale: vi,
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center">
                <button
                  className={`px-4 py-1 border rounded hover:bg-gray-50 ${
                    hasReports ? "hidden" : ""
                  }`}
                  onClick={() => setIsReplyDialogOpen(true)}
                >
                  Trả lời
                </button>
              </div>
            )
          ) : (
            <div className="text-center">
              <button
                className={`px-4 py-1 border rounded hover:bg-gray-50 ${
                  review.isEdited ? "hidden" : ""
                }`}
                onClick={() => setShowReviewDialog(true)}
              >
                Chỉnh sửa
              </button>
            </div>
          )}
        </div>
      </div>

      <ReviewReplyDialog
        isOpen={isReplyDialogOpen}
        onClose={() => setIsReplyDialogOpen(false)}
        review={review}
        onSubmit={handleReply}
      />

      <ReviewDialog
        open={showReviewDialog}
        onOpenChange={setShowReviewDialog}
        productInfo={undefined}
        initialData={{
          productInfo: review.productId,
          reviewId: review._id,
          content: review.content,
          star: review.star,
        }}
      />
    </div>
  );
};

export default ReviewTableItem;
