import { useAuth } from "@/features/auth/hooks/useAuth";
import { CommentForm } from "./CommentsForm";
import { CommentsList } from "./CommentsList";

interface CommentsProps {
  productId: string;
  userId: string;
}

export const Comments = ({ productId, userId }: CommentsProps) => {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8">
      <CommentsList productId={productId} userId={userId} />
      <CommentForm productId={productId} />
    </div>
  );
};
