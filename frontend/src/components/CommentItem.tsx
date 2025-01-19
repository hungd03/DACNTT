/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, MoreVertical, Send } from "lucide-react";
import { AiOutlineLike, AiFillStar, AiFillLike } from "react-icons/ai";
import { formatDistance } from "date-fns";
import { vi } from "date-fns/locale";
import { Comment } from "@/types/comment";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: string, content: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (
    id: string,
    content: string,
    star?: string,
    likes?: number
  ) => Promise<void>;
  isReply?: boolean;
}

export const CommentItem = ({
  comment,
  onReply,
  onDelete,
  onUpdate,
  isReply = false,
}: CommentItemProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userLiked, setUserLiked] = useState(() => {
    const likedComments = JSON.parse(
      localStorage.getItem("likedComments") || "{}"
    );
    return likedComments[comment._id] || false;
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [editContent, setEditContent] = useState(comment.content);
  const [editStar, setEditStar] = useState(comment.star || "0");
  const { user } = useAuth();
  const author = comment.author as any; // Replace 'any' with your User type

  const handleReply = async () => {
    if (!replyContent.trim() || !user) return;

    try {
      await onReply(comment._id, replyContent);
      setReplyContent("");
      setIsReplying(false);
    } catch (error) {
      console.error("Failed to reply:", error);
    }
  };

  const handleLike = async () => {
    try {
      const newLikes = userLiked ? comment.likes - 1 : comment.likes + 1;
      await onUpdate(comment._id, comment.content, comment.star, newLikes);

      const likedComments = JSON.parse(
        localStorage.getItem("likedComments") || "{}"
      );
      likedComments[comment._id] = !userLiked;
      localStorage.setItem("likedComments", JSON.stringify(likedComments));

      setUserLiked(!userLiked);
    } catch (error) {
      console.error("Failed to like:", error);
    }
  };
  const handleUpdate = async () => {
    if (!editContent.trim() || !user) return;

    try {
      await onUpdate(comment._id, editContent, editStar);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete(comment._id);
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Failed to delete:", error);
    }
  };

  console.log(author._id);
  const isOwnComment = user && user._id === author._id;

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex space-x-4">
        {/* Avatar */}
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.avatar} alt={author.fullName} />
          <AvatarFallback>
            <User className="h-5 w-5" />
          </AvatarFallback>
        </Avatar>

        {/* Comment Content */}
        <div className="flex-1 space-y-1">
          <div className="flex items-start justify-between">
            <div className="space-y-0.5">
              <h4 className="font-semibold">
                {isOwnComment ? `Me` : author.fullName}
              </h4>
              {!isReply && comment.star && (
                <div className="flex items-center -mt-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < Number(comment.star)
                          ? "text-yellow-400"
                          : "text-gray-300"
                      }`}
                    >
                      <AiFillStar className="w-5 h-5" />
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Actions Menu */}
            {isOwnComment && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditing(true)}>
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Comment Text */}
          {isEditing ? (
            <div className="space-y-2">
              <Textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="min-h-[100px]"
              />
              {isReplying && (
                <div className="flex items-center space-x-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setEditStar((i + 1).toString())}
                      className="text-lg focus:outline-none"
                    >
                      <AiFillStar
                        className={`w-5 h-5 ${
                          i < Number(editStar)
                            ? "text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              )}
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </Button>
                <Button size="sm" onClick={handleUpdate}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-700">{comment.content}</p>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-4 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsReplying(!isReplying)}
              className="h-auto p-0 hover:bg-transparent"
            >
              Reply
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="h-auto p-0 hover:bg-transparent"
            >
              {userLiked ? (
                <AiFillLike className="h-4 w-4 mr-1 text-blue-600" />
              ) : (
                <AiOutlineLike className="h-4 w-4 mr-1" />
              )}
              Hữu ích ({comment.likes})
            </Button>
            <p className="text-sm text-gray-500">
              {formatDistance(new Date(comment.createdAt), new Date(), {
                addSuffix: true,
                locale: vi,
              })}
            </p>
          </div>

          {/* Reply Input */}
          {isReplying && (
            <div className="flex items-center space-x-2 mt-2">
              <Input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1"
              />
              <Button size="sm" onClick={handleReply}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Nested Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="ml-12 space-y-4">
          {(comment.replies as Comment[]).map((reply) => (
            <CommentItem
              key={reply?._id || Math.random()}
              comment={reply}
              onReply={onReply}
              onDelete={onDelete}
              onUpdate={onUpdate}
              isReply={true} // Mark this as a reply
            />
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Comment</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
