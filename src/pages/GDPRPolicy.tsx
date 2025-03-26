import { Helmet } from 'react-helmet-async';
import { Shield, Lock, FileText, UserCheck } from 'lucide-react';

export function GDPRPolicy() {
  return (
    <div className="py-12">
      <Helmet>
        <title>GDPR Policy - TradeHub24</title>
        <meta name="description" content="Learn about TradeHub24's GDPR compliance and how we protect your personal data. Our commitment to privacy and data protection." />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <Shield className="w-16 h-16 text-[#105298] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-gray-900 mb-4">GDPR Compliance</h1>
          <p className="text-xl text-gray-600">Our commitment to protecting your personal data</p>
        </div>

        <div className="prose prose-lg max-w-none">
          {sections.map((section, index) => (
            <div key={index} className="mb-12">
              <div className="flex items-center mb-6">
                {section.icon}
                <h2 className="text-2xl font-bold ml-3">{section.title}</h2>
              </div>
              <div className="space-y-4">
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-gray-600">
                    {paragraph}
                  </p>
                ))}
                {section.list && (
                  <ul className="list-disc pl-6 space-y-2">
                    {section.list.map((item, iIndex) => (
                      <li key={iIndex} className="text-gray-600">{item}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-bold mb-6">Exercise Your Rights</h2>
          <p className="text-gray-600 mb-6">
            Under GDPR, you have several rights regarding your personal data. Contact us to exercise any of these rights:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rights.map((right, index) => (
              <div key={index} className="flex items-start">
                <UserCheck className="w-6 h-6 text-[#105298] mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-2">{right.title}</h3>
                  <p className="text-sm text-gray-600">{right.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-6">
            For any questions about our GDPR compliance or to exercise your rights, please contact our Data Protection Officer:
          </p>
          <button className="px-8 py-3 bg-[#e20000] text-white rounded-md hover:bg-[#cc0000]">
            Contact DPO
          </button>
        </div>
      </div>
    </div>
  );
}

const sections = [
  {
    icon: <Shield className="w-8 h-8 text-[#105298]" />,
    title: "Our Commitment",
    content: [
      "At TradeHub24, we are committed to protecting your personal data and complying with the General Data Protection Regulation (GDPR). This policy explains how we collect, process, and protect your personal information.",
      "We ensure that your data is processed lawfully, fairly, and transparently, collecting only what is necessary for specific, explicit, and legitimate purposes."
    ]
  },
  {
    icon: <Lock className="w-8 h-8 text-[#105298]" />,
    title: "Data Protection Principles",
    content: [
      "We adhere to the following principles when processing your personal data:"
    ],
    list: [
      "Lawfulness, fairness, and transparency",
      "Purpose limitation",
      "Data minimization",
      "Accuracy",
      "Storage limitation",
      "Integrity and confidentiality",
      "Accountability"
    ]
  },
  {
    icon: <FileText className="w-8 h-8 text-[#105298]" />,
    title: "Legal Basis for Processing",
    content: [
      "We process personal data only when we have a valid legal basis to do so. This includes:",
      "• When you have given consent",
      "• When processing is necessary for the performance of a contract",
      "• When we have a legal obligation",
      "• When it is in our legitimate interests, and these interests do not override your rights"
    ]
  }
];

const rights = [
  {
    title: "Right to Access",
    description: "Request a copy of your personal data and information about how we process it"
  },
  {
    title: "Right to Rectification",
    description: "Request corrections to inaccurate or incomplete personal data"
  },
  {
    title: "Right to Erasure",
    description: "Request deletion of your personal data in certain circumstances"
  },
  {
    title: "Right to Restriction",
    description: "Limit how we process your personal data"
  },
  {
    title: "Right to Data Portability",
    description: "Receive your data in a structured, commonly used format"
  },
  {
    title: "Right to Object",
    description: "Object to processing based on legitimate interests or direct marketing"
  }
];