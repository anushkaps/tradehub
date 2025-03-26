import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { FaSearch, FaFilter, FaMapMarkerAlt, FaCalendarAlt, FaDollarSign, FaTools, FaExternalLinkAlt, FaCheck, FaTimes, FaSpinner } from 'react-icons/fa';
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
    id: string;
    first_name: string;
    last_name: string;
  } | null;
  interest_status: string;
  quote_amount: number | null;
}

interface Interest {
  status: string;
  quote_amount: number | null;
  jobs: Job;
  user_id: string;
}

const MyJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Fetch jobs that the professional has expressed interest in
      const { data: interestsData, error: interestsError } = await supabase
        .from('job_interests')
        .select(`
          job_id,
          status,
          quote_amount,
          jobs(
            *,
            homeowner:homeowner_profiles!jobs_homeowner_id_fkey(
              id,
              first_name,
              last_name
            )
          )
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (interestsError) throw interestsError;
      
      // Transform the data to the format we need
      const transformedJobs = interestsData?.map((interest) => {
        const job = interest.jobs;
        return {
          ...job,
          interest_status: interest.status,
          quote_amount: interest.quote_amount
        };
      }) || [];
      
      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load your jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter ? job.interest_status === statusFilter : true;
    
    return matchesSearch && matchesStatus;
  });
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'interested':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Interested
          </span>
        );
      case 'selected':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Selected
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Not Selected
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
            Completed
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Jobs</h1>
          <p className="mt-2 text-gray-600">Track and manage jobs you've expressed interest in.</p>
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
                  setSearchTerm('');
                  setStatusFilter('');
                  fetchJobs();
                }}
              >
                Refresh Jobs
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div>
                  <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                    Filter by Status
                  </label>
                  <select
                    id="status-filter"
                    className="block w-full sm:w-64 rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="">All Statuses</option>
                    <option value="interested">Interested</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Not Selected</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('');
                    }}
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
            <p className="mt-2 text-gray-600">Loading your jobs...</p>
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
                        {getStatusBadge(job.interest_status)}
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
                      
                      {job.quote_amount && (
                        <div className="flex items-center text-sm font-medium text-green-600">
                          <FaDollarSign className="flex-shrink-0 mr-1.5 text-green-500" />
                          <span>Your Quote: ${job.quote_amount.toLocaleString()}</span>
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
                        
                        {job.interest_status === 'selected' && (
                          <Link
                            to={`/professional/messages/${job.homeowner?.id || ''}`}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Message Homeowner
                          </Link>
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
              {searchTerm || statusFilter
                ? 'Try adjusting your search filters to find more jobs.' 
                : "You haven't expressed interest in any jobs yet."}
            </p>
            {(searchTerm || statusFilter) && (
              <button
                type="button"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('');
                }}
                className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Clear Filters
              </button>
            )}
            <div className="mt-6">
              <Link
                to="/professional/find-jobs"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Find Jobs to Apply
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;