// src/pages/professional/ProfessionalLoginOTP.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { checkIfEmailExists } from '../../services/emailService';
import { Link } from 'lucide-react';

const ProfessionalLoginOTP: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // const isCallback = location.pathname.includes('callback');

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  // useEffect(() => {
  //   if (isCallback) {
  //     setLoading(true);
  //     (async () => {
  //       try {
  //         const hashParams = new URLSearchParams(window.location.hash.substring(1));
  //         const accessToken = hashParams.get('access_token');
  //         const refreshToken = hashParams.get('refresh_token');
  //         if (accessToken && refreshToken) {
  //           const { data, error } = await supabase.auth.setSession({
  //             access_token: accessToken,
  //             refresh_token: refreshToken,
  //           });
  //           if (error) throw error;

  //           const { data: { user } } = await supabase.auth.getUser();
  //           if (user?.user_metadata?.user_type !== 'professional') {
  //             await supabase.auth.signOut();
  //             throw new Error('Access denied: you are not a professional');
  //           }
  //           setMessage({ type: 'success', text: 'Successfully authenticated! Redirecting...' });
  //           setTimeout(() => navigate('/professional/dashboard'), 1500);
  //         }
  //       } catch (err: any) {
  //         setMessage({ type: 'error', text: err.message || 'Failed to verify login link' });
  //       } finally {
  //         setLoading(false);
  //       }
  //     })();
  //   }
  // }, [isCallback, navigate]);

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
    
            if (user?.user_metadata?.user_type !== 'professional') {
              await supabase.auth.signOut();
              throw new Error('Access denied: you are not a professional');
            }
    
            setMessage({ type: 'success', text: 'Successfully authenticated! Redirecting...' });
            // setTimeout(() => navigate('/homeowner/dashboard'), 1500);
            navigate('/professional/dashboard');
    
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
      if (!exists) {
        navigate('/professional/signup', {
          state: { email, message: 'Account not found. Please sign up.' },
        });
        return;
      }
      if (userType !== 'professional') {
        throw new Error('This email is registered as a homeowner. Please use the homeowner login.');
      }
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/professional/dashboard`,
          data: { user_type: 'professional' },
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
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Professional Login with Magic Link
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

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 
                  placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                  focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent 
                text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {loading ? 'Sending...' : 'Send Magic Link'}
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <Link to="/professional/login" className="font-medium text-blue-600 hover:text-blue-500">
                Login with password instead
              </Link>
            </div>
            <div className="text-sm">
              <Link to="/professional/signup" className="font-medium text-blue-600 hover:text-blue-500">
                Sign up
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionalLoginOTP;
