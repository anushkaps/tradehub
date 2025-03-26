import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { signInWithEmail } from '../../services/authService';
import { checkIfEmailExists } from '../../services/emailService';
import { toast } from 'react-toastify';
import { Mail, Lock } from 'lucide-react';

const HomeownerLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        const userType = session.user.user_metadata?.user_type;
        if (userType === 'homeowner') {
          navigate('/homeowner/dashboard');
        }
      }
    };
    checkSession();
  }, [navigate]);

  // Handle tokens from magic link or social login
  useEffect(() => {
    async function parseHashTokens() {
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        if (accessToken && refreshToken) {
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });
          if (error) {
            console.error('Error setting session from hash (HomeownerLogin):', error.message);
          } else {
            console.log('Session stored from hash (HomeownerLogin):', data);
            navigate('/homeowner/dashboard');
          }
          window.history.replaceState({}, document.title, window.location.pathname);
        }
      }
    }
    parseHashTokens();
  }, [navigate]);

  // Pre-check to confirm the email belongs to a homeowner
  const handlePreCheck = async (checkEmail: string) => {
    try {
      const { exists, userType } = await checkIfEmailExists(checkEmail);
      if (!exists) {
        toast.error('No account found. Please sign up.');
        navigate('/homeowner/signup', { state: { email: checkEmail } });
        return false;
      }
      if (userType !== 'homeowner') {
        toast.error('Email belongs to a professional account. Use professional login.');
        setErrorMessage('This email is registered as a professional. Please use the professional login.');
        return false;
      }
      return true;
    } catch (err: any) {
      toast.error(err.message || 'Error checking email');
      setErrorMessage(err.message);
      return false;
    }
  };

  // Full login with password
  const handleLoginWithPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      const { exists, userType } = await checkIfEmailExists(email);
      if (!exists) {
        toast.error('No account found. Please sign up.');
        navigate('/homeowner/signup', { state: { email } });
        return;
      }
      if (userType && userType !== 'homeowner') {
        toast.error('This email is registered as a professional. Please use the professional login.');
        navigate('/professional/login');
        return;
      }

      const { data, error } = await signInWithEmail(email, password);
      if (error) {
        toast.error(error);
        setErrorMessage(error);
        return;
      }

      const sessionRes = await supabase.auth.getSession();
      const user = sessionRes.data.session?.user;
      const userMetadataType = user?.user_metadata?.user_type;

      if (userMetadataType && userMetadataType !== 'homeowner') {
        await supabase.auth.signOut();
        throw new Error('Access denied: you are not a homeowner.');
      }

      toast.success('Login successful!');
      navigate('/homeowner/dashboard', { replace: true });
    } catch (err: any) {
      toast.error(err.message);
      setErrorMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  // OTP login flow
  const handleLoginWithOTP = async () => {
    setErrorMessage('');
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    try {
      const canProceed = await handlePreCheck(email);
      if (!canProceed) return;
      navigate('/homeowner/login-otp', { state: { email } });
    } catch (err: any) {
      toast.error(err.message);
      setErrorMessage(err.message);
    }
  };

  // Google OAuth login
  const handleLoginWithGoogle = async () => {
    setErrorMessage('');
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/homeowner/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message);
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="text-center text-3xl font-bold text-gray-900">
          Welcome back, Homeowner
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          {errorMessage && (
            <div className="mb-4 text-sm text-red-600 bg-red-50 p-3 rounded">
              {errorMessage}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleLoginWithPassword}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm
                    focus:outline-none focus:ring-[#105298] focus:border-[#105298]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm
                    focus:outline-none focus:ring-[#105298] focus:border-[#105298]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#105298] focus:ring-[#105298] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              <div className="text-sm">
                <Link
                  to="/auth/reset-password"
                  className="font-medium text-[#105298] hover:text-blue-700"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm
                  text-sm font-medium text-white bg-[#e20000] hover:bg-[#cc0000]
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#105298]
                  disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <button
              type="button"
              onClick={handleLoginWithOTP}
              className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm
                text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Login with Email OTP
            </button>

            <button
              type="button"
              onClick={handleLoginWithGoogle}
              className="w-full flex items-center justify-center border border-gray-300 rounded-md shadow-sm
                px-6 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <img
                src="/src/assets/googlepng.png"
                alt="Google Logo"
                className="h-5 w-5 mr-2"
              />
              <span>Continue with Google</span>
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/homeowner/signup" className="font-medium text-[#105298] hover:text-blue-700">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomeownerLogin;
