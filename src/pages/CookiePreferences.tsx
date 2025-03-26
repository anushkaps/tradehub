import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

interface CookiePreference {
  id: string;
  title: string;
  description: string;
  required?: boolean;
  enabled: boolean;
}

export function CookiePreferences() {
  const [preferences, setPreferences] = useState<CookiePreference[]>([
    {
      id: 'necessary',
      title: 'Necessary',
      description: 'Essential cookies that enable basic functionality and security features of the website.',
      required: true,
      enabled: true
    },
    {
      id: 'functionality',
      title: 'Functionality',
      description: 'Cookies that enhance the functionality of the website by storing your preferences.',
      enabled: true
    },
    {
      id: 'experience',
      title: 'Experience',
      description: 'Cookies that help improve your experience by remembering your preferences.',
      enabled: true
    },
    {
      id: 'measurement',
      title: 'Measurement',
      description: 'Cookies that help us understand how visitors interact with our website.',
      enabled: true
    },
    {
      id: 'marketing',
      title: 'Marketing',
      description: 'Cookies used to deliver personalized advertisements and track their effectiveness.',
      enabled: false
    }
  ]);

  const handleToggle = (id: string) => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === id && !pref.required ? { ...pref, enabled: !pref.enabled } : pref
      )
    );
  };

  const handleAcceptAll = () => {
    setPreferences(prev =>
      prev.map(pref => ({ ...pref, enabled: true }))
    );
    localStorage.setItem('cookieConsent', 'accepted');
  };

  const handleRejectAll = () => {
    setPreferences(prev =>
      prev.map(pref => pref.required ? pref : { ...pref, enabled: false })
    );
    localStorage.setItem('cookieConsent', 'rejected');
  };

  const savePreferences = () => {
    // Here you would implement the logic to save preferences
    console.log('Saving preferences:', preferences);
  };

  return (
    <div className="py-12">
      <Helmet>
        <title>Cookie Preferences - TradeHub24</title>
        <meta name="description" content="Manage your cookie preferences and privacy settings on TradeHub24" />
      </Helmet>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Cookie Preferences</h1>
          <p className="text-gray-600">Manage your consent preferences for tracking technologies</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <p className="text-gray-600 mb-6">
            We use cookies and similar technologies to help personalize content, improve your experience, 
            and analyze how our website is used. You can customize your consent preferences for each 
            category below.
          </p>

          <div className="space-y-6">
            {preferences.map((pref) => (
              <div key={pref.id} className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-grow">
                  <div className="flex items-center mb-2">
                    <h3 className="font-semibold">{pref.title}</h3>
                    {pref.required && (
                      <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded">
                        Required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{pref.description}</p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={pref.enabled}
                      onChange={() => handleToggle(pref.id)}
                      disabled={pref.required}
                    />
                    <div className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer 
                      ${pref.enabled ? 'peer-checked:bg-[#105298]' : ''} 
                      peer-disabled:bg-gray-100 peer-disabled:cursor-not-allowed`}>
                    </div>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between">
          <div className="space-x-4">
            <button
              onClick={handleRejectAll}
              className="px-6 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Reject All
            </button>
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 bg-[#105298] text-white rounded-md hover:bg-[#0c3d72]"
            >
              Accept All
            </button>
          </div>
          <Link to={'/'}>
          <button
            onClick={savePreferences}
            className="px-6 py-2 bg-[#e20000] text-white rounded-md hover:bg-[#cc0000]"
          >
            Save Preferences
          </button>
          </Link>
        </div>
      </div>
    </div>
  );
}