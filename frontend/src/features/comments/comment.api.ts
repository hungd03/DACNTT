import { axiosInstance } from "@/lib/axiosInstance";
import {
  Comment,
  CommentResponse,
  CommentsListResponse,
} from "@/types/comment";

export interface CreateCommentData {
  productId: string;
  userId: string;
  content: string;
  star?: string;
}

export interface CreateReplyData {
  commentId: string;
  userId: string;
  content: string;
}

export const commentApi = {
  // Get all comments for a product
  getAllComments: async (productId: string): Promise<Comment[]> => {
    const response = await axiosInstance.get<CommentsListResponse>(
      `/comments/${productId}`
    );
    return response.data.data;
  },

  // Create a new comment
  createComment: async (data: CreateCommentData): Promise<Comment> => {
    const response = await axiosInstance.post<CommentResponse>(
      "/comments",
      data
    );
    return response.data.data;
  },

  // Update a comment
  updateComment: async (
    id: string,
    content?: string,
    star?: string,
    likes?: number
  ): Promise<Comment> => {
    const response = await axiosInstance.put<CommentResponse>(
      `/comments/${id}`,
      {
        content,
        star,
        likes,
      }
    );
    return response.data.data;
  },

  // Delete a comment
  deleteComment: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/comments/${id}`);
  },

  // Create a reply to a comment
  createReply: async (data: CreateReplyData): Promise<Comment> => {
    const response = await axiosInstance.post<CommentResponse>(
      `/comments/reply`,
      data
    );
    return response.data.data;
  },
};
