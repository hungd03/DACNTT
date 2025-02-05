import { Skeleton } from "@/components/ui/skeleton";
import { Star } from "lucide-react";

export const ReviewSkeleton = () => {
  return (
    <div className="space-y-8">
      {/* Review Item Skeleton */}
      {[1, 2, 3].map((item) => (
        <div key={item}>
          <div className="flex gap-2">
            {/* Avatar */}
            <Skeleton className="h-10 w-10 rounded-full" />

            <div className="flex-1">
              <div className="space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>
          </div>

          {/* Reply Section Skeleton */}
          <div className="ml-12 mt-2">
            <Skeleton className="h-4 w-2/5" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ReviewTableItemSkeleton = () => {
  return (
    <div className="space-y-3">
      {[1, 2, 3].map((item) => (
        <div key={item} className="border rounded-lg mb-3 mt-3 animate-pulse">
          <div className="flex justify-between px-3 py-1 bg-gray-50 border-b text-sm">
            <div className="flex items-center gap-2">
              <span className="flex items-center">
                <div className="w-6 h-6 rounded-full bg-gray-200 mx-1" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </span>
            </div>
            <div className="w-32 h-4 bg-gray-200 rounded" />
          </div>

          <div className="grid grid-cols-12 p-4">
            <div className="col-span-2 border-r">
              <div className="flex gap-2">
                <div className="w-16 h-16 bg-gray-200 rounded" />
                <div className="w-24 h-4 bg-gray-200 rounded mt-2" />
              </div>
            </div>

            <div className="col-span-7 border-r px-4">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="text-gray-200" />
                ))}
              </div>
              <div className="space-y-2 mt-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
              <div className="h-4 w-32 bg-gray-200 rounded mt-4" />
            </div>

            <div className="col-span-3 px-4">
              <div className="flex justify-center">
                <div className="w-20 h-8 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
