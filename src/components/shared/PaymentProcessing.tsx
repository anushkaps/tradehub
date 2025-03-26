import React, { useState } from 'react';
import { CreditCard, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
}

interface PaymentProcessingProps {
  amount: number;
  currency?: string;
  jobId: string;
  recipientId: string;
  recipientName: string;
  onSuccess?: (transactionId: string) => void;
  onCancel?: () => void;
}

const PaymentProcessing: React.FC<PaymentProcessingProps> = ({
  amount,
  currency = 'USD',
  jobId,
  recipientId,
  recipientName,
  onSuccess,
  onCancel,
}) => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'pm_1',
      type: 'card',
      last4: '4242',
      expiryDate: '12/25',
      isDefault: true,
    },
    {
      id: 'pm_2',
      type: 'bank',
      last4: '6789',
      isDefault: false,
    },
  ]);
  
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>(
    paymentMethods.find(pm => pm.isDefault)?.id || ''
  );
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [transactionId, setTransactionId] = useState<string | null>(null);
  
  const handlePayment = async () => {
    if (!selectedPaymentMethod) {
      setError('Please select a payment method');
      return;
    }
    
    setIsProcessing(true);
    setError(null);
    
    try {
      // This would be replaced with an actual API call
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate successful payment
      const mockTransactionId = `tx_${Date.now()}`;
      setTransactionId(mockTransactionId);
      setSuccess(true);
      
      if (onSuccess) {
        onSuccess(mockTransactionId);
      }
    } catch (err) {
      setError('Payment failed. Please try again.');
      console.error('Payment error:', err);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(value);
  };
  
  if (success && transactionId) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
        <div className="text-center mb-6">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h2 className="mt-4 text-2xl font-bold text-gray-900">Payment Successful!</h2>
          <p className="mt-2 text-gray-600">
            Your payment of {formatCurrency(amount)} has been processed successfully.
          </p>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Transaction ID:</span>
            <span className="font-medium">{transactionId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Amount:</span>
            <span className="font-medium">{formatCurrency(amount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Recipient:</span>
            <span className="font-medium">{recipientName}</span>
          </div>
        </div>
        
        <button
          onClick={() => window.location.href = `/jobs/details/${jobId}`}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Return to Job Details
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Payment Details</h2>
      
      {/* Payment Summary */}
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Job ID:</span>
          <span className="font-medium">{jobId}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Recipient:</span>
          <span className="font-medium">{recipientName}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold">
          <span>Total Amount:</span>
          <span>{formatCurrency(amount)}</span>
        </div>
      </div>
      
      {/* Payment Methods */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">Select Payment Method</h3>
        
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 mb-3 cursor-pointer ${
              selectedPaymentMethod === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-blue-300'
            }`}
            onClick={() => setSelectedPaymentMethod(method.id)}
          >
            <div className="flex items-center">
              {method.type === 'card' ? (
                <CreditCard className="h-6 w-6 text-gray-600 mr-3" />
              ) : (
                <DollarSign className="h-6 w-6 text-gray-600 mr-3" />
              )}
              <div className="flex-1">
                <p className="font-medium">
                  {method.type === 'card' ? 'Credit Card' : 'Bank Account'} ending in {method.last4}
                </p>
                {method.expiryDate && (
                  <p className="text-sm text-gray-500">Expires {method.expiryDate}</p>
                )}
              </div>
              <div className="ml-3">
                <input
                  type="radio"
                  checked={selectedPaymentMethod === method.id}
                  onChange={() => setSelectedPaymentMethod(method.id)}
                  className="h-5 w-5 text-blue-500"
                />
              </div>
            </div>
          </div>
        ))}
        
        <button
          className="text-blue-500 hover:text-blue-700 text-sm font-medium mt-2"
          onClick={() => alert('Add payment method functionality would go here')}
        >
          + Add Payment Method
        </button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-start">
          <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="flex space-x-4">
        <button
          onClick={onCancel}
          className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg hover:bg-gray-50 transition duration-200"
        >
          Cancel
        </button>
        <button
          onClick={handlePayment}
          disabled={isProcessing || !selectedPaymentMethod}
          className={`flex-1 bg-blue-500 text-white font-medium py-2 px-4 rounded-lg transition duration-200 ${
            isProcessing || !selectedPaymentMethod
              ? 'opacity-70 cursor-not-allowed'
              : 'hover:bg-blue-600'
          }`}
        >
          {isProcessing ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            `Pay ${formatCurrency(amount)}`
          )}
        </button>
      </div>
    </div>
  );
};

export default PaymentProcessing;