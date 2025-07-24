-- COMPREHENSIVE DATABASE RESET WITH PROPER SECURITY
-- Drop all existing tables and policies, then recreate with secure configurations

-- Drop all existing tables
DROP TABLE IF EXISTS public.user_analytics CASCADE;
DROP TABLE IF EXISTS public.active_sessions CASCADE;  
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.form_submissions CASCADE;

-- Drop existing functions that might reference deleted tables
DROP FUNCTION IF EXISTS public.update_session_activity() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_inactive_sessions() CASCADE;
DROP FUNCTION IF EXISTS public.cleanup_old_analytics() CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

-- Drop and recreate app_role enum
DROP TYPE IF EXISTS public.app_role CASCADE;
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- 1. FORM SUBMISSIONS TABLE (Only table allowing anonymous access)
CREATE TABLE public.form_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS and create secure policies
ALTER TABLE public.form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow anonymous form submissions (ONLY table with anon access)
CREATE POLICY "Allow anonymous form submissions"
ON public.form_submissions
FOR INSERT
TO anon
WITH CHECK (true);

-- Authenticated users can also submit forms
CREATE POLICY "Allow authenticated form submissions"
ON public.form_submissions
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Only authenticated users can read their own submissions
CREATE POLICY "Users can read own submissions"
ON public.form_submissions
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 2. USER PROFILES TABLE (Authenticated only)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Strict authenticated-only policies
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
ON public.profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
ON public.profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile"
ON public.profiles
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- 3. USER ROLES TABLE (Authenticated only)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Users can only view their own roles
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- 4. USER ANALYTICS TABLE (Authenticated only)
CREATE TABLE public.user_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  page_url TEXT,
  device_type TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  event_details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Users can only read their own analytics
CREATE POLICY "Users can read own analytics"
ON public.user_analytics
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Analytics can be inserted by authenticated users only
CREATE POLICY "Users can insert analytics"
ON public.user_analytics
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 5. RECREATE ESSENTIAL FUNCTIONS WITH SECURITY DEFINER

-- Function to check user roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$$;

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Add update trigger to profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$;

-- Create trigger for auto profile creation
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- 6. SECURE STORAGE POLICIES (Remove anonymous access)
-- Drop all existing storage policies
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;  
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create secure storage policies (authenticated only)
CREATE POLICY "Users can view own avatars"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can upload own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);