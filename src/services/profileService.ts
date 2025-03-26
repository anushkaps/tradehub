import { supabase } from './supabaseClient';
import { UserProfile } from '../contexts/UserContext';

/**
 * Creates a new profile record in the "profiles" table.
 */
export async function createProfile(profileData: Partial<UserProfile>) {
  const { data: sessionData } = await supabase.auth.getSession();
  const user = sessionData?.session?.user;
  if (!user) {
    throw new Error('No authenticated user. Please log in first.');
  }

  const { error } = await supabase
    .from('profiles')
    .insert({
      id: user.id,
      user_type: profileData.user_type,
      first_name: profileData.first_name,
      last_name: profileData.last_name,
      phone: profileData.phone,
      postcode: profileData.postcode,
      company_name: profileData.company_name,
      business_registration_number: profileData.business_registration_number,
      trade: profileData.trade,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    throw new Error(error.message);
  }

  return true;
}

/**
 * Updates an existing profile record.
 * @param id - The profile id.
 * @param data - The data to update.
 */
export const updateProfile = async (id: string, data: Partial<UserProfile>) => {
  // Prevent direct updates to user_type.
  const { user_type, ...allowedUpdates } = data;
  
  const { error } = await supabase
    .from('profiles')
    .update({
      ...allowedUpdates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, error: null };
};

/**
 * Deletes the account (profile) of the given user id.
 * @param id - The profile id.
 */
export const deleteAccount = async (id: string) => {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);

  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true, error: null };
};

/**
 * Requests a role change for a user by inserting a record into the role_change_requests table.
 * @param id - The user's profile id.
 * @param newRole - The new role requested ('homeowner' or 'professional').
 */
export const requestRoleChange = async (id: string, newRole: 'homeowner' | 'professional') => {
  // Fetch the current role to populate from_role
  const { data: profileData, error: profileError } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', id)
    .maybeSingle();
  if (profileError) {
    return { success: false, error: profileError.message, message: '' };
  }
  const currentRole = profileData?.user_type || '';

  const { error } = await supabase
    .from('role_change_requests')
    .insert({
      user_id: id,
      from_role: currentRole,
      requested_role: newRole,
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

  if (error) {
    return { success: false, error: error.message, message: '' };
  }
  return { success: true, error: null, message: 'Role change request submitted successfully.' };
};
