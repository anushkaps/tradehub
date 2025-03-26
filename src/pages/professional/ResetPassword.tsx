// src/pages/professional/ResetPassword.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { resetPassword } from '../../services/authService';
import { checkIfEmailExists } from '../../services/emailService';
import { useNavigate } from 'react-router-dom';

const ProfessionalResetPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { exists, userType } = await checkIfEmailExists(email);
    if (!exists) {
      toast.error('No account found with this email.');
      setLoading(false);
      return;
    }
    if (userType !== 'professional') {
      toast.error(`This email is registered as a ${userType} account. Please use the correct reset password page.`);
      setLoading(false);
      return;
    }
    const { success, error } = await resetPassword(email);
    if (error) {
      toast.error(error);
    } else {
      toast.success('Reset password email sent. Please check your inbox.');
      navigate('/professional/login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleReset} className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Professional Password Reset</h2>
        <label htmlFor="email" className="block mb-2">Email Address:</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded"
        >
          {loading ? 'Processing...' : 'Send Reset Link'}
        </button>
      </form>
    </div>
  );
};

export default ProfessionalResetPassword;
