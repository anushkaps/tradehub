import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';
import { FaBell, FaCheck, FaTrash, FaExclamationCircle, FaUser, FaTools, FaCalendarAlt, FaComments, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'job_update' | 'message' | 'payment' | 'system' | 'review';
  read: boolean;
  created_at: string;
  action_url: string | null;
  related_id: string | null;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  // const [userId, setUserId] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchUserId = async () => {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     setUserId(user?.id || null);
  //   };
  //   fetchUserId();
  // }, []);

  const userId = localStorage.getItem('user_id') || null; // Replace with actual user ID retrieval logic
  
  useEffect(() => {
    fetchNotifications();
    
    // Set up real-time subscription for new notifications
    const subscription = supabase
      .channel('notifications-channel')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'notifications' 
      }, payload => {
        const newNotification = payload.new as Notification;
        
        // Check if the notification is for the current user
        if (newNotification.user_id === userId) {
          setNotifications(prev => [newNotification, ...prev]);
        }
      })
      .subscribe();
    
    return () => {
      subscription.unsubscribe();
    };
  }, []);
  
  // const [currentUser, setCurrentUser] = useState<string | null>(null);
  
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // const { data: { user } } = await supabase.auth.getUser();
      
      // if (!user) {
      //   throw new Error('User not authenticated');
      // }
      
      // setCurrentUser(user.id);
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;

      console.log('Fetched notifications:', data);
      
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => 
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };
  
  const markAllAsRead = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.map(notification => ({ ...notification, read: true }))
      );
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Update local state
      setNotifications(prev => 
        prev.filter(notification => notification.id !== id)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  };
  
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'job_update':
        return <FaTools className="text-blue-500" />;
      case 'message':
        return <FaComments className="text-green-500" />;
      case 'payment':
        return <FaCalendarAlt className="text-purple-500" />;
      case 'review':
        return <FaStar className="text-yellow-500" />;
      case 'system':
      default:
        return <FaBell className="text-red-500" />;
    }
  };
  
  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(notification => !notification.read)
      : notifications.filter(notification => notification.type === filter);
  
  const unreadCount = notifications.filter(notification => !notification.read).length;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="mt-1 text-sm text-gray-500">
                  Stay updated on your projects and messages
                </p>
              </div>
              
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <FaCheck className="mr-1.5 -ml-0.5" />
                  Mark All as Read
                </button>
              )}
            </div>
            
            <div className="mt-4">
              <div className="sm:hidden">
                <select
                  id="notification-filter-mobile"
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Notifications</option>
                  <option value="unread">Unread</option>
                  <option value="job_update">Job Updates</option>
                  <option value="message">Messages</option>
                  <option value="payment">Payments</option>
                  <option value="review">Reviews</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div className="hidden sm:block">
                <nav className="-mb-px flex space-x-4">
                  <button
                    onClick={() => setFilter('all')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filter === 'all'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setFilter('unread')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filter === 'unread'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Unread {unreadCount > 0 && `(${unreadCount})`}
                  </button>
                  <button
                    onClick={() => setFilter('job_update')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filter === 'job_update'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Jobs
                  </button>
                  <button
                    onClick={() => setFilter('message')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filter === 'message'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Messages
                  </button>
                  <button
                    onClick={() => setFilter('payment')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filter === 'payment'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Payments
                  </button>
                  <button
                    onClick={() => setFilter('review')}
                    className={`px-3 py-2 text-sm font-medium rounded-md ${
                      filter === 'review'
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Reviews
                  </button>
                </nav>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="text-center py-10">
                <div className="spinner"></div>
                <p className="mt-2 text-gray-600">Loading notifications...</p>
              </div>
            ) : filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-4 sm:p-6 ${!notification.read ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium text-gray-900">{notification.type}</h3>
                        <p className="text-xs text-gray-500">{formatDate(notification.created_at)}</p>
                      </div>
                      <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
                      
                      <div className="mt-2 flex items-center justify-between">
                        <div className="flex space-x-2">
                          {notification.action_url && (
                            <Link
                              to={notification.action_url}
                              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              View Details
                            </Link>
                          )}
                          
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="inline-flex items-center px-2.5 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                        
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-gray-400 hover:text-gray-500"
                          aria-label="Delete notification"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <FaBell className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No notifications</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {filter !== 'all' 
                    ? `You don't have any ${filter === 'unread' ? 'unread' : filter} notifications.` 
                    : 'You don\'t have any notifications yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notifications;