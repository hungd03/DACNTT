
import { CommentItem } from "./CommentItem";
import { Skeleton } from "@/components/ui/skeleton";
import { useComments } from "@/features/comments/useComment";

interface CommentsListProps {
  productId: string;
  userId: string;
}

export const CommentsList = ({ productId, userId }: CommentsListProps) => {
  const {
    comments,
    loading,
    error,
    createReply,
    deleteComment,
    updateComment,
  } = useComments(productId);

  if (loading) {
    return <Skeleton className="w-full h-32" />;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <CommentItem
          key={comment._id}
          comment={comment}
          currentUser={{ _id: userId, fullName: "", avatar: "" }}
          onReply={async (commentId, content) => {
            await createReply({
              commentId,
              userId,
              content,
            });
          }}
          onDelete={deleteComment}
          onUpdate={updateComment}
        />
      ))}
    </div>
  );
};
