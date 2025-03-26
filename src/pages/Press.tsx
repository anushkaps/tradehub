import { Newspaper, Download } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function Press() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Press & Media - TradeHub24</title>
        <meta name="description" content="Stay updated with the latest news, press releases, and media coverage about TradeHub24. Access our media kit and company information." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Press & Media</h1>
          <p className="text-xl text-gray-600">Latest news and updates from TradeHub24</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Latest News</h2>
            <div className="space-y-8">
              {newsItems.map((item, index) => (
                <div key={index} className="border-b border-gray-200 pb-6 last:border-0">
                  <div className="text-sm text-gray-500 mb-2">{item.date}</div>
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-600 mb-4">{item.excerpt}</p>
                  <a href="#" className="text-[#105298] hover:text-[#0c3d72] font-medium">
                    Read More →
                  </a>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Press Kit</h2>
              <p className="text-gray-600 mb-6">
                Download our press kit containing logos, brand guidelines, and high-resolution images.
              </p>
              <button className="inline-flex items-center px-6 py-3 bg-[#e20000] text-white rounded-md hover:bg-[#cc0000] transition-colors">
                <Download className="w-5 h-5 mr-2" />
                Download Press Kit
              </button>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-2xl font-bold mb-4">Media Inquiries</h2>
              <p className="text-gray-600 mb-4">
                For press and media inquiries, please contact our communications team:
              </p>
              <div className="space-y-2">
                <p className="text-gray-800">press@tradehub24.com</p>
                <p className="text-gray-800">+44 (0) 20 1234 5678</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {pressHighlights.map((highlight, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <img 
                src={highlight.logo} 
                alt={highlight.publication}
                className="h-8 mb-4"
              />
              <p className="text-gray-600 mb-4">"{highlight.quote}"</p>
              <a href="#" className="text-[#105298] hover:text-[#0c3d72] font-medium">
                Read Article →
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const newsItems = [
  {
    date: "March 15, 2024",
    title: "TradeHub24 Expands to Scotland",
    excerpt: "TradeHub24 announces expansion into Scotland, bringing its trusted network of professionals to homeowners across the region."
  },
  {
    date: "March 1, 2024",
    title: "New Features Launch",
    excerpt: "Introducing new platform features including instant messaging and enhanced project management tools."
  },
  {
    date: "February 15, 2024",
    title: "Community Milestone",
    excerpt: "TradeHub24 celebrates reaching 50,000 verified professionals on the platform."
  }
];

const pressHighlights = [
  {
    publication: "TechCrunch",
    quote: "TradeHub24 is revolutionizing how homeowners find and hire trade professionals.",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    publication: "Forbes",
    quote: "A game-changer in the home improvement industry.",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    publication: "Business Insider",
    quote: "Setting new standards for quality and trust in trade services.",
    logo: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];