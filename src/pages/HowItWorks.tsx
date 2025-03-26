import { CheckCircle2, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function HowItWorks() {
  return (
    <div className="py-12">
      <Helmet>
        <title>How It Works - TradeHub24</title>
        <meta name="description" content="Learn how TradeHub24 connects homeowners with trusted professionals. Simple steps to find, hire, and work with the best home improvement experts." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How TradeHub24 Works</h1>
          <p className="text-xl text-gray-600">
            Seamlessly connect with top professionals for all your project needs
          </p>
        </div>

        {/* Three-Step Process */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-[#105298] text-white rounded-full mb-6">1</div>
            <h3 className="text-xl font-semibold mb-4">Submit Your Project</h3>
            <p className="text-gray-600">
              Provide the details of your job, and we will connect you with qualified professionals in your area.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-[#105298] text-white rounded-full mb-6">2</div>
            <h3 className="text-xl font-semibold mb-4">Compare Proposals</h3>
            <p className="text-gray-600">
              Receive competitive quotes, review each professional's profile, and select the best option for your project.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-12 h-12 bg-[#105298] text-white rounded-full mb-6">3</div>
            <h3 className="text-xl font-semibold mb-4">Hire & Pay Securely</h3>
            <p className="text-gray-600">
              Work directly with your chosen professional and use our secure payment system for peace of mind.
            </p>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Why Choose TradeHub24?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start">
                <CheckCircle2 className="w-6 h-6 text-[#e20000] mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="inline-flex items-center px-6 py-3 bg-[#e20000] text-white rounded-md hover:bg-[#cc0000] transition-colors">
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Benefits data (can be extracted to its own file or remain inline)
const benefits = [
  {
    title: 'Vetted Professionals',
    description:
      'Every expert on our platform undergoes a thorough screening process to ensure you receive the highest level of service.',
  },
  {
    title: 'Secure Payments',
    description:
      'Our secure payment portal protects both homeowners and professionals, ensuring every transaction is safe.',
  },
  {
    title: 'Quality Assurance',
    description:
      "We stand behind our professionals' work, offering transparent reviews and a satisfaction guarantee.",
  },
  {
    title: 'Dedicated Support',
    description:
      'Our support team is available 24/7 to address your questions and provide assistance whenever you need it.',
  },
];