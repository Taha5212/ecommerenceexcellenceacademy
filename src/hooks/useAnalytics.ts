import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useLocation } from 'react-router-dom';

type EventType = 'signup' | 'login' | 'pageview' | 'click' | 'session_start' | 'session_end';

interface AnalyticsEvent {
  event_type: EventType;
  event_details?: Record<string, any>;
  page_url?: string;
}

// Generate a unique session ID
const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get device type based on screen width
const getDeviceType = (): 'desktop' | 'tablet' | 'mobile' => {
  if (typeof window === 'undefined') return 'desktop';
  
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

// Get current user ID if authenticated
const getCurrentUserId = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return session?.user?.id || null;
};

export const useAnalytics = () => {
  const location = useLocation();
  const sessionIdRef = useRef<string>(generateSessionId());
  const sessionStartTimeRef = useRef<Date>(new Date());
  const lastActivityRef = useRef<Date>(new Date());

  // Track analytics event
  const trackEvent = useCallback(async (event: AnalyticsEvent) => {
    try {
      const userId = await getCurrentUserId();
      const deviceType = getDeviceType();
      
      await supabase.from('user_analytics').insert({
        user_id: userId,
        session_id: sessionIdRef.current,
        event_type: event.event_type,
        event_details: event.event_details || {},
        page_url: event.page_url || window.location.pathname,
        device_type: deviceType,
        user_agent: navigator.userAgent,
        ip_address: null // Will be handled by server if needed
      });

      lastActivityRef.current = new Date();
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  }, []);

  // Track page view
  const trackPageView = useCallback((page?: string) => {
    trackEvent({
      event_type: 'pageview',
      page_url: page || location.pathname,
      event_details: {
        referrer: document.referrer,
        timestamp: new Date().toISOString()
      }
    });
  }, [location.pathname, trackEvent]);

  // Track button/link clicks
  const trackClick = useCallback((elementId: string, elementText?: string, elementType?: string) => {
    trackEvent({
      event_type: 'click',
      event_details: {
        element_id: elementId,
        element_text: elementText,
        element_type: elementType,
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  // Track user signup
  const trackSignup = useCallback((method?: string) => {
    trackEvent({
      event_type: 'signup',
      event_details: {
        method: method || 'email',
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  // Track user login
  const trackLogin = useCallback((method?: string) => {
    trackEvent({
      event_type: 'login',
      event_details: {
        method: method || 'email',
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  // Track session start
  const trackSessionStart = useCallback(() => {
    sessionStartTimeRef.current = new Date();
    trackEvent({
      event_type: 'session_start',
      event_details: {
        timestamp: sessionStartTimeRef.current.toISOString(),
        device_type: getDeviceType(),
        user_agent: navigator.userAgent
      }
    });
  }, [trackEvent]);

  // Track session end
  const trackSessionEnd = useCallback(() => {
    const sessionDuration = Date.now() - sessionStartTimeRef.current.getTime();
    trackEvent({
      event_type: 'session_end',
      event_details: {
        session_duration_ms: sessionDuration,
        timestamp: new Date().toISOString()
      }
    });
  }, [trackEvent]);

  // Auto-track page views on route changes
  useEffect(() => {
    trackPageView();
  }, [location.pathname, trackPageView]);

  // Track session start on component mount
  useEffect(() => {
    trackSessionStart();

    // Track session end on page unload
    const handleBeforeUnload = () => {
      trackSessionEnd();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      trackSessionEnd();
    };
  }, [trackSessionStart, trackSessionEnd]);

  return {
    trackEvent,
    trackPageView,
    trackClick,
    trackSignup,
    trackLogin,
    trackSessionStart,
    trackSessionEnd
  };
};