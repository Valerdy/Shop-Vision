import { Skeleton } from '@/components/ui/skeleton';

const ProductCardSkeleton = () => {
  return (
    <div className="gradient-card rounded-lg overflow-hidden shadow-card">
      {/* Image Skeleton */}
      <Skeleton className="aspect-square w-full" />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Brand */}
        <Skeleton className="h-4 w-20" />

        {/* Product Name */}
        <Skeleton className="h-6 w-full" />

        {/* Price */}
        <Skeleton className="h-6 w-32" />

        {/* Button */}
        <Skeleton className="h-10 w-full mt-4" />
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
