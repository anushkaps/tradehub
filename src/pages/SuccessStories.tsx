import React from 'react';
import { Star } from 'lucide-react';

export function SuccessStories() {
  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Success Stories</h1>
          <p className="text-xl text-gray-600">Real stories from professionals who grew their business with TradeHub24</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {stories.map((story, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                src={story.image}
                alt={story.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold">{story.name}</h3>
                    <p className="text-gray-600">{story.trade}</p>
                  </div>
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400" />
                    <span className="ml-1 font-semibold">{story.rating}</span>
                  </div>
                </div>
                <p className="text-gray-700 mb-6">{story.testimonial}</p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-[#105298]">{story.stats.jobs}</div>
                    <div className="text-gray-600">Jobs Completed</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-[#105298]">{story.stats.growth}</div>
                    <div className="text-gray-600">Revenue Growth</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#105298] text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Write Your Success Story?</h2>
          <p className="text-lg mb-6">Join thousands of professionals who are growing their business with TradeHub24</p>
          <button className="bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors">
            Join as a Pro
          </button>
        </div>
      </div>
    </div>
  );
}

const stories = [
  {
    name: "John Smith",
    trade: "Electrician",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    testimonial: "Since joining TradeHub24, my business has grown exponentially. The platform's user-friendly interface and quality leads have helped me expand my client base significantly.",
    stats: {
      jobs: "250+",
      growth: "85%"
    }
  },
  {
    name: "Sarah Williams",
    trade: "Plumber",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    testimonial: "TradeHub24 has transformed how I run my plumbing business. The steady stream of verified leads and professional tools have made growing my business much easier.",
    stats: {
      jobs: "180+",
      growth: "65%"
    }
  }
];