-- Fix RLS policies for form_submissions table
-- First, drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Allow form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Users can read own form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Admins can read all form submissions" ON public.form_submissions;

-- Recreate policies with correct permissions
-- Allow anonymous users to insert form submissions
CREATE POLICY "Allow public form submissions" 
ON public.form_submissions 
FOR INSERT 
TO public, anon, authenticated
WITH CHECK (true);

-- Allow users to read their own submissions
CREATE POLICY "Users can read own form submissions" 
ON public.form_submissions 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow admins to read all submissions
CREATE POLICY "Admins can read all form submissions" 
ON public.form_submissions 
FOR SELECT 
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

-- Ensure RLS is enabled
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;