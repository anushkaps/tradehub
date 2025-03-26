// src/pages/account/DeleteAccount.tsx
import React from 'react';
import { toast } from 'react-toastify';
import { useUser } from '../../contexts/UserContext';

function DeleteAccount() {
  const { user } = useUser();

  const handleDelete = async () => {
    if (!user) {
      toast.error('Not logged in');
      return;
    }
    try {
      const res = await fetch('/api/delete-account', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id }),
      });
      if (!res.ok) throw new Error('Failed to delete account');
      toast.success('Account deleted. Goodbye!');
      // Optionally navigate away
    } catch (err: any) {
      toast.error(err.message || 'Error deleting account');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Delete Account</h2>
      <p className="text-red-600 my-4">This action is permanent and cannot be undone.</p>
      <button
        onClick={handleDelete}
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        Delete My Account
      </button>
    </div>
  );
}

export default DeleteAccount;