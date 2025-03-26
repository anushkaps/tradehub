import { supabase } from './supabaseClient';
import { checkIfEmailExists, sendConfirmationEmail, sendWelcomeEmail } from './emailService';

export type UserType = 'homeowner' | 'professional' | 'admin';

interface SignUpOptions {
  emailRedirectTo?: string;
  data: {
    user_type: UserType;
    first_name: string;
    last_name: string;
    postcode: string;
    phone: string;
    // Professional specific fields
    company_name?: string;
    company_status?: string;
    registration_number?: string;
    employee_count?: number;
    establishment_year?: number;
    insurance_number?: string;
    trade_type?: string;
  };
}

// Helper function to create a profile
const createProfile = async (userId: string, email: string, userType: UserType, extraData?: Record<string, any>) => {
  try {
    // Check if profile already exists
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking existing profile:', checkError);
      throw checkError;
    }
    
    if (existingProfile) {
      console.log('Profile already exists:', existingProfile);
      return { data: existingProfile, error: null };
    }
    
    // Profile doesn't exist, create it
    const profileData = {
      id: userId,
      email: email.toLowerCase(),
      user_type: userType,
      confirmed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...extraData
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert(profileData)
      .select()
      .single();
      
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    console.log('Profile created successfully:', data);
    return { data, error: null };
  } catch (error: any) {
    console.error('Error in createProfile:', error);
    return { data: null, error: error.message };
  }
};

export const signUpWithEmail = async (
  email: string,
  password: string,
  options: SignUpOptions
) => {
  try {
    // First, check if email exists
    const { exists, userType: existingUserType } = await checkIfEmailExists(email);
    if (exists) {
      if (existingUserType) {
        return { 
          data: null, 
          error: `This email is already used by a ${existingUserType} account. Please use a different email.` 
        };
      }
      return { data: null, error: 'Email already registered. Please log in.' };
    }

    // Create auth user
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: options.emailRedirectTo || `${window.location.origin}/${options.data.user_type}/email-confirmed`,
        data: {
          user_type: options.data.user_type
        }
      }
    });

    if (signUpError) throw signUpError;

    if (authData.user) {
      // Create profile with all form data
      const profileData = {
        id: authData.user.id,
        email: email.toLowerCase(),
        user_type: options.data.user_type,
        first_name: options.data.first_name,
        last_name: options.data.last_name,
        postcode: options.data.postcode,
        phone: options.data.phone,
        confirmed: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { error: profileError } = await supabase
        .from('profiles')
        .insert([profileData]);

      if (profileError) {
        console.error('Error creating profile:', profileError);
        // Don't delete auth user, just log error and continue
        console.log('Profile creation failed but proceeding with auth account');
      }

      // If professional, create professional details
      if (options.data.user_type === 'professional' && 
          (options.data.company_name || options.data.trade_type)) {
        const professionalData = {
          id: authData.user.id,
          company_name: options.data.company_name,
          company_status: options.data.company_status,
          registration_number: options.data.registration_number,
          employee_count: options.data.employee_count,
          establishment_year: options.data.establishment_year,
          insurance_number: options.data.insurance_number,
          trade_type: options.data.trade_type,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        const { error: proError } = await supabase
          .from('professionals')
          .insert([professionalData]);

        if (proError) {
          console.error('Error creating professional details:', proError);
          // Don't fail the signup, just log the error
          console.log('Professional details creation failed but proceeding');
        }
      }

      // Send branded emails
      await sendConfirmationEmail(email, options.data.user_type);
      await sendWelcomeEmail(email, options.data.user_type);

      return { data: authData, error: null };
    }

    return { data: null, error: 'Failed to create user account.' };
  } catch (error: any) {
    console.error('Error in signUpWithEmail:', error);
    return { data: null, error: error.message };
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    const normalizedEmail = email.toLowerCase();

    const { data, error } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        const { exists } = await checkIfEmailExists(normalizedEmail);
        if (!exists) {
          throw new Error('No account found with this email. Please sign up.');
        }
        throw new Error('Invalid password. Please try again.');
      }
      throw error;
    }

    if (data.user) {
      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        console.error('Error fetching profile:', profileError);
      }

      // Allow login even if profile doesn't exist or email isn't confirmed
      // Just update the profile if needed
      if (profile && !profile.confirmed && data.user.email_confirmed_at) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            confirmed: true, 
            updated_at: new Date().toISOString() 
          })
          .eq('id', data.user.id);
          
        if (updateError) {
          console.error('Error updating profile confirmation:', updateError);
        }
      }

      // Record login activity
      const { error: activityError } = await supabase.from('login_activity').insert({
        user_id: data.user.id,
        login_time: new Date().toISOString(),
        ip_address: 'client-side',
        user_agent: navigator.userAgent,
      });

      if (activityError) {
        console.error('Error logging activity:', activityError);
      }

      // Store last used role
      const userRole = profile?.user_type || data.user.user_metadata?.user_type;
      if (userRole) {
        localStorage.setItem('lastUserType', userRole);
      }
    }

    return { data, error: null };
  } catch (error: any) {
    console.error('Error in signInWithEmail:', error);
    return { data: null, error: error.message };
  }
};

export const signOut = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error in signOut:', error);
    return { success: false, error: error.message };
  }
};

export const signOutAllSessions = async () => {
  try {
    const { error } = await supabase.auth.signOut({ scope: 'global' });
    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error in signOutAllSessions:', error);
    return { success: false, error: error.message };
  }
};

export const resetPassword = async (email: string) => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
    return { success: true, error: null };
  } catch (error: any) {
    console.error('Error in resetPassword:', error);
    return { success: false, error: error.message };
  }
};