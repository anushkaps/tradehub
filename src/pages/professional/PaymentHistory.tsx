import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { format } from 'date-fns';

// Payment status types
type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';

// Payment data interface
interface Payment {
  id: string;
  job_id: string;
  job_title: string;
  homeowner_name: string;
  amount: number;
  status: PaymentStatus;
  payment_date: string;
  payment_method: string;
  invoice_number: string;
  description: string;
}

const PaymentHistory: React.FC = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<{ from: string; to: string }>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0], // Default: last 3 months
    to: new Date().toISOString().split('T')[0], // Today
  });
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [totalEarnings, setTotalEarnings] = useState<number>(0);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setIsLoading(true);
        
        // Get the current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) throw new Error('Authentication error. Please login again.');
        if (!user) {
          navigate('/professional/ProfessionalLogin');
          return;
        }

        // Fetch payments for the professional
        let query = supabase
          .from('payments')
          .select(`
            id,
            job_id,
            amount,
            status,
            payment_date,
            payment_method,
            invoice_number,
            description,
            jobs(title),
            homeowners(full_name)
          `)
          .eq('professional_id', user.id)
          .gte('payment_date', dateRange.from)
          .lte('payment_date', dateRange.to)
          .order('payment_date', { ascending: false });

        // Apply status filter if not 'all'
        if (statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }

        const { data, error: paymentsError } = await query;

        if (paymentsError) throw new Error(paymentsError.message);

        // Transform the data to match our Payment interface
        const transformedPayments: Payment[] = data.map((item: any) => ({
          id: item.id,
          job_id: item.job_id,
          job_title: item.jobs?.title || 'Untitled Job',
          homeowner_name: item.homeowners?.full_name || 'Unknown Client',
          amount: item.amount,
          status: item.status,
          payment_date: item.payment_date,
          payment_method: item.payment_method,
          invoice_number: item.invoice_number,
          description: item.description,
        }));

        // Calculate total earnings from completed payments
        const totalCompleted = transformedPayments
          .filter(payment => payment.status === 'completed')
          .reduce((sum, payment) => sum + payment.amount, 0);
        
        setTotalEarnings(totalCompleted);
        setPayments(transformedPayments);
        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, [navigate, dateRange, statusFilter]);

  // Filter payments based on search query
  const filteredPayments = payments.filter(payment => 
    payment.job_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.homeowner_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    payment.invoice_number.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadgeClass = (status: PaymentStatus): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleDownloadInvoice = (invoiceNumber: string) => {
    // This would be implemented to generate and download an invoice PDF
    console.log(`Downloading invoice ${invoiceNumber}`);
    alert(`Invoice download feature will be implemented in a future update.`);
  };

  const handleJobDetailsClick = (jobId: string) => {
    navigate(`/professional/JobManagement?jobId=${jobId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Payment History</h1>
        <p className="text-gray-600 mt-2">
          View and manage all your transactions from jobs completed through TradeHub24.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Total Earnings</h3>
          <p className="text-2xl font-bold text-green-600">${totalEarnings.toFixed(2)}</p>
          <p className="text-sm text-gray-500">All completed payments</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Pending</h3>
          <p className="text-2xl font-bold text-yellow-600">
            ${payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Awaiting completion</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">This Month</h3>
          <p className="text-2xl font-bold text-blue-600">
            ${payments
              .filter(p => 
                p.status === 'completed' && 
                new Date(p.payment_date).getMonth() === new Date().getMonth() &&
                new Date(p.payment_date).getFullYear() === new Date().getFullYear()
              )
              .reduce((sum, p) => sum + p.amount, 0)
              .toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Current month earnings</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Last Month</h3>
          <p className="text-2xl font-bold text-indigo-600">
            ${payments
              .filter(p => {
                const paymentDate = new Date(p.payment_date);
                const lastMonth = new Date();
                lastMonth.setMonth(lastMonth.getMonth() - 1);
                return p.status === 'completed' && 
                  paymentDate.getMonth() === lastMonth.getMonth() &&
                  paymentDate.getFullYear() === lastMonth.getFullYear();
              })
              .reduce((sum, p) => sum + p.amount, 0)
              .toFixed(2)}
          </p>
          <p className="text-sm text-gray-500">Previous month earnings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              placeholder="Search by job, client, or invoice"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Payment Status
            </label>
            <select
              id="status"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="dateFrom" className="block text-sm font-medium text-gray-700 mb-1">
                From Date
              </label>
              <input
                type="date"
                id="dateFrom"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.from}
                onChange={(e) => setDateRange({...dateRange, from: e.target.value})}
              />
            </div>
            <div>
              <label htmlFor="dateTo" className="block text-sm font-medium text-gray-700 mb-1">
                To Date
              </label>
              <input
                type="date"
                id="dateTo"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={dateRange.to}
                onChange={(e) => setDateRange({...dateRange, to: e.target.value})}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Payment Table */}
      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600 mb-2"></div>
          <p className="text-gray-600">Loading your payment history...</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold">Error</h3>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200 transition-colors">
            Try Again
          </button>
        </div>
      ) : filteredPayments.length === 0 ? (
        <div className="bg-white p-10 rounded-lg shadow-md border border-gray-200 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No Payments Found</h3>
          <p className="text-gray-600 mb-4">
            {statusFilter !== 'all' || searchQuery ? 
              'Try adjusting your filters to see more results.' : 
              'You haven\'t received any payments yet. Complete jobs to start earning!'}
          </p>
          <button 
            onClick={() => {
              setStatusFilter('all');
              setSearchQuery('');
              setDateRange({
                from: new Date(new Date().setMonth(new Date().getMonth() - 3)).toISOString().split('T')[0],
                to: new Date().toISOString().split('T')[0],
              });
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job & Client
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Invoice #
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {format(new Date(payment.payment_date), 'MMM d, yyyy')}
                      </div>
                      <div className="text-xs text-gray-500">
                        {format(new Date(payment.payment_date), 'h:mm a')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900 hover:text-blue-600 cursor-pointer" 
                           onClick={() => handleJobDetailsClick(payment.job_id)}>
                        {payment.job_title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.homeowner_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">
                        ${payment.amount.toFixed(2)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {payment.payment_method}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(payment.status)}`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {payment.invoice_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleDownloadInvoice(payment.invoice_number)}
                        className="text-blue-600 hover:text-blue-900 mx-2"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => navigate(`/Messages?jobId=${payment.job_id}`)}
                        className="text-green-600 hover:text-green-900 mx-2"
                      >
                        Message
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination placeholder - would be implemented with actual pagination logic */}
      {filteredPayments.length > 0 && (
        <div className="mt-6 flex justify-between items-center">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{Math.min(1, filteredPayments.length)}</span> to{' '}
            <span className="font-medium">{Math.min(10, filteredPayments.length)}</span> of{' '}
            <span className="font-medium">{filteredPayments.length}</span> results
          </div>
          <div className="flex-1 flex justify-end">
            <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                2
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                3
              </button>
              <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Export Options */}
      {filteredPayments.length > 0 && (
        <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Export Options</h3>
          <div className="flex space-x-2">
            <button className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-sm">
              Export as CSV
            </button>
            <button className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm">
              Export as Excel
            </button>
            <button className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm">
              Export as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentHistory;