import React, { useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface LogoWithSkeletonProps {
  src: string;
  alt: string;
  companyName: string;
  className?: string;
}

const LogoWithSkeleton: React.FC<LogoWithSkeletonProps> = ({ 
  src, 
  alt, 
  companyName, 
  className = "w-8 h-8 object-contain rounded hover:scale-110 transition-transform cursor-default" 
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative">
            {!isLoaded && !hasError && (
              <Skeleton className="w-8 h-8 rounded" />
            )}
            <img
              src={src}
              alt={alt}
              className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-200`}
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                setHasError(true);
                setIsLoaded(true);
              }}
              style={{ display: isLoaded || hasError ? 'block' : 'none' }}
            />
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          <p>{companyName}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default LogoWithSkeleton;