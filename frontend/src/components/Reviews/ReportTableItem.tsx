import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertTriangle, User, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Comment, getReportReasonContent } from "@/types/comment";
import { useCommentMutations } from "@/features/comments/useComment";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import CustomAlertDialog from "../CustomAlertDialog";

const ReportedReviewItem = ({ review }: { review: Comment }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [showDeleteDiaLog, setShowDeleteDialog] = useState(false);
  const [showDismissDialog, setShowDismissDialog] = useState(false);
  const { deleteComment, dismissReport } = useCommentMutations();

  if (!review.report?.length) return null;

  const handleDelete = async () => {
    try {
      await deleteComment.mutateAsync(review._id);
      toast.success("Review deleted successfully");
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleDismiss = async () => {
    try {
      await dismissReport.mutateAsync({ commentId: review._id });
      toast.success("Review dismissed successfully");
    } catch (error) {
      console.error("Error dismissing report:", error);
    }
  };

  return (
    <div className="border rounded-lg mb-3 mt-3">
      <div className="flex justify-between px-3 py-2 bg-gray-50 border-b">
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-700">
            {review.report.length}{" "}
            {review.report.length === 1 ? "Report" : "Reports"}
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <button className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                View All Reports
              </button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Report History</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                {review.report.map((report, index) => (
                  <div
                    key={report._id}
                    className="p-4 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={report.reportedBy?.avatar?.url} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {report.reportedBy?.fullName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {format(
                            new Date(report.reportDate),
                            "HH:mm dd/M/yyyy",
                            {
                              locale: vi,
                            }
                          )}
                        </div>
                      </div>
                    </div>

                    <Alert variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                        Lý do:{" "}
                        {report.reason === "other"
                          ? report.description
                          : getReportReasonContent(report.reason)}
                      </AlertDescription>
                    </Alert>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <div className="text-sm text-gray-500">
          Latest Report:{" "}
          {format(new Date(review.report[0].reportDate), "HH:mm dd/M/yyyy", {
            locale: vi,
          })}
        </div>
      </div>

      <div className="grid grid-cols-12 p-4">
        <div className="col-span-2 border-r pr-4">
          <div className="flex gap-2">
            <img
              src={
                review.productId.thumbnailImage?.url ||
                "https://placehold.co/60x60"
              }
              alt="Product"
              className="w-16 h-16 object-cover rounded"
            />
            <div className="text-sm text-gray-600">{review.productId.name}</div>
          </div>
        </div>

        <div className="col-span-7 border-r px-4">
          {review.report?.length < 2 && (
            <Alert variant="destructive" className="mb-2">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Lý do:{" "}
                {review.report[0].reason === "other"
                  ? review.report[0].description
                  : getReportReasonContent(review.report[0].reason)}
              </AlertDescription>
            </Alert>
          )}

          <div className="flex items-center gap-2 mt-5 mb-2">
            <Avatar className="w-6 h-6">
              <AvatarImage
                src={review.author.avatar?.url || "https://placehold.co/24x24"}
              />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{review.author.fullName}</span>
          </div>
          <p className="text-sm whitespace-pre-line">{review.content}</p>
          <div className="text-gray-500 text-sm mt-2">
            {format(new Date(review.createdAt), "HH:mm dd/M/yyyy", {
              locale: vi,
            })}
          </div>
        </div>

        <div className="flex flex-col col-span-3 pl-4 space-y-4 justify-center items-center">
          <Button
            variant="destructive"
            className="w-1/2"
            onClick={() => setShowDeleteDialog(true)}
            disabled={deleteComment.isPending}
          >
            Delete Review
          </Button>
          <Button
            variant="outline"
            className="w-1/2"
            onClick={() => setShowDismissDialog(true)}
            disabled={dismissReport.isPending}
          >
            Dismiss Report
          </Button>
        </div>
      </div>

      {/* Display Delete Dialog */}
      <CustomAlertDialog
        open={showDeleteDiaLog}
        onOpenChange={setShowDeleteDialog}
        onSubmit={handleDelete}
        title="Delete review"
        description="Are you sure to delete this review?"
        cancelText="Cancel"
        confirmText="Delete"
      />

      {/* Display Dismiss Dialog */}
      <CustomAlertDialog
        open={showDismissDialog}
        onOpenChange={setShowDismissDialog}
        onSubmit={handleDismiss}
        title="Dismiss report"
        description="Are you sure to dismiss report for this review?"
        cancelText="Cancel"
        confirmText="Dismiss"
      />
    </div>
  );
};

export default ReportedReviewItem;
