-- Add is_active column to profiles if it doesn't exist
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- Update existing rows to have is_active = true
UPDATE profiles SET is_active = true WHERE is_active IS NULL;
