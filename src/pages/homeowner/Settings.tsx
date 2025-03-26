import React, { useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { User, Mail, Phone, MapPin, Bell, Shield, CreditCard, Upload } from 'lucide-react';

const Settings: React.FC = () => {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState('profile');

  // Mock data
  const [formData, setFormData] = useState({
    name: user?.name || 'John Doe',
    email: user?.email || 'john.doe@example.com',
    phone: user?.phone || '+1234567890',
    address: '123 Main St, Anytown, USA',
    notifyEmail: true,
    notifySMS: true,
    notifyPush: false,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    alert('Settings updated successfully!');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Account Settings</h1>
        <p className="text-gray-600">Manage your account preferences and settings.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Tabs */}
        <div className="w-full md:w-64 bg-white rounded-lg shadow">
          <nav className="p-4 space-y-1">
            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center px-3 py-2 w-full text-sm font-medium rounded-md ${
                activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <User className="mr-3 h-5 w-5" />
              Profile Information
            </button>
            <button
              onClick={() => setActiveTab('notifications')}
              className={`flex items-center px-3 py-2 w-full text-sm font-medium rounded-md ${
                activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Bell className="mr-3 h-5 w-5" />
              Notification Settings
            </button>
            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center px-3 py-2 w-full text-sm font-medium rounded-md ${
                activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Shield className="mr-3 h-5 w-5" />
              Security
            </button>
            <button
              onClick={() => setActiveTab('payment')}
              className={`flex items-center px-3 py-2 w-full text-sm font-medium rounded-md ${
                activeTab === 'payment' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <CreditCard className="mr-3 h-5 w-5" />
              Payment Methods
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg shadow">
          <div className="p-6">
            {activeTab === 'profile' && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
                    <p className="mt-1 text-sm text-gray-500">Update your personal information.</p>
                  </div>

                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <img
                        className="h-16 w-16 rounded-full"
                        src={user?.profileImage || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                        alt=""
                      />
                    </div>
                    <div className="ml-5">
                      <div className="relative bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm flex items-center cursor-pointer hover:bg-gray-50 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                        <label
                          htmlFor="user-photo"
                          className="relative text-sm font-medium text-gray-700 pointer-events-none"
                        >
                          <span>Change</span>
                          <span className="sr-only"> user photo</span>
                        </label>
                        <input
                          id="user-photo"
                          name="user-photo"
                          type="file"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer border-gray-300 rounded-md"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        <User className="inline-block h-4 w-4 mr-1" />
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        <Mail className="inline-block h-4 w-4 mr-1" />
                        Email Address
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        <Phone className="inline-block h-4 w-4 mr-1" />
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        id="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        <MapPin className="inline-block h-4 w-4 mr-1" />
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'notifications' && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Notification Settings</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage how you receive notifications.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifyEmail"
                          name="notifyEmail"
                          type="checkbox"
                          checked={formData.notifyEmail}
                          onChange={handleChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifyEmail" className="font-medium text-gray-700">
                          Email Notifications
                        </label>
                        <p className="text-gray-500">Receive email notifications for new quotes, messages, and job updates.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifySMS"
                          name="notifySMS"
                          type="checkbox"
                          checked={formData.notifySMS}
                          onChange={handleChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifySMS" className="font-medium text-gray-700">
                          SMS Notifications
                        </label>
                        <p className="text-gray-500">Receive text message alerts for important updates.</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="notifyPush"
                          name="notifyPush"
                          type="checkbox"
                          checked={formData.notifyPush}
                          onChange={handleChange}
                          className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="notifyPush" className="font-medium text-gray-700">
                          Push Notifications
                        </label>
                        <p className="text-gray-500">Receive push notifications on your device.</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div>
                    <h2 className="text-lg font-medium text-gray-900">Security Settings</h2>
                    <p className="mt-1 text-sm text-gray-500">Update your password and security preferences.</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                        Current Password
                      </label>
                      <input
                        type="password"
                        name="currentPassword"
                        id="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                        New Password
                      </label>
                      <input
                        type="password"
                        name="newPassword"
                        id="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>

                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        name="confirmPassword"
                        id="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Update Password
                    </button>
                  </div>
                </div>
              </form>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-medium text-gray-900">Payment Methods</h2>
                  <p className="mt-1 text-sm text-gray-500">Manage your payment methods for job deposits and payments.</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="text-center py-8">
                    <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No payment methods</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      You haven't added any payment methods yet.
                    </p>
                    <div className="mt-6">
                      <button
                        type="button"
                        className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Add Payment Method
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;