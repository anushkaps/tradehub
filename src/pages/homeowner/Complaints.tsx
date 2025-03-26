// src/pages/homeowner/Complaints.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import {
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaFileAlt,
  FaPaperPlane,
} from 'react-icons/fa';
import { toast } from 'react-toastify';

interface Complaint {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  created_at: string;
  updated_at: string;
  job_id: string | null;
  professional_id: string | null;
  attachments: string[] | null;
  job: {
    title: string;
  } | null;
  professional: {
    first_name: string;
    last_name: string;
    company_name: string | null;
  } | null;
}

interface ComplaintMessage {
  id: string;
  complaint_id: string;
  sender_id: string;
  content: string;
  created_at: string;
  sender_type: 'homeowner' | 'professional' | 'admin';
}

const Complaints: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [complaintMessages, setComplaintMessages] = useState<ComplaintMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sendingMessage, setSendingMessage] = useState(false);
  const [showNewComplaintForm, setShowNewComplaintForm] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    title: '',
    description: '',
    job_id: '',
    professional_id: '',
  });
  const [jobs, setJobs] = useState<{ id: string; title: string }[]>([]);
  const [professionals, setProfessionals] = useState<{ id: string; name: string }[]>([]);
  const [submittingComplaint, setSubmittingComplaint] = useState(false);

  useEffect(() => {
    fetchComplaints();
    fetchJobs();
    fetchProfessionals();
  }, []);

  useEffect(() => {
    if (selectedComplaint) {
      fetchComplaintMessages(selectedComplaint.id);
    }
  }, [selectedComplaint]);

  const fetchComplaints = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('complaints')
        .select(
          `
          *,
          job:jobs(title),
          professional:professional_profiles(first_name, last_name, company_name)
        `
        )
        .eq('homeowner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setComplaints(data || []);
    } catch (error) {
      console.error('Error fetching complaints:', error);
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  const fetchComplaintMessages = async (complaintId: string) => {
    try {
      const { data, error } = await supabase
        .from('complaint_messages')
        .select('*')
        .eq('complaint_id', complaintId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setComplaintMessages(data || []);
    } catch (error) {
      console.error('Error fetching complaint messages:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data, error } = await supabase
        .from('jobs')
        .select('id, title')
        .eq('homeowner_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setJobs(data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchProfessionals = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Get professionals that the homeowner has worked with
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('assigned_professional_id')
        .eq('homeowner_id', user.id)
        .not('assigned_professional_id', 'is', null);

      if (jobsError) throw jobsError;

      if (!jobsData || jobsData.length === 0) return;

      const professionalIds = [
        ...new Set(jobsData.map((job) => job.assigned_professional_id)),
      ];

      const { data, error } = await supabase
        .from('professional_profiles')
        .select('user_id, first_name, last_name, company_name')
        .in('user_id', professionalIds);

      if (error) throw error;

      setProfessionals(
        data?.map((pro) => ({
          id: pro.user_id,
          name: pro.company_name || `${pro.first_name} ${pro.last_name}`,
        })) || []
      );
    } catch (error) {
      console.error('Error fetching professionals:', error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !selectedComplaint) return;

    setSendingMessage(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('complaint_messages')
        .insert({
          complaint_id: selectedComplaint.id,
          sender_id: user.id,
          content: newMessage.trim(),
          sender_type: 'homeowner',
        })
        .select();

      if (error) throw error;

      // If complaint was closed, reopen it (set to in_progress)
      if (selectedComplaint.status === 'closed') {
        const { error: updateError } = await supabase
          .from('complaints')
          .update({ status: 'in_progress', updated_at: new Date().toISOString() })
          .eq('id', selectedComplaint.id);

        if (updateError) throw updateError;

        // Update local state
        setSelectedComplaint({
          ...selectedComplaint,
          status: 'in_progress',
          updated_at: new Date().toISOString(),
        });

        setComplaints((prev) =>
          prev.map((complaint) =>
            complaint.id === selectedComplaint.id
              ? { ...complaint, status: 'in_progress', updated_at: new Date().toISOString() }
              : complaint
          )
        );
      }

      // Add message to state
      if (data && data.length > 0) {
        setComplaintMessages((prev) => [...prev, data[0]]);
      }

      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSendingMessage(false);
    }
  };

  const handleSubmitComplaint = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComplaint.title.trim() || !newComplaint.description.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmittingComplaint(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('complaints')
        .insert({
          title: newComplaint.title,
          description: newComplaint.description,
          homeowner_id: user.id,
          job_id: newComplaint.job_id || null,
          professional_id: newComplaint.professional_id || null,
          status: 'pending',
        })
        .select();

      if (error) throw error;

      toast.success('Complaint submitted successfully');

      // Reset form and refresh complaints
      setNewComplaint({
        title: '',
        description: '',
        job_id: '',
        professional_id: '',
      });
      setShowNewComplaintForm(false);

      // Add new complaint to state
      if (data && data.length > 0) {
        fetchComplaints();
      }
    } catch (error) {
      console.error('Error submitting complaint:', error);
      toast.error('Failed to submit complaint');
    } finally {
      setSubmittingComplaint(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
    }).format(date);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'in_progress':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            In Progress
          </span>
        );
      case 'resolved':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Resolved
          </span>
        );
      case 'closed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            Closed
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Complaints & Dispute Resolution</h1>
          <button
            onClick={() => setShowNewComplaintForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <FaExclamationTriangle className="mr-2 -ml-1" />
            Submit New Complaint
          </button>
        </div>

        {showNewComplaintForm && (
          <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Submit a New Complaint</h2>
              <form onSubmit={handleSubmitComplaint}>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Complaint Title *
                    </label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={newComplaint.title}
                      onChange={(e) =>
                        setNewComplaint({ ...newComplaint, title: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Complaint Details *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={4}
                      value={newComplaint.description}
                      onChange={(e) =>
                        setNewComplaint({ ...newComplaint, description: e.target.value })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      placeholder="Please provide detailed information about your complaint..."
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="job_id" className="block text-sm font-medium text-gray-700">
                        Related Job (Optional)
                      </label>
                      <select
                        id="job_id"
                        name="job_id"
                        value={newComplaint.job_id}
                        onChange={(e) =>
                          setNewComplaint({ ...newComplaint, job_id: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a job</option>
                        {jobs.map((job) => (
                          <option key={job.id} value={job.id}>
                            {job.title}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="professional_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Related Professional (Optional)
                      </label>
                      <select
                        id="professional_id"
                        name="professional_id"
                        value={newComplaint.professional_id}
                        onChange={(e) =>
                          setNewComplaint({ ...newComplaint, professional_id: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      >
                        <option value="">Select a professional</option>
                        {professionals.map((pro) => (
                          <option key={pro.id} value={pro.id}>
                            {pro.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowNewComplaintForm(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={submittingComplaint}
                  >
                    {submittingComplaint ? (
                      <>
                        <FaSpinner className="animate-spin mr-2 -ml-1" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <FaExclamationTriangle className="mr-2 -ml-1" />
                        Submit Complaint
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 h-[calc(100vh-16rem)]">
            {/* Complaints List */}
            <div className="border-r border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Your Complaints</h2>
              </div>

              <div className="overflow-y-auto h-[calc(100%-4rem)]">
                {loading ? (
                  <div className="flex justify-center items-center h-full">
                    <FaSpinner className="animate-spin text-gray-500 text-2xl" />
                  </div>
                ) : complaints.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {complaints.map((complaint) => (
                      <li
                        key={complaint.id}
                        className={`hover:bg-gray-50 cursor-pointer ${
                          selectedComplaint?.id === complaint.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => setSelectedComplaint(complaint)}
                      >
                        <div className="px-4 py-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-sm font-medium text-gray-900">
                              {complaint.title}
                            </h3>
                            {getStatusBadge(complaint.status)}
                          </div>
                          <p className="mt-1 text-xs text-gray-500 truncate">
                            {complaint.description}
                          </p>
                          <div className="mt-2 flex justify-between items-center">
                            <p className="text-xs text-gray-500">
                              {formatDate(complaint.created_at)}
                            </p>
                            {complaint.job && (
                              <p className="text-xs text-gray-500">
                                Job: {complaint.job.title}
                              </p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full p-6">
                    <FaFileAlt className="text-gray-400 text-4xl mb-2" />
                    <p className="text-gray-500 text-center">
                      You haven't submitted any complaints yet.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Complaint Details */}
            <div className="md:col-span-2 flex flex-col h-full">
              {selectedComplaint ? (
                <>
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex justify-between items-center">
                      <h2 className="text-lg font-medium text-gray-900">
                        {selectedComplaint.title}
                      </h2>
                      {getStatusBadge(selectedComplaint.status)}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      Submitted on {formatDate(selectedComplaint.created_at)}
                    </p>
                    {selectedComplaint.professional && (
                      <p className="mt-1 text-sm text-gray-500">
                        Professional:{' '}
                        {selectedComplaint.professional.company_name ||
                          `${selectedComplaint.professional.first_name} ${selectedComplaint.professional.last_name}`}
                      </p>
                    )}
                    {selectedComplaint.job && (
                      <p className="mt-1 text-sm text-gray-500">
                        Job: {selectedComplaint.job.title}
                      </p>
                    )}
                  </div>

                  <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <h3 className="text-sm font-medium text-gray-900">Complaint Details</h3>
                    <p className="mt-2 text-sm text-gray-700 whitespace-pre-line">
                      {selectedComplaint.description}
                    </p>
                    {selectedComplaint.attachments && selectedComplaint.attachments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="text-xs font-medium text-gray-700">Attachments:</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {selectedComplaint.attachments.map((url, index) => (
                            <a
                              key={index}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs flex items-center"
                            >
                              <FaFileAlt className="mr-1" />
                              Attachment {index + 1}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Communication</h3>

                    {complaintMessages.length > 0 ? (
                      complaintMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender_type === 'homeowner' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-xs sm:max-w-md rounded-lg px-4 py-2 ${
                              message.sender_type === 'homeowner'
                                ? 'bg-blue-600 text-white'
                                : message.sender_type === 'admin'
                                ? 'bg-gray-700 text-white'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender_type === 'homeowner'
                                  ? 'text-blue-200'
                                  : message.sender_type === 'admin'
                                  ? 'text-gray-300'
                                  : 'text-gray-500'
                              }`}
                            >
                              {formatDate(message.created_at)} •{' '}
                              {message.sender_type === 'homeowner'
                                ? 'You'
                                : message.sender_type === 'admin'
                                ? 'Support Team'
                                : 'Professional'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6">
                        <p className="text-gray-500">No messages yet. Start the conversation!</p>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-200 p-4">
                    <form onSubmit={handleSendMessage} className="flex items-end space-x-2">
                      <div className="flex-1">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={2}
                          disabled={selectedComplaint.status === 'resolved'}
                        />
                      </div>
                      <button
                        type="submit"
                        className="bg-red-600 text-white rounded-full p-2 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={
                          sendingMessage || !newMessage.trim() || selectedComplaint.status === 'resolved'
                        }
                      >
                        {sendingMessage ? (
                          <FaSpinner className="animate-spin h-5 w-5" />
                        ) : (
                          <FaPaperPlane />
                        )}
                      </button>
                    </form>

                    {selectedComplaint.status === 'resolved' && (
                      <p className="mt-2 text-sm text-gray-500 text-center">
                        This complaint has been resolved. No further messages can be sent.
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <FaExclamationTriangle className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No complaint selected
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Select a complaint from the list or submit a new one.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Complaints;
