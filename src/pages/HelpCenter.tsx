import { Search, MessageCircle, Phone, Mail } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function HelpCenter() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Help Center - TradeHub24</title>
        <meta name="description" content="Get help and support for all your TradeHub24 questions. Find answers to common questions, tutorials, and contact our support team." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How Can We Help?</h1>
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search for help..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#105298]"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold mb-4">{category.title}</h2>
              <ul className="space-y-3">
                {category.topics.map((topic, topicIndex) => (
                  <li key={topicIndex}>
                    <a href="#" className="text-[#105298] hover:text-[#0c3d72]">
                      {topic}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#105298] text-white p-6 rounded-lg">
            <MessageCircle className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
            <p className="mb-4">Chat with our support team</p>
            <button className="bg-white text-[#105298] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
              Start Chat
            </button>
          </div>
          <div className="bg-[#105298] text-white p-6 rounded-lg">
            <Phone className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
            <p className="mb-4">Call us at 0800 123 4567</p>
            <button className="bg-white text-[#105298] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
              Call Now
            </button>
          </div>
          <div className="bg-[#105298] text-white p-6 rounded-lg">
            <Mail className="h-8 w-8 mb-4" />
            <h3 className="text-xl font-semibold mb-2">Email Support</h3>
            <p className="mb-4">Get help via email</p>
            <button className="bg-white text-[#105298] px-4 py-2 rounded-md hover:bg-gray-100 transition-colors">
              Send Email
            </button>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you with any questions you may have
          </p>
          <button className="bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

const categories = [
  {
    title: "Getting Started",
    topics: [
      "Creating an Account",
      "Finding Professionals",
      "Posting a Job",
      "Payment Methods",
      "Account Settings"
    ]
  },
  {
    title: "For Professionals",
    topics: [
      "Setting Up Your Profile",
      "Responding to Leads",
      "Managing Your Calendar",
      "Getting Paid",
      "Pro Guidelines"
    ]
  },
  {
    title: "Common Issues",
    topics: [
      "Troubleshooting",
      "Account Access",
      "Payment Issues",
      "Communication Problems",
      "Technical Support"
    ]
  }
];