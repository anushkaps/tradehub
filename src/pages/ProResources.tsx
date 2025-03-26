import { BookOpen, Download, FileText, Video } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function ProResources() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Professional Resources - TradeHub24</title>
        <meta name="description" content="Access valuable resources, guides, and tools designed to help professionals succeed on TradeHub24. Learn best practices and grow your business." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Resources</h1>
          <p className="text-xl text-gray-600">Tools and guides to help you succeed on TradeHub24</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {resourceCategories.map((category, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#105298] text-white rounded-full mb-4">
                {category.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
              <p className="text-gray-600 mb-4">{category.description}</p>
              <ul className="space-y-2">
                {category.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <a href="#" className="text-[#105298] hover:text-[#0c3d72] flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Latest Training Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {trainingVideos.map((video, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-100">
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-48 object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{video.title}</h3>
                  <p className="text-gray-600 mb-4">{video.description}</p>
                  <button className="text-[#105298] hover:text-[#0c3d72] font-medium">
                    Watch Now →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Need Additional Support?</h2>
          <p className="text-gray-600 mb-6">
            Our support team is here to help you make the most of TradeHub24
          </p>
          <button className="bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors">
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
}

const resourceCategories = [
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Getting Started",
    description: "Essential guides for new professionals",
    items: [
      "Platform Overview",
      "Setting Up Your Profile",
      "Responding to Leads",
      "Pricing Your Services"
    ]
  },
  {
    icon: <Download className="w-6 h-6" />,
    title: "Business Tools",
    description: "Templates and tools for your business",
    items: [
      "Quote Template",
      "Invoice Template",
      "Contract Template",
      "Project Checklist"
    ]
  },
  {
    icon: <Video className="w-6 h-6" />,
    title: "Marketing Resources",
    description: "Grow your online presence",
    items: [
      "Photo Guidelines",
      "Description Writing",
      "Customer Communication",
      "Review Management"
    ]
  }
];

const trainingVideos = [
  {
    title: "Maximizing Your Profile",
    description: "Learn how to optimize your profile to attract more clients",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Winning More Jobs",
    description: "Tips and strategies for increasing your success rate",
    thumbnail: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];