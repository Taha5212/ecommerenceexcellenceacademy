-- Fix form submissions policy to allow all public submissions
DROP POLICY IF EXISTS "Allow public form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Users can read own form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Admins can read all form submissions" ON public.form_submissions;

-- Create a simple policy that allows anyone to submit forms
CREATE POLICY "Public can submit forms" 
ON public.form_submissions 
FOR INSERT 
WITH CHECK (true);

-- Allow authenticated users to read their own submissions
CREATE POLICY "Users can read own submissions" 
ON public.form_submissions 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow admins to read all submissions
CREATE POLICY "Admins can read all submissions" 
ON public.form_submissions 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure RLS is enabled
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;