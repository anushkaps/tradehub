import { Lock } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function PrivacyPolicy() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Privacy Policy - TradeHub24</title>
        <meta name="description" content="Learn how TradeHub24 protects and handles your personal information. Our privacy policy explains our data collection, usage, and protection practices." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Lock className="w-16 h-16 text-[#105298] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
          <p className="text-xl text-gray-600">Protecting your personal information is our priority</p>
        </div>

        <div className="prose prose-lg max-w-none">
          {sections.map((section, index) => (
            <div key={index} className="mb-8">
              <h2 className="text-2xl font-bold mb-4">{section.title}</h2>
              <div className="space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const sections = [
  {
    title: "Information We Collect",
    content: [
      "We collect information that you provide directly to us when creating an account, using our services, or communicating with us.",
      "This includes your name, email address, phone number, and location information."
    ]
  },
  {
    title: "How We Use Your Information",
    content: [
      "We use your information to provide and improve our services, communicate with you, and ensure platform security.",
      "Your information helps us match homeowners with appropriate trade professionals."
    ]
  },
  {
    title: "Information Sharing",
    content: [
      "We share your information with trade professionals or homeowners as necessary to facilitate services.",
      "We may share information with service providers who assist in operating our platform.",
      "We do not sell your personal information to third parties."
    ]
  }
];