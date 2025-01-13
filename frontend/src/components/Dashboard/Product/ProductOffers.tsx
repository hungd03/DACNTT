import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { CalendarIcon, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useProductDiscount } from "@/features/products/hooks/useProduct";

interface Offer {
  type: string;
  value: number | string;
  startDate: Date | null;
  endDate: Date | null;
  isActive: boolean;
}

interface ProductOffersProps {
  productId: string;
  offer?: Offer;
  onUpdate?: () => void;
}

const ProductOffers: React.FC<ProductOffersProps> = ({ productId, offer: initialOffer, onUpdate }) => {
  const { updateDiscount, isLoading } = useProductDiscount(productId);
  const [offer, setOffer] = useState<Offer>(
    initialOffer || {
      type: "",
      value: "",
      startDate: null,
      endDate: null,
      isActive: false,
    }
  );
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!offer.type) {
      setError("Please select a discount type");
      return;
    }
    if (!offer.value || Number(offer.value) <= 0) {
      setError("Please enter a valid discount value");
      return;
    }
    if (offer.type === "percentage" && Number(offer.value) > 100) {
      setError("Percentage discount cannot exceed 100%");
      return;
    }
    if (!offer.startDate || !offer.endDate) {
      setError("Please select both start and end dates");
      return;
    }
    if (offer.startDate >= offer.endDate) {
      setError("End date must be after start date");
      return;
    }

    try {
      await updateDiscount(offer);
      setError("");
      if (onUpdate) onUpdate();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update discount";
      setError(errorMessage);
    }
  };

  return (
    <Card className="border-none shadow-sm">
      <CardContent className="p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Special Offer
              </h2>
              <p className="text-sm text-gray-500">
                Set up a special discount offer for this product
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="active" className="text-sm text-gray-500">
                Active
              </Label>
              <Switch
                id="active"
                checked={offer.isActive}
                onCheckedChange={(checked) =>
                  setOffer({ ...offer, isActive: checked })
                }
              />
            </div>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="discountType">Discount Type</Label>
              <Select
                value={offer.type}
                onValueChange={(value) => setOffer({ ...offer, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select discount type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountValue">
                {offer.type === "percentage" ? "Percentage" : "Amount"}
              </Label>
              <div className="relative">
                <Input
                  id="discountValue"
                  type="number"
                  value={offer.value}
                  onChange={(e) =>
                    setOffer({ ...offer, value: parseFloat(e.target.value) })
                  }
                  placeholder={
                    offer.type === "percentage" ? "e.g., 20" : "e.g., 100000"
                  }
                  className="pr-12"
                />
                <span className="absolute right-3 top-2.5 text-gray-500">
                  {offer.type === "percentage" ? "%" : "₫"}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full pl-3 text-left font-normal ${
                      !offer.startDate && "text-gray-400"
                    }`}
                  >
                    {offer.startDate
                      ? format(offer.startDate, "PPP")
                      : "Select start date"}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={offer.startDate}
                    onSelect={(date) => setOffer({ ...offer, startDate: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full pl-3 text-left font-normal ${
                      !offer.endDate && "text-gray-400"
                    }`}
                  >
                    {offer.endDate
                      ? format(offer.endDate, "PPP")
                      : "Select end date"}
                    <CalendarIcon className="ml-auto h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={offer.endDate}
                    onSelect={(date) => setOffer({ ...offer, endDate: date })}
                    initialFocus
                    disabled={(date) =>
                      offer.startDate ? date < offer.startDate : false
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {offer.type &&
            offer.value > 0 &&
            offer.startDate &&
            offer.endDate && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                <h3 className="font-medium text-blue-800 mb-2">
                  Current Offer {offer.isActive ? "(Active)" : "(Inactive)"}
                </h3>
                <p className="text-sm text-blue-600">
                  {offer.type === "percentage"
                    ? `${offer.value}% off`
                    : `${offer.value.toLocaleString()}₫ off`}
                  {" from "}
                  {format(offer.startDate, "PP")}
                  {" to "}
                  {format(offer.endDate, "PP")}
                </p>
              </div>
            )}

          <div className="flex justify-end">
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Offer"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductOffers;
