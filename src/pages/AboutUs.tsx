import { Users, Shield, Target, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function AboutUs() {
  return (
    <div className="py-12">
      <Helmet>
        <title>About Us - TradeHub24</title>
        <meta name="description" content="Learn about TradeHub24 - Connecting homeowners with trusted professionals since 2020" />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About TradeHub24</h1>
          <p className="text-xl text-gray-600">Connecting homeowners with trusted professionals since 2020</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-gray-600 mb-8">
              At TradeHub24, we're on a mission to transform how homeowners find and hire trusted trade professionals. 
              We believe every home improvement project should be a success story, built on trust, quality, and 
              seamless collaboration.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="text-center">
                <div className="text-[#105298] text-4xl font-bold mb-2">50K+</div>
                <div className="text-gray-600">Verified Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-[#105298] text-4xl font-bold mb-2">200K+</div>
                <div className="text-gray-600">Completed Projects</div>
              </div>
              <div className="text-center">
                <div className="text-[#105298] text-4xl font-bold mb-2">95%</div>
                <div className="text-gray-600">Satisfaction Rate</div>
              </div>
              <div className="text-center">
                <div className="text-[#105298] text-4xl font-bold mb-2">24/7</div>
                <div className="text-gray-600">Support Available</div>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1577412647305-991150c7d163?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Team meeting"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <div key={index} className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#105298] text-white rounded-full mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Growing Community</h2>
          <p className="text-gray-600 mb-6">
            Whether you're a homeowner looking for quality service or a professional ready to grow your business,
            TradeHub24 is here to help.
          </p>
          <button className="bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors">
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
}

const values = [
  {
    icon: <Users className="w-6 h-6" />,
    title: "Community",
    description: "Building strong relationships between pros and homeowners"
  },
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Trust",
    description: "Ensuring safety and reliability in every interaction"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Quality",
    description: "Maintaining high standards in all services"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Innovation",
    description: "Continuously improving our platform"
  }
];