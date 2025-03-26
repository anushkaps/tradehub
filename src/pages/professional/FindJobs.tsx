import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaTools, FaExternalLinkAlt, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  budget: number | null;
  category: string;
  timeline: string;
  created_at: string;
  status: string;
  homeowner: {
    first_name: string;
    last_name: string;
  } | null;
  interested: boolean;
}

const FindJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('');
  const [timelineFilter, setTimelineFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  const [tradeCategories, setTradeCategories] = useState<string[]>([]);
  const [userTradeCategories, setUserTradeCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [timelines, setTimelines] = useState<string[]>([]);
  const [processingJobId, setProcessingJobId] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchUserTradeCategories = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          const { data } = await supabase
            .from('professional_profiles')
            .select('trade_categories')
            .eq('user_id', user.id)
            .single();
          
          if (data && data.trade_categories) {
            setUserTradeCategories(data.trade_categories);
          }
        }
      } catch (error) {
        console.error('Error fetching user trade categories:', error);
      }
    };
    
    // Get unique categories, locations, and timelines from all jobs
    const fetchFilterOptions = async () => {
      try {
        // Fetch categories
        const { data: categoryData } = await supabase
          .from('jobs')
          .select('category')
          .not('category', 'is', null);
        
        if (categoryData) {
          const categories = [...new Set(categoryData.map(job => job.category))].filter(Boolean);
          setTradeCategories(categories);
        }
        
        // Fetch locations
        const { data: locationData } = await supabase
          .from('jobs')
          .select('location')
          .not('location', 'is', null);
        
        if (locationData) {
          const locationList = [...new Set(locationData.map(job => job.location))].filter(Boolean);
          setLocations(locationList);
        }
        
        // Fetch timelines
        const { data: timelineData } = await supabase
          .from('jobs')
          .select('timeline')
          .not('timeline', 'is', null);
        
        if (timelineData) {
          const timelineList = [...new Set(timelineData.map(job => job.timeline))].filter(Boolean);
          setTimelines(timelineList);
        }
      } catch (error) {
        console.error('Error fetching filter options:', error);
      }
    };
    
    fetchUserTradeCategories();
    fetchFilterOptions();
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Fetch jobs that are open
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select(`
          *,
          homeowner:homeowner_profiles!jobs_homeowner_id_fkey(
            first_name,
            last_name
          )
        `)
        .eq('status', 'Open')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      // Check which jobs the professional has already expressed interest in
      const { data: interestedData } = await supabase
        .from('job_interests')
        .select('job_id')
        .eq('user_id', user.id);
      
      const interestedJobIds = interestedData?.map(item => item.job_id) || [];
      
      // Add 'interested' flag to each job
      const jobsWithInterestFlag = jobsData?.map(job => ({
        ...job,
        interested: interestedJobIds.includes(job.id)
      })) || [];
      
      setJobs(jobsWithInterestFlag);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExpressInterest = async (jobId: string) => {
    setProcessingJobId(jobId);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Check if already interested
      const { data: existingInterest } = await supabase
        .from('job_interests')
        .select('*')
        .eq('job_id', jobId)
        .eq('user_id', user.id)
        .single();
      
      if (existingInterest) {
        // Already interested, do nothing
        return;
      }
      
      // Add interest record
      const { error } = await supabase
        .from('job_interests')
        .insert({
          job_id: jobId,
          user_id: user.id,
          status: 'interested'
        });
      
      if (error) throw error;
      
      // Update local state
      setJobs(prevJobs => 
        prevJobs.map(job => 
          job.id === jobId ? { ...job, interested: true } : job
        )
      );
      
      toast.success('Interest expressed successfully!');
    } catch (error) {
      console.error('Error expressing interest:', error);
      toast.error('Failed to express interest. Please try again.');
    } finally {
      setProcessingJobId(null);
    }
  };
  
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter ? job.category === categoryFilter : true;
    
    const matchesLocation = locationFilter ? job.location === locationFilter : true;
    
    const matchesTimeline = timelineFilter ? job.timeline === timelineFilter : true;
    
    return matchesSearch && matchesCategory && matchesLocation && matchesTimeline;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setLocationFilter('');
    setTimelineFilter('');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Find Jobs</h1>
          <p className="mt-2 text-gray-600">Browse available jobs that match your skills and expertise.</p>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search jobs by title or description"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setShowFilters(!showFilters)}
              >
                <FaFilter className="mr-2 -ml-1" />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </button>
              
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => {
                  clearFilters();
                  fetchJobs();
                }}
              >
                Refresh Jobs
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Category Filter */}
                  <div>
                    <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Trade Category
                    </label>
                    <select
                      id="category-filter"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                      <option value="">All Categories</option>
                      {userTradeCategories.length > 0 ? (
                        userTradeCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))
                      ) : (
                        tradeCategories.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  {/* Location Filter */}
                  <div>
                    <label htmlFor="location-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <select
                      id="location-filter"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                    >
                      <option value="">All Locations</option>
                      {locations.map((location) => (
                        <option key={location} value={location}>
                          {location}
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  {/* Timeline Filter */}
                  <div>
                    <label htmlFor="timeline-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Timeline
                    </label>
                    <select
                      id="timeline-filter"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={timelineFilter}
                      onChange={(e) => setTimelineFilter(e.target.value)}
                    >
                      <option value="">All Timelines</option>
                      {timelines.map((timeline) => (
                        <option key={timeline} value={timeline}>
                          {timeline}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {loading ? (
          <div className="text-center py-10">
            <div className="spinner"></div>
            <p className="mt-2 text-gray-600">Loading jobs...</p>
          </div>
        ) : filteredJobs.length > 0 ? (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {filteredJobs.map((job) => (
                <li key={job.id}>
                  <div className="px-4 py-5 sm:px-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-600">{job.title}</h3>
                      <div className="ml-2 flex-shrink-0 flex">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {job.status}
                        </span>
                      </div>
                    </div>
                    
                    <div className="mt-2 max-w-xl text-sm text-gray-500">
                      <p className="line-clamp-2">{job.description}</p>
                    </div>
                    
                    <div className="mt-3 flex flex-wrap gap-2">
                      {job.location && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaMapMarkerAlt className="flex-shrink-0 mr-1.5 text-gray-400" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      
                      {job.category && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaTools className="flex-shrink-0 mr-1.5 text-gray-400" />
                          <span>{job.category}</span>
                        </div>
                      )}
                      
                      {job.budget && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaDollarSign className="flex-shrink-0 mr-1.5 text-gray-400" />
                          <span>${job.budget.toLocaleString()}</span>
                        </div>
                      )}
                      
                      {job.timeline && (
                        <div className="flex items-center text-sm text-gray-500">
                          <FaCalendarAlt className="flex-shrink-0 mr-1.5 text-gray-400" />
                          <span>{job.timeline}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-500">
                        <FaCalendarAlt className="flex-shrink-0 mr-1.5 text-gray-400" />
                        <span>Posted {formatDate(job.created_at)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-between items-center">
                      <div className="text-sm font-medium text-gray-900">
                        {job.homeowner ? `Posted by: ${job.homeowner.first_name} ${job.homeowner.last_name.charAt(0)}.` : 'Homeowner'}
                      </div>
                      
                      <div className="flex space-x-3">
                        <Link
                          to={`/professional/job-details/${job.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <FaExternalLinkAlt className="mr-1.5 -ml-0.5" /> View Details
                        </Link>
                        
                        {job.interested ? (
                          <span className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md text-green-700 bg-green-100">
                            <FaCheck className="mr-1.5 -ml-0.5" /> Interested
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleExpressInterest(job.id)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            disabled={processingJobId === job.id}
                          >
                            {processingJobId === job.id ? (
                              <>
                                <span className="spinner-small mr-2"></span>
                                Processing...
                              </>
                            ) : (
                              'Express Interest'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-lg shadow">
            <FaSearch className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || categoryFilter || locationFilter || timelineFilter
                ? 'Try adjusting your search filters to find more jobs.' 
                : 'There are no open jobs available at the moment. Check back later.'}
            </p>
            {(searchTerm || categoryFilter || locationFilter || timelineFilter) && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FindJobs;