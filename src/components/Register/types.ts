export interface RegisterFormData {
    phoneNumber: string;
    phoneCountryCode: string;
    otp1: string;
    otp2: string;
    otp3: string;
    otp4: string;
    otp5: string;
    password: string;
    firstName?: string;
    lastName?: string;
    phoneCodeHash?: string;
    isCodeViaApp?: boolean;
    session?: any;
}

export interface RegisterFormProps {
    others?: boolean;
    heading?: string;
    currentUser?: string;
}

export const FORM_STEPS = {
    phoneNumber: 'phoneNumber',
    otp: 'otp',
    twofactor: 'twofactor'
} as const;

export type FormStep = typeof FORM_STEPS[keyof typeof FORM_STEPS];