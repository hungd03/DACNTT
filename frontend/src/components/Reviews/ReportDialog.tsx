"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useCommentMutations } from "@/features/comments/useComment";
import { REPORT_REASONS, ReportRequest } from "@/types/comment";
import toast from "react-hot-toast";


interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  commentId: string;
}

const ReportDialog = ({ open, onOpenChange, commentId }: ReportDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { reportComment } = useCommentMutations();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason) {
      toast.error("Vui lòng chọn lý do báo cáo");
      return;
    }

    try {
      const reportData: ReportRequest = {
        reason: selectedReason,
        ...(selectedReason === "other" && { description: description.trim() }),
      };

      await reportComment.mutateAsync({
        commentId,
        data: reportData,
      });

      toast.success("Báo cáo đã được gửi thành công");
      handleClose();
    } catch (error) {
      toast.error("Có lỗi xảy ra khi gửi báo cáo");
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setDescription("");
    onOpenChange(false);
  };

  const isSubmitDisabled =
    !selectedReason ||
    (selectedReason === "other" && !description.trim()) ||
    reportComment.isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Báo Cáo Đánh Giá Này</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4">
          <h4 className="mb-4 text-sm">Vui lòng chọn lý do báo cáo</h4>
          <RadioGroup
            value={selectedReason}
            onValueChange={setSelectedReason}
            className="gap-3"
          >
            {REPORT_REASONS.map((reason) => (
              <div key={reason.id} className="flex items-center space-x-2">
                <RadioGroupItem value={reason.id} id={reason.id} />
                <Label htmlFor={reason.id} className="text-sm">
                  {reason.label}
                </Label>
              </div>
            ))}
          </RadioGroup>

          {selectedReason === "other" && (
            <div className="mt-4">
              <Textarea
                placeholder="Vui lòng mô tả chi tiết vi phạm (bắt buộc)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none ring-0 border-sm focus-visible:ring-offset-0 focus-visible:ring-0"
                rows={3}
                required
              />
            </div>
          )}

          <DialogFooter className="gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-red-500 hover:bg-red-600"
              disabled={isSubmitDisabled}
            >
              {reportComment.isPending ? "Đang gửi..." : "Gửi báo cáo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReportDialog;
