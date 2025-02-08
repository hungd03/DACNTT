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
import toast from "react-hot-toast";
import { CANCEL_REASON } from "@/types/order";
import { useCancelOrder } from "@/features/order/useOrder";

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  orderId: string;
  orderStatus: string;
}

const CancelOrderDialog = ({
  open,
  onOpenChange,
  orderId,
  orderStatus,
}: ReportDialogProps) => {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { mutate: cancelOrder, isPending } = useCancelOrder();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedReason && orderStatus === "pending") {
      toast.error("Please choose report reason");
      return;
    }
  };

  const handleClose = () => {
    setSelectedReason("");
    setDescription("");
    onOpenChange(false);
  };

  const handleCancelOrder = (orderId: string) => {
    const reasonLabel =
      CANCEL_REASON.find((reason) => reason.id === selectedReason)?.label ??
      "Lý do khác";

    cancelOrder(
      {
        id: orderId,
        reason: orderStatus === "pending" ? "buyer_cancel" : "buyer_request",
        description: orderStatus === "pending" ? reasonLabel : description,
      },
      {
        onSuccess: () => {
          toast.success(
            ` ${
              orderStatus === "pending"
                ? "Order cancelled successfully"
                : "Cancellation request submitted successfully. Waiting for admin approval"
            }`
          );
          handleClose();
        },
        onError: (error) => {
          toast.error("Error while cancelling order");
          console.error("Cancel order error:", error);
        },
      }
    );
  };

  const isSubmitDisabled =
    orderStatus === "pending"
      ? !selectedReason || isPending
      : !description.trim() || isPending;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-full">
        <DialogHeader>
          <DialogTitle>Huỷ đơn hàng</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="py-4">
          {orderStatus === "pending" && (
            <>
              <h4 className="mb-4 text-md">Vui lòng chọn lý huỷ đơn</h4>
              <RadioGroup
                value={selectedReason}
                onValueChange={setSelectedReason}
                className="gap-3"
              >
                {CANCEL_REASON.map((reason) => (
                  <div key={reason.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={reason.id} id={reason.id} />
                    <Label htmlFor={reason.id} className="text-md">
                      {reason.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </>
          )}

          {orderStatus === "preparing" && (
            <Textarea
              placeholder="Vui lòng nhập lý do huỷ đơn"
              className="min-h-[200px] resize-none pr-16 pb-8 ring-0 border-2 focus-visible:ring-offset-0 focus-visible:ring-0"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={200}
              required
            />
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
              onClick={() => handleCancelOrder(orderId)}
              disabled={isSubmitDisabled}
            >
              {isPending ? "Đang gửi..." : "Đồng ý"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CancelOrderDialog;
