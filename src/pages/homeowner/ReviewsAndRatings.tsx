import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { Star, ThumbsUp, ThumbsDown, User, MessageCircle } from 'lucide-react';

interface Review {
  id: string;
  professional_id: string;
  homeowner_id: string;
  rating: number;
  review_text: string;
  created_at: string;
  helpful_count: number;
  unhelpful_count: number;
  user_feedback?: 'helpful' | 'unhelpful' | null;
  professional_response?: {
    comment: string;
    created_at: string;
  } | null;
  profiles: {
    first_name: string;
    last_name: string;
  };
  professionals: {
    company_name: string;
  };
  jobs: {
    title: string;
  };
}

interface ProfessionalDetails {
  company_name: string;
  rating: number;
  reviews_count: number;
  rating_breakdown: { [key: number]: number };
}

const ReviewsAndRatings: React.FC = () => {
  const { professionalId } = useParams<{ professionalId: string }>();
  const navigate = useNavigate();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('recent');
  const [professionalDetails, setProfessionalDetails] = useState<ProfessionalDetails | null>(null);
  // const [currentUser, setCurrentUser] = useState<{ id: string; type: string } | null>(null);
  const currentUser = {
    id: localStorage.getItem('user_id'),
  }

  useEffect(() => {
    const initializeData = async () => {
      if (!professionalId) return;
      
      setLoading(true);
      try {
        // await fetchCurrentUser();
        await fetchProfessionalDetails();
        await fetchReviews();
      } catch (error) {
        console.error('Error initializing data:', error);
        setError('Failed to load reviews data');
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [professionalId]);

  // const fetchCurrentUser = async () => {
  //   try {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (user) {
  //       const { data: profile } = await supabase
  //         .from('profiles')
  //         .select('user_type')
  //         .eq('id', user.id)
  //         .single();

  //       if (profile) {
  //         setCurrentUser({
  //           id: user.id,
  //           type: profile.user_type
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     console.error('Error fetching current user:', error);
  //   }
  // };

  const fetchProfessionalDetails = async () => {
    if (!professionalId) return;

    try {
      const { data: reviews, error: reviewsError } = await supabase
        .from('reviews')
        .select('rating')
        .eq('professional_id', professionalId);

      if (reviewsError) throw reviewsError;

      const { data: professional, error: professionalError } = await supabase
        .from('professionals')
        .select('company_name')
        .eq('id', professionalId)
        .single();

      if (professionalError) throw professionalError;

      if (reviews && professional) {
        const rating_breakdown: { [key: number]: number } = {};
        let total_rating = 0;

        reviews.forEach(review => {
          rating_breakdown[review.rating] = (rating_breakdown[review.rating] || 0) + 1;
          total_rating += review.rating;
        });

        setProfessionalDetails({
          company_name: professional.company_name,
          rating: reviews.length ? total_rating / reviews.length : 0,
          reviews_count: reviews.length,
          rating_breakdown
        });
      }
    } catch (error) {
      console.error('Error fetching professional details:', error);
      throw error;
    }
  };

  const fetchReviews = async () => {
    if (!professionalId) return;

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          profiles (first_name, last_name),
          professionals (company_name),
          jobs (title)
        `)
        .eq('professional_id', professionalId);

      if (error) throw error;

      if (data) {
        const reviewsWithFeedback = await Promise.all(
          data.map(async (review) => {
            if (currentUser) {
              const { data: feedback } = await supabase
                .from('review_feedback')
                .select('feedback_type')
                .eq('review_id', review.id)
                .eq('user_id', currentUser.id)
                .single();

              return {
                ...review,
                user_feedback: feedback?.feedback_type || null
              };
            }
            return review;
          })
        );

        setReviews(reviewsWithFeedback);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  };

  const handleFeedback = async (reviewId: string, type: 'helpful' | 'unhelpful') => {
    if (!currentUser) {
      navigate('/login', { state: { redirect: `/reviews/${professionalId}` } });
      return;
    }

    try {
      const reviewToUpdate = reviews.find(r => r.id === reviewId);
      if (!reviewToUpdate) return;

      const updatedReviews = [...reviews];
      const reviewIndex = updatedReviews.findIndex(r => r.id === reviewId);

      const { data: existingFeedback } = await supabase
        .from('review_feedback')
        .select('feedback_type')
        .eq('review_id', reviewId)
        .eq('user_id', currentUser.id)
        .single();

      const newFeedback = existingFeedback?.feedback_type === type ? null : type;

      await supabase
        .from('review_feedback')
        .upsert({
          review_id: reviewId,
          user_id: currentUser.id,
          feedback_type: newFeedback
        });

      updatedReviews[reviewIndex] = {
        ...updatedReviews[reviewIndex],
        user_feedback: newFeedback,
        helpful_count: type === 'helpful' 
          ? (reviewToUpdate.helpful_count || 0) + (newFeedback ? 1 : -1)
          : reviewToUpdate.helpful_count,
        unhelpful_count: type === 'unhelpful'
          ? (reviewToUpdate.unhelpful_count || 0) + (newFeedback ? 1 : -1)
          : reviewToUpdate.unhelpful_count
      };

      setReviews(updatedReviews);
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const getFilteredReviews = () => {
    let filtered = [...reviews];
    
    if (filter !== 'all') {
      const ratingFilter = parseInt(filter);
      filtered = filtered.filter(review => review.rating === ratingFilter);
    }
    
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        case 'helpful':
          return (b.helpful_count || 0) - (a.helpful_count || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const renderStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
        />
      ))}
    </div>
  );

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(dateString));
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
              <h2 className="text-2xl font-semibold">{professionalDetails.company_name}</h2>
              <div className="flex items-center mt-2">
                {renderStars(professionalDetails.rating)}
                <span className="ml-2 text-2xl font-bold">
                  {professionalDetails.rating.toFixed(1)}
                </span>
                <span className="ml-2 text-gray-500">
                  ({professionalDetails.reviews_count} reviews)
                </span>
              </div>
            </div>
            
            {(
              <button
                onClick={() => navigate(`/write-review/${professionalId}`)}
                className="mt-4 md:mt-0 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Write a Review
              </button>
            )}
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
                      />
                    </div>
                    <div className="w-10 text-right text-sm text-gray-500">
                      {percentage}%
                    </div>
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
              <label htmlFor="filter" className="block text-sm font-medium text-gray-700 mb-1">
                Filter
              </label>
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
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
                Sort by
              </label>
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
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
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
                    <h4 className="font-medium">
                      {review.profiles.first_name} {review.profiles.last_name}
                    </h4>
                    <div className="flex items-center mt-1">
                      {renderStars(review.rating)}
                      <span className="ml-2 text-sm text-gray-500">
                        {formatDate(review.created_at)}
                      </span>
                    </div>
                    
                    {review.jobs?.title && (
                      <div className="mt-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {review.jobs.title}
                        </span>
                      </div>
                    )}
                    
                    <p className="mt-3 text-gray-700">{review.review_text}</p>
                    
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
                        <span>Helpful ({review.helpful_count || 0})</span>
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
                        <span>Not Helpful ({review.unhelpful_count || 0})</span>
                      </button>
                    </div>
                    
                    {review.professional_response && (
                      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center mb-2">
                          <MessageCircle className="h-4 w-4 text-blue-600 mr-2" />
                          <h5 className="font-medium">
                            Response from {review.professionals.company_name}
                          </h5>
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