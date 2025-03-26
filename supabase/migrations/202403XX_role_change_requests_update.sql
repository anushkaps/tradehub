-- Add is_active column to profiles (if not already present)
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Add is_active column to professionals (if not already present)
ALTER TABLE public.professionals
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- ROLE CHANGE REQUESTS TABLE
CREATE TABLE IF NOT EXISTS role_change_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  from_role text NOT NULL,
  requested_role text NOT NULL,
  status text DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE role_change_requests ENABLE ROW LEVEL SECURITY;

-- Allow users to insert a role change request for themselves
CREATE POLICY role_change_requests_insert_own
  ON role_change_requests
  FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Allow admins to select all role change requests
CREATE POLICY role_change_requests_admin_select
  ON role_change_requests
  FOR SELECT
  USING (auth.role() = 'admin');

-- Allow admins to update the status of role change requests
CREATE POLICY role_change_requests_update_admin
  ON role_change_requests
  FOR UPDATE
  USING (auth.role() = 'admin');
