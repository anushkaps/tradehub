import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ProfileData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;    // Keep this if your "profiles" table has an "address" column
  city: string;
  state: string;
  zip_code: string;   // Will be saved in the "postcode" column
  profile_image_url: string | null; // We'll fetch/store from "avatar_url" in DB
}

const HomeownerProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: '',
    profile_image_url: null
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Tab state
  const [activeTab, setActiveTab] = useState('profile');
  
  // Delete account states
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          // Fetch from "profiles" by matching the user's email
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', user.email.toLowerCase())
            .single();
          
          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }
          
          if (data) {
            // Map DB columns to our state shape
            setProfileData(prev => ({
              ...prev,
              first_name: data.first_name || '',
              last_name: data.last_name || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              zip_code: data.postcode || '',        // "postcode" in DB
              profile_image_url: data.avatar_url || null, // "avatar_url" in DB
              email: user.email || ''
            }));
          }
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error('User not authenticated');
      
      // Update "profiles" by matching user's email
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          postcode: profileData.zip_code // "zip_code" in UI, "postcode" in DB
        })
        .eq('email', user.email.toLowerCase());
      
      if (error) throw error;
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setUpdating(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }
    setUpdating(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        setPasswordError('User not authenticated or email is missing');
        setUpdating(false);
        return;
      }
      // Re-authenticate using current password
      const { error: reAuthError } = await supabase.auth.signInWithPassword({
        email: user.email.toLowerCase(),
        password: currentPassword,
      });
      
      if (reAuthError) {
        setPasswordError('Current password is incorrect');
        setUpdating(false);
        return;
      }
      // Update the password
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordError('Failed to update password. Please ensure your current password is correct.');
    } finally {
      setUpdating(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingImage(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error('User not authenticated');
      
      // Upload image to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.email}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file);
      
      if (uploadError) throw uploadError;
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);
      
      const publicUrl = urlData.publicUrl;
      
      // Update "profiles" table with the new image URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl }) // store in "avatar_url" column
        .eq('email', user.email.toLowerCase());
      
      if (updateError) throw updateError;
      
      // Update local state
      setProfileData(prev => ({ ...prev, profile_image_url: publicUrl }));
      
      toast.success('Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Use Vite environment variables in your delete function
  const deleteAuthUser = async (userId: string) => {
    const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
    const SERVICE_ROLE_KEY = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;
    const response = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`
      }
    });
    return response;
  };

  const handleAccountDeletion = async () => {
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) {
        toast.error('User not authenticated');
        setUpdating(false);
        return;
      }
      // Re-authenticate using the entered delete password
      const { error: reAuthError } = await supabase.auth.signInWithPassword({
        email: user.email.toLowerCase(),
        password: deletePassword,
      });
      if (reAuthError) {
        toast.error('Incorrect password. Account deletion aborted.');
        setUpdating(false);
        return;
      }
      // Delete the user's row from the "profiles" table
      const { error: deleteProfileError } = await supabase
        .from('profiles')
        .delete()
        .eq('email', user.email.toLowerCase());
      if (deleteProfileError) {
        toast.error('Error deleting profile data.');
        setUpdating(false);
        return;
      }
      // Delete the user from Supabase Auth (frontend only, insecure)
      const authResponse = await deleteAuthUser(user.id);
      if (!authResponse.ok) {
        toast.error('Error deleting authentication data.');
        setUpdating(false);
        return;
      }
      // Sign the user out
      const { error: signOutError } = await supabase.auth.signOut();
      if (signOutError) {
        toast.error('Error signing out.');
        setUpdating(false);
        return;
      }
      toast.success('Account deleted successfully!');
      window.location.href = '/';
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account. Please try again.');
    } finally {
      setUpdating(false);
      setShowDeletePrompt(false);
      setDeletePassword('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'profile'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Security Settings
              </button>
            </nav>
          </div>

          {activeTab === 'profile' && (
            <div className="p-6">
              <div className="flex flex-col sm:flex-row items-center mb-6">
                <div className="relative mb-4 sm:mb-0 sm:mr-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border border-gray-300">
                    {profileData.profile_image_url ? (
                      <img 
                        src={profileData.profile_image_url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <FaUser className="text-gray-400 text-3xl" />
                      </div>
                    )}
                  </div>
                  <label 
                    htmlFor="profile-image" 
                    className="absolute bottom-0 right-0 bg-blue-600 text-white p-1 rounded-full cursor-pointer"
                  >
                    <FaCamera size={14} />
                  </label>
                  <input 
                    type="file" 
                    id="profile-image" 
                    className="hidden" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                  />
                </div>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-bold text-gray-900">
                    {profileData.first_name} {profileData.last_name}
                  </h2>
                  <p className="text-sm text-gray-500">Homeowner</p>
                  {uploadingImage && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
                </div>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="first_name"
                        id="first_name"
                        value={profileData.first_name}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="last_name"
                        id="last_name"
                        value={profileData.last_name}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaEnvelope className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={profileData.email}
                        className="pl-10 block w-full rounded-md border-gray-300 bg-gray-100 shadow-sm sm:text-sm"
                        disabled
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Contact support to change your email address</p>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      Phone Number
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaPhone className="text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={profileData.phone}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Address Information</h3>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <div className="relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaMapMarkerAlt className="text-gray-400" />
                        </div>
                        <input
                          type="text"
                          name="address"
                          id="address"
                          value={profileData.address}
                          onChange={handleInputChange}
                          className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          value={profileData.city}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          value={profileData.state}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="zip_code" className="block text-sm font-medium text-gray-700 mb-1">
                          ZIP Code
                        </label>
                        <input
                          type="text"
                          name="zip_code"
                          id="zip_code"
                          value={profileData.zip_code}
                          onChange={handleInputChange}
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={updating}
                  >
                    {updating ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
              
              <form onSubmit={handlePasswordChange}>
                {passwordError && (
                  <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md">
                    {passwordError}
                  </div>
                )}
                
                <div className="space-y-4 mb-6">
                  <div>
                    <label htmlFor="current_password" className="block text-sm font-medium text-gray-700 mb-1">
                      Current Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="current_password"
                        id="current_password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="new_password" className="block text-sm font-medium text-gray-700 mb-1">
                      New Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="new_password"
                        id="new_password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                        minLength={8}
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Password must be at least 8 characters long</p>
                  </div>
                  <div>
                    <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm New Password
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaLock className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        name="confirm_password"
                        id="confirm_password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end mb-6">
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    disabled={updating}
                  >
                    {updating ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Security</h3>
                
                <div className="bg-yellow-50 p-4 rounded-md mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Security Recommendations</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <ul className="list-disc pl-5 space-y-1">
                          <li>Use a strong, unique password that you don't use elsewhere</li>
                          <li>Enable two-factor authentication for additional security</li>
                          <li>Never share your login credentials with anyone</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between py-3 border-b border-gray-200">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Set Up
                  </button>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Account Deletion</p>
                  <p className="text-sm text-gray-500">Permanently delete your account and all data</p>
                </div>
                {showDeletePrompt ? (
                  <div className="flex flex-col">
                    <input
                      type="password"
                      placeholder="Enter password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      className="mb-2 px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    />
                    <button
                      type="button"
                      onClick={handleAccountDeletion}
                      className="inline-flex items-center px-3 py-1.5 border border-red-700 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      disabled={updating}
                    >
                      {updating ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowDeletePrompt(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    Delete Account
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeownerProfile;
