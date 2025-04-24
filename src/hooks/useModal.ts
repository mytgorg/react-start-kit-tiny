
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const useModal = (initialState: boolean = false, modalKey: string) => {
    const [isOpen, setIsOpen] = useState(initialState);
    const navigate = useNavigate();
    const location = useLocation();
    const [isInitialMount, setIsInitialMount] = useState(true);

    useEffect(() => {
        setIsInitialMount(false);
    }, []);

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
        if (!isInitialMount) {
            const currentParams = new URLSearchParams(location.search);
            currentParams.delete('modal');
            navigate({
                pathname: location.pathname,
                search: currentParams.toString()
            }, { replace: true });
        }
    }, [navigate, location.pathname, isInitialMount]);

    const openModal = useCallback(() => {
        setIsOpen(true);
        if (!isInitialMount) {
            const currentParams = new URLSearchParams(location.search);
            currentParams.set('modal', modalKey);
            navigate({
                pathname: location.pathname,
                search: currentParams.toString()
            });
        }
    }, [navigate, location.pathname, modalKey, isInitialMount]);

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
