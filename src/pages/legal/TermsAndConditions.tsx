import { Shield } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export function TermsAndConditions() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Terms & Conditions - TradeHub24</title>
        <meta name="description" content="Read TradeHub24's terms and conditions. Understand your rights and responsibilities when using our platform for home improvement services." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Shield className="w-16 h-16 text-[#105298] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
          <p className="text-xl text-gray-600">Last updated: March 15, 2024</p>
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
    title: "1. Agreement to Terms",
    content: [
      "By accessing and using TradeHub24's services, you agree to be bound by these Terms and Conditions. If you disagree with any part of these terms, you may not access our services.",
      "These terms apply to all users of the platform, including homeowners and trade professionals."
    ]
  },
  {
    title: "2. User Responsibilities",
    content: [
      "Users must provide accurate and complete information when creating an account.",
      "Trade professionals must maintain appropriate licenses and insurance as required by local regulations.",
      "Users are responsible for maintaining the confidentiality of their account credentials."
    ]
  },
  {
    title: "3. Platform Usage",
    content: [
      "The platform serves as a marketplace connecting homeowners with trade professionals.",
      "TradeHub24 does not directly provide trade services and is not responsible for the quality of work performed.",
      "Users agree to communicate and conduct transactions through the platform."
    ]
  }
];