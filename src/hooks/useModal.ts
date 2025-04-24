import { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

export const useModal = (initialState: boolean = false, modalKey: string) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const history = useHistory();
    const location = useLocation();

    // Prevent URL updates during initial mount
    const [isInitialMount, setIsInitialMount] = useState(true);

    useEffect(() => {
        setIsInitialMount(false);
    }, []);

    // Handle closing modal when navigating back
    useEffect(() => {
        const handlePopState = (event: PopStateEvent) => {
            event.preventDefault();
            setIsOpen(false);
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    const closeModal = useCallback(() => {
        setIsOpen(false);
        // Only modify URL if we're not in initial mount
        if (!isInitialMount) {
            const currentParams = new URLSearchParams(location.search);
            currentParams.delete('modal');
            history.replace({
                pathname: location.pathname,
                search: currentParams.toString()
            });
        }
    }, [history, location.pathname, isInitialMount]);

    const openModal = useCallback(() => {
        setIsOpen(true);
        // Only modify URL if we're not in initial mount
        if (!isInitialMount) {
            const currentParams = new URLSearchParams(location.search);
            currentParams.set('modal', modalKey);
            history.push({
                pathname: location.pathname,
                search: currentParams.toString()
            });
        }
    }, [history, location.pathname, modalKey, isInitialMount]);

    return {
        isOpen,
        setIsOpen: (open: boolean) => {
            if (open) {
                openModal();
            } else {
                closeModal();
            }
        },
        closeModal
    };
};