import { Briefcase, Users, Banknote, Star, Shield, ChevronRight, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import man2Image from '../../assets/man-2.png';

export function ProfessionalHome() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <Helmet>
        <title>Professional Dashboard - TradeHub24</title>
        <meta name="description" content="Access your professional dashboard, manage jobs, connect with clients, and grow your business with TradeHub24's professional tools and resources." />
      </Helmet>
      <section
        className="relative bg-[#105298] text-white py-20 flex items-center"
        style={{ minHeight: '587px' }} // Matches your HomePage's hero size
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            {/* Left Column */}
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Grow Your Business <br />
                with TradeHub24
              </h1>
              <p className="text-xl mb-8">
                Join thousands of successful trade professionals connecting with quality clients daily
              </p>
              {/* Buttons in the older design: side by side with space-x-4 */}
              <div className="space-x-4">
                <Link 
                  to="/join-as-pro"
                  className="inline-block bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/pro-resources"
                  className="inline-block bg-white text-[#105298] px-8 py-3 rounded-md hover:bg-gray-100 transition-colors"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Right Column (Image) */}
            <div className="flex justify-center">
            <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
  <img
    src={man2Image}
    alt="Professional at work"
    className="max-h-[428px] object-contain transform origin-top"
    style={{ transform: 'scaleX(1.05) scaleY(1.05)' }}
  />
</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#105298] mb-2">{stat.value}</div>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Why Join TradeHub24?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#105298] text-white rounded-full mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                <p className="text-gray-600 mb-4">{benefit.description}</p>
                <ul className="space-y-2">
                  {benefit.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-gray-600">
                      <CheckCircle className="w-5 h-5 text-[#105298] mr-2" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Success Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {successStories.map((story, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img
                  src={story.image}
                  alt={story.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div>
                      <h3 className="font-semibold">{story.name}</h3>
                      <p className="text-gray-600">{story.trade}</p>
                    </div>
                    <div className="ml-auto flex items-center">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1 font-semibold">{story.rating}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{story.quote}</p>
                  <div className="text-[#105298] font-semibold">{story.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#105298] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8">Join TradeHub24 today and get your first 30 days free</p>
          <Link
            to="/join-as-pro"
            className="inline-block bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors"
          >
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  );
}

const stats = [
  {
    value: "50K+",
    label: "Active Professionals"
  },
  {
    value: "£10M+",
    label: "Monthly Job Value"
  },
  {
    value: "200K+",
    label: "Completed Jobs"
  },
  {
    value: "95%",
    label: "Satisfaction Rate"
  }
];

const benefits = [
  {
    icon: <Briefcase className="w-6 h-6" />,
    title: "Quality Leads",
    description: "Connect with serious clients actively looking for your services",
    features: [
      "Verified homeowner requests",
      "Targeted job matching",
      "Real-time notifications"
    ]
  },
  {
    icon: <Banknote className="w-6 h-6" />,
    title: "Business Growth",
    description: "Tools and support to expand your business",
    features: [
      "Professional profile",
      "Quote management",
      "Secure payments"
    ]
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Platform Benefits",
    description: "Everything you need to succeed",
    features: [
      "30-day free trial",
      "Marketing tools",
      "24/7 support"
    ]
  }
];

const successStories = [
  {
    name: "John Smith",
    trade: "Electrician",
    rating: 4.9,
    quote: "TradeHub24 transformed my business. I've doubled my client base in 6 months.",
    growth: "120% Revenue Growth",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Sarah Williams",
    trade: "Plumber",
    rating: 4.8,
    quote: "The quality of leads and support has been exceptional. Highly recommended!",
    growth: "85% Revenue Growth",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Mike Johnson",
    trade: "Carpenter",
    rating: 5.0,
    quote: "Best decision for my business. The platform makes everything easier.",
    growth: "95% Revenue Growth",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];