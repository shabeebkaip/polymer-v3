"use client";

interface InlineLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'bar';
}

export default function InlineLoader({ 
  message = "Loading...", 
  size = 'md',
  variant = 'spinner'
}: InlineLoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6', 
    lg: 'w-8 h-8'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  if (variant === 'spinner') {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-green-600 rounded-full animate-spin`}></div>
        <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{message}</span>
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className="flex items-center justify-center gap-3 py-8">
        <div className="flex space-x-1">
          {[0, 1, 2].map((index) => (
            <div
              key={index}
              className={`${size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-4 h-4' : 'w-3 h-3'} bg-green-600 rounded-full animate-bounce`}
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animationDuration: '0.6s'
              }}
            ></div>
          ))}
        </div>
        <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{message}</span>
      </div>
    );
  }

  if (variant === 'bar') {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-8">
        <div className="w-32 h-1 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full animate-pulse"></div>
        </div>
        <span className={`${textSizeClasses[size]} text-gray-600 font-medium`}>{message}</span>
      </div>
    );
  }

  return null;
}
