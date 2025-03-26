import React, { createContext, useContext, useState, useEffect } from 'react';
import { User as SupabaseUser } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { sendConfirmationEmail, sendWelcomeEmail } from '../services/emailService';

export type UserType = 'homeowner' | 'professional' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  user_type: UserType;
  confirmed: boolean;
  first_name?: string;
  last_name?: string;
  phone?: string;
  postcode?: string;
  created_at?: string;
  updated_at?: string;
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

// Type aliases for Supabase queries.
export type ProfilesRow = UserProfile;
export type ProfilesInsert = Omit<UserProfile, 'created_at' | 'updated_at'> & {
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdateData = Partial<UserProfile>;

export type AuthResponse = {
  success: boolean;
  message: string;
  data?: any;
};

export interface AuthUser extends SupabaseUser {
  profile?: UserProfile;
}

export interface UserContextProps {
  user: AuthUser | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  userType: UserType | null;
  isAuthenticated: boolean;
  updateProfile: (updates: ProfileUpdateData) => Promise<void>;
  setUserType: (type: UserType) => void;
  signIn: (email: string, password: string) => Promise<AuthResponse>;
  signUp: (
    email: string,
    password: string,
    userType: UserType,
    profileData?: Record<string, any>
  ) => Promise<AuthResponse>;
  signOut: () => Promise<void>;
  loginWithOTP: (email: string, userType: UserType) => Promise<AuthResponse>;
}

export const UserContext = createContext<UserContextProps | undefined>(undefined);

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

// Helper: Create a profile with confirmed set to false.
const createProfile = async (
  userId: string,
  email: string,
  userType: UserType,
  extraData?: Record<string, any>
): Promise<UserProfile | null> => {
  try {
    // First check if profile exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('profiles')
      .select('*')
      .or(`id.eq.${userId},email.eq.${email.toLowerCase()}`)
      .single();
      
    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error checking existing profile:', fetchError);
    }
    
    if (existingProfile) {
      console.log('Profile already exists, retrieving:', existingProfile);
      
      // If ID is different but email matches, update the ID to match auth
      if (existingProfile.id !== userId && existingProfile.email.toLowerCase() === email.toLowerCase()) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update({ 
            id: userId,
            updated_at: new Date().toISOString() 
          })
          .eq('email', email.toLowerCase())
          .select()
          .single();
          
        if (updateError) {
          console.error('Error updating profile ID:', updateError);
        } else {
          console.log('Updated profile ID to match auth:', updatedProfile);
          return updatedProfile as UserProfile;
        }
      }
      
      return existingProfile as UserProfile;
    }
    
    // Prepare the profile data
    const profileData: ProfilesInsert = {
      id: userId,
      email: email.toLowerCase(),
      user_type: userType,
      confirmed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...extraData
    };
    
    // Insert the profile and return the inserted data
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    if (!data) {
      throw new Error('No data returned when creating profile');
    }
    
    console.log('Profile created successfully:', data);
    return data;
  } catch (err) {
    console.error('Error in createProfile:', err);
    return null;
  }
};

// Helper: Fetch profile from the profiles table.
const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
  console.log('fetchProfile called with userId:', userId);
  localStorage.setItem('user_id', userId);
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      console.log('fetchProfile', data, error);
    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
    
    console.log('Profile fetched:', data);
    return data;
  } catch (err) {
    console.error('Error fetching profile:', err);
    return null;
  }
};

// const fetchProfile = async (userId: string): Promise<UserProfile | null> => {
//   console.log('Fetching profile...');

//   try {
//     // Ensure the session is restored before fetching the profile
//     const { data: { user }, error: sessionError } = await supabase.auth.getUser();
    
//     if (sessionError) {
//       console.error('Error fetching session:', sessionError);
//       return null;
//     }

//     if (!user) {
//       console.warn('No user found, returning null');
//       return null;
//     }

//     console.log('User found:', user);

//     const { data, error } = await supabase
//       .from('profiles')
//       .select('*')
//       .eq('id', user.id)
//       .single();

//     if (error) {
//       console.error('Error fetching profile:', error.message || error);
//       return null;
//     }

//     if (!data) {
//       console.warn(`No profile found for userId: ${user.id}`);
//       return null;
//     }

//     console.log('Profile fetched:', data);
//     return data as UserProfile;
//   } catch (err: any) {
//     console.error('Unexpected error:', err.message || err);
//     return null;
//   }
// };



export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [userType, setUserTypeState] = useState<UserType | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        console.log('Session:', session);
        if (sessionError) throw sessionError;
        if (session?.user) {
          console.log('Session found for user:', session.user.id);
          setUser(session.user as AuthUser);
          let prof = await fetchProfile(session.user.id);
          
          if (!prof) {
            console.log('No profile found, creating one...');
            // Create a profile with confirmed = false.
            const userTypeFromMetadata = (session.user.user_metadata?.user_type as UserType) || 'homeowner';
            if (!session.user.email) throw new Error('User email is missing.');
            prof = await createProfile(session.user.id, session.user.email, userTypeFromMetadata);
          }
          
          if (!prof) {
            console.error('Failed to create or fetch profile');
            toast.error('There was an error with your account. Please try again.');
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setUserTypeState(null);
            navigate('/');
            return;
          }
          
          // If the auth record shows email confirmed but our profile is not updated, update it.
          if (!prof.confirmed && session.user.email_confirmed_at) {
            console.log('Email confirmed but profile not updated, updating profile confirmation status');
            try {
              const { data, error } = await supabase
                .from('profiles')
                .update({ confirmed: true, updated_at: new Date().toISOString() })
                .eq('id', session.user.id)
                .select()
                .single();
              
              if (error) {
                console.error('Error updating profile confirmation:', error);
                throw error;
              }
              
              if (!data) {
                console.error('No data returned when updating profile confirmation');
                throw new Error('Failed to update profile confirmation');
              }
              
              console.log('Profile confirmation updated successfully:', data);
              prof = data;
            } catch (updateErr) {
              console.error('Error in profile confirmation update:', updateErr);
              toast.error('Error updating your profile. Please try again.');
            }
          }
          if(prof){
            if (!prof.confirmed) {
              console.log('User email not confirmed, redirecting');
              toast.error('Your email is not confirmed. Please check your email and confirm your account.');
              await supabase.auth.signOut();
              setUser(null);
              setProfile(null);
              setUserTypeState(null);
              navigate('/homeowner/signup'); // Adjust redirection if needed.
            } else {
              console.log('Setting profile and user type:', prof);
              setProfile(prof);
              setUserTypeState(prof.user_type);
              localStorage.setItem('lastUserType', prof.user_type);
            }
          }
        }
      } catch (err) {
        console.error('Error initializing auth:', err);
        setError('Failed to initialize auth');
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_IN' && session?.user) {
        localStorage.setItem('user_id', session.user.id);
        setUser(session.user as AuthUser);
        let prof = await fetchProfile(session.user.id);
        
        if (!prof) {
          console.log('No profile found on auth change, creating one...');
          const userTypeFromMetadata = (session.user.user_metadata?.user_type as UserType) || 'homeowner';
          if (!session.user.email) {
            console.error('User email is missing on auth change');
            toast.error('There was an error with your account. Please try again.');
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setUserTypeState(null);
            navigate('/');
            return;
          }
          prof = await createProfile(session.user.id, session.user.email, userTypeFromMetadata);
        }
        
        if (!prof) {
          console.error('Failed to create or fetch profile on auth change');
          toast.error('There was an error with your account. Please try again.');
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setUserTypeState(null);
          navigate('/');
          return;
        }
        
        if (!prof.confirmed && session.user.email_confirmed_at) {
          console.log('Email confirmed but profile not updated on auth change');
          try {
            const { data, error } = await supabase
              .from('profiles')
              .update({ confirmed: true, updated_at: new Date().toISOString() })
              .eq('id', session.user.id)
              .select()
              .single();
            
            if (error) {
              console.error('Error updating profile confirmation on auth change:', error);
              throw error;
            }
            
            if (!data) {
              console.error('No data returned when updating profile confirmation on auth change');
              throw new Error('Failed to update profile confirmation');
            }
            
            console.log('Profile confirmation updated successfully on auth change:', data);
            prof = data;
          } catch (updateErr) {
            console.error('Error in profile confirmation update on auth change:', updateErr);
          }
        }
        if(prof){
          if (!prof.confirmed) {
            console.log('User email not confirmed on auth change, redirecting');
            toast.error('Your email is not confirmed. Please check your email.');
            await supabase.auth.signOut();
            setUser(null);
            setProfile(null);
            setUserTypeState(null);
            navigate('/homeowner/signup');
          } else {
            console.log('Setting profile and user type on auth change:', prof);
            setProfile(prof);
            setUserTypeState(prof.user_type);
            localStorage.setItem('lastUserType', prof.user_type);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        localStorage.removeItem('user_id');
        setUser(null);
        setProfile(null);
        setUserTypeState(null);
        navigate('/');
      } else if (event === 'USER_UPDATED') {
        console.log('User updated, checking email confirmation');
        if (session?.user?.email_confirmed_at && profile && !profile.confirmed) {
          try {
            const { data, error } = await supabase
              .from('profiles')
              .update({ confirmed: true, updated_at: new Date().toISOString() })
              .eq('id', session.user.id)
              .select()
              .single();
            
            if (error) {
              console.error('Error updating profile confirmation on user update:', error);
              throw error;
            }
            
            if (data) {
              console.log('Profile confirmation updated successfully on user update:', data);
              setProfile(data);
            }
          } catch (updateErr) {
            console.error('Error in profile confirmation update on user update:', updateErr);
          }
        }
      }
    });
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  const updateProfile = async (updates: ProfileUpdateData) => {
    try {
      setLoading(true);
      if (!user) throw new Error('No user logged in');
      
      console.log('Updating profile with:', updates);
      const { user_type, ...allowedUpdates } = updates;
      
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...allowedUpdates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();
        
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      
      if (!data) {
        console.error('No data returned when updating profile');
        throw new Error("No data returned when updating profile");
      }
      
      console.log('Profile updated successfully:', data);
      setProfile(data);
      
      if (data.user_type) {
        setUserTypeState(data.user_type);
        localStorage.setItem('lastUserType', data.user_type);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const setUserType = (type: UserType) => {
    setUserTypeState(type);
  };

  const signIn = async (email: string, password: string): Promise<AuthResponse> => {
    try {
      console.log('Signing in user with email:', email);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) throw error;
      
      if (data.user) {
        console.log('User signed in:', data.user.id);
        // localStorage.setItem('user_id', data.user.id);
        let prof = await fetchProfile(data.user.id);
        
        if (!prof) {
          console.log('No profile found during sign in, creating one...');
          const userTypeFromMetadata = (data.user.user_metadata?.user_type as UserType) || 'homeowner';
          if (!data.user.email) throw new Error('User email is missing.');
          prof = await createProfile(data.user.id, data.user.email, userTypeFromMetadata);
        }
        
        if (!prof) {
          throw new Error("Failed to create or fetch profile during sign in");
        }
        
        if (!prof.confirmed) {
          console.log('User email not confirmed during sign in');
          throw new Error('Your email is not confirmed. Please check your email for the confirmation link.');
        }
      }
      
      return { success: true, message: 'Successfully signed in', data };
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to sign in',
      };
    }
  };

  const signUp = async (
    email: string,
    password: string,
    userType: UserType,
    profileData?: Record<string, any>
  ): Promise<AuthResponse> => {
    try {
      const redirectUrl =
        userType === 'homeowner'
          ? `${window.location.origin}/homeowner/email-confirmed`
          : `${window.location.origin}/professional/registration-step2`;
          
      console.log('Signing up user with email:', email, 'and userType:', userType);
      
      // Check if email already exists in profiles table first
      const { data: existingProfiles, error: profileCheckError } = await supabase
        .from('profiles')
        .select('id, email, user_type, confirmed')
        .eq('email', email.toLowerCase());
        
      if (profileCheckError) {
        console.error('Error checking existing profiles:', profileCheckError);
      } else if (existingProfiles && existingProfiles.length > 0) {
        console.log('Email already exists in profiles:', existingProfiles[0]);
        const existingProfile = existingProfiles[0];
        
        // If profile exists but isn't confirmed, we can allow re-signup
        if (existingProfile.confirmed) {
          return {
            success: false,
            message: `This email is already registered as a ${existingProfile.user_type}. Please log in instead.`
          };
        }
      }
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: { user_type: userType },
        },
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        console.log('User created in auth:', authData.user.id);
        if (!authData.user.email) throw new Error('User email is missing.');
        
        try {
          // Create or update profile with same ID as auth user
          const profile = await createProfile(authData.user.id, authData.user.email, userType, profileData);
          
          if (!profile) {
            throw new Error("Failed to create profile during sign up");
          }
          
          console.log('Profile created or updated:', profile);
          
          // Handle professional-specific data
          if (userType === 'professional') {
            const extraData = {
              company_name: profileData?.company_name || null,
              company_status: profileData?.company_status || null,
              registration_number: profileData?.businessRegistration || null,
              employee_count: profileData?.employeeCount || null,
              establishment_year: profileData?.establishmentYear || null,
              insurance_number: profileData?.insuranceNumber || null,
              trade_type: profileData?.trade || null,
            };
            
            console.log('Creating professional record:', extraData);
            
            const { data, error: proError } = await supabase
              .from('professionals')
              .upsert({
                id: authData.user.id,
                ...extraData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              })
              .select();
              
            if (proError) {
              console.error('Error inserting into professionals table:', proError);
            } else {
              console.log('Professional record created:', data);
              setUser(data[0] as AuthUser)
            }
          }
          
          // Send confirmation emails
          await sendConfirmationEmail(email.toLowerCase(), userType);
          await sendWelcomeEmail(email.toLowerCase(), userType);
          
          setUserTypeState(userType);
          localStorage.setItem('lastUserType', userType);
        } catch (profileError) {
          console.error('Error creating profile:', profileError);
          throw profileError;
        }
      } else {
        console.log("No active session returned from signUp; waiting for email confirmation.");
      }
      
      return {
        success: true,
        message: 'Successfully signed up. Please check your email for confirmation.',
        data: authData,
      };
    } catch (error) {
      console.error('Error signing up:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Failed to sign up',
      };
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      console.log('Signing out user');
      localStorage.removeItem('sb-ewfhwbpmhfpzknnbotdm-auth-token');
      localStorage.removeItem('lastUserType');
      const { error } = await supabase.auth.signOut();
      window.location.reload();
      if (error) throw error;
      setUser(null);
      setProfile(null);
      setUserTypeState(null);
      navigate('/');
    } catch (err) {
      console.error('Error logging out:', err);
      setError('Failed to log out');
      throw err;
    } finally {
      setLoading(false);
    }
  };  

  const loginWithOTP = async (email: string, type: UserType): Promise<AuthResponse> => {
    try {
      console.log('Sending OTP to email:', email, 'for user type:', type);
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/${type}/login-otp-callback`,
          data: { user_type: type },
        },
      });
      
      if (error) {
        console.error('OTP error:', error);
        return { success: false, message: error.message };
      }
      
      return { success: true, message: 'Check your email for the magic link' };
    } catch (err: any) {
      console.error('OTP login error:', err);
      return { success: false, message: err.message || 'An error occurred' };
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        profile,
        loading,
        error,
        userType,
        isAuthenticated: !!user,
        updateProfile,
        setUserType,
        signIn,
        signUp,
        signOut,
        loginWithOTP,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}