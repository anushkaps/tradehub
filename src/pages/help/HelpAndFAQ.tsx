import { Search, HelpCircle } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function HelpAndFAQ() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Help & FAQ - TradeHub24</title>
        <meta name="description" content="Find answers to frequently asked questions about TradeHub24. Get help with your account, services, and common platform features." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help & FAQ</h1>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for answers..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#105298]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {faqCategories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4 flex items-center">
                <HelpCircle className="w-5 h-5 mr-2 text-[#105298]" />
                {category.title}
              </h2>
              <div className="space-y-4">
                {category.questions.map((qa, qaIndex) => (
                  <div key={qaIndex} className="border-b border-gray-200 pb-4 last:border-0">
                    <h3 className="font-medium mb-2">{qa.question}</h3>
                    <p className="text-gray-600">{qa.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const faqCategories = [
  {
    title: "Getting Started",
    questions: [
      {
        question: "How do I create an account?",
        answer: "Click the 'Sign Up' button in the top right corner and follow the registration process. You'll need to provide basic information and verify your email."
      },
      {
        question: "How do I find a professional?",
        answer: "Use our search bar to enter the type of service you need and your location. You can then browse through verified professionals and their reviews."
      }
    ]
  },
  {
    title: "Payments & Pricing",
    questions: [
      {
        question: "What payment methods are accepted?",
        answer: "We accept all major credit cards, debit cards, and bank transfers. All payments are processed securely through our platform."
      },
      {
        question: "Is there a fee for using the platform?",
        answer: "For homeowners, using TradeHub24 is completely free. Professionals pay a subscription fee based on their chosen plan."
      }
    ]
  }
];