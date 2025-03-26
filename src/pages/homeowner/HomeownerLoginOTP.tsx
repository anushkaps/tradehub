// src/pages/homeowner/HomeownerLoginOTP.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { checkIfEmailExists } from '../../services/emailService';
import { FaEnvelope } from 'react-icons/fa';

const HomeownerLoginOTP: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // const isCallback = location.pathname.includes('login-otp-callback');

  // useEffect(() => {
  //   if (location.state?.email) {
  //     setEmail(location.state.email);
  //   }
  // }, [location.state]);

  // useEffect(() => {
  //   // if (location.state?.email) {
  //   //   setEmail(location.state.email);
  //   // }
  //   // Handle OTP callback
  //   console.log('Is callback:', isCallback);
    
  //   if (isCallback) {
  //     setLoading(true);
  //     (async () => {
  //       try {
  //         const hashParams = new URLSearchParams(window.location.hash.substring(1));
  //         console.log('Hash params:', hashParams);
  //         const accessToken = hashParams.get('access_token');
  //         const refreshToken = hashParams.get('refresh_token');
  //         console.log('Access token:', accessToken);
  //         console.log('Refresh token:', refreshToken);
  //         if (accessToken && refreshToken) {
  //           const { error } = await supabase.auth.setSession({
  //             access_token: accessToken,
  //             refresh_token: refreshToken,
  //           });
  //           if (error) throw error;

  //           //Check user type
  //           const { data: { user } } = await supabase.auth.getUser();
  //           console.log('User data:', user);
  //           if (user?.user_metadata?.user_type !== 'homeowner') {
  //             await supabase.auth.signOut();
  //             throw new Error('Access denied: you are not a homeowner');
  //           }
  //           setMessage({ type: 'success', text: 'Successfully authenticated! Redirecting...' });
  //           setTimeout(() => navigate('/homeowner/dashboard'), 1500);
  //         }
  //       } catch (err: any) {
  //         setMessage({ type: 'error', text: err.message || 'Failed to verify login link' });
  //       } finally {
  //         setLoading(false);
  //       }
  //     })();
  //   }
  // }, [isCallback, navigate,location.state]);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get('access_token');
    const refreshToken = queryParams.get('refresh_token');
  
    if (accessToken && refreshToken) {
      (async () => {
        try {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
  
          if (error) throw error;
  
          const { data: { user } } = await supabase.auth.getUser();
  
          if (user?.user_metadata?.user_type !== 'homeowner') {
            await supabase.auth.signOut();
            throw new Error('Access denied: you are not a homeowner');
          }
  
          setMessage({ type: 'success', text: 'Successfully authenticated! Redirecting...' });
          // setTimeout(() => navigate('/homeowner/dashboard'), 1500);
          navigate('/homeowner/dashboard');
  
        } catch (error) {
          setMessage({ type: 'error', text: (error as Error).message || 'Failed to verify login link' });
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [navigate]);
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const { exists, userType } = await checkIfEmailExists(email);
      console.log('Email exists:', exists, userType);
      if (!exists) {
        navigate('/homeowner/signup', {
          state: { email, message: 'Account not found. Please sign up.' },
        });
        return;
      }
      if (userType !== 'homeowner') {
        throw new Error('This email is registered as a professional. Please use the professional login.');
      }
      // Send magic link
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/homeowner/dashboard`,
          data: { user_type: 'homeowner' },
        },
      });
      if (error) throw error;
      setMessage({ type: 'success', text: 'Magic link sent! Check your email.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send magic link.' });
    } finally {
      setLoading(false);
    }
  };

  // if (isCallback) {
  //   // Show verifying screen
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
  //       <div className="max-w-md w-full space-y-8">
  //         <div>
  //           <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
  //             Verifying your login
  //           </h2>
  //         </div>
  //         <div className="mt-8 space-y-6">
  //           {loading ? (
  //             <div className="flex justify-center">
  //               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
  //             </div>
  //           ) : message ? (
  //             <div
  //               className={`rounded-md p-4 ${
  //                 message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
  //               }`}
  //             >
  //               {message.text}
  //             </div>
  //           ) : null}
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // Normal OTP request form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Login with Magic Link
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email to receive a secure login link
          </p>
        </div>

        {message && (
          <div
            className={`rounded-md p-4 ${
              message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-8 bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full pl-10 sm:text-sm border-gray-300 rounded-md 
                    focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md 
                  shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Magic Link'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <Link
                to="/homeowner/login"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 
                  rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Password Login
              </Link>
              <Link
                to="/homeowner/signup"
                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 
                  rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeownerLoginOTP;