import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { FaDownload, FaSearch, FaFilter, FaReceipt, FaCreditCard, FaMoneyBill } from 'react-icons/fa';

interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  created_at: string;
  job_id: string;
  job: {
    title: string;
  };
  professional: {
    first_name: string;
    last_name: string;
    company_name: string | null;
  } | null;
  invoice_url: string | null;
  receipt_url: string | null;
}

const PaymentHistory: React.FC = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<string>('');
  const [showFilters, setShowFilters] = useState(false);
  
  useEffect(() => {
    fetchPayments();
  }, []);
  
  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, statusFilter, dateFilter]);
  
  const fetchPayments = async () => {
    try {
      setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          job:jobs(title),
          professional:professional_profiles(first_name, last_name, company_name)
        `)
        .eq('homeowner_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setPayments(data || []);
      setFilteredPayments(data || []);
    } catch (error) {
      console.error('Error fetching payments:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const filterPayments = () => {
    let filtered = [...payments];
    
    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        payment => 
          payment.job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (payment.professional && 
            (payment.professional.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
             `${payment.professional.first_name} ${payment.professional.last_name}`.toLowerCase().includes(searchTerm.toLowerCase())))
      );
    }
    
    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }
    
    // Apply date filter
    if (dateFilter) {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'last7days':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(payment => new Date(payment.created_at) >= filterDate);
          break;
        case 'last30days':
          filterDate.setDate(now.getDate() - 30);
          filtered = filtered.filter(payment => new Date(payment.created_at) >= filterDate);
          break;
        case 'last90days':
          filterDate.setDate(now.getDate() - 90);
          filtered = filtered.filter(payment => new Date(payment.created_at) >= filterDate);
          break;
        case 'thisYear':
          filterDate.setMonth(0, 1);
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(payment => new Date(payment.created_at) >= filterDate);
          break;
      }
    }
    
    setFilteredPayments(filtered);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'completed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'failed':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            Failed
          </span>
        );
      case 'refunded':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
            Refunded
          </span>
        );
      default:
        return null;
    }
  };
  
  const getPaymentMethodIcon = (method: string) => {
    switch (method.toLowerCase()) {
      case 'credit card':
      case 'card':
        return <FaCreditCard className="text-gray-500" />;
      case 'bank transfer':
      case 'bank':
        return <FaMoneyBill className="text-gray-500" />;
      default:
        return <FaReceipt className="text-gray-500" />;
    }
  };
  
  const calculateTotalSpent = () => {
    return payments
      .filter(payment => payment.status === 'completed')
      .reduce((total, payment) => total + payment.amount, 0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Payment History</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage all your payments for services
          </p>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800">Total Spent</h3>
              <p className="mt-2 text-2xl font-bold text-blue-900">{formatCurrency(calculateTotalSpent())}</p>
              <p className="mt-1 text-xs text-blue-700">Across all completed payments</p>
            </div>
            
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800">Completed Payments</h3>
              <p className="mt-2 text-2xl font-bold text-green-900">
                {payments.filter(payment => payment.status === 'completed').length}
              </p>
              <p className="mt-1 text-xs text-green-700">Successfully processed payments</p>
            </div>
            
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800">Pending Payments</h3>
              <p className="mt-2 text-2xl font-bold text-yellow-900">
                {payments.filter(payment => payment.status === 'pending').length}
              </p>
              <p className="mt-1 text-xs text-yellow-700">Payments awaiting processing</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden mb-6">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Search by job title or professional name"
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
                Filters
              </button>
            </div>
            
            {showFilters && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Status
                    </label>
                    <select
                      id="status-filter"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="failed">Failed</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="date-filter" className="block text-sm font-medium text-gray-700 mb-1">
                      Filter by Date
                    </label>
                    <select
                      id="date-filter"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value)}
                    >
                      <option value="">All Time</option>
                      <option value="last7days">Last 7 Days</option>
                      <option value="last30days">Last 30 Days</option>
                      <option value="last90days">Last 90 Days</option>
                      <option value="thisYear">This Year</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {
                      setSearchTerm('');
                      setStatusFilter('');
                      setDateFilter('');
                    }}
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {loading ? (
            <div className="text-center py-10">
              <div className="spinner"></div>
              <p className="mt-2 text-gray-600">Loading payment history...</p>
            </div>
          ) : filteredPayments.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Professional
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Method
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Receipt
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {payment.job.title}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.professional 
                          ? (payment.professional.company_name || `${payment.professional.first_name} ${payment.professional.last_name}`)
                          : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(payment.amount)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(payment.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(payment.status)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          {getPaymentMethodIcon(payment.payment_method)}
                          <span className="ml-2">{payment.payment_method}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {payment.receipt_url ? (
                          <a
                            href={payment.receipt_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                          >
                            <FaDownload className="mr-1" />
                            Receipt
                          </a>
                        ) : payment.status === 'completed' ? (
                          <span className="text-gray-400">Processing</span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-10">
              <FaReceipt className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No payments found</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || statusFilter || dateFilter 
                  ? 'Try adjusting your search filters to find more payments.' 
                  : 'You haven\'t made any payments yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;