import { DollarSign, Clock, Star, ThumbsUp, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function RateGuide() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Rate Guide - TradeHub24</title>
        <meta name="description" content="Understand typical rates and pricing for different trade services. Get insights into market rates and factors that influence service costs." />
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rate Guide</h1>
          <p className="text-xl text-gray-600">Understanding pricing for trade services</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {tradeCategories.map((category, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-4">{category.title}</h2>
                <div className="space-y-4">
                  {category.services.map((service, serviceIndex) => (
                    <div key={serviceIndex} className="flex justify-between items-center border-b border-gray-200 pb-4 last:border-0">
                      <div>
                        <h3 className="font-semibold">{service.name}</h3>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-[#105298]">{service.rate}</div>
                        <div className="text-sm text-gray-600">{service.unit}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-16">
          <h2 className="text-2xl font-bold mb-6">Pricing Factors</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {pricingFactors.map((factor, index) => (
              <div key={index} className="text-center">
                {factor.icon}
                <h3 className="font-semibold mt-4 mb-2">{factor.title}</h3>
                <p className="text-gray-600">{factor.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-6">Additional Information</h2>
          <div className="space-y-4">
            {additionalInfo.map((info, index) => (
              <div key={index} className="flex items-start">
                <ThumbsUp className="w-5 h-5 text-[#105298] mr-3 flex-shrink-0 mt-1" />
                <p className="text-gray-600">{info}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const tradeCategories = [
  {
    title: "Plumbing Services",
    services: [
      {
        name: "General Plumbing",
        description: "Basic repairs and maintenance",
        rate: "£50-£80",
        unit: "per hour"
      },
      {
        name: "Emergency Call-out",
        description: "24/7 emergency services",
        rate: "£80-£120",
        unit: "per hour"
      },
      {
        name: "Bathroom Installation",
        description: "Complete bathroom fitting",
        rate: "£2000-£4000",
        unit: "per project"
      }
    ]
  },
  {
    title: "Electrical Services",
    services: [
      {
        name: "General Electrical",
        description: "Basic electrical work",
        rate: "£45-£70",
        unit: "per hour"
      },
      {
        name: "Emergency Call-out",
        description: "24/7 emergency services",
        rate: "£75-£100",
        unit: "per hour"
      },
      {
        name: "Rewiring",
        description: "Complete house rewiring",
        rate: "£3000-£8000",
        unit: "per project"
      }
    ]
  }
];

const pricingFactors = [
  {
    icon: <DollarSign className="w-8 h-8 text-[#105298] mx-auto" />,
    title: "Service Type",
    description: "Different services have different base rates"
  },
  {
    icon: <Clock className="w-8 h-8 text-[#105298] mx-auto" />,
    title: "Time",
    description: "Duration and urgency affect pricing"
  },
  {
    icon: <Star className="w-8 h-8 text-[#105298] mx-auto" />,
    title: "Experience",
    description: "Professional's expertise level"
  },
  {
    icon: <MapPin className="w-8 h-8 text-[#105298] mx-auto" />,
    title: "Location",
    description: "Travel distance and area rates"
  }
];

const additionalInfo = [
  "Rates are guidelines only and may vary based on specific requirements",
  "Emergency and out-of-hours services typically incur additional charges",
  "Some professionals may charge a minimum call-out fee",
  "Complex jobs may require an on-site assessment for accurate quoting"
];