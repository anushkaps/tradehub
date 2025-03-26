import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem('cookieConsent');
    if (!hasConsent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookieConsent', 'rejected');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-gray-600 text-sm">
              We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.{' '}
              <Link to="/cookie-policy" className="text-[#105298] hover:text-[#0c3d72]">
                Learn more
              </Link>
            </p>
          </div>
          <div className="mt-4 md:mt-0 md:ml-6 flex space-x-4">
            <Link
              to="/cookie-preferences"
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              <button onClick={()=>setIsVisible(false)}>Customize</button>
            </Link>
            <button
              onClick={handleReject}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium"
            >
              Reject All
            </button>
            <button
              onClick={handleAccept}
              className="bg-[#e20000] text-white px-4 py-2 rounded-md hover:bg-[#cc0000] text-sm font-medium"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}