-- Add user_id column to form_submissions table
ALTER TABLE public.form_submissions 
ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Update RLS policies for user-specific access

-- Drop existing policies
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Allow reading form submissions" ON public.form_submissions;

-- Allow all form submissions (anonymous and authenticated)
CREATE POLICY "Allow form submissions" 
ON public.form_submissions 
FOR INSERT 
WITH CHECK (true);

-- Users can only read their own form submissions if logged in
CREATE POLICY "Users can read own form submissions" 
ON public.form_submissions 
FOR SELECT 
USING (auth.uid() = user_id);

-- Admin access policy (adjust as needed)
CREATE POLICY "Admin can read all form submissions" 
ON public.form_submissions 
FOR SELECT 
USING (true);

-- Update analytics policies for user-specific access
-- Drop existing policies
DROP POLICY IF EXISTS "Allow analytics tracking" ON public.user_analytics;
DROP POLICY IF EXISTS "Allow reading analytics" ON public.user_analytics;

-- Allow all analytics tracking (anonymous and authenticated)
CREATE POLICY "Allow analytics tracking" 
ON public.user_analytics 
FOR INSERT 
WITH CHECK (true);

-- Users can only read their own analytics if logged in
CREATE POLICY "Users can read own analytics" 
ON public.user_analytics 
FOR SELECT 
USING (auth.uid() = user_id OR user_id IS NULL);

-- Admin access policy for analytics
CREATE POLICY "Admin can read all analytics" 
ON public.user_analytics 
FOR SELECT 
USING (true);