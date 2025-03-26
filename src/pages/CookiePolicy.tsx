import { Helmet } from 'react-helmet-async';

export function CookiePolicy() {
  return (
    <div className="py-12">
      <Helmet>
        <title>Cookie Policy - TradeHub24</title>
        <meta name="description" content="Learn about how TradeHub24 uses cookies to improve your experience" />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Cookie Policy</h1>
          <p className="text-xl text-gray-600">Understanding how we use cookies to improve your experience</p>
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
    title: "What Are Cookies?",
    content: [
      "Cookies are small text files that are placed on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and how you use our site.",
      "We use both session cookies, which expire when you close your browser, and persistent cookies, which stay on your device until they expire or you delete them."
    ]
  },
  {
    title: "How We Use Cookies",
    content: [
      "Essential cookies: These are necessary for the website to function properly and cannot be switched off.",
      "Analytics cookies: Help us understand how visitors interact with our website.",
      "Functionality cookies: Remember your preferences and personalization choices.",
      "Marketing cookies: Track your activity across websites to deliver targeted advertising."
    ]
  },
  {
    title: "Managing Cookies",
    content: [
      "You can control and/or delete cookies as you wish. You can delete all cookies that are already on your computer and you can set most browsers to prevent them from being placed.",
      "However, if you do this, you may have to manually adjust some preferences every time you visit a site and some services and functionalities may not work."
    ]
  },
  {
    title: "Updates to This Policy",
    content: [
      "We may update this Cookie Policy from time to time to reflect changes in our practices or for operational, legal, or regulatory reasons.",
      "We encourage you to periodically review this page for the latest information on our cookie practices."
    ]
  }
];