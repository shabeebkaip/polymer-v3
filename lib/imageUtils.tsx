import React from 'react';
import { FALLBACK_PRODUCT_IMAGE, FALLBACK_COMPANY_IMAGE, FALLBACK_USER_AVATAR } from './fallbackImages';

/**
 * Utility function to handle image URLs with fallbacks
 */
export const getImageWithFallback = (
  imageUrl: string | null | undefined,
  type: 'product' | 'company' | 'user' = 'product'
): string => {
  if (imageUrl && imageUrl.trim() !== '') {
    return imageUrl;
  }

  switch (type) {
    case 'company':
      return FALLBACK_COMPANY_IMAGE;
    case 'user':
      return FALLBACK_USER_AVATAR;
    case 'product':
    default:
      return FALLBACK_PRODUCT_IMAGE;
  }
};

/**
 * Image error handler for React img elements
 */
export const handleImageError = (
  event: React.SyntheticEvent<HTMLImageElement, Event>,
  fallbackType: 'product' | 'company' | 'user' = 'product'
) => {
  const target = event.target as HTMLImageElement;
  target.src = getImageWithFallback(null, fallbackType);
};

/**
 * Props for images with fallback support
 */
export interface ImageWithFallbackProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fallbackType?: 'product' | 'company' | 'user';
  [key: string]: any;
}

/**
 * Reusable image component with automatic fallback handling
 */
export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  fallbackType = 'product',
  className = '',
  ...props
}) => {
  return (
    <img
      src={getImageWithFallback(src, fallbackType)}
      alt={alt}
      className={className}
      onError={(e) => handleImageError(e, fallbackType)}
      {...props}
    />
  );
};
