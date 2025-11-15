import React from 'react';
import Image from 'next/image';
import { FALLBACK_PRODUCT_IMAGE, FALLBACK_COMPANY_IMAGE, FALLBACK_USER_AVATAR } from './fallbackImages';
import { ImageWithFallbackProps } from '@/types/shared';

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
    <Image
      src={getImageWithFallback(src, fallbackType)}
      alt={alt}
      width={100}
      height={100}
      className={className}
      onError={(e) => handleImageError(e, fallbackType)}
      {...props}
    />
  );
};
