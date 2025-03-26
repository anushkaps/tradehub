-- Profiles table policies
CREATE POLICY "Users can view their own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Login activity policies
CREATE POLICY "Users can view their own login activity"
    ON login_activity FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "System can insert login activity"
    ON login_activity FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Role change requests policies
CREATE POLICY "Users can view their own role change requests"
    ON role_change_requests FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own role change requests"
    ON role_change_requests FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Jobs table policies
CREATE POLICY "Homeowners can create jobs"
    ON jobs FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND user_type = 'homeowner'
        )
    );

CREATE POLICY "Homeowners can view their own jobs"
    ON jobs FOR SELECT
    USING (
        homeowner_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND user_type = 'professional'
        )
    );

CREATE POLICY "Homeowners can update their own jobs"
    ON jobs FOR UPDATE
    USING (homeowner_id = auth.uid())
    WITH CHECK (homeowner_id = auth.uid());

-- Bids table policies
CREATE POLICY "Professionals can create bids"
    ON bids FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE id = auth.uid()
            AND user_type = 'professional'
        )
    );

CREATE POLICY "Users can view relevant bids"
    ON bids FOR SELECT
    USING (
        professional_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = bids.job_id
            AND jobs.homeowner_id = auth.uid()
        )
    );

CREATE POLICY "Professionals can update their own bids"
    ON bids FOR UPDATE
    USING (professional_id = auth.uid())
    WITH CHECK (professional_id = auth.uid());

-- Reviews table policies
CREATE POLICY "Users can create reviews for completed jobs"
    ON reviews FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM jobs
            WHERE jobs.id = reviews.job_id
            AND jobs.status = 'completed'
            AND (
                jobs.homeowner_id = auth.uid() OR
                EXISTS (
                    SELECT 1 FROM bids
                    WHERE bids.job_id = jobs.id
                    AND bids.professional_id = auth.uid()
                    AND bids.status = 'accepted'
                )
            )
        )
    );

CREATE POLICY "Everyone can view reviews"
    ON reviews FOR SELECT
    USING (true);

-- Messages table policies
CREATE POLICY "Users can send messages"
    ON messages FOR INSERT
    WITH CHECK (sender_id = auth.uid());

CREATE POLICY "Users can view their messages"
    ON messages FOR SELECT
    USING (
        sender_id = auth.uid() OR
        receiver_id = auth.uid()
    );

-- Professionals table policies
CREATE POLICY "Professional profiles are publicly viewable"
    ON professionals FOR SELECT
    USING (true);

CREATE POLICY "Professionals can update their own profile"
    ON professionals FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());
