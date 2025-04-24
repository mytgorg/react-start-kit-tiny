import { FormStep, FORM_STEPS } from '../types';

export const useStepProgress = (activeForm: FormStep) => {
    const getStepState = (step: FormStep) => {
        const steps = [FORM_STEPS.phoneNumber, FORM_STEPS.otp, FORM_STEPS.twofactor];
        const currentIndex = steps.indexOf(activeForm);
        const stepIndex = steps.indexOf(step);

        if (stepIndex === currentIndex) return 'active';
        if (stepIndex < currentIndex) return 'completed';
        return 'pending';
    };

    return { getStepState };
};