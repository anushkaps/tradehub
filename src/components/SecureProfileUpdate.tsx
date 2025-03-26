import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../services/supabaseClient';
import { toast } from 'react-toastify';
import { UserType, ProfileUpdateData } from '../types/supabase';

interface SecureProfileUpdateProps {
  onSuccess?: () => void;
}

interface ActivityDetails {
  fields_updated: string[];
  password_changed: boolean;
  user_type: UserType;
}

interface FormData {
  email: string;
  phone: string;
  fullName: string;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
  bio: string;
  companyName: string;
  yearsOfExperience: string;
  licenseNumber: string;
  specialties: string[];
}

export const SecureProfileUpdate: React.FC<SecureProfileUpdateProps> = ({ onSuccess }) => {
  const { user, userType, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [requiresReauth, setRequiresReauth] = useState(false);

  const [formData, setFormData] = useState<FormData>({
    email: '',
    phone: '',
    fullName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    bio: '',
    companyName: '',
    yearsOfExperience: '',
    licenseNumber: '',
    specialties: []
  });

  useEffect(() => {
    if (!user) return;

    loadUserProfile();
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      toast.error('Failed to load profile');
      return;
    }

    setFormData(prev => ({
      ...prev,
      email: data.email || '',
      phone: data.phone || '',
      fullName: data.full_name || '',
      bio: data.bio || '',
      companyName: data.company_name || '',
      yearsOfExperience: data.years_of_experience?.toString() || '',
      licenseNumber: data.license_number || '',
      specialties: data.specialties || []
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // If email is being changed, require re-authentication
    if (name === 'email' && value !== user?.email) {
      setRequiresReauth(true);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      toast.error('Full name is required');
      return false;
    }

    if (formData.email.trim() !== user?.email && !formData.currentPassword) {
      toast.error('Current password is required to change email');
      return false;
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      toast.error('New passwords do not match');
      return false;
    }

    // Professional-specific validations
    if (userType === 'professional') {
      if (!formData.companyName) {
        toast.error('Company name is required for professionals');
        return false;
      }
      if (!formData.licenseNumber) {
        toast.error('License number is required for professionals');
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !userType || loading || !validateForm()) return;

    setLoading(true);
    try {
      // Handle password change if requested
      if (formData.newPassword) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: formData.newPassword
        });

        if (passwordError) throw passwordError;
      }

      // Handle email update
      if (formData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: formData.email
        });

        if (emailError) throw emailError;
      }

      // Update profile data
      const updateData: ProfileUpdateData = {
        full_name: formData.fullName,
        phone: formData.phone,
        bio: formData.bio,
        ...(userType === 'professional' && {
          company_name: formData.companyName,
          years_of_experience: parseInt(formData.yearsOfExperience) || undefined,
          license_number: formData.licenseNumber,
          specialties: formData.specialties
        })
      };

      const { success, message } = await updateProfile(updateData);

      if (!success) throw new Error(message);

      // Log activity
      const activityDetails: ActivityDetails = {
        fields_updated: Object.keys(updateData),
        password_changed: !!formData.newPassword,
        user_type: userType
      };

      await supabase.from('login_activity').insert({
        user_id: user.id,
        activity_type: 'profile_update',
        details: activityDetails
      });

      toast.success('Profile updated successfully!');
      onSuccess?.();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Bio</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleInputChange}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {userType === 'professional' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700">Company Name</label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Years of Experience</label>
            <input
              type="number"
              name="yearsOfExperience"
              value={formData.yearsOfExperience}
              onChange={handleInputChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">License Number</label>
            <input
              type="text"
              name="licenseNumber"
              value={formData.licenseNumber}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
        </>
      )}

      {requiresReauth && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Password</label>
          <input
            type="password"
            name="currentPassword"
            value={formData.currentPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">New Password (optional)</label>
        <input
          type="password"
          name="newPassword"
          value={formData.newPassword}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {formData.newPassword && (
        <div>
          <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Profile'}
      </button>
    </form>
  );
};
