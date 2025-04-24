
import { useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const useBackButton = (activeForm: string, handleBack: () => void) => {
  const navigate = useHistory();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      handleBack();
      // Push a new entry to prevent default back behavior
      navigate.push(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Push an entry on mount to enable back button handling
    navigate.push(window.location.pathname, { replace: true });

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeForm, handleBack, navigate]);
};
