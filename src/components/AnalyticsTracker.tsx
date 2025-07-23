import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';

// Global click tracking component
export const AnalyticsTracker = () => {
  const { trackClick } = useAnalytics();

  useEffect(() => {
    // Add global click listener for automatic tracking
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Skip if target is null or not an element
      if (!target || !target.tagName) return;

      // Track clicks on buttons, links, and other interactive elements
      const isTrackable = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.getAttribute('role') === 'button' ||
        target.classList.contains('trackable') ||
        target.closest('button') ||
        target.closest('a');

      if (isTrackable) {
        const elementId = target.id || target.className || 'unknown';
        const elementText = target.textContent?.trim() || '';
        const elementType = target.tagName.toLowerCase();
        
        trackClick(elementId, elementText, elementType);
      }
    };

    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [trackClick]);

  return null; // This component doesn't render anything
};