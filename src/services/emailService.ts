import { supabase } from './supabaseClient';

// export const checkIfEmailExists = async (
//   email: string
// ): Promise<{ exists: boolean; userType?: 'homeowner' | 'professional' | 'admin' }> => {
//   console.log('Checking email:', email.toLowerCase())
//   try {
//     const { data, error } = await supabase
//       .from('profiles')
//       .select('email, user_type')
//       // .ilike('email', email.toLowerCase())
//       // .maybeSingle();

//     if (error) {
//       console.error('Error checking email existence:', error);
//       return { exists: false };
//     }

//     console.log('checkIfEmailExists:', {data, error});

//     if (data) {
//       return { exists: true, userType: data.user_type as 'homeowner' | 'professional' | 'admin' };
//     } else {
//       return { exists: false };
//     }
//   } catch (error: any) {
//     console.error('Error in checkIfEmailExists:', error);
//     return { exists: false };
//   }
// };

export const checkIfEmailExists = async (
  email: string
): Promise<{ exists: boolean; userType?: 'homeowner' | 'professional' | 'admin' }> => {
  // Normalize input email
  const normalizedEmail = email.trim().toLowerCase();
  console.log('Checking normalized email:', normalizedEmail);
  
  try {
    // Get ALL profiles and log them to examine the data
    const { data: allProfiles, error: allProfilesError } = await supabase
      .from('profiles')
      .select('email, user_type');
    
    if (allProfilesError) {
      console.error('Error fetching all profiles:', allProfilesError);
      return { exists: false };
    }
    
    // Log all emails in the database for debugging
    // console.log('All emails in database:', allProfiles.map(p => p.email));
    
    // Find the profile manually by comparing emails
    const matchingProfile = allProfiles.find(profile => 
      profile.email && profile.email.toLowerCase().trim() === normalizedEmail
    );
    
    if (matchingProfile) {
      console.log('Found matching profile:', matchingProfile);
      return { 
        exists: true, 
        userType: matchingProfile.user_type as 'homeowner' | 'professional' | 'admin' 
      };
    }
    
    // If no exact match, look for close matches for debugging
    const similarProfiles = allProfiles.filter(profile => 
      profile.email && profile.email.toLowerCase().includes(normalizedEmail.split('@')[0])
    );
    
    if (similarProfiles.length > 0) {
      console.log('Found similar profiles:', similarProfiles);
    }
    
    console.log('No matching profile found for:', normalizedEmail);
    return { exists: false };
  } catch (error: any) {
    console.error('Error in checkIfEmailExists:', error);
    return { exists: false };
  }
};

export const isEmailVerified = async (userId: string): Promise<boolean> => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    if (user?.id !== userId) return false;
    return user?.email_confirmed_at != null;
  } catch (error) {
    console.error('Error checking email verification:', error);
    return false;
  }
};

export const sendConfirmationEmail = async (email: string, userType: 'homeowner' | 'professional' | 'admin') => {
  // Placeholder: Replace with your branded email template logic.
  console.log(`Sending branded confirmation email to ${email} for ${userType} account.`);
  return true;
};

export const sendWelcomeEmail = async (email: string, userType: 'homeowner' | 'professional' | 'admin') => {
  // Placeholder: Replace with your branded welcome email template logic.
  console.log(`Sending branded welcome email to ${email} for ${userType} account.`);
  return true;
};
