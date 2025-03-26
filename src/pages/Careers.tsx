import { Briefcase, Heart, Coffee, Zap } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function Careers() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Careers - TradeHub24</title>
        <meta name="description" content="Join our team at TradeHub24 and help transform the home improvement industry" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Our Team</h1>
          <p className="text-xl text-gray-600">Help us transform the home improvement industry</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Why Work With Us?</h2>
            <div className="space-y-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start">
                  {benefit.icon}
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Team collaboration"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Open Positions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {positions.map((position, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold mb-2">{position.title}</h3>
                <p className="text-gray-600 mb-4">{position.location}</p>
                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <Briefcase className="w-4 h-4 mr-2" />
                  {position.type}
                </div>
                <button className="text-[#105298] hover:text-[#0c3d72] font-medium">
                  View Details →
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Don't See the Right Role?</h2>
          <p className="text-gray-600 mb-6">
            We're always looking for talented people to join our team. Send us your CV and we'll keep you in mind for future opportunities.
          </p>
          <button className="bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors">
            Send Your CV
          </button>
        </div>
      </div>
    </div>
  );
}

const benefits = [
  {
    icon: <Heart className="w-6 h-6 text-[#e20000]" />,
    title: "Comprehensive Benefits",
    description: "Competitive salary, health insurance, and retirement plans to take care of you and your family."
  },
  {
    icon: <Coffee className="w-6 h-6 text-[#e20000]" />,
    title: "Work-Life Balance",
    description: "Flexible working hours, remote work options, and generous vacation policy."
  },
  {
    icon: <Zap className="w-6 h-6 text-[#e20000]" />,
    title: "Growth Opportunities",
    description: "Continuous learning, mentorship programs, and clear career progression paths."
  }
];

const positions = [
  {
    title: "Senior Full Stack Developer",
    location: "London, UK (Hybrid)",
    type: "Full-time"
  },
  {
    title: "Product Manager",
    location: "London, UK",
    type: "Full-time"
  },
  {
    title: "Customer Success Manager",
    location: "Manchester, UK",
    type: "Full-time"
  },
  {
    title: "Marketing Specialist",
    location: "Remote (UK)",
    type: "Full-time"
  }
];