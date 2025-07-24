-- Phase 1: Fix Critical Database Security Vulnerabilities

-- 1. Fix search path vulnerabilities in existing functions
CREATE OR REPLACE FUNCTION public.cleanup_inactive_sessions()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  DELETE FROM public.active_sessions 
  WHERE last_activity < NOW() - INTERVAL '15 minutes'; -- Reduced from 30 to 15 minutes
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_session_activity()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  -- Update last_activity when session is touched
  UPDATE public.active_sessions 
  SET last_activity = NOW() 
  WHERE session_id = NEW.session_id;
  
  -- If session doesn't exist, create it
  IF NOT FOUND THEN
    INSERT INTO public.active_sessions (session_id, user_id, device_type, page_url)
    VALUES (NEW.session_id, NEW.user_id, NEW.device_type, NEW.page_url)
    ON CONFLICT (session_id) DO UPDATE SET 
      last_activity = NOW(),
      page_url = EXCLUDED.page_url;
  END IF;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  INSERT INTO public.profiles (user_id, display_name)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$function$;

-- 2. Create user roles system for proper access control
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles safely
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to get current user role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS app_role
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
  SELECT role FROM public.user_roles 
  WHERE user_id = auth.uid() 
  LIMIT 1
$$;

-- 3. Fix overly permissive RLS policies

-- Update form_submissions policies
DROP POLICY IF EXISTS "Admin can read all form submissions" ON public.form_submissions;
CREATE POLICY "Admins can read all form submissions" 
ON public.form_submissions 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update user_analytics policies  
DROP POLICY IF EXISTS "Admin can read all analytics" ON public.user_analytics;
CREATE POLICY "Admins can read all analytics" 
ON public.user_analytics 
FOR SELECT 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update active_sessions policies
DROP POLICY IF EXISTS "Allow session tracking" ON public.active_sessions;
CREATE POLICY "Users can manage own sessions" 
ON public.active_sessions 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Allow anonymous session tracking" 
ON public.active_sessions 
FOR INSERT 
TO anon
WITH CHECK (user_id IS NULL);

-- Create policies for user_roles table
CREATE POLICY "Users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles" 
ON public.user_roles 
FOR ALL 
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Add input validation functions
CREATE OR REPLACE FUNCTION public.validate_email(email_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN email_input ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

CREATE OR REPLACE FUNCTION public.validate_phone(phone_input TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  RETURN phone_input ~* '^\+?[1-9]\d{1,14}$';
END;
$$;

-- 5. Add data retention trigger for analytics
CREATE OR REPLACE FUNCTION public.cleanup_old_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  -- Delete analytics data older than 90 days
  DELETE FROM public.user_analytics 
  WHERE created_at < NOW() - INTERVAL '90 days';
  
  -- Delete old sessions
  DELETE FROM public.active_sessions 
  WHERE created_at < NOW() - INTERVAL '7 days';
END;
$$;