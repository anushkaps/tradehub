-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create login_activity table
CREATE TABLE IF NOT EXISTS login_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL,
    ip_address TEXT,
    user_agent TEXT,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE login_activity ENABLE ROW LEVEL SECURITY;

-- Create role_change_requests table
CREATE TABLE IF NOT EXISTS role_change_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    from_role TEXT NOT NULL,
    requested_role TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    admin_id UUID REFERENCES auth.users(id),
    request_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    processed_date TIMESTAMP WITH TIME ZONE,
    reason TEXT,
    CONSTRAINT valid_roles CHECK (
        from_role IN ('homeowner', 'professional') AND
        requested_role IN ('homeowner', 'professional')
    )
);

ALTER TABLE role_change_requests ENABLE ROW LEVEL SECURITY;

-- Create trigger to prevent direct role changes
CREATE OR REPLACE FUNCTION prevent_role_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.user_type IS NOT NULL AND NEW.user_type != OLD.user_type THEN
        RAISE EXCEPTION 'Direct role changes are not allowed. Please use the role change request system.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS prevent_role_change_trigger ON profiles;
CREATE TRIGGER prevent_role_change_trigger
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION prevent_role_change();

-- Create function to check email uniqueness across roles
CREATE OR REPLACE FUNCTION check_email_uniqueness()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM profiles 
        WHERE email = NEW.email 
        AND id != NEW.id
    ) THEN
        RAISE EXCEPTION 'Email already exists in the system';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS email_uniqueness_trigger ON profiles;
CREATE TRIGGER email_uniqueness_trigger
    BEFORE INSERT OR UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION check_email_uniqueness();
