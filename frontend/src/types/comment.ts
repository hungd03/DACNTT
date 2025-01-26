export interface User {
  _id: string;
  fullName: string;
  avatar?: string;
}

export interface Comment {
  _id: string;
  productId: string;
  author: User | string;
  content: string;
  star: string;
  replies: Comment[] | string[];
  likes: number;
  dislikes: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CommentResponse {
  success: boolean;
  data: Comment;
  message?: string;
}

export interface CommentsListResponse {
  success: boolean;
  data: Comment[];
  message?: string;
}
