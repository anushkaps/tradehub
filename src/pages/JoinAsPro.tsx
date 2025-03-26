import { ArrowRight, Shield, Banknote, Users } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function JoinAsPro() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Join as a Professional - TradeHub24</title>
        <meta name="description" content="Join TradeHub24 as a professional. Get access to quality leads, grow your business, and connect with homeowners looking for your services." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join TradeHub24 as a Professional</h1>
          <p className="text-xl text-gray-600">Grow your business with access to quality leads and tools</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Join Us?</h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0">
                    {benefit.icon}
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <h3 className="text-2xl font-bold mb-6">Get Started Today</h3>
              <form className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Business Name</label>
                  <input
                    type="text"
                    id="name"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                  <input
                    type="email"
                    id="email"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number</label>
                  <input
                    type="tel"
                    id="phone"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                  />
                </div>
                <div>
                  <label htmlFor="trade" className="block text-sm font-medium text-gray-700">Primary Trade</label>
                  <select
                    id="trade"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
                  >
                    <option>Select your trade</option>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Carpentry</option>
                    <option>Painting</option>
                    <option>Other</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#e20000] text-white px-6 py-3 rounded-md hover:bg-[#cc0000] transition-colors flex items-center justify-center"
                >
                  Join Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-4xl font-bold text-[#105298] mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const benefits = [
  {
    icon: <Shield className="w-6 h-6 text-[#e20000]" />,
    title: "Verified Leads",
    description: "Connect with serious homeowners actively looking for your services."
  },
  {
    icon: <Banknote className="w-6 h-6 text-[#e20000]" />,
    title: "Flexible Pricing",
    description: "Choose the subscription plan that works best for your business."
  },
  {
    icon: <Users className="w-6 h-6 text-[#e20000]" />,
    title: "Growing Community",
    description: "Join thousands of successful professionals on our platform."
  }
];

const stats = [
  {
    value: "50K+",
    label: "Active Professionals"
  },
  {
    value: "£10M+",
    label: "Jobs Completed Monthly"
  },
  {
    value: "95%",
    label: "Customer Satisfaction"
  }
];