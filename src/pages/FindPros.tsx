import { useState } from 'react';
import { MapPin, Star, MessageSquare, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function FindPros() {
  const [filters, setFilters] = useState({
    service: '',
    location: '',
    rating: '',
    availability: ''
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <Helmet>
        <title>Find Professionals - TradeHub24</title>
        <meta name="description" content="Search and connect with skilled home improvement professionals in your area. Filter by service, location, rating, and availability." />
      </Helmet>
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Professionals</h1>
        <p className="text-xl text-gray-600">Connect with trusted professionals in your area</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service Type</label>
            <select
              value={filters.service}
              onChange={(e) => setFilters({ ...filters, service: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
            >
              <option value="">All Services</option>
              {serviceTypes.map((service, index) => (
                <option key={index} value={service}>{service}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <input
              type="text"
              placeholder="Enter postcode"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
            <select
              value={filters.rating}
              onChange={(e) => setFilters({ ...filters, rating: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
            >
              <option value="">Any Rating</option>
              <option value="4">4+ Stars</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
            <select
              value={filters.availability}
              onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#105298] focus:ring-[#105298]"
            >
              <option value="">Any Time</option>
              <option value="immediate">Immediate</option>
              <option value="this_week">This Week</option>
              <option value="next_week">Next Week</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {professionals.map((pro, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start">
                <img
                  src={pro.image}
                  alt={pro.name}
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="ml-4 flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">{pro.name}</h3>
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400" />
                      <span className="ml-1 font-semibold">{pro.rating}</span>
                      <span className="text-gray-500 text-sm ml-1">({pro.reviewCount})</span>
                    </div>
                  </div>
                  <p className="text-gray-600">{pro.trade}</p>
                  <div className="flex items-center text-gray-500 text-sm mt-2">
                    <MapPin className="w-4 h-4 mr-1" />
                    {pro.location}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-gray-600">{pro.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {pro.specialties.map((specialty, specIndex) => (
                    <span
                      key={specIndex}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
              <div className="mt-6 flex items-center justify-between">
                <div className="flex space-x-4">
                  <button className="flex items-center px-4 py-2 bg-[#105298] text-white rounded-md hover:bg-[#0c3d72]">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </button>
                  <button className="flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Phone className="w-4 h-4 mr-2" />
                    Call
                  </button>
                </div>
                <button className="px-4 py-2 bg-[#e20000] text-white rounded-md hover:bg-[#cc0000]">
                  Request Quote
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center">
        <button className="px-6 py-3 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200">
          Load More Results
        </button>
      </div>
    </div>
  );
}

const serviceTypes = [
  'Plumbing',
  'Electrical',
  'Carpentry',
  'Painting',
  'Building',
  'HVAC',
  'Landscaping',
  'Home Maintenance'
];

const professionals = [
  {
    name: 'John Smith',
    trade: 'Master Plumber',
    rating: 4.9,
    reviewCount: 127,
    location: 'Manchester, M1',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Experienced plumber specializing in residential and commercial plumbing services. Available for emergency repairs.',
    specialties: ['Emergency Repairs', 'Bathroom Installation', 'Boiler Services']
  },
  {
    name: 'Sarah Williams',
    trade: 'Electrician',
    rating: 4.8,
    reviewCount: 93,
    location: 'Liverpool, L1',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    description: 'NICEIC registered electrician with over 10 years of experience in domestic and commercial installations.',
    specialties: ['Rewiring', 'Safety Inspections', 'Smart Home Installation']
  },
  {
    name: 'Mike Johnson',
    trade: 'Carpenter',
    rating: 4.7,
    reviewCount: 85,
    location: 'Leeds, LS1',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Skilled carpenter specializing in custom furniture and kitchen installations.',
    specialties: ['Custom Furniture', 'Kitchen Fitting', 'Door Installation']
  },
  {
    name: 'Emma Brown',
    trade: 'Painter & Decorator',
    rating: 5.0,
    reviewCount: 64,
    location: 'Birmingham, B1',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=256&h=256&q=80',
    description: 'Professional painter offering high-quality interior and exterior painting services.',
    specialties: ['Interior Painting', 'Wallpaper Installation', 'Decorative Finishes']
  }
];