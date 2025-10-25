import { useState, ImgHTMLAttributes } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  aspectRatio?: 'square' | 'video' | 'auto';
}

const OptimizedImage = ({
  src,
  alt,
  aspectRatio = 'auto',
  className = '',
  ...props
}: OptimizedImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const aspectRatioClass = {
    square: 'aspect-square',
    video: 'aspect-video',
    auto: '',
  }[aspectRatio];

  if (hasError) {
    return (
      <div className={`${aspectRatioClass} ${className} bg-muted flex items-center justify-center`}>
        <p className="text-muted-foreground text-sm">Image non disponible</p>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectRatioClass} ${className}`}>
      {!isLoaded && (
        <Skeleton className="absolute inset-0 w-full h-full" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;
