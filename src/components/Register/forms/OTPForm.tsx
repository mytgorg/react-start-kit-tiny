import React, { useEffect } from 'react';
import LoadingSpinner from '../../LoadingSpinner';
import { RegisterFormData } from '../types';
import '../styles/form.css';

interface OTPFormProps {
    formData: RegisterFormData;
    isLoading: boolean;
    showErr: boolean;
    errMsg: string;
    handleOTPDigitChange: (index: number, value: string) => void;
    handleOTPKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleInputBlur: () => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    otpInputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>;
    submitRef: React.RefObject<HTMLButtonElement>;
}

const OTPForm: React.FC<OTPFormProps> = ({
    formData,
    isLoading,
    showErr,
    errMsg,
    handleOTPDigitChange,
    handleOTPKeyDown,
    handleInputFocus,
    handleInputBlur,
    handleSubmit,
    otpInputRefs,
    submitRef
}) => {
    const checkOTPValidity = () => {
        const otpDigits = [formData.otp1, formData.otp2, formData.otp3, formData.otp4, formData.otp5];
        return otpDigits.every(digit => digit);
    };

    const handleClick = (e: React.FormEvent) => {
        if (!checkOTPValidity()) {
            e.preventDefault();
            handleSubmit(e); // This will trigger error message display
        }
    };

    const renderErrorMessages = () => {
        if (!showErr || !errMsg) return null;

        const messages = typeof errMsg === 'string' ? errMsg.split('\n') : [String(errMsg)];
        return messages.map((msg, index) => (
            <span key={index} className="register-form__error">{msg}</span>
        ));
    };

    useEffect(() => {
        // Auto focus first input on mount
        const firstInput = otpInputRefs.current[0];
        if (firstInput) {
            firstInput.focus();
        }
    }, []);

    return (
        <form onSubmit={handleSubmit} className="otp-form" aria-label="OTP verification form">
            <h6>Enter the OTP received on your<br /> <span style={{ display: 'block' }}>Telegram App</span></h6>
            <div className="register-form__otp-input" role="group" aria-label="OTP input group">
                {[...Array(5)].map((_, i) => (
                    <input
                        key={i}
                        type="text"
                        name={`otp${i + 1}`}
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={formData[`otp${i + 1}` as keyof RegisterFormData] || ''}
                        onChange={(e) => handleOTPDigitChange(i, e.target.value)}
                        onKeyDown={(e) => handleOTPKeyDown(i, e)}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        ref={(el) => otpInputRefs.current[i] = el}
                        required
                        disabled={isLoading}
                        aria-label={`OTP digit ${i + 1}`}
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        placeholder="•"
                    />
                ))}
            </div>
            {renderErrorMessages()}
            {!isLoading && (
                <button
                    ref={submitRef}
                    type="submit"
                    className={`register-form__submit ${checkOTPValidity() ? '' : 'disabled'}`}
                    onClick={handleClick}
                    disabled={isLoading}
                    aria-busy={isLoading}
                >
                    {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
            )}
            {isLoading && (
                <div className="register-form__loading" role="status" aria-label="Loading">
                    <LoadingSpinner />
                </div>
            )}
        </form>
    );
};

export default OTPForm;