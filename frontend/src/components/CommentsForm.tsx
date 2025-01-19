import { useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "react-hot-toast";
import { useComments } from "@/features/comments/useComment";
import { CiStar } from "react-icons/ci";

interface CommentFormProps {
  productId: string;
}

export const CommentForm = ({ productId }: CommentFormProps) => {
  const [content, setContent] = useState("");
  const [star, setStar] = useState("0");
  const { createComment, loading } = useComments(productId);
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !user) return;

    try {
      await createComment({
        productId,
        userId: user._id,
        content,
        star,
      });
      setContent("");
      setStar("0");
      toast.success("Comment posted successfully!");
    } catch (error) {
      console.log(error);
      toast.error("Failed to post comment. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-1/2 space-y-2">
      <div className="flex justify-center space-x-1">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setStar(value.toString())}
            className={`text-[50px] font-bold ${
              value <= Number(star) ? "text-yellow-400 " : "text-gray-300"
            }`}
          >
            <CiStar />
          </button>
        ))}
      </div>

      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your comment..."
        className="min-h-[100px]"
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={loading || !content.trim()}>
          {loading ? "Submitting" : "Submit"}
        </Button>
      </div>
    </form>
  );
};
