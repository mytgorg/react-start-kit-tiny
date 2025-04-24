import { useEffect } from 'react';

export const usePreventNavigation = (shouldPrevent: boolean) => {
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (shouldPrevent) {
                e.preventDefault();
                e.returnValue = '';
            }
        };

        const handlePopState = (e: PopStateEvent) => {
            if (shouldPrevent) {
                e.preventDefault();
                window.history.pushState(null, '', window.location.pathname);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        window.addEventListener('popstate', handlePopState);

        // Push a new entry to handle back button
        window.history.pushState(null, '', window.location.pathname);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [shouldPrevent]);
};