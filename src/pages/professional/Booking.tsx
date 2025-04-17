import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Briefcase, ChevronDown, Check, X } from 'lucide-react';
import { supabase } from '../../services/supabaseClient';
import { format } from 'date-fns';
import { toast, ToastContainer } from 'react-toastify';
import { useParams } from 'react-router-dom';

interface Job {
  id: string;
  title: string;
  description: string;
}

function Booking() {
  const [selectedTime, setSelectedTime] = useState('12:00');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedJob, setSelectedJob] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const { proid } = useParams<{ proid: string }>();

  const times = Array.from({ length: 24 }, (_, i) => {
    const hour = Math.floor(i / 2) + 11;
    const minute = i % 2 === 0 ? '00' : '30';
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute} ${period}`;
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data: jobsData, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(jobsData || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast.error('Failed to load jobs');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) {
      toast.error('Please select a job');
      return;
    }

    setLoading(true);
    const dateTime = new Date(`${selectedDate}T${selectedTime}`);

    try {
      const { error } = await supabase
        .from('bookings')
        .insert([
          {
            professional_id: proid,
            job_id: selectedJob,
            date_time: dateTime.toISOString(),
            notes,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      
      
      toast.success('Booking request sent successfully!');
      setNotes('');
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" />
      
      {/* Hero Section */}
      <div 
        className="h-[300px] bg-cover bg-center relative"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2340&q=80")'
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50">
          <div className="container mx-auto px-4 h-full flex items-center">
            <h1 className="text-4xl md:text-5xl text-white font-bold">Book an Appointment</h1>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Job Selection */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Job
                </label>
                <div className="relative">
                  <select
                    value={selectedJob}
                    onChange={(e) => setSelectedJob(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    required
                  >
                    <option value="">Choose a job...</option>
                    {jobs.map((job) => (
                      <option key={job.id} value={job.id}>{job.title}</option>
                    ))}
                  </select>
                  <Briefcase className="absolute right-8 top-2.5 h-5 w-5 text-gray-400" />
                  <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                  <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>

              {/* Time Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Time
                </label>
                <div className="relative">
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    required
                  >
                    {times.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  <Clock className="absolute right-8 top-2.5 h-5 w-5 text-gray-400" />
                  <ChevronDown className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes for Professional
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24"
                placeholder="Add any specific requirements or questions..."
              />
            </div>

            {/* Booking Summary */}
            <div className="mt-8 bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Summary</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-5 w-5 mr-3" />
                  <span>{selectedJob ? jobs.find(j => j.id === selectedJob)?.title || 'No job selected' : 'No job selected'}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Calendar className="h-5 w-5 mr-3" />
                  <span>{format(new Date(selectedDate), 'EEEE, MMMM d, yyyy')}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="h-5 w-5 mr-3" />
                  <span>{selectedTime}</span>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`mt-8 w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2 ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-blue-600 hover:bg-blue-700'
              } text-white transition-colors duration-200`}
            >
              {loading ? (
                <>
                  <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  <span>Send Booking Request</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Booking;