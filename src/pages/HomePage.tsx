// src/pages/HomePage.tsx
import { Shield, Clock, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import man1Image from '../assets/man-1.png';
import { useUser } from '../contexts/UserContext'; // <-- Merged user context
import { ProfessionalHome } from './professional/ProfessionalHome';

const homeownerTestimonials = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Homeowner',
    content: 'Found a great electrician within hours. The whole process was smooth and professional.',
    avatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '2',
    name: 'Michael Smith',
    role: 'Homeowner',
    content:
      "Quality work, fair prices, and excellent communication. Couldn't be happier!",
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
  {
    id: '3',
    name: 'Emily Davis',
    role: 'Homeowner',
    content: 'The guarantee gave me peace of mind. The carpenter did an amazing job!',
    avatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  },
];

export function HomePage() {
  const { userType } = useUser(); // merged context
  const isProfessional = userType === 'professional';

  if (isProfessional) {
    return <ProfessionalHome />;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>TradeHub24 - Find Trusted Home Improvement Professionals</title>
        <meta name="description" content="Connect with verified professionals for your home improvement projects. Get quotes, read reviews, and hire the best pros in your area." />
      </Helmet>
      {/* Hero Section */}
      <section
        className="relative bg-[#105298] text-white py-20 flex items-center"
        style={{ minHeight: '587px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find Trusted Professionals for Your Home
              </h1>
              <p className="text-xl mb-8">
                Connect with verified local trade professionals for all your home improvement needs.
              </p>
              <div className="max-w-3xl">
                <div className="flex flex-col md:flex-row gap-4 bg-white rounded-lg p-2">
                  <input
                    type="text"
                    placeholder="What service do you need?"
                    className="flex-grow px-4 py-3 text-gray-900 rounded-md focus:outline-none"
                  />
                  <button className="bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors">
                    Find Pros
                  </button>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Link to="/" className="flex-shrink-0 flex items-center space-x-2">
                <img
                  src={man1Image}
                  alt="Friendly Tradesperson"
                  className="max-h-[428px] object-contain"
                />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <Shield className="w-12 h-12 text-[#105298] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
              <p className="text-gray-600">
                Every professional is thoroughly vetted and background-checked.
              </p>
            </div>
            <div className="text-center p-6">
              <Clock className="w-12 h-12 text-[#105298] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
              <p className="text-gray-600">
                Get quotes from available professionals within hours.
              </p>
            </div>
            <div className="text-center p-6">
              <Star className="w-12 h-12 text-[#105298] mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">
                Satisfaction guaranteed on all work or your money back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {homeownerTestimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                    loading="eager"
                  />
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#105298] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8">Join thousands of satisfied customers today.</p>
          <Link
            to="/find-pros"
            className="bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors inline-block"
          >
            Find Professionals Now
          </Link>
        </div>
      </section>
    </div>
  );
}
