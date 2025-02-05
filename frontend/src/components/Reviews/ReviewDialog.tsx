"use client";
import React, { useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useCommentMutations } from "@/features/comments/useComment";
import { CommentRequest, Product } from "@/types/comment";
import { ProductComment } from "@/types/product";

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productInfo?: ProductComment;
  initialData?: {
    productInfo: Product;
    reviewId: string;
    content: string;
    star: number;
  };
}

const ReviewDialog = ({
  open,
  onOpenChange,
  productInfo,
  initialData,
}: ReviewDialogProps) => {
  const [rating, setRating] = useState(initialData?.star || 0);
  const [content, setContent] = useState(initialData?.content || "");
  const { createComment, updateComment } = useCommentMutations();

  const ratings = [
    { value: 1, label: "Rất tệ" },
    { value: 2, label: "Tệ" },
    { value: 3, label: "Tạm ổn" },
    { value: 4, label: "Tốt" },
    { value: 5, label: "Rất tốt" },
  ];

  const handlePasteLink = (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text");
    if (text.includes("http://") || text.includes("https://")) {
      e.preventDefault();
      toast.error("Không được phép dán link");
    }
  };

  const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
    const text = (e.target as HTMLTextAreaElement).value;
    if (text.includes("http://") || text.includes("https://")) {
      (e.target as HTMLTextAreaElement).value = text.replace(
        /(https?:\/\/[^\s]+)/g,
        ""
      );
      toast.error("Không được phép nhập link");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Vui lòng chọn đánh giá sao");
      return;
    }

    const commentData: CommentRequest = {
      productId: productInfo?._id,
      content,
      star: rating,
    };

    try {
      if (initialData) {
        await updateComment.mutateAsync({
          commentId: initialData.reviewId,
          data: commentData,
        });
        toast.success("Đánh giá chỉnh sửa thành công");
      } else {
        await createComment.mutateAsync(commentData);
        toast.success("Đánh giá đã được gửi thành công");
      }
      setContent("");
      setRating(0);
      onOpenChange(false);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi đánh giá");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl p-0 gap-0">
        <DialogHeader className="p-6 pb-2 border-b">
          <div className="flex justify-between items-start">
            <DialogTitle className="w-full text-center mb-2">
              Đánh giá sản phẩm
            </DialogTitle>
            <Button
              variant="ghost"
              className="h-6 w-6 p-0 hover:bg-transparent absolute right-6"
              onClick={() => onOpenChange(false)}
            ></Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          <div className="flex flex-col items-center gap-4">
            <Image
              src={
                productInfo?.thumbnailImage?.url ||
                initialData?.productInfo.thumbnailImage?.url ||
                "https://placehold.co/120x120"
              }
              alt={
                productInfo?.name || initialData?.productInfo.name || "phone"
              }
              width={120}
              height={120}
              className="rounded-lg object-cover"
              style={{ width: "auto", height: "auto" }}
            />
            <h3 className="text-xl font-bold">
              Điện thoại{" "}
              {productInfo?.name || initialData?.productInfo?.name || ""}
            </h3>
          </div>

          <div className="flex justify-center gap-4">
            {ratings.map((r) => (
              <div key={r.value} className="flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRating(r.value)}
                  className="p-0 hover:bg-transparent"
                >
                  <Star
                    className={`w-10 h-10 ${
                      rating >= r.value
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
                <span className="text-sm text-gray-600">{r.label}</span>
              </div>
            ))}
          </div>

          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Đánh giá của bạn về sản phẩm"
              className="min-h-[150px] resize-none pr-16 pb-8 ring-0 border-2 focus-visible:ring-offset-0 focus-visible:ring-0"
              maxLength={80}
              onPaste={handlePasteLink}
              onInput={handleInput}
            />
            <div className="absolute bottom-2 right-2 text-sm text-gray-500">
              {content.length}/{80}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600"
            disabled={createComment.isPending}
          >
            {createComment.isPending ? "Đang gửi..." : "Gửi đánh giá"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
