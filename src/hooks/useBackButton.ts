
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useBackButton = (activeForm: string, handleBack: () => void) => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      handleBack();
      // Push a new entry to prevent default back behavior
      navigate(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Push an entry on mount to enable back button handling
    navigate(window.location.pathname, { replace: true });

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeForm, handleBack, navigate]);
};
