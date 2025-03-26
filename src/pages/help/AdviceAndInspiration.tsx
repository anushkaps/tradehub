import { Helmet } from 'react-helmet-async';
import { Lightbulb, PenTool as Tool, Home, Paintbrush } from 'lucide-react';

export function AdviceAndInspiration() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Advice & Inspiration - TradeHub24</title>
        <meta name="description" content="Get expert advice and inspiration for your home improvement projects. Browse our comprehensive guides, tips, and ideas to transform your living space." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Advice & Inspiration</h1>
          <p className="text-xl text-gray-600">Get inspired and learn from our expert guides</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {categories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={category.image}
                alt={category.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center mb-4">
                  {category.icon}
                  <h2 className="text-xl font-bold ml-2">{category.title}</h2>
                </div>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <button className="text-[#105298] hover:text-[#0c3d72] font-medium">
                  Explore {category.title} →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            <div className="space-y-6">
              {articles.map((article, index) => (
                <div key={index} className="flex items-start border-b border-gray-200 pb-6 last:border-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <div className="ml-4">
                    <h3 className="font-semibold mb-2">{article.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{article.excerpt}</p>
                    <button className="text-[#105298] hover:text-[#0c3d72] text-sm font-medium">
                      Read More →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Expert Tips</h2>
            <div className="space-y-6">
              {tips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-[#105298] rounded-full p-2 text-white">
                    <Lightbulb className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold mb-2">{tip.title}</h3>
                    <p className="text-gray-600">{tip.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const categories = [
  {
    title: "Home Improvement",
    description: "Transform your living space with our comprehensive guides and tips.",
    icon: <Home className="w-6 h-6 text-[#105298]" />,
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Maintenance",
    description: "Keep your home in top condition with expert maintenance advice.",
    icon: <Tool className="w-6 h-6 text-[#105298]" />,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Renovation",
    description: "Plan your next renovation project with professional insights.",
    icon: <Paintbrush className="w-6 h-6 text-[#105298]" />,
    image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const articles = [
  {
    title: "10 Budget-Friendly Home Improvement Ideas",
    excerpt: "Transform your home without breaking the bank with these creative ideas.",
    image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    title: "Essential Home Maintenance Checklist",
    excerpt: "Keep your home in perfect condition with this seasonal maintenance guide.",
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];

const tips = [
  {
    title: "Choosing the Right Professional",
    content: "Look for verified reviews, check qualifications, and always get multiple quotes."
  },
  {
    title: "Planning Your Project",
    content: "Set a realistic budget and timeline, and consider seasonal factors."
  },
  {
    title: "Working with Contractors",
    content: "Maintain clear communication and get everything in writing."
  }
];