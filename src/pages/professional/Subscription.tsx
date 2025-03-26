// src/pages/professional/Subscription.tsx
import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  CreditCard,
  Calendar,
  Check,
  ArrowRight
} from 'lucide-react';

interface SubscriptionPlan {
  id: string;
  name: string;
  monthlyPrice: number;
  annualPrice: number;
  features: string[];
  popular?: boolean;
}

interface PaymentMethod {
  id: string;
  type: 'card';
  last4: string;
  expiryDate: string;
  isDefault: boolean;
}

const Subscription: React.FC = () => {
  // Current subscription (mocked)
  const [currentPlan, setCurrentPlan] = useState<string | null>('starter');
  
  // The plan user selects to upgrade/downgrade
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  
  // Toggle monthly vs. annual billing
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  
  // Payment methods from API
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Plans adapted from your “Pricing” snippet
  const plans: SubscriptionPlan[] = [
    {
      id: 'starter',
      name: 'Starter',
      monthlyPrice: 29,
      annualPrice: 290,
      features: [
        'Up to 10 job leads per month',
        'Basic profile listing',
        'Email support',
        'Mobile app access',
        'Basic analytics'
      ],
      popular: false
    },
    {
      id: 'professional',
      name: 'Professional',
      monthlyPrice: 79,
      annualPrice: 790,
      features: [
        'Up to 50 job leads per month',
        'Featured profile listing',
        'Priority email & phone support',
        'Advanced analytics',
        'Business tools & templates'
      ],
      popular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      monthlyPrice: 199,
      annualPrice: 1990,
      features: [
        'Unlimited job leads',
        'Premium profile listing',
        '24/7 priority support',
        'Custom analytics dashboard',
        'Team management tools'
      ],
      popular: false
    },
  ];

  // Simulate fetching subscription data from an API
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      setLoading(true);
      try {
        // Mock network request
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock payment methods
        const mockPaymentMethods: PaymentMethod[] = [
          {
            id: 'pm_1',
            type: 'card',
            last4: '4242',
            expiryDate: '12/25',
            isDefault: true,
          },
          {
            id: 'pm_2',
            type: 'card',
            last4: '5678',
            expiryDate: '10/24',
            isDefault: false,
          },
        ];
        
        setPaymentMethods(mockPaymentMethods);
        setSelectedPaymentMethod(
          mockPaymentMethods.find(pm => pm.isDefault)?.id || null
        );
      } catch (error) {
        console.error('Error fetching subscription data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptionData();
  }, []);

  // Handle plan selection
  const handlePlanSelect = (planId: string) => {
    // If user clicks the same plan as current, do nothing
    if (planId === currentPlan) return;
    setSelectedPlan(planId);
  };

  // Toggle billing cycle
  const handleBillingCycleChange = (cycle: 'monthly' | 'annual') => {
    setBillingCycle(cycle);
  };

  // Choose a payment method
  const handlePaymentMethodSelect = (paymentMethodId: string) => {
    setSelectedPaymentMethod(paymentMethodId);
  };

  // Confirm subscription changes
  const handleSubscribe = async () => {
    if (!selectedPlan || !selectedPaymentMethod) return;
    setProcessingPayment(true);

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update current plan
      setCurrentPlan(selectedPlan);
      setShowSuccess(true);

      // Reset after success
      setTimeout(() => {
        setShowSuccess(false);
        setSelectedPlan(null);
      }, 4000);
    } catch (error) {
      console.error('Error processing subscription:', error);
    } finally {
      setProcessingPayment(false);
    }
  };

  // Helper to get plan details
  const getPlanDetails = (planId: string | null) =>
    plans.find(plan => plan.id === planId);

  // Format currency
  const formatPrice = (plan: SubscriptionPlan) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    return `£${price}`;
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that works best for your business</p>
        </div>

        {/* Success banner */}
        {showSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 flex items-start">
            <CheckCircle className="h-5 w-5 text-green-500 mr-3 mt-0.5" />
            <div>
              <h3 className="font-medium text-green-800">Subscription Updated</h3>
              <p className="text-green-700 text-sm">
                You are now on the {getPlanDetails(currentPlan)?.name} plan.
              </p>
            </div>
          </div>
        )}

        {/* If user has a current plan, show it */}
        {currentPlan && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Subscription</h2>
            <div className="flex flex-col md:flex-row md:items-center justify-between">
              <div>
                <div className="flex items-center mb-2">
                  <span className="text-xl font-bold text-gray-900 mr-2">
                    {getPlanDetails(currentPlan)?.name} Plan
                  </span>
                  {getPlanDetails(currentPlan)?.popular && (
                    <span className="bg-[#e20000] text-white text-xs font-medium px-2 py-0.5 rounded">
                      Most Popular
                    </span>
                  )}
                </div>
                <p className="text-gray-600 mb-4">
                  {formatPrice(getPlanDetails(currentPlan)!)} /
                  {billingCycle === 'monthly' ? 'month' : 'year'}
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button
                  onClick={() => {
                    // Example: if on Enterprise, maybe switch to Starter, etc.
                    setSelectedPlan(currentPlan === 'enterprise' ? 'professional' : 'enterprise');
                  }}
                  className="bg-white border border-blue-500 text-blue-500 hover:bg-blue-50 font-medium rounded-lg px-4 py-2 text-sm"
                >
                  {currentPlan === 'enterprise' ? 'Downgrade Plan' : 'Upgrade Plan'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Billing cycle toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-lg">
            <button
              onClick={() => handleBillingCycleChange('monthly')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                billingCycle === 'monthly'
                  ? 'bg-[#e20000] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => handleBillingCycleChange('annual')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                billingCycle === 'annual'
                  ? 'bg-[#e20000] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Annual (Save ~17%)
            </button>
          </div>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {plans.map(plan => {
            const isSelected = selectedPlan === plan.id;
            const isCurrent = currentPlan === plan.id;

            return (
              <div
                key={plan.id}
                onClick={() => handlePlanSelect(plan.id)}
                className={`cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden border ${
                  isSelected ? 'ring-2 ring-[#e20000]' : 'border-gray-200'
                } relative`}
              >
                {plan.popular && (
                  <div className="bg-[#e20000] text-white text-center py-2 text-xs font-semibold">
                    Most Popular
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold">
                      {formatPrice(plan)}
                    </span>
                    <span className="text-gray-600">
                      /{billingCycle === 'monthly' ? 'month' : 'year'}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {/* For brevity, just show a short text. If needed, add a plan-specific description. */}
                    {plan.name === 'Starter'
                      ? 'Perfect for professionals just getting started.'
                      : plan.name === 'Professional'
                      ? 'Ideal for growing businesses.'
                      : 'For established businesses with multiple teams.'}
                  </p>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check className="w-5 h-5 text-[#105298] mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Button */}
                  <button
                    className={`w-full py-3 px-6 rounded-md flex items-center justify-center transition-colors ${
                      isCurrent
                        ? 'bg-gray-100 text-gray-800 cursor-default'
                        : isSelected
                        ? 'bg-[#e20000] text-white hover:bg-[#cc0000]'
                        : 'bg-[#105298] text-white hover:bg-[#0c3d72]'
                    }`}
                    disabled={isCurrent}
                  >
                    {isCurrent
                      ? 'Current Plan'
                      : isSelected
                      ? 'Selected'
                      : 'Get Started'}
                    {!isCurrent && (
                      <ArrowRight className="ml-2 h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* If user selected a new plan (different from current), show Payment section */}
        {selectedPlan && selectedPlan !== currentPlan && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-12">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h2>
            <div className="space-y-3 mb-6">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handlePaymentMethodSelect(method.id)}
                  className={`border rounded-lg p-4 cursor-pointer flex items-center justify-between ${
                    selectedPaymentMethod === method.id
                      ? 'border-[#e20000] bg-red-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <div className="flex items-center">
                    <CreditCard className="h-6 w-6 text-gray-600 mr-3" />
                    <div>
                      <p className="font-medium">•••• •••• •••• {method.last4}</p>
                      <p className="text-sm text-gray-500">Expires {method.expiryDate}</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    checked={selectedPaymentMethod === method.id}
                    onChange={() => handlePaymentMethodSelect(method.id)}
                    className="h-5 w-5 text-[#e20000]"
                  />
                </div>
              ))}
            </div>

            <button
              className="text-[#105298] hover:text-blue-700 text-sm font-medium mb-6"
              onClick={() => alert('Add payment method functionality would go here')}
            >
              + Add Payment Method
            </button>

            {/* Order Summary */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-medium text-gray-900 mb-2">Order Summary</h3>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  {getPlanDetails(selectedPlan)?.name} Plan ({billingCycle})
                </span>
                <span className="font-medium">
                  {formatPrice(getPlanDetails(selectedPlan)!)}
                </span>
              </div>
              {/* Example "credit" logic if downgrading */}
              {currentPlan && (
                <div className="flex justify-between mb-2 text-green-600">
                  <span>Credit from current plan</span>
                  <span>-£10</span>
                  {/* Hard-coded example. Could be dynamic. */}
                </div>
              )}
              <div className="border-t border-gray-200 my-2 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>
                  {/* For demonstration, just show plan price minus 10 if user had a current plan. */}
                  {selectedPlan && currentPlan
                    ? `£${
                        (billingCycle === 'monthly'
                          ? getPlanDetails(selectedPlan)!.monthlyPrice
                          : getPlanDetails(selectedPlan)!.annualPrice
                        ) - 10
                      }`
                    : formatPrice(getPlanDetails(selectedPlan)!)}
                </span>
              </div>
            </div>

            {/* Subscribe button */}
            <button
              onClick={handleSubscribe}
              disabled={processingPayment || !selectedPaymentMethod}
              className={`w-full bg-[#e20000] text-white font-medium py-3 px-4 rounded-lg ${
                processingPayment || !selectedPaymentMethod
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-[#cc0000]'
              }`}
            >
              {processingPayment ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 
                      1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                'Confirm Subscription'
              )}
            </button>
          </div>
        )}

        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I change plans at any time?</h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Is there a contract or minimum commitment?</h3>
              <p className="text-gray-600">
                No, all our plans are month-to-month with no long-term contracts required.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-600">
                We accept all major credit cards, PayPal, and direct bank transfers for business accounts.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Do you offer a money-back guarantee?</h3>
              <p className="text-gray-600">
                Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
