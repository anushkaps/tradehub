// src/components/SwitchAccountType.tsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { requestRoleChange } from '../services/roleChangeService';
import type { UserType } from '../services/authService';

const SwitchAccountType: React.FC = () => {
  const [requestedRole, setRequestedRole] = useState<UserType>('homeowner');
  const [loading, setLoading] = useState(false);

  const handleRoleChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await requestRoleChange(requestedRole);
    if (error) {
      // Extract error message whether error is string or PostgrestError
      const errorMessage = typeof error === 'string' ? error : error.message || 'An error occurred';
      toast.error(errorMessage);
    } else {
      toast.success('Role change request submitted successfully.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleRoleChange} className="bg-white p-6 rounded shadow-md">
      <h3 className="text-lg font-bold mb-2">Switch Account Type</h3>
      <label htmlFor="requestedRole" className="block mb-2">Select new account type:</label>
      <select
        id="requestedRole"
        value={requestedRole}
        onChange={(e) => setRequestedRole(e.target.value as UserType)}
        className="p-2 border rounded w-full mb-4"
      >
        <option value="homeowner">Homeowner</option>
        <option value="professional">Professional</option>
      </select>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded"
      >
        {loading ? 'Submitting...' : 'Submit Request'}
      </button>
    </form>
  );
};

export default SwitchAccountType;
