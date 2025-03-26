import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../services/supabaseClient';

interface Complaint {
  id: string;
  created_at: string;
  user_id: string;
  subject: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  related_job_id?: string;
  related_job?: {
    title: string;
  };
}

const Complaints: React.FC = () => {
  const { user, userType } = useUser();
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [relatedJobId, setRelatedJobId] = useState<string | undefined>();
  const [availableJobs, setAvailableJobs] = useState<{ id: string; title: string }[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('complaints')
          .select(`
            id,
            created_at,
            user_id,
            subject,
            description,
            status,
            related_job_id,
            related_job:jobs(title)
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setComplaints(data || []);
      } catch (error) {
        console.error('Error fetching complaints:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        let query = supabase.from('jobs').select('id, title');
        
        if (userType === 'homeowner') {
          query = query.eq('homeowner_id', user.id);
        } else if (userType === 'professional') {
          // For professionals, fetch jobs they're assigned to
          query = query.eq('professional_id', user.id);
        }
        
        const { data, error } = await query;
        
        if (error) throw error;
        setAvailableJobs(data || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchComplaints();
    fetchJobs();
  }, [user, userType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    if (!subject.trim() || !description.trim()) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (!user) {
      setFormError('You must be logged in to submit a complaint');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert({
          user_id: user.id,
          subject,
          description,
          related_job_id: relatedJobId,
          status: 'pending'
        })
        .select();

      if (error) throw error;

      // Add the new complaint to the list
      if (data && data[0]) {
        setComplaints([data[0], ...complaints]);
      }

      // Reset form
      setSubject('');
      setDescription('');
      setRelatedJobId(undefined);
      setFormSuccess('Your complaint has been submitted successfully');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      setFormError('Failed to submit complaint. Please try again.');
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      case 'closed':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Complaints</h1>
      
      {/* Submit Complaint Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Submit a New Complaint</h2>
        
        {formError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {formError}
          </div>
        )}
        
        {formSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {formSuccess}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
              Subject *
            </label>
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="relatedJob" className="block text-gray-700 font-medium mb-2">
              Related Job (Optional)
            </label>
            <select
              id="relatedJob"
              value={relatedJobId || ''}
              onChange={(e) => setRelatedJobId(e.target.value || undefined)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Select a job --</option>
              {availableJobs.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>
          
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Submit Complaint
          </button>
        </form>
      </div>
      
      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Your Complaints</h2>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : complaints.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            You haven't submitted any complaints yet.
          </div>
        ) : (
          <div className="divide-y">
            {complaints.map((complaint) => (
              <div key={complaint.id} className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-medium">{complaint.subject}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeClass(complaint.status)}`}>
                    {complaint.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-gray-600 mb-3">{complaint.description}</p>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Submitted on {formatDate(complaint.created_at)}</span>
                  {complaint.related_job && (
                    <span>Related to: {complaint.related_job.title}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Complaints;
