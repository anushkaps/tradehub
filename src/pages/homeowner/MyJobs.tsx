import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../services/supabaseClient';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  location: string;
  professional_id?: string;
  professional?: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url?: string;
    rating?: number;
  };
  category: string;
  bids_count?: number;
}

const MyJobs: React.FC = () => {
  const { user } = useUser();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'open' | 'in_progress' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!user) return;

    const fetchJobs = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('jobs')
          .select(`
            id,
            title,
            description,
            budget,
            status,
            created_at,
            location,
            category,
            professional_id,
            professional:profiles(id, first_name, last_name, avatar_url, rating),
            bids_count:bids(count)
          `)
          .eq('homeowner_id', user.id)
          .order('created_at', { ascending: false });

        // Apply status filter if not showing all
        if (activeTab !== 'all') {
          query = query.eq('status', activeTab);
        }

        const { data, error } = await query;

        if (error) throw error;
        setJobs(data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, activeTab]);

  const handleCancelJob = async (jobId: string) => {
    if (window.confirm('Are you sure you want to cancel this job?')) {
      try {
        const { error } = await supabase
          .from('jobs')
          .update({ status: 'cancelled' })
          .eq('id', jobId)
          .eq('homeowner_id', user?.id);

        if (error) throw error;

        // Update the job in the local state
        setJobs(prevJobs =>
          prevJobs.map(job =>
            job.id === jobId ? { ...job, status: 'cancelled' as const } : job
          )
        );
      } catch (error) {
        console.error('Error cancelling job:', error);
        alert('Failed to cancel job. Please try again.');
      }
    }
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Jobs</h1>
        <Link
          to="/homeowner/post-job"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Post New Job
        </Link>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0 md:w-1/3">
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'all'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setActiveTab('open')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'open'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Open
            </button>
            <button
              onClick={() => setActiveTab('in_progress')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'in_progress'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              In Progress
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'completed'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Completed
            </button>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-500 mb-4">No jobs found.</p>
          <Link
            to="/homeowner/post-job"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Post Your First Job
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(job.status)}`}>
                    {job.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-3">{job.description}</p>
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <span className="text-gray-500">Budget:</span>
                    <span className="ml-2 font-semibold">{formatCurrency(job.budget)}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">Posted:</span>
                    <span className="ml-2">{formatDate(job.created_at)}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <span className="text-gray-500">Location:</span>
                  <span className="ml-2">{job.location}</span>
                </div>
                <div className="mb-4">
                  <span className="text-gray-500">Category:</span>
                  <span className="ml-2">{job.category}</span>
                </div>
                {job.status === 'open' && (
                  <div className="mb-4">
                    <span className="text-gray-500">Bids:</span>
                    <span className="ml-2">{job.bids_count || 0}</span>
                  </div>
                )}
                {job.professional && (
                  <div className="flex items-center mb-4">
                    <span className="text-gray-500 mr-2">Professional:</span>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-white mr-2">
                        {job.professional.avatar_url ? (
                          <img src={job.professional.avatar_url} alt="Professional" className="h-8 w-8 rounded-full" />
                        ) : (
                          job.professional.first_name[0]
                        )}
                      </div>
                      <span>
                        {job.professional.first_name} {job.professional.last_name}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex justify-between items-center mt-6">
                  <Link
                    to={`/homeowner/job/${job.id}`}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    View Details
                  </Link>
                  {job.status === 'open' && (
                    <button
                      onClick={() => handleCancelJob(job.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Cancel Job
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;
