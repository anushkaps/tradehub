import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { Star, ThumbsUp, ThumbsDown, User, Calendar, MessageCircle } from 'lucide-react';

interface Review {
  id: string;
  professional_id: string;
  professional_name: string;
  job_title: string;
  job_id: string;
  rating: number;
  comment: string;
  created_at: string;
  homeowner_name: string;
  homeowner_id: string;
  helpful_count: number;
  unhelpful_count: number;
  user_feedback?: 'helpful' | 'unhelpful' | null;
  professional_response?: {
    comment: string;
    created_at: string;
  } | null;
}

const ReviewsAndRatings: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [professionalDetails, setProfessionalDetails] = useState<{
    name: string;
    rating: number;
    reviews_count: number;
    rating_breakdown: {[key: number]: number};
  } | null>(null);
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    type: 'homeowner';
  } | null>(null);

  useEffect(() => {
    fetchCurrentUser();
    fetchProfessionalDetails();
    fetchReviews();
  }, [professionalId]);

  const fetchCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // In a real app, you would get user_type from your users table
        setCurrentUser({
          id: user.id,
          type: 'homeowner'
        });
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchProfessionalDetails = async () => {
    try {
      // In a real implementation, this would fetch from Supabase
      const { data, error } = await supabase
        .from('professionals')
        .select('name, rating, reviews_count, rating_breakdown')
        .eq('id', professionalId)
        .single();
      
      if (error) throw error;
      
      setProfessionalDetails(data);
    } catch (error) {
      console.error('Error fetching professional details:', error);
      setError('Failed to load professional details');
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      // In a real implementation, this would fetch from Supabase
      const { data, error } = await supabase
        .from('reviews')
        .select('*, professional_response(*)')
        .eq('professional_id', professionalId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setReviews(data || []);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      setError('Failed to load reviews');
    } finally {
      setLoading(false);
    }
  };

  const handleFeedback = async (reviewId: string, type: 'helpful' | 'unhelpful') => {
    if (!currentUser) {
      navigate('/homeowner/login', { state: { redirect: `/homeowner/reviews/${professionalId}` } });
      return;
    }

    try {
      const reviewToUpdate = reviews.find(r => r.id === reviewId);
      if (!reviewToUpdate) return;

      let updatedReviews = [...reviews];
      const reviewIndex = updatedReviews.findIndex(r => r.id === reviewId);
      
      // Check if user has already given feedback
      if (reviewToUpdate.user_feedback) {
        // Remove previous feedback
        if (reviewToUpdate.user_feedback === 'helpful') {
          updatedReviews[reviewIndex].helpful_count -= 1;
        } else {
          updatedReviews[reviewIndex].unhelpful_count -= 1;
        }
        
        // Add new feedback if it's different
        if (reviewToUpdate.user_feedback !== type) {
          updatedReviews[reviewIndex][type === 'helpful' ? 'helpful_count' : 'unhelpful_count'] += 1;
          updatedReviews[reviewIndex].user_feedback = type;
        } else {
          // If clicking the same button, remove feedback
          updatedReviews[reviewIndex].user_feedback = null;
        }
      } else {
        // New feedback
        updatedReviews[reviewIndex][type === 'helpful' ? 'helpful_count' : 'unhelpful_count'] += 1;
        updatedReviews[reviewIndex].user_feedback = type;
      }
      
      setReviews(updatedReviews);
      
      // In a real app, this would update the database
      await supabase
        .from('review_feedback')
        .upsert({
          review_id: reviewId,
          user_id: currentUser.id,
          feedback_type: reviewToUpdate.user_feedback === type ? null : type
        });
      
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const getFilteredReviews = () => {
    let filtered = [...reviews];
    
    // Apply rating filter
    if (filter !== 'all') {
      const ratingFilter = parseInt(filter);
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      if (sortBy === 'recent') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'highest') {
        return b.rating - a.rating;
      } else if (sortBy === 'lowest') {
        return a.rating - b.rating;
      } else if (sortBy === 'helpful') {
        return b.helpful_count - a.helpful_count;
      }
      return 0;
    });
    
    return filtered;
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-5 w-5 ${
              star <= rating
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Reviews & Ratings</h1>
      
      {professionalDetails && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">{professionalDetails.name}</h2>
              <div className="flex items-center mt-2">
                <div className="flex">
                  {renderStars(professionalDetails.rating)}
                </div>
                <span className="ml-2 text-2xl font-bold">{professionalDetails.rating.toFixed(1)}</span>
                <span className="ml-2 text-gray-500">({professionalDetails.reviews_count} reviews)</span>
              </div>
            </div>
            
            <button
              onClick={() => navigate('/homeowner/write-review/' + professionalId)}
              className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Write a Review
            </button>
          </div>
          
          <div className="mt-6 border-t pt-6">
            <h3 className="text-lg font-medium mb-4">Rating Breakdown</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => {
                const count = professionalDetails.rating_breakdown[rating] || 0;
                const percentage = professionalDetails.reviews_count 
                  ? Math.round((count / professionalDetails.reviews_count) * 100) 
                  : 0;
                
                return (
                  <div key={rating} className="flex items-center">
                    <div className="flex items-center w-20">
                      <span className="text-sm font-medium mr-1">{rating}</span>
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full mx-2">
                      <div 
                        className="h-2 bg-blue-600 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="w-10 text-right text-sm text-gray-500">{percentage}%</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h3 className="text-xl font-semibold">Customer Reviews</h3>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4 md:mt-0">
            <div>
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">Filter</label>
              <select
                id="filter"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Ratings</option>
                <option value="5">5 Stars</option>
                <option value="4">4 Stars</option>
                <option value="3">3 Stars</option>
                <option value="2">2 Stars</option>
                <option value="1">1 Star</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">Sort by</label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="recent">Most Recent</option>
                <option value="highest">Highest Rating</option>
                <option value="lowest">Lowest Rating</option>
                <option value="helpful">Most Helpful</option>
              </select>
            </div>
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : getFilteredReviews().length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No reviews found with the selected filter</p>
          </div>
        ) : (
          <div className="space-y-8">
            {getFilteredReviews().map((review) => (
              <div key={review.id} className="border-b pb-8 last:border-b-0">
                <div className="flex items-start">
                  <div className="mr-4">
                    <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-700">
                      <User className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h4 className="font-medium">{review.homeowner_name}</h4>
                    <div className="flex items-center mt-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {review.job_title}
                      </span>
                    </div>
                    
                    <p className="mt-3 text-gray-700">{review.comment}</p>
                    
                    <div className="mt-4 flex items-center space-x-6">
                      <button
                        onClick={() => handleFeedback(review.id, 'helpful')}
                        className={`flex items-center space-x-1 text-sm ${
                          review.user_feedback === 'helpful'
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <ThumbsUp className="h-4 w-4" />
                        <span>Helpful ({review.helpful_count})</span>
                      </button>
                      
                      <button
                        onClick={() => handleFeedback(review.id, 'unhelpful')}
                        className={`flex items-center space-x-1 text-sm ${
                          review.user_feedback === 'unhelpful'
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        <ThumbsDown className="h-4 w-4" />
                        <span>Not Helpful ({review.unhelpful_count})</span>
                      </button>
                    </div>
                    
                    {review.professional_response && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
                          <h5 className="font-medium">Response from {review.professional_name}</h5>
                          <span className="ml-2 text-sm text-gray-500">
                            {formatDate(review.professional_response.created_at)}
                          </span>
                        </div>
                        <p className="text-gray-700">{review.professional_response.comment}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsAndRatings;