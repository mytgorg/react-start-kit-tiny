import { useEffect } from 'react';

interface UseFocusEffectProps {
    activeForm: string;
    inputRef: React.RefObject<HTMLInputElement>;
    otpRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    formType: {
        phoneNumber: string;
        otp: string;
        twofactor: string;
    };
}

export const useFocusEffect = ({
    activeForm,
    inputRef,
    otpRefs,
    formType
}: UseFocusEffectProps) => {
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden) {
                // Refocus on the appropriate input when returning to the tab
                setTimeout(() => {
                    if (activeForm === formType.phoneNumber && inputRef.current) {
                        inputRef.current.focus();
                        // Trigger mobile keyboard
                        inputRef.current.click();
                    } else if (activeForm === formType.otp && otpRefs.current[0]) {
                        otpRefs.current[0].focus();
                        // Trigger mobile keyboard
                        otpRefs.current[0].click();
                    } else if (activeForm === formType.twofactor) {
                        const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement;
                        if (passwordInput) {
                            passwordInput.focus();
                            // Trigger mobile keyboard
                            passwordInput.click();
                        }
                    }
                }, 100); // Small delay to ensure DOM is ready
            }
        };

        // Initial focus
        handleVisibilityChange();

        // Handle tab visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);
        
        // Handle mobile app switching
        window.addEventListener('focus', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('focus', handleVisibilityChange);
        };
    }, [activeForm, inputRef, otpRefs, formType]);
};