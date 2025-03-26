import React, { useState, useEffect } from 'react';
import { Search, MapPin, Clock, DollarSign, Filter, ChevronDown, Briefcase, Calendar, ArrowRight } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget?: {
    min: number;
    max: number;
  };
  postedDate: Date;
  startDate?: Date;
  homeownerId: string;
  homeownerName: string;
  homeownerRating: number;
  status: 'open' | 'in_progress' | 'completed';
  bidCount: number;
  distance: number; // in miles
}

const JobSearch: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDistance, setSelectedDistance] = useState<number>(50);
  const [sortBy, setSortBy] = useState<'newest' | 'closest' | 'budget_high' | 'budget_low'>('newest');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [bidAmount, setBidAmount] = useState<string>('');
  const [bidNotes, setBidNotes] = useState<string>('');
  const [showBidForm, setShowBidForm] = useState(false);
  const [submittingBid, setSubmittingBid] = useState(false);
  
  const categories = [
    { id: 'all', name: 'All Categories' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'electrical', name: 'Electrical' },
    { id: 'carpentry', name: 'Carpentry' },
    { id: 'roofing', name: 'Roofing' },
    { id: 'painting', name: 'Painting' },
    { id: 'landscaping', name: 'Landscaping' },
    { id: 'hvac', name: 'HVAC' },
    { id: 'cleaning', name: 'Cleaning' },
    { id: 'other', name: 'Other' },
  ];
  
  const distanceOptions = [
    { value: 10, label: '10 miles' },
    { value: 25, label: '25 miles' },
    { value: 50, label: '50 miles' },
    { value: 100, label: '100 miles' },
  ];

  useEffect(() => {
    // Simulate fetching jobs from API
    const fetchJobs = async () => {
      setLoading(true);
      try {
        // This would be replaced with an actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockJobs: Job[] = [
          {
            id: 'job1',
            title: 'Bathroom Renovation',
            description: 'Need to renovate a small bathroom (5x8). Replace tub, toilet, vanity, and tile floor.',
            category: 'plumbing',
            location: 'Seattle, WA',
            budget: {
              min: 2000,
              max: 3000,
            },
            postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            homeownerId: 'home1',
            homeownerName: 'John Smith',
            homeownerRating: 4.8,
            status: 'open',
            bidCount: 3,
            distance: 5.2,
          },
          {
            id: 'job2',
            title: 'Kitchen Sink Installation',
            description: 'Need to replace old kitchen sink with a new one. Sink and faucet already purchased.',
            category: 'plumbing',
            location: 'Bellevue, WA',
            budget: {
              min: 200,
              max: 400,
            },
            postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            homeownerId: 'home2',
            homeownerName: 'Sarah Johnson',
            homeownerRating: 4.5,
            status: 'open',
            bidCount: 2,
            distance: 12.7,
          },
          {
            id: 'job3',
            title: 'Electrical Panel Upgrade',
            description: 'Need to upgrade electrical panel to support new appliances and EV charger.',
            category: 'electrical',
            location: 'Redmond, WA',
            budget: {
              min: 1500,
              max: 2500,
            },
            postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            homeownerId: 'home3',
            homeownerName: 'David Williams',
            homeownerRating: 4.2,
            status: 'open',
            bidCount: 4,
            distance: 15.3,
          },
          {
            id: 'job4',
            title: 'Roof Repair',
            description: 'Roof is leaking around chimney area. Need to fix before rainy season.',
            category: 'roofing',
            location: 'Kirkland, WA',
            budget: {
              min: 500,
              max: 1000,
            },
            postedDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            homeownerId: 'home4',
            homeownerName: 'Emma Davis',
            homeownerRating: 3.9,
            status: 'open',
            bidCount: 5,
            distance: 18.6,
          },
          {
            id: 'job5',
            title: 'Deck Construction',
            description: 'Looking to build a new deck in the backyard. Approximately 12x16 feet with railing and stairs.',
            category: 'carpentry',
            location: 'Sammamish, WA',
            budget: {
              min: 4000,
              max: 6000,
            },
            postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
            startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
            homeownerId: 'home5',
            homeownerName: 'Michael Brown',
            homeownerRating: 4.7,
            status: 'open',
            bidCount: 1,
            distance: 22.1,
          },
          {
            id: 'job6',
            title: 'Interior Painting',
            description: 'Need to paint living room, dining room, and hallway. Approximately 1200 sq ft total.',
            category: 'painting',
            location: 'Issaquah, WA',
            budget: {
              min: 1200,
              max: 1800,
            },
            postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
            homeownerId: 'home6',
            homeownerName: 'Jennifer Wilson',
            homeownerRating: 4.4,
            status: 'open',
            bidCount: 3,
            distance: 25.8,
          },
          {
            id: 'job7',
            title: 'Lawn Maintenance',
            description: 'Looking for regular lawn maintenance including mowing, edging, and fertilizing. Approximately 1/4 acre lot.',
            category: 'landscaping',
            location: 'Renton, WA',
            budget: {
              min: 100,
              max: 200,
            },
            postedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            homeownerId: 'home7',
            homeownerName: 'Robert Taylor',
            homeownerRating: 4.1,
            status: 'open',
            bidCount: 6,
            distance: 30.2,
          },
        ];
        
        setJobs(mockJobs);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSubmitBid = async () => {
    if (!selectedJob || !bidAmount.trim() || isNaN(parseFloat(bidAmount))) return;
    
    setSubmittingBid(true);
    
    try {
      // This would be replaced with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Show success message or redirect
      alert(`Bid submitted successfully for job: ${selectedJob.title}`);
      
      // Reset form
      setShowBidForm(false);
      setBidAmount('');
      setBidNotes('');
      setSelectedJob(null);
    } catch (error) {
      console.error('Error submitting bid:', error);
    } finally {
      setSubmittingBid(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return `${Math.floor(diffInHours / 24)} days ago`;
    }
  };

  const getFilteredJobs = () => {
    let filtered = [...jobs];
    
    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }
    
    // Apply distance filter
    filtered = filtered.filter(job => job.distance <= selectedDistance);
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        job =>
          job.title.toLowerCase().includes(query) ||
          job.description.toLowerCase().includes(query) ||
          job.location.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.postedDate.getTime() - a.postedDate.getTime();
        case 'closest':
          return a.distance - b.distance;
        case 'budget_high':
          return (b.budget?.max || 0) - (a.budget?.max || 0);
        case 'budget_low':
          return (a.budget?.min || 0) - (b.budget?.min || 0);
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredJobs = getFilteredJobs();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Find Jobs</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <input
                type="text"
                placeholder="Search jobs by title, description, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>
          
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={selectedDistance}
              onChange={(e) => setSelectedDistance(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {distanceOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  Within {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <div>
          <span className="text-gray-600">
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
          </span>
        </div>
        
        <div className="relative">
          <button
            className="flex items-center justify-between px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            onClick={() => setSortBy(sortBy === 'newest' ? 'closest' : sortBy === 'closest' ? 'budget_high' : sortBy === 'budget_high' ? 'budget_low' : 'newest')}
          >
            <span>
              Sort by: {sortBy === 'newest'
                ? 'Newest'
                : sortBy === 'closest'
                ? 'Distance'
                : sortBy === 'budget_high'
                ? 'Budget (High to Low)'
                : 'Budget (Low to High)'}
            </span>
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <Briefcase className="mx-auto h-12 w-12 text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
          <p className="text-gray-500 mb-4">
            {searchQuery || selectedCategory !== 'all' || selectedDistance !== 50
              ? 'Try adjusting your search filters to see more results.'
              : 'There are no jobs available in your area at the moment.'}
          </p>
          {(searchQuery || selectedCategory !== 'all' || selectedDistance !== 50) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedDistance(50);
              }}
              className="text-blue-500 hover:text-blue-700"
            >
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {categories.find(c => c.id === job.category)?.name || job.category}
                  </span>
                </div>
                
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{job.location} ({job.distance.toFixed(1)} miles)</span>
                </div>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                
                <div className="flex flex-wrap gap-y-2 mb-4">
                  {job.budget && (
                    <div className="w-full sm:w-1/2 flex items-center text-gray-500 text-sm">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>
                        {formatCurrency(job.budget.min)} - {formatCurrency(job.budget.max)}
                      </span>
                    </div>
                  )}
                  
                  <div className="w-full sm:w-1/2 flex items-center text-gray-500 text-sm">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Posted {getTimeAgo(job.postedDate)}</span>
                  </div>
                  
                  {job.startDate && (
                    <div className="w-full sm:w-1/2 flex items-center text-gray-500 text-sm">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Starts {formatDate(job.startDate)}</span>
                    </div>
                  )}
                  
                  <div className="w-full sm:w-1/2 flex items-center text-gray-500 text-sm">
                    <Briefcase className="h-4 w-4 mr-1" />
                    <span>{job.bidCount} bids so far</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    Homeowner: {job.homeownerName}
                  </div>
                  
                  <button
                    onClick={() => {
                      setSelectedJob(job);
                      setShowBidForm(true);
                      
                      // Set initial bid amount based on budget
                      if (job.budget) {
                        setBidAmount(job.budget.min.toString());
                      }
                    }}
                    className="flex items-center text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Bid Now
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Bid Form Modal */}
      {showBidForm && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Submit a Bid</h2>
                <button
                  onClick={() => {
                    setShowBidForm(false);
                    setBidAmount('');
                    setBidNotes('');
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">{selectedJob.title}</h3>
                <div className="flex items-center text-gray-500 text-sm mb-2">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{selectedJob.location}</span>
                </div>
                <p className="text-gray-600 mb-2">{selectedJob.description}</p>
                {selectedJob.budget && (
                  <div className="flex items-center text-gray-500 text-sm">
                    <DollarSign className="h-4 w-4 mr-1" />
                    <span>
                      Budget: {formatCurrency(selectedJob.budget.min)} - {formatCurrency(selectedJob.budget.max)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="bidAmount" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Bid Amount (USD)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500">$</span>
                  </div>
                  <input
                    type="text"
                    id="bidAmount"
                    value={bidAmount}
                    onChange={(e) => {
                      // Allow only numbers and decimal point
                      const value = e.target.value.replace(/[^0-9.]/g, '');
                      setBidAmount(value);
                    }}
                    placeholder="Enter your bid amount"
                    className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                {selectedJob.budget && (
                  <p className="text-sm text-gray-500 mt-1">
                    Homeowner's budget: {formatCurrency(selectedJob.budget.min)} - {formatCurrency(selectedJob.budget.max)}
                  </p>
                )}
              </div>
              
              <div className="mb-6">
                <label htmlFor="bidNotes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="bidNotes"
                  value={bidNotes}
                  onChange={(e) => setBidNotes(e.target.value)}
                  placeholder="Include details about your experience, timeline, or any questions you have about the job."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-6">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm text-yellow-700">
                    By submitting a bid, you agree to complete the job as described if your bid is accepted. The homeowner will be able to see your profile, reviews, and contact information.
                  </p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setShowBidForm(false);
                    setBidAmount('');
                    setBidNotes('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleSubmitBid}
                  disabled={submittingBid || !bidAmount.trim() || isNaN(parseFloat(bidAmount))}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-lg ${
                    submittingBid || !bidAmount.trim() || isNaN(parseFloat(bidAmount))
                      ? 'opacity-70 cursor-not-allowed'
                      : 'hover:bg-blue-600'
                  }`}
                >
                  {submittingBid ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting...
                    </span>
                  ) : (
                    'Submit Bid'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobSearch;