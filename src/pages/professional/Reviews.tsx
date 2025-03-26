import React, { useState, useEffect } from 'react';
import { Star, Filter, ChevronDown, MessageSquare, ThumbsUp, Flag, Search } from 'lucide-react';

interface Review {
  id: string;
  jobId: string;
  jobTitle: string;
  homeownerId: string;
  homeownerName: string;
  rating: number;
  comment: string;
  date: Date;
  response?: {
    text: string;
    date: Date;
  };
}

const Reviews: React.FC = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState({
    average: 0,
    total: 0,
    distribution: [0, 0, 0, 0, 0],
  });
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');

  useEffect(() => {
    // Simulate fetching reviews from API
    const fetchReviews = async () => {
      setLoading(true);
      try {
        // This would be replaced with an actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockReviews: Review[] = [
          {
            id: 'rev1',
            jobId: 'job123',
            jobTitle: 'Bathroom Renovation',
            homeownerId: 'home1',
            homeownerName: 'John Smith',
            rating: 5,
            comment: 'Mike did an excellent job renovating our bathroom. He was professional, punctual, and the quality of work exceeded our expectations. Would definitely hire again!',
            date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            response: {
              text: 'Thank you for your kind words, John! It was a pleasure working with you on your bathroom renovation. I\'m glad you\'re happy with the results.',
              date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            },
          },
          {
            id: 'rev2',
            jobId: 'job456',
            jobTitle: 'Kitchen Plumbing',
            homeownerId: 'home2',
            homeownerName: 'Sarah Johnson',
            rating: 4,
            comment: 'Good work on fixing our kitchen sink and installing the new faucet. Everything works well, though there was a slight delay in arrival time.',
            date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'rev3',
            jobId: 'job789',
            jobTitle: 'Electrical Wiring',
            homeownerId: 'home3',
            homeownerName: 'David Williams',
            rating: 5,
            comment: 'Excellent service! Fixed all our electrical issues quickly and efficiently. Very knowledgeable and explained everything clearly.',
            date: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
            response: {
              text: 'I appreciate your feedback, David. I\'m glad I could help with your electrical issues. Don\'t hesitate to reach out if you need any further assistance!',
              date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
            },
          },
          {
            id: 'rev4',
            jobId: 'job101',
            jobTitle: 'Roof Repair',
            homeownerId: 'home4',
            homeownerName: 'Emma Davis',
            rating: 2,
            comment: 'The roof still leaks after the repair. Had to call another professional to fix it properly. Communication was also poor throughout the process.',
            date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'rev5',
            jobId: 'job102',
            jobTitle: 'Deck Construction',
            homeownerId: 'home5',
            homeownerName: 'Michael Brown',
            rating: 5,
            comment: 'Our new deck is beautiful! The craftsmanship is outstanding, and the project was completed on time and within budget. Highly recommend!',
            date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          },
        ];
        
        setReviews(mockReviews);
        
        // Calculate stats
        const total = mockReviews.length;
        const sum = mockReviews.reduce((acc, review) => acc + review.rating, 0);
        const average = total > 0 ? sum / total : 0;
        
        // Calculate distribution
        const distribution = [0, 0, 0, 0, 0];
        mockReviews.forEach(review => {
          distribution[review.rating - 1]++;
        });
        
        setStats({
          average,
          total,
          distribution,
        });
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  const handleSubmitResponse = async (reviewId: string) => {
    if (!responseText.trim()) return;
    
    try {
      // This would be replaced with an actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setReviews(
        reviews.map(review =>
          review.id === reviewId
            ? {
                ...review,
                response: {
                  text: responseText,
                  date: new Date(),
                },
              }
            : review
        )
      );
      
      // Reset form
      setRespondingTo(null);
      setResponseText('');
    } catch (error) {
      console.error('Error submitting response:', error);
    }
  };

  const handleReportReview = (reviewId: string) => {
    // This would be replaced with an actual API call
    alert(`Reporting review ${reviewId}. This would open a report form in a real application.`);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getFilteredReviews = () => {
    let filtered = [...reviews];
    
    // Apply rating filter
    if (filter === 'positive') {
      filtered = filtered.filter(review => review.rating >= 4);
    } else if (filter === 'negative') {
      filtered = filtered.filter(review => review.rating <= 2);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        review =>
          review.jobTitle.toLowerCase().includes(query) ||
          review.homeownerName.toLowerCase().includes(query) ||
          review.comment.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.date.getTime() - a.date.getTime();
        case 'oldest':
          return a.date.getTime() - b.date.getTime();
        case 'highest':
          return b.rating - a.rating;
        case 'lowest':
          return a.rating - b.rating;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const renderStars = (rating: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-5 w-5 ${
            i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
          }`}
        />
      ));
  };

  const filteredReviews = getFilteredReviews();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Reviews & Ratings</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Stats Column */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Overall Rating</h2>
            
            <div className="flex items-center mb-6">
              <div className="text-5xl font-bold text-gray-900 mr-4">
                {stats.average.toFixed(1)}
              </div>
              <div>
                <div className="flex mb-1">
                  {renderStars(Math.round(stats.average))}
                </div>
                <p className="text-gray-500 text-sm">Based on {stats.total} reviews</p>
              </div>
            </div>
            
            <div className="space-y-2">
              {stats.distribution.map((count, index) => {
                const starNumber = 5 - index;
                const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                
                return (
                  <div key={starNumber} className="flex items-center">
                    <div className="w-16 text-sm text-gray-600">{starNumber} stars</div>
                    <div className="flex-1 mx-2">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-400"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                    <div className="w-8 text-sm text-gray-600 text-right">{count}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Tips for Great Reviews</h2>
            
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-start">
                <ThumbsUp className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Respond to all reviews, especially negative ones.</span>
              </li>
              <li className="flex items-start">
                <ThumbsUp className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Keep responses professional and constructive.</span>
              </li>
              <li className="flex items-start">
                <ThumbsUp className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Thank customers for positive feedback.</span>
              </li>
              <li className="flex items-start">
                <ThumbsUp className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Address concerns raised in negative reviews.</span>
              </li>
              <li className="flex items-start">
                <ThumbsUp className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0" />
                <span>Use reviews as an opportunity to improve your service.</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Reviews Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Customer Reviews</h2>
              
              <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <div className="relative">
                  <button
                    className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => setFilter(filter === 'all' ? 'positive' : filter === 'positive' ? 'negative' : 'all')}
                  >
                    <Filter className="h-4 w-4 mr-2" />
                    <span>
                      {filter === 'all'
                        ? 'All Ratings'
                        : filter === 'positive'
                        ? '4-5 Stars'
                        : '1-2 Stars'}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                </div>
                
                <div className="relative">
                  <button
                    className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : sortBy === 'oldest' ? 'highest' : sortBy === 'highest' ? 'lowest' : 'newest')}
                  >
                    <span>
                      Sort: {sortBy === 'newest'
                        ? 'Newest First'
                        : sortBy === 'oldest'
                        ? 'Oldest First'
                        : sortBy === 'highest'
                        ? 'Highest Rated'
                        : 'Lowest Rated'}
                    </span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search reviews..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
              </div>
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="text-center py-12">
                <Star className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews found</h3>
                <p className="text-gray-500">
                  {searchQuery
                    ? 'No reviews match your search criteria.'
                    : 'You haven\'t received any reviews yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {filteredReviews.map((review) => (
                  <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="flex items-center mb-1">
                          <div className="font-medium text-gray-900 mr-2">{review.homeownerName}</div>
                          <div className="text-sm text-gray-500">
                            {formatDate(review.date)}
                          </div>
                        </div>
                        <div className="flex mb-1">{renderStars(review.rating)}</div>
                      </div>
                      <button
                        onClick={() => handleReportReview(review.id)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Report review"
                      >
                        <Flag size={16} />
                      </button>
                    </div>
                    
                    <div className="mb-2">
                      <div className="text-sm font-medium text-gray-500 mb-1">
                        Job: {review.jobTitle}
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                    
                    {review.response ? (
                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <div className="flex items-center mb-1">
                          <div className="font-medium text-gray-900 mr-2">Your Response</div>
                          <div className="text-xs text-gray-500">
                            {formatDate(review.response.date)}
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm">{review.response.text}</p>
                      </div>
                    ) : (
                      <div className="mt-3">
                        {respondingTo === review.id ? (
                          <div>
                            <textarea
                              value={responseText}
                              onChange={(e) => setResponseText(e.target.value)}
                              placeholder="Write your response..."
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                              rows={3}
                            ></textarea>
                            <div className="flex justify-end mt-2 space-x-2">
                              <button
                                onClick={() => {
                                  setRespondingTo(null);
                                  setResponseText('');
                                }}
                                className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSubmitResponse(review.id)}
                                disabled={!responseText.trim()}
                                className={`px-3 py-1 text-sm bg-blue-500 text-white rounded-lg ${
                                  !responseText.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                                }`}
                              >
                                Submit Response
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setRespondingTo(review.id)}
                            className="flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium"
                          >
                            <MessageSquare size={16} className="mr-1" />
                            Respond to Review
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reviews;