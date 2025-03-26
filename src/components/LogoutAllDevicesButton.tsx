// src/components/LogoutAllDevicesButton.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { signOutAllSessions } from '../services/authService';

const LogoutAllDevicesButton: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleLogoutAll = async () => {
    setLoading(true);
    const { success, error } = await signOutAllSessions();
    if (success) {
      toast.success('Logged out from all devices.');
    } else {
      toast.error(error || 'Error logging out from all devices.'); 
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleLogoutAll}
      disabled={loading}
      className="py-2 px-4 bg-red-600 text-white rounded"
    >
      {loading ? 'Logging out...' : 'Log Out From All Devices'}
    </button>
  );
};

export default LogoutAllDevicesButton;
