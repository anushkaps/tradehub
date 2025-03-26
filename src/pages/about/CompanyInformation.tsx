import { Building2, Users, Target, Globe } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function CompanyInformation() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Company Information - TradeHub24</title>
        <meta
          name="description"
          content="Discover TradeHub24's background, values, and commitment to connecting homeowners with quality trade professionals."
        />
        <meta name="keywords" content="company info, tradehub24, about us, background, values" />

        {/* Open Graph */}
        <meta property="og:title" content="Company Information - TradeHub24" />
        <meta
          property="og:description"
          content="Discover TradeHub24's background, values, and commitment to connecting homeowners with quality trade professionals."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.tradehub24.com/about/company-info" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Company Information - TradeHub24" />
        <meta
          name="twitter:description"
          content="Discover TradeHub24's background, values, and commitment to connecting homeowners with quality trade professionals."
        />

        {/* JSON-LD */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Company Information - TradeHub24",
            url: "https://www.tradehub24.com/about/company-info",
            description:
              "Discover TradeHub24's background, values, and commitment to connecting homeowners with quality trade professionals.",
            publisher: {
              "@type": "Organization",
              name: "TradeHub24",
              url: "https://www.tradehub24.com",
            },
          })}
        </script>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Company Information</h1>
          <p className="text-xl text-gray-600">Learn more about TradeHub24 and our mission</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-3xl font-bold mb-6">Who We Are</h2>
            <p className="text-gray-600 mb-8">
              TradeHub24 is the UK's leading platform connecting homeowners with trusted trade professionals. 
              Since our founding in 2020, we've helped thousands of homeowners find reliable professionals 
              for their home improvement projects.
            </p>
            <div className="grid grid-cols-2 gap-6">
              {stats.map((stat, index) => (
                <div key={index} className="text-center bg-white p-6 rounded-lg shadow-md">
                  <div className="text-[#105298] text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Our office"
              className="rounded-lg shadow-lg w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-[#105298] text-white rounded-full mb-4">
                {value.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
              <p className="text-gray-600">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Leadership Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="font-semibold text-lg">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const stats = [
  {
    value: "50K+",
    label: "Verified Professionals"
  },
  {
    value: "200K+",
    label: "Completed Projects"
  },
  {
    value: "95%",
    label: "Customer Satisfaction"
  },
  {
    value: "24/7",
    label: "Support Available"
  }
];

const values = [
  {
    icon: <Building2 className="w-6 h-6" />,
    title: "Quality",
    description: "We maintain high standards in all services"
  },
  {
    icon: <Users className="w-6 h-6" />,
    title: "Trust",
    description: "Building reliable connections"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Innovation",
    description: "Continuously improving our platform"
  },
  {
    icon: <Globe className="w-6 h-6" />,
    title: "Community",
    description: "Supporting local businesses"
  }
];

const team = [
  {
    name: "Sarah Johnson",
    role: "CEO & Founder",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Michael Chen",
    role: "CTO",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  },
  {
    name: "Emily Williams",
    role: "Head of Operations",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
  }
];