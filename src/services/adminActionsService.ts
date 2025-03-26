// THIS FILE MUST RUN ON SERVER (with service_role key)! Not in client code.
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL!;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceKey);

/** Logout from all devices (sign out user from all refresh tokens) */
export async function logoutAllSessions(userId: string) {
  const { error } = await supabaseAdmin.auth.admin.signOut(userId);
  if (error) throw error;
  return true;
}

/** Delete user from both "profiles" table and Supabase Auth */
export async function deleteUserAccount(userId: string) {
  // Remove from "profiles" first
  await supabaseAdmin.from('profiles').delete().eq('id', userId);
  // Then remove from Auth
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  if (error) throw error;
  return true;
}
