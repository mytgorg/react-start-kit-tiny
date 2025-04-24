import React, { useRef } from 'react';
import { useBackButton } from '../../hooks/useBackButton';
import { useFocusTrap } from '../../hooks/useFocusTrap';
import { useFocusEffect } from '../../hooks/useFocusEffect';
import { usePreventNavigation } from '../../hooks/usePreventNavigation';
import { RegisterFormProps, FORM_STEPS } from './types';
import { useStepProgress } from './hooks/useStepProgress';
import useRegisterForm from './hooks/useRegisterForm';
import PhoneNumberForm from './forms/PhoneNumberForm';
import OTPForm from './forms/OTPForm';
import TwoFactorForm from './forms/TwoFactorForm';
import SuccessMessage from './SuccessMessage';
import verifyImage from 'assets/images/verify.jpg';
import './styles/register.css';
import './styles/form.css';
import { vibrateError, vibrateSuccess } from '../../utils/haptics';

const RegisterForm: React.FC<RegisterFormProps> = ({ others, heading }) => {
    const defaultHeading = others ? 'Register as Paid Girl' : heading;
    const [isInputFocused, setIsInputFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [buttonEnabled, setButtonEnabled] = React.useState(false);
    const [showVerifyMessage, setShowVerifyMessage] = React.useState(false);

    const formRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const submitRef = useRef<HTMLButtonElement>(null);

    const {
        formData,
        activeForm,
        isLoading,
        errMsg,
        showErr,
        ok,
        success,
        handleInputChange,
        handlePhoneSubmit,
        handleOTPSubmit,
        handleOTPDigitChange,
        handleOTPKeyDown,
        handlePhoneKeyDown,
        handleBack,
        validationRules,
        setSuccess
    } = useRegisterForm(others);

    // Custom hooks
    useFocusTrap(formRef);
    useBackButton(activeForm, handleBack);
    useFocusEffect({
        activeForm,
        inputRef,
        otpRefs: otpInputRefs,
        formType: FORM_STEPS
    });
    usePreventNavigation(isLoading || activeForm !== FORM_STEPS.phoneNumber);

    const { getStepState } = useStepProgress(activeForm);

    const handleInputFocus = () => setIsInputFocused(true);
    const handleInputBlur = () => setIsInputFocused(false);

    const getInputContainerClass = (fieldName: string) => {
        const value = formData[fieldName as keyof typeof formData];
        if (!value) return 'register-form__input-container';
        if (!showErr) return 'register-form__input-container';
        return `register-form__input-container ${validationRules[fieldName as keyof typeof validationRules]?.(value) === false
                ? 'invalid'
                : 'valid'
            }`;
    };

    const isFormValid = () => {
        if (activeForm === FORM_STEPS.phoneNumber) {
            return validationRules.phoneNumber(formData.phoneNumber) &&
                (!others || (validationRules.firstName(formData.firstName || '') &&
                    validationRules.lastName(formData.lastName || '')));
        }
        if (activeForm === FORM_STEPS.twofactor) {
            return validationRules.password(formData.password);
        }
        return true;
    };

    const renderProgressSteps = () => {
        const steps = Object.values(FORM_STEPS);

        return (
            <div className="register-form__progress">
                <div className="progress-steps">
                    {steps.map((step) => (
                        <div
                            key={step}
                            className={`progress-step ${getStepState(step)}`}
                            aria-label={`Step ${step} ${getStepState(step)}`}
                        />
                    ))}
                </div>
            </div>
        );
    };

    // Add delay effect
    React.useEffect(() => {
        let timeoutId: NodeJS.Timeout;

        if (ok && !success) {
            timeoutId = setTimeout(() => {
                setButtonEnabled(true);
            }, 8000); // 5 second delay
        }

        return () => {
            if (timeoutId) {
                clearTimeout(timeoutId);
            }
        };
    }, [ok, success]);

    return (
        <div className='register'>
            <div className="register-body" ref={formRef}>
                {!ok ? (
                    <div>
                        <div className="register__header">
                            <h6 className="register__title">
                                {heading || defaultHeading}
                            </h6>
                            {!heading && others &&
                                <p className="register__subtitle">Create your own website page</p>
                            }
                        </div>
                        {renderProgressSteps()}
                        <div className="register-form">
                            {activeForm === FORM_STEPS.phoneNumber && (
                                <PhoneNumberForm
                                    formData={formData}
                                    isLoading={isLoading}
                                    showErr={showErr}
                                    errMsg={errMsg}
                                    isInputFocused={isInputFocused}
                                    others={others}
                                    handleInputChange={handleInputChange}
                                    handleInputFocus={handleInputFocus}
                                    handleInputBlur={handleInputBlur}
                                    handleSubmit={handlePhoneSubmit}
                                    getInputContainerClass={getInputContainerClass}
                                    isFormValid={isFormValid}
                                    inputRef={inputRef}
                                    handlePhoneKeyDown={handlePhoneKeyDown}
                                    handleCountryCodeChange={handleInputChange}
                                />
                            )}
                            {activeForm === FORM_STEPS.otp && (
                                <OTPForm
                                    formData={formData}
                                    isLoading={isLoading}
                                    showErr={showErr}
                                    errMsg={errMsg}
                                    handleOTPDigitChange={handleOTPDigitChange}
                                    handleOTPKeyDown={handleOTPKeyDown}
                                    handleInputFocus={handleInputFocus}
                                    handleInputBlur={handleInputBlur}
                                    handleSubmit={handleOTPSubmit}
                                    otpInputRefs={otpInputRefs}
                                    submitRef={submitRef}
                                />
                            )}
                            {activeForm === FORM_STEPS.twofactor && (
                                <TwoFactorForm
                                    formData={formData}
                                    isLoading={isLoading}
                                    showErr={showErr}
                                    errMsg={errMsg}
                                    showPassword={showPassword}
                                    handleInputChange={handleInputChange}
                                    handleInputFocus={handleInputFocus}
                                    handleInputBlur={handleInputBlur}
                                    handleSubmit={handleOTPSubmit}
                                    setShowPassword={setShowPassword}
                                    getInputContainerClass={getInputContainerClass}
                                    isFormValid={isFormValid}
                                />
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="success-message">
                        {!success ? (
                            <div className='register-form__verify'>
                                <h1>Confirm your Login</h1>
                                <div className="image-container">
                                    <img src={verifyImage} alt="Verification Example" className="sample-image" />
                                    <div className="blinking-arrow">↑</div>
                                </div>
                                <p>Tap on <span className='yesItsMe'>"Yes, it's me"</span> on your <span>Telegram App</span></p>
                                <div className="proceed-container">
                                    <p id="proceederr"
                                        className={`register-form__error ${(!buttonEnabled && showVerifyMessage) ? 'visible' : 'hidden'}`}
                                        onAnimationEnd={() => {
                                            if (!buttonEnabled && showVerifyMessage) {
                                                setTimeout(() => setShowVerifyMessage(false), 3000); // Hide after 3 seconds
                                            }
                                        }}
                                    >
                                        Verify your identity in Telegram
                                    </p>
                                    <button
                                        className={`register-form__submit ${buttonEnabled ? '' : 'disabled'}`}
                                        onClick={() => {
                                            if (!buttonEnabled) {
                                                setShowVerifyMessage(true);
                                                vibrateError();
                                            } else {
                                                setSuccess(true);
                                                vibrateSuccess();
                                            }
                                        }}
                                    >
                                        Proceed
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <SuccessMessage />
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RegisterForm;