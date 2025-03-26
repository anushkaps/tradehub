import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabaseClient';
import { toast } from 'react-toastify';

const HomeownerEmailConfirmedCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        // Get the current user session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error('Unable to verify your session. Please try signing in.');
          return navigate('/homeowner/login');
        }

        if (!session?.user) {
          toast.error('No active session found. Please sign in.');
          return navigate('/homeowner/login');
        }

        // Verify that email is actually confirmed in auth
        if (!session.user.email_confirmed_at) {
          toast.error('Email not confirmed yet. Please check your email.');
          return navigate('/auth/please-confirm-email');
        }

        // Update the profiles table
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            confirmed: true, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', session.user.id)
          .eq('confirmed', false); // Only update if not already confirmed

        if (updateError) {
          console.error('Profile update error:', updateError);
          toast.error('Error updating your profile. Please contact support.');
          return;
        }

        // Success! Redirect to dashboard
        toast.success('Email confirmed successfully! Welcome to TradeHub24.');
        navigate('/homeowner/dashboard');
      } catch (error: Error | unknown) {
        console.error('Confirmation error:', error);
        toast.error('An unexpected error occurred. Please try again.');
        navigate('/homeowner/login');
      }
    };

    confirmEmail();
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Confirming your email...</h2>
        <p className="text-gray-600">Please wait while we verify your account.</p>
      </div>
    </div>
  );
};

export default HomeownerEmailConfirmedCallback;
