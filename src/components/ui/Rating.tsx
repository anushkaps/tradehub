import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  total?: number;
  size?: 'sm' | 'md' | 'lg';
}

export function Rating({ value, total = 5, size = 'md' }: RatingProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center">
      {[...Array(total)].map((_, index) => (
        <Star
          key={index}
          className={`${sizes[size]} ${
            index < value
              ? 'text-yellow-400 fill-current'
              : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );
}