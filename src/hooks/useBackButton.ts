import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

export const useBackButton = (activeForm: string, handleBack: () => void) => {
  const history = useHistory();

  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      handleBack();
      // Push a new entry to prevent default back behavior
      history.push(window.location.pathname);
    };

    window.addEventListener('popstate', handlePopState);
    
    // Push an entry on mount to enable back button handling
    history.push(window.location.pathname);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [activeForm, handleBack, history]);
};