-- Ensure the 'confirmed' column exists in profiles and professionals (if needed)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS confirmed boolean NOT NULL DEFAULT false;
ALTER TABLE professionals ADD COLUMN IF NOT EXISTS confirmed boolean NOT NULL DEFAULT false;

-- ============================================================
-- Enable RLS and define policies on the profiles table
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow profile owner select" ON profiles
  FOR SELECT
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow profile owner update" ON profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admin full access on profiles" ON profiles
  FOR ALL
  USING (current_setting('jwt.claims.role', true) = 'admin');

-- ============================================================
-- Enable RLS and define policies on the professionals table
-- ============================================================
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow professional owner select" ON professionals
  FOR SELECT
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow professional owner update" ON professionals
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow admin full access on professionals" ON professionals
  FOR ALL
  USING (current_setting('jwt.claims.role', true) = 'admin');

-- ============================================================
-- Jobs table (created by homeowners)
-- ============================================================
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow homeowner to select their jobs" ON jobs
  FOR SELECT
  USING (auth.uid() = homeowner_id);

CREATE POLICY "Allow homeowner to insert/update their jobs" ON jobs
  FOR INSERT, UPDATE
  USING (auth.uid() = homeowner_id)
  WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Allow admin full access on jobs" ON jobs
  FOR ALL
  USING (current_setting('jwt.claims.role', true) = 'admin');

-- ============================================================
-- Bids table (submitted by professionals)
-- ============================================================
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow professional to select their bids" ON bids
  FOR SELECT
  USING (auth.uid() = professional_id);

CREATE POLICY "Allow professional to insert/update their bids" ON bids
  FOR INSERT, UPDATE
  USING (auth.uid() = professional_id)
  WITH CHECK (auth.uid() = professional_id);

CREATE POLICY "Allow admin full access on bids" ON bids
  FOR ALL
  USING (current_setting('jwt.claims.role', true) = 'admin');

-- ============================================================
-- Messages table (user communications)
-- ============================================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user to select their messages" ON messages
  FOR SELECT
  USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

CREATE POLICY "Allow user to insert messages" ON messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Allow admin full access on messages" ON messages
  FOR ALL
  USING (current_setting('jwt.claims.role', true) = 'admin');

-- ============================================================
-- Reviews table (homeowners reviewing professionals)
-- ============================================================
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow homeowner to select their reviews" ON reviews
  FOR SELECT
  USING (auth.uid() = homeowner_id);

CREATE POLICY "Allow homeowner to insert/update their reviews" ON reviews
  FOR INSERT, UPDATE
  USING (auth.uid() = homeowner_id)
  WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Allow admin full access on reviews" ON reviews
  FOR ALL
  USING (current_setting('jwt.claims.role', true) = 'admin');

-- ============================================================
-- Role Change Requests table
-- ============================================================
ALTER TABLE role_change_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user to select their role change requests" ON role_change_requests
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow user to insert role change requests" ON role_change_requests
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow admin full access on role change requests" ON role_change_requests
  FOR ALL
  USING (current_setting('jwt.claims.role', true) = 'admin');

-- ============================================================
-- Login Activity table
-- ============================================================
ALTER TABLE login_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow user to see their login activity" ON login_activity
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Allow user to insert their login activity" ON login_activity
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Allow admin full access on login_activity" ON login_activity
  FOR ALL
  USING (current_setting('jwt.claims.role', true) = 'admin');
