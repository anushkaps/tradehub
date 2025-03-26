-- Enable Row Level Security on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.phone_otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own data" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

-- Jobs table policies
CREATE POLICY "Homeowners can create jobs" 
ON public.jobs 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = homeowner_id);

CREATE POLICY "Homeowners can update their own jobs" 
ON public.jobs 
FOR UPDATE 
USING (auth.uid() = homeowner_id);

CREATE POLICY "Everyone can view jobs" 
ON public.jobs 
FOR SELECT 
TO authenticated 
USING (true);

-- Reviews table policies
CREATE POLICY "Homeowners can create reviews for completed jobs" 
ON public.reviews 
FOR INSERT 
TO authenticated 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = reviews.job_id
    AND jobs.homeowner_id = auth.uid()
    AND jobs.status = 'closed'
  )
);

CREATE POLICY "Everyone can view approved reviews" 
ON public.reviews 
FOR SELECT 
TO authenticated 
USING (approved_by_admin = true);

-- Bids table policies
CREATE POLICY "Professionals can create bids" 
ON public.bids 
FOR INSERT 
TO authenticated 
WITH CHECK (
  auth.uid() = professional_id
  AND EXISTS (
    SELECT 1 FROM public.users
    WHERE users.id = auth.uid()
    AND users.user_type = 'professional'
  )
);

CREATE POLICY "Professionals can update their own bids" 
ON public.bids 
FOR UPDATE 
USING (auth.uid() = professional_id);

CREATE POLICY "Homeowners can view bids on their jobs" 
ON public.bids 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM public.jobs
    WHERE jobs.id = bids.job_id
    AND jobs.homeowner_id = auth.uid()
  )
);

-- Messages table policies
CREATE POLICY "Users can insert messages they send" 
ON public.messages 
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = sender_id);

CREATE POLICY "Users can view messages they sent or received" 
ON public.messages 
FOR SELECT 
TO authenticated 
USING (auth.uid() = sender_id OR auth.uid() = recipient_id);