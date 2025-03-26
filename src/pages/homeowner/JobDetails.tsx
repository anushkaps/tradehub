import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Briefcase, Clock, MapPin, DollarSign, MessageSquare, 
  User, Star, CheckCircle, XCircle, Edit, Trash2, Calendar 
} from 'lucide-react';

const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState('details');

  // Mock data
  const job = {
    id: id,
    title: 'Bathroom Renovation',
    status: 'in-progress',
    date: '2025-03-15',
    description: 'Complete renovation of master bathroom including new fixtures, tiling, and plumbing. Need to replace the bathtub, toilet, sink, and all fixtures. Also need to retile the floor and walls.',
    category: 'Plumbing',
    location: '123 Main St, Anytown, USA',
    budget: '$3,000 - $5,000',
    timeframe: 'Within a month',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1564540583246-934409427776?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
    ]
  };

  const quotes = [
    {
      id: '1',
      professional: {
        id: '101',
        name: 'John Smith',
        company: 'Smith Plumbing',
        rating: 4.8,
        reviews: 56,
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      amount: '$4,200',
      estimatedDuration: '2 weeks',
      message: 'I can complete this renovation with high-quality fixtures and materials. I have 15 years of experience with bathroom renovations.',
      date: '2025-03-16',
      status: 'accepted'
    },
    {
      id: '2',
      professional: {
        id: '102',
        name: 'Sarah Johnson',
        company: 'Johnson Home Improvements',
        rating: 4.9,
        reviews: 42,
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      amount: '$4,800',
      estimatedDuration: '10 days',
      message: 'I specialize in bathroom renovations and can provide premium fixtures at a competitive price. My team is available to start next week.',
      date: '2025-03-17',
      status: 'pending'
    },
    {
      id: '3',
      professional: {
        id: '103',
        name: 'Mike Davis',
        company: 'Davis Plumbing & Remodeling',
        rating: 4.6,
        reviews: 38,
        image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
      },
      amount: '$3,900',
      estimatedDuration: '3 weeks',
      message: 'I can offer a competitive rate for your bathroom renovation. I use quality materials and provide a 1-year warranty on all work.',
      date: '2025-03-18',
      status: 'pending'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'open':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">Open</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending Quotes</span>;
      case 'in-progress':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">In Progress</span>;
      case 'completed':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">Completed</span>;
      case 'cancelled':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">Cancelled</span>;
      default:
        return null;
    }
  };

  const getQuoteStatusBadge = (status: string) => {
    switch(status) {
      case 'accepted':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Accepted</span>;
      case 'pending':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>;
      case 'rejected':
        return <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
          <div className="mt-1 flex items-center">
            {getStatusBadge(job.status)}
            <span className="ml-2 text-sm text-gray-500">Posted on {job.date}</span>
          </div>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Edit className="mr-1.5 h-4 w-4 text-gray-500" />
            Edit
          </button>
          <button className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
            <Trash2 className="mr-1.5 h-4 w-4 text-red-500" />
            Cancel Job
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Job Details
          </button>
          <button
            onClick={() => setActiveTab('quotes')}
            className={`${
              activeTab === 'quotes'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Quotes ({quotes.length})
          </button>
          <button
            onClick={() => setActiveTab('messages')}
            className={`${
              activeTab === 'messages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Messages
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'details' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Job Information</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Details about your job request.</p>
          </div>
          <div className="border-t border-gray-200">
            <dl>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Category</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{job.category}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{job.description}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  <MapPin className="inline-block h-4 w-4 mr-1" />
                  Location
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{job.location}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  <DollarSign className="inline-block h-4 w-4 mr-1" />
                  Budget
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{job.budget}</dd>
              </div>
              <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  <Calendar className="inline-block h-4 w-4 mr-1" />
                  Timeframe
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{job.timeframe}</dd>
              </div>
              <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">Images</dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="grid grid-cols-2 gap-4">
                    {job.images.map((image, index) => (
                      <div key={index} className="relative">
                        <img src={image} alt={`Job image ${index + 1}`} className="h-40 w-full object-cover rounded-md" />
                      </div>
                    ))}
                  </div>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      )}

      {activeTab === 'quotes' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Quotes Received</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">Review and manage quotes from professionals.</p>
          </div>
          <div className="border-t border-gray-200">
            {quotes.length === 0 ? (
              <div className="px-4 py-5 sm:px-6 text-center">
                <p className="text-gray-500">No quotes received yet.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {quotes.map((quote) => (
                  <li key={quote.id} className="px-4 py-5 sm:px-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img className="h-12 w-12 rounded-full" src={quote.professional.image} alt="" />
                        </div>
                        <div>
                          <Link to={`/homeowner/professional/${quote.professional.id}`} className="text-sm font-medium text-blue-600 hover:underline">
                            {quote.professional.name}
                          </Link>
                          <p className="text-sm text-gray-500">{quote.professional.company}</p>
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="ml-1 text-sm text-gray-600">{quote.professional.rating} ({quote.professional.reviews} reviews)</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        {getQuoteStatusBadge(quote.status)}
                        <p className="mt-1 text-sm font-medium text-gray-900">{quote.amount}</p>
                        <p className="text-sm text-gray-500">Est. {quote.estimatedDuration}</p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-600">{quote.message}</p>
                    </div>
                    <div className="mt-4 flex justify-between items-center">
                      <p className="text-xs text-gray-500">Received on {quote.date}</p>
                      <div className="flex space-x-2">
                        <Link 
                          to={`/homeowner/messages?professional=${quote.professional.id}`}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          <MessageSquare className="mr-1.5 h-3 w-3 text-gray-500" />
                          Message
                        </Link>
                        {quote.status === 'pending' && (
                          <>
                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
                              <CheckCircle className="mr-1.5 h-3 w-3 text-white" />
                              Accept
                            </button>
                            <button className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                              <XCircle className="mr-1.5 h-3 w-3 text-white" />
                              Decline
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
          <div className="text-center py-8">
            <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No messages yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start a conversation with a professional to discuss your project.
            </p>
            <div className="mt-6">
              <Link
                to="/homeowner/messages"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Go to Messages
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;