// src/services/roleChangeService.ts
import { supabase } from './supabaseClient';
import type { UserType } from './authService';

export const requestRoleChange = async (requestedRole: UserType) => {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { data: null, error: 'User not logged in' };
  }

  // Retrieve current user role from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('user_type')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return { data: null, error: profileError.message };
  }

  const currentRole = profile.user_type;
  if (currentRole === requestedRole) {
    return { data: null, error: 'Your account is already set to the requested role' };
  }

  const { data, error } = await supabase
    .from('role_change_requests')
    .insert({
      user_id: user.id,
      current_role: currentRole,
      requested_role: requestedRole,
      status: 'pending',
      created_at: new Date().toISOString(),
    })
    .select();

  return { data, error };
};

export const getRoleChangeRequests = async () => {
  const { data, error } = await supabase
    .from('role_change_requests')
    .select(`
      *,
      profiles:user_id (
        email,
        first_name,
        last_name
      )
    `)
    .order('created_at', { ascending: false });

  return { data, error };
};

export const updateRoleChangeRequestStatus = async (
  requestId: string,
  status: 'approved' | 'rejected'
) => {
  const { data, error } = await supabase
    .from('role_change_requests')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', requestId)
    .select();

  return { data, error };
};
