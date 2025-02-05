"use client";
import { Flag, Star, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Comment } from "@/types/comment";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCommentMutations } from "@/features/comments/useComment";
import toast from "react-hot-toast";
import ReportDialog from "./ReportDialog";
import { useState } from "react";
import CustomAlertDialog from "../CustomAlertDialog";
import { useRouter } from "next/navigation";

interface CommentItemProps {
  comment: Comment;
  isSellerReply?: boolean;
}

const CommentItem = ({ comment, isSellerReply = false }: CommentItemProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const { likeComment } = useCommentMutations();
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);

  const handleLike = async () => {
    try {
      if (!user) return router.push("/auth/login");
      await likeComment.mutateAsync(comment._id);
    } catch (error) {
      toast.error("Có lỗi xảy ra khi thực hiện thao tác");
    }
  };

  return (
    <div
      className={
        isSellerReply
          ? "w-[80vh] ml-8 mt-2 bg-gray-50 p-3 rounded-lg border border-gray-100"
          : ""
      }
    >
      <div className="flex gap-2">
        <Avatar className="h-10 w-10">
          <AvatarImage
            src={comment.author.avatar?.url}
            alt={comment.author.fullName}
          />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="font-bold">
                {isSellerReply ? (
                  <span className="flex items-center gap-1">
                    <span className="text-xs bg-red-100 text-[#F01541] px-1.5 py-0.5 rounded">
                      ITSHOP
                    </span>
                  </span>
                ) : comment.author._id === user?._id ? (
                  "Me"
                ) : (
                  comment.author.fullName
                )}
              </span>
            </div>
            {!isSellerReply && (
              <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                Đã mua sản phẩm
              </span>
            )}
          </div>

          {!isSellerReply && comment.star && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center -mt-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Number(comment.star)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300 fill-gray-300"
                    }`}
                  />
                ))}
              </div>
              <div className="ml-2 space-x-2">
                <Badge className="text-sm text-gray-400 font-normal rounded bg-white border-gray-300 pointer-events-none">
                  Sản phẩm rất đáng mua
                </Badge>
                <Badge className="text-sm text-gray-400 font-normal rounded bg-white border-gray-300 pointer-events-none">
                  Hiệu năng tốt trong tầm giá
                </Badge>
              </div>
            </div>
          )}

          <p
            className={`text-gray-700 mb-2 ${
              isSellerReply ? "italic" : ""
            } whitespace-pre-line`}
          >
            {comment.content}
          </p>

          {!isSellerReply && (
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <div className="flex items-center">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 hover:text-blue-700 hover:bg-transparent"
                  onClick={handleLike}
                >
                  {comment.likes?.includes(user?._id || "") ? (
                    <AiFillLike className="h-4 w-4 mr-1 text-blue-600" />
                  ) : (
                    <AiOutlineLike className="h-4 w-4 mr-1" />
                  )}
                </Button>
                <span>Hữu ích ({comment.likes?.length || 0})</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 hover:text-red-600 hover:bg-transparent"
                onClick={() => {
                  if (!user) {
                    setShowLoginDialog(true);
                  } else {
                    setShowReportDialog(true);
                  }
                }}
              >
                <Flag className="h-3 w-3 mb-1" />
              </Button>

              <span className="text-gray-400">
                {format(new Date(comment.createdAt), "HH:mm dd/M/yyyy", {
                  locale: vi,
                })}
              </span>
            </div>
          )}

          {isSellerReply && (
            <div className="text-gray-400 text-sm">
              {format(new Date(comment.createdAt), "HH:mm dd/M/yyyy", {
                locale: vi,
              })}
            </div>
          )}
        </div>
      </div>

      {/* Report Dialog */}
      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        commentId={comment._id}
      />

      <CustomAlertDialog
        open={showLoginDialog}
        onOpenChange={setShowLoginDialog}
        onSubmit={() => router.push("/auth/login")}
        title="Report This Comment"
        description="Please log in to report comments and contribute to a safer discussion space"
        cancelText="Cancel"
        confirmText="Login"
      />
    </div>
  );
};

export default CommentItem;
