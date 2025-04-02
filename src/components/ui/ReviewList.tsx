import React from 'react';
import { Star, MessageSquare } from 'lucide-react';
import { Rating } from './Rating';

interface Review {
  id: string;
  rating: number;
  comment: string;
  response?: string;
  created_at: string;
  reviewer?: {
    name: string;
    avatar?: string;
  };
}

interface ReviewListProps {
  reviews: Review[];
  showResponses?: boolean;
  responderName?: string;
}

export function ReviewList({ reviews, showResponses = true, responderName }: ReviewListProps) {
  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-200 pb-6 last:border-0">
          <div className="flex items-center justify-between mb-4">
            {review.reviewer && (
              <div className="flex items-center">
                {review.reviewer.avatar ? (
                  <img
                    src={review.reviewer.avatar}
                    alt={review.reviewer.name}
                    className="w-10 h-10 rounded-full"
                  />
                ) : (
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <span className="text-gray-500">{review.reviewer.name[0]}</span>
                  </div>
                )}
                <div className="ml-3">
                  <div className="font-medium">{review.reviewer.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(review.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
            )}
            <Rating value={review.rating} size="sm" />
          </div>

          <p className="text-gray-600">{review.comment}</p>

          {showResponses && review.response && (
            <div className="mt-4 pl-4 border-l-4 border-gray-200">
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <MessageSquare className="w-4 h-4 mr-1" />
                Response from {responderName}
              </div>
              <p className="text-gray-600">{review.response}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}