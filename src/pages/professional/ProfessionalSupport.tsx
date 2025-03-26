import { LifeBuoy, BookOpen, MessageSquare, Phone } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function ProfessionalSupport() {
  return (
    <div>
      <Helmet>
        <title>Professional Support - TradeHub24</title>
        <meta
          name="description"
          content="Access dedicated support for trade professionals on TradeHub24. Get help with bids, membership, and more."
        />
        <meta
          name="keywords"
          content="professional support, tradehub24, help center"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Professional Support - TradeHub24"
        />
        <meta
          property="og:description"
          content="Access dedicated support for trade professionals on TradeHub24. Get help with bids, membership, and more."
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content="https://www.tradehub24.com/professional/professional-support"
        />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Professional Support - TradeHub24"
        />
        <meta
          name="twitter:description"
          content="Access dedicated support for trade professionals on TradeHub24. Get help with bids, membership, and more."
        />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Professional Support - TradeHub24",
            url: "https://www.tradehub24.com/professional/professional-support",
            description:
              "Access dedicated support for trade professionals on TradeHub24. Get help with bids, membership, and more.",
            publisher: {
              "@type": "Organization",
              name: "TradeHub24",
              url: "https://www.tradehub24.com",
            },
          })}
        </script>
      </Helmet>
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Professional Support</h1>
            <p className="text-xl text-gray-600">Get the help you need to succeed on TradeHub24</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <MessageSquare className="w-8 h-8 text-[#105298] mr-3" />
                <h2 className="text-2xl font-bold">Live Support</h2>
              </div>
              <p className="text-gray-600 mb-6">
                Connect with our dedicated support team for immediate assistance with your account,
                leads, or any other questions you may have.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <Phone className="w-5 h-5 text-[#105298] mr-3" />
                  <span className="text-gray-600">0800 123 4567</span>
                </div>
                <button className="w-full bg-[#e20000] text-white px-6 py-3 rounded-md hover:bg-[#cc0000] transition-colors">
                  Start Live Chat
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-8">
              <div className="flex items-center mb-6">
                <BookOpen className="w-8 h-8 text-[#105298] mr-3" />
                <h2 className="text-2xl font-bold">Knowledge Base</h2>
              </div>
              <div className="space-y-4">
                {knowledgeBase.map((item, index) => (
                  <div key={index} className="border-b border-gray-200 pb-4 last:border-0">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                    <button className="text-[#105298] hover:text-[#0c3d72] text-sm font-medium">
                      Learn More →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {supportCategories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-[#105298] text-white rounded-full mb-4">
                  {category.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{category.title}</h3>
                <p className="text-gray-600 mb-4">{category.description}</p>
                <ul className="space-y-2">
                  {category.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a href="#" className="text-[#105298] hover:text-[#0c3d72]">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Additional Help?</h2>
            <p className="text-gray-600 mb-6">
              Our support team is available 24/7 to help you with any questions or concerns
            </p>
            <button className="bg-[#e20000] text-white px-8 py-3 rounded-md hover:bg-[#cc0000] transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const knowledgeBase = [
  {
    title: "Getting Started Guide",
    description: "Learn how to set up your profile and start receiving leads."
  },
  {
    title: "Managing Your Account",
    description: "Tips for optimizing your profile and managing your business."
  },
  {
    title: "Handling Customer Inquiries",
    description: "Best practices for communicating with potential clients."
  }
];

const supportCategories = [
  {
    icon: <LifeBuoy className="w-6 h-6" />,
    title: "Technical Support",
    description: "Get help with platform features and functionality",
    links: [
      "Account Access",
      "Payment Issues",
      "App Troubleshooting",
      "System Requirements"
    ]
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title: "Business Resources",
    description: "Tools and guides to grow your business",
    links: [
      "Marketing Tips",
      "Pricing Strategies",
      "Business Templates",
      "Success Stories"
    ]
  },
  {
    icon: <MessageSquare className="w-6 h-6" />,
    title: "Community Support",
    description: "Connect with other professionals",
    links: [
      "Discussion Forums",
      "Networking Events",
      "Industry News",
      "Best Practices"
    ]
  }
];
