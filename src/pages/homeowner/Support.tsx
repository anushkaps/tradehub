import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Send, Phone, MessageSquare, HelpCircle, FileText } from 'lucide-react';

const Support = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('general');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real implementation, this would send the support request
    alert('Support request submitted successfully!');
    setQuery('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0B4F94] mb-2">Homeowner Support Center</h1>
        <p className="text-gray-600">Get help with your TradeHub24 account, jobs, and professionals.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <MessageSquare className="text-[#E31937] mr-3" size={24} />
            <h2 className="text-xl font-semibold">Chat Support</h2>
          </div>
          <p className="text-gray-600 mb-4">Chat with our support team in real-time for immediate assistance.</p>
          <button 
            className="bg-[#E31937] text-white py-2 px-4 rounded-md hover:bg-[#c01731] transition-colors flex items-center"
            onClick={() => navigate('/homeowner/messages')}
          >
            <MessageSquare size={18} className="mr-2" />
            Start Chat
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <Phone className="text-[#E31937] mr-3" size={24} />
            <h2 className="text-xl font-semibold">Call Support</h2>
          </div>
          <p className="text-gray-600 mb-4">Speak directly with a support representative about your concerns.</p>
          <p className="font-semibold text-gray-800 mb-2">Support hours:</p>
          <p className="text-gray-600 mb-4">Mon-Fri: 8AM - 8PM<br />Sat-Sun: 9AM - 5PM</p>
          <a 
            href="tel:+18001234567" 
            className="bg-[#E31937] text-white py-2 px-4 rounded-md hover:bg-[#c01731] transition-colors flex items-center"
          >
            <Phone size={18} className="mr-2" />
            1-800-123-4567
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center mb-4">
            <HelpCircle className="text-[#E31937] mr-3" size={24} />
            <h2 className="text-xl font-semibold">FAQ</h2>
          </div>
          <p className="text-gray-600 mb-4">Browse our frequently asked questions to find quick solutions.</p>
          <button 
            className="bg-[#E31937] text-white py-2 px-4 rounded-md hover:bg-[#c01731] transition-colors flex items-center"
            onClick={() => navigate('/help/HelpAndFAQ')}
          >
            <FileText size={18} className="mr-2" />
            View FAQs
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md mb-10">
        <h2 className="text-2xl font-bold text-[#0B4F94] mb-6">Submit a Support Request</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 mb-2 font-medium">
              Support Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#0B4F94]"
            >
              <option value="general">General Inquiry</option>
              <option value="job">Job Related Issue</option>
              <option value="professional">Professional Related Issue</option>
              <option value="payment">Payment Issue</option>
              <option value="account">Account Management</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="query" className="block text-gray-700 mb-2 font-medium">
              Your Question
            </label>
            <textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md h-32 focus:outline-none focus:ring-2 focus:ring-[#0B4F94]"
              placeholder="Please describe your issue in detail..."
            />
          </div>
          
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">We typically respond within 24 hours</p>
            <button 
              type="submit" 
              className="bg-[#0B4F94] text-white py-2 px-6 rounded-md hover:bg-[#083c70] transition-colors flex items-center"
            >
              <Send size={18} className="mr-2" />
              Submit Request
            </button>
          </div>
        </form>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-[#0B4F94] mb-4">Common Issues</h2>
        <div className="space-y-4">
          <div 
            className="p-4 bg-white rounded-md shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => navigate('/help/Account')}
          >
            <h3 className="font-medium text-[#0B4F94] mb-1">How do I change my contact information?</h3>
            <p className="text-gray-600 text-sm">Learn how to update your profile, email, phone number, and address.</p>
          </div>
          
          <div 
            className="p-4 bg-white rounded-md shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => navigate('/homeowner/HiringGuide')}
          >
            <h3 className="font-medium text-[#0B4F94] mb-1">Tips for hiring the right professional</h3>
            <p className="text-gray-600 text-sm">Get guidance on reviewing quotes, checking reviews, and interviewing professionals.</p>
          </div>
          
          <div 
            className="p-4 bg-white rounded-md shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            onClick={() => navigate('/help/RateGuide')}
          >
            <h3 className="font-medium text-[#0B4F94] mb-1">Understanding professional rates</h3>
            <p className="text-gray-600 text-sm">Learn about typical rates for different trades and services in your area.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;