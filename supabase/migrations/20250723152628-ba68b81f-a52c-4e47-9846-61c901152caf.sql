-- Create user_analytics table for tracking events
CREATE TABLE public.user_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('signup', 'login', 'pageview', 'click', 'session_start', 'session_end')),
  event_details JSONB DEFAULT '{}',
  page_url TEXT,
  device_type TEXT NOT NULL CHECK (device_type IN ('desktop', 'tablet', 'mobile')),
  user_agent TEXT,
  ip_address INET,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for better query performance
CREATE INDEX idx_user_analytics_user_id ON public.user_analytics(user_id);
CREATE INDEX idx_user_analytics_event_type ON public.user_analytics(event_type);
CREATE INDEX idx_user_analytics_created_at ON public.user_analytics(created_at);
CREATE INDEX idx_user_analytics_session_id ON public.user_analytics(session_id);

-- Enable Row Level Security
ALTER TABLE public.user_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for analytics data access
-- Allow all inserts for tracking (anonymous and authenticated)
CREATE POLICY "Allow analytics tracking" 
ON public.user_analytics 
FOR INSERT 
WITH CHECK (true);

-- Allow reading all analytics data (for admin dashboard)
CREATE POLICY "Allow reading analytics" 
ON public.user_analytics 
FOR SELECT 
USING (true);

-- Create active_sessions table for real-time tracking
CREATE TABLE public.active_sessions (
  session_id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  last_activity TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  device_type TEXT NOT NULL,
  page_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for active_sessions
ALTER TABLE public.active_sessions ENABLE ROW LEVEL SECURITY;

-- Policies for active_sessions
CREATE POLICY "Allow session tracking" 
ON public.active_sessions 
FOR ALL 
USING (true);

-- Create function to clean up old sessions (older than 30 minutes)
CREATE OR REPLACE FUNCTION cleanup_inactive_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM public.active_sessions 
  WHERE last_activity < NOW() - INTERVAL '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-cleanup sessions
CREATE OR REPLACE FUNCTION update_session_activity()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Create trigger on analytics table to update active sessions
CREATE TRIGGER update_active_sessions_trigger
  AFTER INSERT ON public.user_analytics
  FOR EACH ROW
  EXECUTE FUNCTION update_session_activity();