import { useState, useCallback, useEffect } from "react";
import { Comment } from "@/types/comment";
import { commentApi, CreateCommentData, CreateReplyData } from "./comment.api";
import { toast } from "react-hot-toast";

export const useComments = (productId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all comments
  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await commentApi.getAllComments(productId);
      setComments(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch comments");
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  // Create comment
  const createComment = async (data: CreateCommentData) => {
    try {
      const newComment = await commentApi.createComment(data);
      setComments((prev) => [newComment, ...prev]);
      return newComment;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create comment";
      toast.error(errorMessage);
      throw err;
    }
  };

  // Update comment
  const updateComment = async (
    id: string,
    content: string,
    star?: string,
    likes?: number
  ) => {
    try {
      const updatedComment = await commentApi.updateComment(
        id,
        content,
        star,
        likes
      );
      setComments((prev) =>
        prev.map((comment) => (comment._id === id ? updatedComment : comment))
      );
      return updatedComment;
    } catch (err) {
      toast.error("Failed to update comment");
      throw err;
    }
  };

  // Delete comment
  const deleteComment = async (id: string) => {
    try {
      await commentApi.deleteComment(id);
      setComments((prev) => prev.filter((comment) => comment._id !== id));
      toast.success("Comment deleted successfully");
    } catch (err) {
      toast.error("Failed to delete comment");
      throw err;
    }
  };

  // Create reply
  const createReply = async (data: CreateReplyData) => {
    try {
      console.log(data);
      const newReply = await commentApi.createReply(data);
      setComments((prev) =>
        prev.map((comment) =>
          comment._id === data.commentId
            ? {
                ...comment,
                replies: [...(comment.replies as Comment[]), newReply],
              }
            : comment
        )
      );
      toast.success("Reply added successfully");
      return newReply;
    } catch (err) {
      toast.error("Failed to add reply");
      throw err;
    }
  };

  // Load comments on mount and when productId changes
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    createComment,
    updateComment,
    deleteComment,
    createReply,
    refreshComments: fetchComments,
  };
};
