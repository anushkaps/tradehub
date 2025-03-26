// src/pages/Messages.tsx
import { useEffect, useState, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../services/supabaseClient';
import { useUser } from '../contexts/UserContext';
import MessagingInterface from '../components/shared/MessagingInterface'; // If you need this UI

export function Messages() {
  const navigate = useNavigate();
  const location = useLocation();

  // Instead of calling `UserType()` as a function, useContext:
  const { userType } = useUser();

  // Local states for loading/error
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) throw new Error(authError.message);

        if (!user) {
          // If user is not logged in, redirect to your chosen login page
          navigate('/professional/login');
          return;
        }

        setIsLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  // Optionally read a `jobId` from the query params
  const queryParams = new URLSearchParams(location.search);
  const jobId = queryParams.get('jobId');

  // Show a spinner if we're still verifying Supabase auth
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  // Show an error if we failed to get the user
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md">
          <h3 className="text-lg font-semibold">Error</h3>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Redirect logic based on userType
  if (userType === 'homeowner') {
    // E.g., navigate to homeowner-specific messages page
    navigate(`/homeowner/Messages${jobId ? `?jobId=${jobId}` : ''}`);
    return null; // so we don't render anything else
  } else if (userType === 'professional') {
    // E.g., navigate to professional-specific messages page
    navigate(`/professional/Messages${jobId ? `?jobId=${jobId}` : ''}`);
    return null;
  }

  // If we somehow don't have a recognized userType, show a fallback
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-md">
        <h3 className="text-lg font-semibold">Account Type Not Determined</h3>
        <p>
          We couldn't determine your account type. Please complete your registration or log in again.
        </p>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={() => navigate('/professional/login')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Login as Professional
          </button>
          <button
            onClick={() => navigate('/homeowner/login')}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Login as Homeowner
          </button>
        </div>
      </div>
    </div>
  );
}

return (
  <div className="min-h-screen bg-gray-50">
    <Helmet>
      <title>Messages - TradeHub24</title>
      <meta name="description" content="View and manage your conversations with professionals and homeowners on TradeHub24. Stay connected and communicate effectively with your contacts." />
    </Helmet>
    {{ ... }}
