-- Fix anonymous access policies - restrict to only necessary public access
-- Keep form_submissions public insert for contact forms
-- Keep user_analytics public insert for tracking
-- Keep active_sessions public insert for anonymous tracking

-- Fix profiles policies to remove unnecessary public access
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can delete their own profile" ON public.profiles;

-- Recreate profiles policies with authenticated only
CREATE POLICY "Authenticated users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can update their own profile" 
ON public.profiles 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Authenticated users can insert their own profile" 
ON public.profiles 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can delete their own profile" 
ON public.profiles 
FOR DELETE 
TO authenticated
USING (auth.uid() = user_id);

-- Fix user_roles policies
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;
CREATE POLICY "Authenticated users can view their own roles" 
ON public.user_roles 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Fix active_sessions policies for authenticated users
DROP POLICY IF EXISTS "Users can manage own sessions" ON public.active_sessions;
CREATE POLICY "Authenticated users can manage own sessions" 
ON public.active_sessions 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id);

-- Ensure proper analytics policy for authenticated users only
DROP POLICY IF EXISTS "Users can read own analytics" ON public.user_analytics;
CREATE POLICY "Authenticated users can read own analytics" 
ON public.user_analytics 
FOR SELECT 
TO authenticated
USING ((auth.uid() = user_id) OR (user_id IS NULL));