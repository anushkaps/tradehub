import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { supabase } from '../../services/supabaseClient';

const Settings: React.FC = () => {
  const { user, profile, updateProfile } = useUser();
  
  // Account settings
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  
  // Privacy settings
  const [profileVisibility, setProfileVisibility] = useState('public');
  const [showContactInfo, setShowContactInfo] = useState(false);
  
  // Loading and error states
  const [loading, setLoading] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);
  const [accountSuccess, setAccountSuccess] = useState<string | null>(null);
  const [notificationError, setNotificationError] = useState<string | null>(null);
  const [notificationSuccess, setNotificationSuccess] = useState<string | null>(null);
  const [privacyError, setPrivacyError] = useState<string | null>(null);
  const [privacySuccess, setPrivacySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
    
    if (profile) {
      // Load notification preferences from profile
      setEmailNotifications(profile.email_notifications || true);
      setSmsNotifications(profile.sms_notifications || false);
      setMarketingEmails(profile.marketing_emails || true);
      
      // Load privacy settings from profile
      setProfileVisibility(profile.profile_visibility || 'public');
      setShowContactInfo(profile.show_contact_info || false);
    }
  }, [user, profile]);

  const handleUpdateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setAccountSuccess(null);
    setLoading(true);
    
    try {
      // Update email if changed
      if (email !== user?.email) {
        const { error } = await supabase.auth.updateUser({ email });
        if (error) throw error;
      }
      
      // Update password if provided
      if (password) {
        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }
        
        const { error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
      }
      
      setAccountSuccess('Account settings updated successfully');
    } catch (error: any) {
      setAccountError(error.message || 'Failed to update account settings');
      console.error('Error updating account:', error);
    } finally {
      setLoading(false);
      setPassword('');
      setConfirmPassword('');
    }
  };

  const handleUpdateNotifications = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotificationError(null);
    setNotificationSuccess(null);
    setLoading(true);
    
    try {
      if (!profile) throw new Error('Profile not found');
      
      const updatedProfile = {
        ...profile,
        email_notifications: emailNotifications,
        sms_notifications: smsNotifications,
        marketing_emails: marketingEmails
      };
      
      await updateProfile(updatedProfile);
      setNotificationSuccess('Notification preferences updated successfully');
    } catch (error: any) {
      setNotificationError(error.message || 'Failed to update notification preferences');
      console.error('Error updating notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePrivacy = async (e: React.FormEvent) => {
    e.preventDefault();
    setPrivacyError(null);
    setPrivacySuccess(null);
    setLoading(true);
    
    try {
      if (!profile) throw new Error('Profile not found');
      
      const updatedProfile = {
        ...profile,
        profile_visibility: profileVisibility,
        show_contact_info: showContactInfo
      };
      
      await updateProfile(updatedProfile);
      setPrivacySuccess('Privacy settings updated successfully');
    } catch (error: any) {
      setPrivacyError(error.message || 'Failed to update privacy settings');
      console.error('Error updating privacy settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        setLoading(true);
        
        // Delete user data from profiles table
        if (user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .delete()
            .eq('id', user.id);
            
          if (profileError) throw profileError;
          
          // Delete auth user
          // Note: This might require admin privileges or a server-side function
          // depending on your Supabase setup
          const { error: authError } = await supabase.auth.admin.deleteUser(user.id);
          if (authError) throw authError;
        }
        
        // Sign out
        await supabase.auth.signOut();
        window.location.href = '/';
      } catch (error: any) {
        console.error('Error deleting account:', error);
        alert(`Failed to delete account: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar - Navigation */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Settings</h2>
            </div>
            <nav className="p-4">
              <ul className="space-y-2">
                <li>
                  <a href="#account" className="block px-3 py-2 rounded-md bg-blue-50 text-blue-700">
                    Account
                  </a>
                </li>
                <li>
                  <a href="#notifications" className="block px-3 py-2 rounded-md hover:bg-gray-50">
                    Notifications
                  </a>
                </li>
                <li>
                  <a href="#privacy" className="block px-3 py-2 rounded-md hover:bg-gray-50">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#danger" className="block px-3 py-2 rounded-md hover:bg-gray-50 text-red-600">
                    Danger Zone
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
        
        {/* Right Content Area */}
        <div className="col-span-1 md:col-span-2 space-y-6">
          {/* Account Settings */}
          <div id="account" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Account Settings</h2>
            
            {accountError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {accountError}
              </div>
            )}
            
            {accountSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {accountSuccess}
              </div>
            )}
            
            <form onSubmit={handleUpdateAccount}>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  New Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Leave blank to keep current password"
                />
              </div>
              
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Account'}
              </button>
            </form>
          </div>
          
          {/* Notification Settings */}
          <div id="notifications" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Notification Preferences</h2>
            
            {notificationError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {notificationError}
              </div>
            )}
            
            {notificationSuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {notificationSuccess}
              </div>
            )}
            
            <form onSubmit={handleUpdateNotifications}>
              <div className="space-y-4 mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="emailNotifications"
                    checked={emailNotifications}
                    onChange={(e) => setEmailNotifications(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="emailNotifications" className="ml-2 block text-gray-700">
                    Receive email notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smsNotifications"
                    checked={smsNotifications}
                    onChange={(e) => setSmsNotifications(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="smsNotifications" className="ml-2 block text-gray-700">
                    Receive SMS notifications
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="marketingEmails"
                    checked={marketingEmails}
                    onChange={(e) => setMarketingEmails(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="marketingEmails" className="ml-2 block text-gray-700">
                    Receive marketing emails
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Preferences'}
              </button>
            </form>
          </div>
          
          {/* Privacy Settings */}
          <div id="privacy" className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Privacy Settings</h2>
            
            {privacyError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {privacyError}
              </div>
            )}
            
            {privacySuccess && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {privacySuccess}
              </div>
            )}
            
            <form onSubmit={handleUpdatePrivacy}>
              <div className="mb-4">
                <label htmlFor="profileVisibility" className="block text-gray-700 font-medium mb-2">
                  Profile Visibility
                </label>
                <select
                  id="profileVisibility"
                  value={profileVisibility}
                  onChange={(e) => setProfileVisibility(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="public">Public - Visible to everyone</option>
                  <option value="contacts">Contacts Only - Visible to people you've worked with</option>
                  <option value="private">Private - Visible only to you</option>
                </select>
              </div>
              
              <div className="mb-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showContactInfo"
                    checked={showContactInfo}
                    onChange={(e) => setShowContactInfo(e.target.checked)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="showContactInfo" className="ml-2 block text-gray-700">
                    Show contact information on my profile
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                {loading ? 'Updating...' : 'Update Privacy Settings'}
              </button>
            </form>
          </div>
          
          {/* Danger Zone */}
          <div id="danger" className="bg-white rounded-lg shadow p-6 border border-red-200">
            <h2 className="text-xl font-semibold mb-4 text-red-600">Danger Zone</h2>
            <p className="text-gray-600 mb-6">
              Once you delete your account, there is no going back. Please be certain.
            </p>
            <button
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
