// src/pages/auth/UpdatePassword.tsx
import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../../services/supabaseClient';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export function UpdatePassword() {
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    // If user arrived with #access_token, supabase sets session automatically.
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: { user }, error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      if (user) {
        toast.success('Password updated! You can now log in.');
        navigate(`/`)
        await supabase.auth.signOut();
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <Helmet>
        <title>Update Password - TradeHub24</title>
        <meta name="description" content="Update your TradeHub24 account password. Keep your account secure by choosing a strong password." />
      </Helmet>
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Set New Password</h2>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-md rounded-lg sm:px-10">
          <form onSubmit={handleUpdate} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent 
                  rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
