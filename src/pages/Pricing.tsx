import { useState, useEffect } from 'react';
import { Check, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function Pricing() {
  // Set the selected plan index. On mount, default to the popular plan if available.
  const [selectedPlanIndex, setSelectedPlanIndex] = useState(0);

  useEffect(() => {
    const popularIndex = plans.findIndex(plan => plan.popular);
    if (popularIndex !== -1) {
      setSelectedPlanIndex(popularIndex);
    }
  }, []);

  return (
    <div className="py-12">
      <Helmet>
        <title>Pricing Plans - TradeHub24</title>
        <meta name="description" content="Choose the perfect TradeHub24 membership plan for your business. Flexible pricing options designed to help professionals grow and succeed." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600">Choose the plan that works best for your business</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div 
              key={index} 
              onClick={() => setSelectedPlanIndex(index)}
              className={`cursor-pointer bg-white rounded-lg shadow-lg overflow-hidden ${
                selectedPlanIndex === index ? 'ring-2 ring-[#e20000]' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-[#e20000] text-white text-center py-2">
                  Most Popular
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold">£{plan.price}</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="w-5 h-5 text-[#105298] mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <button
                  className={`w-full py-3 px-6 rounded-md flex items-center justify-center ${
                    plan.popular
                      ? 'bg-[#e20000] text-white hover:bg-[#cc0000]'
                      : 'bg-[#105298] text-white hover:bg-[#0c3d72]'
                  } transition-colors`}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {faqs.map((faq, index) => (
              <div key={index}>
                <h3 className="text-lg font-semibold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const plans = [
  {
    name: "Starter",
    price: "29",
    description: "Perfect for professionals just getting started",
    features: [
      "Up to 10 job leads per month",
      "Basic profile listing",
      "Email support",
      "Mobile app access",
      "Basic analytics"
    ],
    popular: false
  },
  {
    name: "Professional",
    price: "79",
    description: "Ideal for growing businesses",
    features: [
      "Up to 50 job leads per month",
      "Featured profile listing",
      "Priority email & phone support",
      "Advanced analytics",
      "Business tools & templates"
    ],
    popular: true
  },
  {
    name: "Enterprise",
    price: "199",
    description: "For established businesses with multiple teams",
    features: [
      "Unlimited job leads",
      "Premium profile listing",
      "24/7 priority support",
      "Custom analytics dashboard",
      "Team management tools"
    ],
    popular: false
  }
];

const faqs = [
  {
    question: "Can I change plans at any time?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
  },
  {
    question: "Is there a contract or minimum commitment?",
    answer: "No, all our plans are month-to-month with no long-term contracts required."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and direct bank transfers for business accounts."
  },
  {
    question: "Do you offer a money-back guarantee?",
    answer: "Yes, we offer a 30-day money-back guarantee if you're not satisfied with our service."
  }
];
