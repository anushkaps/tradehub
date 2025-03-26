import React from 'react';
import { Calendar, Clock, MapPin, Briefcase, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

export default function JobManagement() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Job Management</h1>
          <p className="text-gray-600">Manage your active and upcoming jobs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {jobStats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2 rounded-lg ${stat.iconBg}`}>
                  {stat.icon}
                </div>
              </div>
              <h3 className="text-2xl font-bold">{stat.value}</h3>
              <p className="text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
          <div className="p-6">
            <h2 className="text-xl font-bold mb-6">Active Jobs</h2>
            <div className="space-y-6">
              {activeJobs.map((job, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <div className="flex items-center text-gray-500 mt-2">
                        <MapPin className="w-4 h-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <Calendar className="w-4 h-4 mr-2" />
                        {job.date}
                      </div>
                      <div className="flex items-center text-gray-500 mt-1">
                        <Clock className="w-4 h-4 mr-2" />
                        {job.time}
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <button className="px-4 py-2 bg-[#105298] text-white rounded-md hover:bg-[#0c3d72]">
                        Update Status
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        View Details
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center space-x-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        job.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                        job.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {job.status}
                      </span>
                      <button className="flex items-center text-[#105298] hover:text-[#0c3d72]">
                        <MessageSquare className="w-4 h-4 mr-1" />
                        Message Client
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Upcoming Jobs</h2>
            <div className="space-y-4">
              {upcomingJobs.map((job, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-600">{job.date}</p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-green-600 hover:bg-green-50 rounded-full">
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    <button className="p-2 text-red-600 hover:bg-red-50 rounded-full">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Recent Quotes</h2>
            <div className="space-y-4">
              {recentQuotes.map((quote, index) => (
                <div key={index} className="flex items-center justify-between border-b border-gray-200 pb-4 last:border-0">
                  <div>
                    <h3 className="font-semibold">{quote.title}</h3>
                    <p className="text-sm text-gray-600">£{quote.amount}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    quote.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                    quote.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {quote.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const jobStats = [
  {
    label: 'Active Jobs',
    value: '8',
    icon: <Briefcase className="w-6 h-6 text-blue-600" />,
    iconBg: 'bg-blue-100'
  },
  {
    label: 'Completed',
    value: '145',
    icon: <CheckCircle className="w-6 h-6 text-green-600" />,
    iconBg: 'bg-green-100'
  },
  {
    label: 'Pending',
    value: '3',
    icon: <Clock className="w-6 h-6 text-yellow-600" />,
    iconBg: 'bg-yellow-100'
  },
  {
    label: 'Cancelled',
    icon: <XCircle className="w-6 h-6 text-red-600" />,
    value: '2',
    iconBg: 'bg-red-100'
  }
];

const activeJobs = [
  {
    title: 'Bathroom Renovation',
    location: 'Manchester, M1',
    date: '15 March 2024',
    time: '09:00 - 17:00',
    status: 'In Progress'
  },
  {
    title: 'Kitchen Plumbing',
    location: 'Liverpool, L1',
    date: '16 March 2024',
    time: '10:00 - 14:00',
    status: 'Scheduled'
  }
];

const upcomingJobs = [
  {
    title: 'Boiler Installation',
    date: '18 March 2024'
  },
  {
    title: 'Pipe Repair',
    date: '20 March 2024'
  }
];

const recentQuotes = [
  {
    title: 'Bathroom Renovation',
    amount: '2,500',
    status: 'Pending'
  },
  {
    title: 'Boiler Installation',
    amount: '1,800',
    status: 'Accepted'
  },
  {
    title: 'Pipe Repair',
    amount: '350',
    status: 'Declined'
  }
];