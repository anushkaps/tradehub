import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, AlertTriangle, DollarSign, Calendar, ChevronDown, Filter, Search } from 'lucide-react';

interface Bid {
  id: string;
  jobId: string;
  jobTitle: string;
  homeownerId: string;
  homeownerName: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  createdAt: Date;
  expiresAt: Date;
  notes: string;
  jobDetails: {
    description: string;
    location: string;
    category: string;
    startDate?: Date;
    estimatedDuration?: string;
  };
}

const BidManagement: React.FC = () => {
  const [bids, setBids] = useState<Bid[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'rejected' | 'expired'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'amount_high' | 'amount_low'>('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  const [showBidDetails, setShowBidDetails] = useState(false);
  
  useEffect(() => {
    // Simulate fetching bids from API
    const fetchBids = async () => {
      setLoading(true);
      try {
        // This would be replaced with an actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockBids: Bid[] = [
          {
            id: 'bid1',
            jobId: 'job123',
            jobTitle: 'Bathroom Renovation',
            homeownerId: 'home1',
            homeownerName: 'John Smith',
            amount: 2500,
            status: 'pending',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
            notes: 'Includes all materials and labor for complete bathroom renovation.',
            jobDetails: {
              description: 'Need to renovate a small bathroom (5x8). Replace tub, toilet, vanity, and tile floor.',
              location: 'Seattle, WA',
              category: 'Plumbing',
              startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
              estimatedDuration: '1-2 weeks',
            },
          },
          {
            id: 'bid2',
            jobId: 'job456',
            jobTitle: 'Kitchen Sink Installation',
            homeownerId: 'home2',
            homeownerName: 'Sarah Johnson',
            amount: 350,
            status: 'accepted',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            notes: 'Installation of new kitchen sink and faucet. Customer will provide the sink and faucet.',
            jobDetails: {
              description: 'Need to replace old kitchen sink with a new one. Sink and faucet already purchased.',
              location: 'Bellevue, WA',
              category: 'Plumbing',
              startDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
              estimatedDuration: '1 day',
            },
          },
          {
            id: 'bid3',
            jobId: 'job789',
            jobTitle: 'Electrical Panel Upgrade',
            homeownerId: 'home3',
            homeownerName: 'David Williams',
            amount: 1800,
            status: 'rejected',
            createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000),
            notes: 'Upgrade electrical panel from 100A to 200A. Includes all permits and inspections.',
            jobDetails: {
              description: 'Need to upgrade electrical panel to support new appliances and EV charger.',
              location: 'Redmond, WA',
              category: 'Electrical',
              estimatedDuration: '1-2 days',
            },
          },
          {
            id: 'bid4',
            jobId: 'job101',
            jobTitle: 'Roof Repair',
            homeownerId: 'home4',
            homeownerName: 'Emma Davis',
            amount: 750,
            status: 'expired',
            createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
            notes: 'Repair leak in roof. Replace damaged shingles and fix flashing around chimney.',
            jobDetails: {
              description: 'Roof is leaking around chimney area. Need to fix before rainy season.',
              location: 'Kirkland, WA',
              category: 'Roofing',
              estimatedDuration: '1 day',
            },
          },
          {
            id: 'bid5',
            jobId: 'job102',
            jobTitle: 'Deck Construction',
            homeownerId: 'home5',
            homeownerName: 'Michael Brown',
            amount: 4500,
            status: 'pending',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            expiresAt: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
            notes: 'Construction of 12x16 cedar deck with railing and stairs. Includes all materials and labor.',
            jobDetails: {
              description: 'Looking to build a new deck in the backyard. Approximately 12x16 feet with railing and stairs.',
              location: 'Sammamish, WA',
              category: 'Carpentry',
              startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
              estimatedDuration: '1 week',
            },
          },
        ];
        
        setBids(mockBids);
      } catch (error) {
        console.error('Error fetching bids:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  const handleUpdateBid = async (bidId: string, updates: Partial<Bid>) => {
    try {
      // This would be replaced with an actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setBids(
        bids.map(bid =>
          bid.id === bidId
            ? { ...bid, ...updates }
            : bid
        )
      );
      
      // Update selected bid if it's the one being updated
      if (selectedBid && selectedBid.id === bidId) {
        setSelectedBid({ ...selectedBid, ...updates });
      }
    } catch (error) {
      console.error('Error updating bid:', error);
    }
  };

  const handleDeleteBid = async (bidId: string) => {
    if (!confirm('Are you sure you want to delete this bid? This action cannot be undone.')) {
      return;
    }
    
    try {
      // This would be replaced with an actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update local state
      setBids(bids.filter(bid => bid.id !== bidId));
      
      // Close details modal if the deleted bid was selected
      if (selectedBid && selectedBid.id === bidId) {
        setSelectedBid(null);
        setShowBidDetails(false);
      }
    } catch (error) {
      console.error('Error deleting bid:', error);
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'accepted':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'expired':
        return <AlertTriangle className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'expired':
        return 'Expired';
      default:
        return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'expired':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFilteredBids = () => {
    let filtered = [...bids];
    
    // Apply status filter
    if (filter !== 'all') {
      filtered = filtered.filter(bid => bid.status === filter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        bid =>
          bid.jobTitle.toLowerCase().includes(query) ||
          bid.homeownerName.toLowerCase().includes(query) ||
          bid.jobDetails.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt.getTime() - a.createdAt.getTime();
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'amount_high':
          return b.amount - a.amount;
        case 'amount_low':
          return a.amount - b.amount;
        default:
          return 0;
      }
    });
    
    return filtered;
  };

  const filteredBids = getFilteredBids();

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Bid Management</h1>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 sm:mb-0">Your Bids</h2>
            
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <button
                  className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => setFilter(filter === 'all' ? 'pending' : filter === 'pending' ? 'accepted' : filter === 'accepted' ? 'rejected' : filter === 'rejected' ? 'expired' : 'all')}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span>
                    {filter === 'all'
                      ? 'All Bids'
                      : `${getStatusText(filter)} Bids`}
                  </span>
                  <ChevronDown className="h-4 w-4 ml-2" />
                </button>
              </div>
              
              <div className="relative">
                <button
                  className="flex items-center justify-between w-full px-4 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => setSortBy(sortBy === 'newest' ? 'oldest' : sortBy === 'oldest' ? 'amount_high' : sortBy === 'amount_high' ? 'amount_low' : 'newest')}
                >
                  <span>
                    Sort: {sortBy === 'newest'
                      ? 'Newest First'
                      : sortBy === 'oldest'
                      ? 'Oldest First'
                      : sortBy === 'amount_high'
                      ? 'Highest Amount'
                      : 'Lowest Amount'}
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
                placeholder="Search bids..."
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
          ) : filteredBids.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No bids found</h3>
              <p className="text-gray-500">
                {searchQuery || filter !== 'all'
                  ? 'No bids match your search criteria.'
                  : 'You have not submitted any bids yet.'}
              </p>
              {(searchQuery || filter !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilter('all');
                  }}
                  className="mt-4 text-blue-500 hover:text-blue-700"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Homeowner
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Expires
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBids.map((bid) => (
                    <tr key={bid.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{bid.jobTitle}</div>
                        <div className="text-sm text-gray-500">{bid.jobDetails.category}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{bid.homeownerName}</div>
                        <div className="text-sm text-gray-500">{bid.jobDetails.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{formatCurrency(bid.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusClass(bid.status)}`}>
                          {getStatusIcon(bid.status)}
                          <span className="ml-1">{getStatusText(bid.status)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(bid.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(bid.expiresAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setSelectedBid(bid);
                            setShowBidDetails(true);
                          }}
                          className="text-blue-500 hover:text-blue-700 mr-3"
                        >
                          View
                        </button>
                        {bid.status === 'pending' && (
                          <button
                            onClick={() => handleDeleteBid(bid.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Delete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Bid Details Modal */}
      {showBidDetails && selectedBid && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-900">Bid Details</h2>
                <button
                  onClick={() => setShowBidDetails(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle size={24} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">Job Title</div>
                      <div className="font-medium">{selectedBid.jobTitle}</div>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">Category</div>
                      <div>{selectedBid.jobDetails.category}</div>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">Location</div>
                      <div>{selectedBid.jobDetails.location}</div>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">Start Date</div>
                      <div>
                        {selectedBid.jobDetails.startDate
                          ? formatDate(selectedBid.jobDetails.startDate)
                          : 'Not specified'}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Estimated Duration</div>
                      <div>{selectedBid.jobDetails.estimatedDuration || 'Not specified'}</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Bid Information</h3>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">Bid Amount</div>
                      <div className="text-xl font-bold text-gray-900">{formatCurrency(selectedBid.amount)}</div>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">Status</div>
                      <div className="flex items-center">
                        {getStatusIcon(selectedBid.status)}
                        <span className="ml-1 font-medium">{getStatusText(selectedBid.status)}</span>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-sm text-gray-500">Submitted On</div>
                      <div>{formatDate(selectedBid.createdAt)}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Expires On</div>
                      <div>{formatDate(selectedBid.expiresAt)}</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Job Description</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p>{selectedBid.jobDetails.description}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bid Notes</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p>{selectedBid.notes}</p>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowBidDetails(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                
                {selectedBid.status === 'pending' && (
                  <button
                    onClick={() => {
                      handleDeleteBid(selectedBid.id);
                    }}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    Delete Bid
                  </button>
                )}
                
                {selectedBid.status === 'accepted' && (
                  <button
                    onClick={() => {
                      window.location.href = `/jobs/details/${selectedBid.jobId}`;
                    }}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    View Job
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BidManagement;