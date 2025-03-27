import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaCamera } from 'react-icons/fa';
import { toast } from 'react-toastify';

interface ProfessionalProfileData {
  // Personal fields (from profiles table)
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
  postcode: string;
  profile_image_url: string | null; // if available in profiles
  // Company fields (from professionals table)
  company_name: string;
  company_status: string;
  registration_number: string;
  employee_count: string;
  establishment_year: string;
  insurance_number: string;
  trade_type: string;
  city: string;
  company_summary: string;
  services_offered: string;
}

const ProfessionalProfile: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfessionalProfileData>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    address: '',
    postcode: '',
    profile_image_url: null,
    company_name: '',
    company_status: '',
    registration_number: '',
    employee_count: '',
    establishment_year: '',
    insurance_number: '',
    trade_type: '',
    city: '',
    company_summary: '',
    services_offered: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  // Tab state: "profile" or "security"
  const [activeTab, setActiveTab] = useState('profile');
  
  // Account deletion states
  const [showDeletePrompt, setShowDeletePrompt] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user && user.email) {
          // Fetch personal info from "profiles" table
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('email', user.email.toLowerCase())
            .single();
          if (profileError) {
            console.error('Error fetching profiles:', profileError);
          }
          // Fetch company info from "professionals" table
          const { data: professional, error: professionalError } = await supabase
            .from('professionals')
            .select('*')
            .eq('user_id', user.id)
            .single();
          if (professionalError) {
            console.error('Error fetching professionals:', professionalError);
          }
          setProfileData({
            first_name: profile?.first_name || '',
            last_name: profile?.last_name || '',
            email: user.email,
            phone: profile?.phone || '',
            address: profile?.address || '',
            postcode: profile?.postcode || '',
            profile_image_url: profile?.profile_image_url || null,
            company_name: professional?.company_name || '',
            company_status: professional?.company_status || '',
            registration_number: professional?.registration_number || '',
            employee_count: professional?.employee_count || '',
            establishment_year: professional?.establishment_year || '',
            insurance_number: professional?.insurance_number || '',
            trade_type: professional?.trade_type || '',
            city: professional?.city || '',
            company_summary: professional?.company_summary || '',
            services_offered: professional?.services_offered || ''
          });
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
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !user.email) throw new Error('User not authenticated');
      
      // Update personal info in "profiles" table
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: profileData.first_name,
          last_name: profileData.last_name,
          phone: profileData.phone,
          address: profileData.address,
          postcode: profileData.postcode
        })
        .eq('email', user.email.toLowerCase());
      if (profileError) throw profileError;
      
      // Update company info in "professionals" table
      const { error: professionalError } = await supabase
        .from('professionals')
        .update({
          company_name: profileData.company_name,
          company_status: profileData.company_status,
          registration_number: profileData.registration_number,
          employee_count: profileData.employee_count,
          establishment_year: profileData.establishment_year,
          insurance_number: profileData.insurance_number,
          trade_type: profileData.trade_type,
          city: profileData.city,
          company_summary: profileData.company_summary,
          services_offered: profileData.services_offered
        })
        .eq('user_id', user.id);
      if (professionalError) throw professionalError;
      
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
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.email}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `profile-images/${fileName}`;
      const { error: uploadError } = await supabase.storage
        .from('user-uploads')
        .upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from('user-uploads')
        .getPublicUrl(filePath);
      const publicUrl = urlData.publicUrl;
      // Update the avatar image in "profiles" table
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_image_url: publicUrl })
        .eq('email', user.email.toLowerCase());
      if (updateError) throw updateError;
      setProfileData(prev => ({ ...prev, profile_image_url: publicUrl }));
      toast.success('Profile image updated successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // 1) Use environment variables for your service role key
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
      // Delete the user's row from the "profiles" table (personal info)
      const { error: deleteProfileError } = await supabase
        .from('profiles')
        .delete()
        .eq('email', user.email.toLowerCase());
      if (deleteProfileError) {
        toast.error('Error deleting profile data.');
        setUpdating(false);
        return;
      }

      // (Optional) Delete from "professionals" if needed:
      // const { error: deleteProfessionalError } = await supabase
      //   .from('professionals')
      //   .delete()
      //   .eq('user_id', user.id);
      // if (deleteProfessionalError) {
      //   toast.error('Error deleting professional data.');
      //   setUpdating(false);
      //   return;
      // }

      // 2) Delete the user from Supabase Auth (frontend-only, insecure in production)
      const authResponse = await deleteAuthUser(user.id);
      if (!authResponse.ok) {
        toast.error('Error deleting authentication data.');
        setUpdating(false);
        return;
      }

      // 3) Sign the user out
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
                  <p className="text-sm text-gray-500">Professional</p>
                  {uploadingImage && <p className="text-sm text-blue-600 mt-1">Uploading image...</p>}
                </div>
              </div>

              <form onSubmit={handleProfileUpdate}>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
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
                  <div>
                    <label htmlFor="postcode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postcode
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        name="postcode"
                        id="postcode"
                        value={profileData.postcode}
                        onChange={handleInputChange}
                        className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label htmlFor="company_name" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="company_name"
                        id="company_name"
                        value={profileData.company_name}
                        onChange={handleInputChange}
                        className="pl-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="registration_number" className="block text-sm font-medium text-gray-700 mb-1">
                      Registration Number
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="registration_number"
                        id="registration_number"
                        value={profileData.registration_number}
                        onChange={handleInputChange}
                        className="pl-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="company_status" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Status
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="company_status"
                        id="company_status"
                        value={profileData.company_status}
                        onChange={handleInputChange}
                        className="pl-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="trade_type" className="block text-sm font-medium text-gray-700 mb-1">
                      Trade Type
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="trade_type"
                        id="trade_type"
                        value={profileData.trade_type}
                        onChange={handleInputChange}
                        className="pl-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="employee_count" className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Count
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="employee_count"
                        id="employee_count"
                        value={profileData.employee_count}
                        onChange={handleInputChange}
                        className="pl-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="establishment_year" className="block text-sm font-medium text-gray-700 mb-1">
                      Establishment Year
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="establishment_year"
                        id="establishment_year"
                        value={profileData.establishment_year}
                        onChange={handleInputChange}
                        className="pl-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="insurance_number" className="block text-sm font-medium text-gray-700 mb-1">
                      Insurance Number
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="insurance_number"
                        id="insurance_number"
                        value={profileData.insurance_number}
                        onChange={handleInputChange}
                        className="pl-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Address
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={profileData.address}
                        onChange={handleInputChange}
                        className="pl-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <input
                        type="text"
                        name="city"
                        id="city"
                        value={profileData.city}
                        onChange={handleInputChange}
                        className="pl-3 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Information</h3>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div>
                    <label htmlFor="company_summary" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Summary
                    </label>
                    <textarea
                      name="company_summary"
                      id="company_summary"
                      value={profileData.company_summary}
                      onChange={handleTextAreaChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      rows={4}
                    />
                  </div>
                  <div>
                    <label htmlFor="services_offered" className="block text-sm font-medium text-gray-700 mb-1">
                      Services Offered
                    </label>
                    <textarea
                      name="services_offered"
                      id="services_offered"
                      value={profileData.services_offered}
                      onChange={handleTextAreaChange}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      rows={3}
                    />
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

              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
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
                <div className="flex items-center justify-between py-3">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfile;
