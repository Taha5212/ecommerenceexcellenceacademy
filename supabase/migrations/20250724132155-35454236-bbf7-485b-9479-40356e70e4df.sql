-- Fix RLS policies for form_submissions to allow anonymous inserts
DROP POLICY IF EXISTS "Allow anonymous form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Allow authenticated form submissions" ON public.form_submissions;

-- Create proper policy for anonymous form submissions
CREATE POLICY "Allow anon form submissions" 
ON public.form_submissions 
FOR INSERT 
TO anon
WITH CHECK (true);

-- Allow authenticated users to insert and view their own submissions
CREATE POLICY "Allow auth form submissions" 
ON public.form_submissions 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own submissions" 
ON public.form_submissions 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Ensure profiles table has proper policies for auth users
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);