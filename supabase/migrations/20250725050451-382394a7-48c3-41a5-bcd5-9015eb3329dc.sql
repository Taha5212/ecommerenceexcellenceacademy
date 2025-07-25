-- Enable RLS on all tables if not already enabled
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can read own submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Allow anon form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Allow auth form submissions" ON public.form_submissions;
DROP POLICY IF EXISTS "Users can view their own submissions" ON public.form_submissions;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can read own analytics" ON public.user_analytics;
DROP POLICY IF EXISTS "Users can insert analytics" ON public.user_analytics;

DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;

-- Storage policies
DROP POLICY IF EXISTS "Users can view own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own avatars" ON storage.objects;
DROP POLICY IF EXISTS "Allow public read access to avatars bucket" ON storage.objects;

-- Create new secure policies for form_submissions
CREATE POLICY "Allow insert by anyone" ON public.form_submissions
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can read their own submissions" ON public.form_submissions
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create policies for profiles (authenticated users only)
CREATE POLICY "Users can view own profile" ON public.profiles
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" ON public.profiles
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Create policies for user_analytics (authenticated users only)
CREATE POLICY "Users can read own analytics" ON public.user_analytics
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics" ON public.user_analytics
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create policies for user_roles (authenticated users only)
CREATE POLICY "Users can view own roles" ON public.user_roles
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Create secure storage policies (authenticated users only)
CREATE POLICY "Users can view own avatars" ON storage.objects
FOR SELECT 
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can insert own avatars" ON storage.objects
FOR INSERT 
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatars" ON storage.objects
FOR UPDATE 
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatars" ON storage.objects
FOR DELETE 
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);