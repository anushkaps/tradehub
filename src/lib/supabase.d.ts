import { SupabaseClient } from '@supabase/supabase-js';
import { UserType, Profile, Professional, Job, Bid, Review, Message, LoginActivity, RoleChangeRequest } from '../types/supabase';

declare module '@supabase/supabase-js' {
  export interface Database {
    public: {
      Tables: {
        profiles: {
          Row: Profile;
          Insert: Omit<Profile, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>;
        };
        professionals: {
          Row: Professional;
          Insert: Omit<Professional, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Professional, 'id' | 'created_at' | 'updated_at'>>;
        };
        jobs: {
          Row: Job;
          Insert: Omit<Job, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Job, 'id' | 'created_at' | 'updated_at'>>;
        };
        bids: {
          Row: Bid;
          Insert: Omit<Bid, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Bid, 'id' | 'created_at' | 'updated_at'>>;
        };
        reviews: {
          Row: Review;
          Insert: Omit<Review, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Review, 'id' | 'created_at' | 'updated_at'>>;
        };
        messages: {
          Row: Message;
          Insert: Omit<Message, 'id' | 'created_at' | 'updated_at'>;
          Update: Partial<Omit<Message, 'id' | 'created_at' | 'updated_at'>>;
        };
        login_activity: {
          Row: LoginActivity;
          Insert: Omit<LoginActivity, 'id' | 'created_at'>;
          Update: Partial<Omit<LoginActivity, 'id' | 'created_at'>>;
        };
        role_change_requests: {
          Row: RoleChangeRequest;
          Insert: Omit<RoleChangeRequest, 'id' | 'processed_date'>;
          Update: Partial<Omit<RoleChangeRequest, 'id'>>;
        };
      };
      Views: {
        [_ in never]: never;
      };
      Functions: {
        [_ in never]: never;
      };
      Enums: {
        user_type: UserType;
        job_status: 'open' | 'in_progress' | 'completed' | 'cancelled';
        bid_status: 'pending' | 'accepted' | 'rejected';
        role_change_status: 'pending' | 'approved' | 'rejected';
      };
    };
  }
}

declare global {
  const supabase: SupabaseClient<Database>;
}
