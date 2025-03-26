// Auth Types
export type UserType = 'homeowner' | 'professional' | 'admin';

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: any;
}

// Profile Types
export interface ProfileUpdateData {
  full_name?: string;
  phone?: string;
  email?: string;
  bio?: string;
  company_name?: string;
  years_of_experience?: number;
  license_number?: string;
  specialties?: string[];
  [key: string]: any;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  user_type: UserType;
  first_name: string;
  last_name: string;
  phone?: string;
  created_at: string;
  updated_at: string;
  email_verified: boolean;
  postcode?: string;
  // Professional specific fields
  company_name?: string;
  business_registration?: string;
  trade?: string;
  bio?: string;
  website?: string;
  years_of_experience?: number;
  hourly_rate?: number;
  avatar_url?: string;
  rating?: number;
  total_reviews?: number;
  // Homeowner specific fields
  preferred_contact?: 'email' | 'phone';
  address?: string;
  project_history?: string[];
}

// Professional Types
export interface Professional {
  id: string;
  user_id: string;
  company_name: string;
  business_registration_number: string;
  trade: string;
  experience_years: number;
  rating: number;
  total_reviews: number;
  created_at: string;
  updated_at: string;
}

// Job Types
export interface Job {
  id: string;
  homeowner_id: string;
  title: string;
  description: string;
  location: string;
  budget: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

// Bid Types
export interface Bid {
  id: string;
  job_id: string;
  professional_id: string;
  amount: number;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  updated_at: string;
}

// Review Types
export interface Review {
  id: string;
  job_id: string;
  homeowner_id: string;
  professional_id: string;
  rating: number;
  comment: string;
  created_at: string;
  updated_at: string;
}

// Message Types
export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  read: boolean;
  created_at: string;
  updated_at: string;
}

// Login Activity Types
export interface LoginActivity {
  id: string;
  user_id: string;
  activity_type: string;
  ip_address?: string;
  user_agent?: string;
  details?: Record<string, any>;
  created_at: string;
}

// Role Change Request Types
export interface RoleChangeRequest {
  id: string;
  user_id: string;
  from_role: UserType;
  requested_role: UserType;
  status: 'pending' | 'approved' | 'rejected';
  admin_id?: string;
  reason?: string;
  request_date: string;
  processed_date?: string;
}

// Success Story Types
export interface SuccessStory {
  id: string;
  professional_id: string;
  title: string;
  description: string;
  before_image?: string;
  after_image?: string;
  completion_date: string;
  customer_name?: string;
  customer_review?: string;
  rating: number;
  created_at: string;
  updated_at: string;
}
