import React from 'react';
import LoadingSpinner from '../../LoadingSpinner';
import { countryCodes } from '../../../constants/countryCodes';
import { RegisterFormData } from '../types';
import '../styles/form.css';
import { vibrateSuccess, vibrateError } from '../../../utils/haptics';

interface PhoneNumberFormProps {
    formData: RegisterFormData;
    isLoading: boolean;
    showErr: boolean;
    errMsg: string;
    isInputFocused: boolean;
    others?: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleInputBlur: () => void;
    handlePhoneKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    handleCountryCodeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    getInputContainerClass: (fieldName: string) => string;
    isFormValid: () => boolean;
    inputRef: React.RefObject<HTMLInputElement>;
}

const PhoneNumberForm: React.FC<PhoneNumberFormProps> = ({
    formData,
    isLoading,
    showErr,
    errMsg,
    isInputFocused,
    others,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handlePhoneKeyDown,
    handleCountryCodeChange,
    handleSubmit,
    getInputContainerClass,
    isFormValid,
    inputRef
}) => {
    const handleClick = (e: React.FormEvent) => {
        if (!isFormValid()) {
            e.preventDefault();
            handleSubmit(e); // This will trigger validation and show errors
        }
    };

    const renderErrorMessages = () => {
        if (!showErr || !errMsg) return null;
        
        const messages = typeof errMsg === 'string' ? errMsg.split('\n') : [String(errMsg)];
        return messages.map((msg, index) => (
            <span key={index} className="register-form__error">{msg}</span>
        ));
    };

    return (
        <form 
            className="register-form__phone" 
            onSubmit={(e) => {
                if (!isFormValid()) {
                    vibrateError();
                }
                handleSubmit(e);
            }}
        >
            {others && (
                <div className="register-form__name-fields">
                    <div className={getInputContainerClass('firstName')}>
                        <input
                            type="text"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            placeholder="First Name"
                            autoComplete="given-name"
                            disabled={isLoading}
                        />
                    </div>
                    <div className={getInputContainerClass('lastName')}>
                        <input
                            type="text"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            onBlur={handleInputBlur}
                            placeholder="Last Name"
                            autoComplete="family-name"
                            disabled={isLoading}
                        />
                    </div>
                </div>
            )}
            <div className="register-form__country-code">
                <select
                    name="phoneCountryCode"
                    value={formData.phoneCountryCode}
                    onChange={(e) => {
                        vibrateSuccess();
                        handleCountryCodeChange(e);
                    }}
                    className={isInputFocused ? 'focused' : ''}
                    disabled={isLoading}
                >
                    {countryCodes.map(code => (
                        <option key={code.value} value={code.value}>
                            {code.value} ({code.label})
                        </option>
                    ))}
                </select>
            </div>
            <div className="register-form__phone-input">
                <div className={getInputContainerClass('phoneNumber')}>
                    <input
                        ref={inputRef}
                        type="tel"
                        inputMode="numeric"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleInputChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        onKeyDown={handlePhoneKeyDown}
                        placeholder="Phone Number"
                        autoComplete="tel"
                        required
                        disabled={isLoading}
                    />
                </div>
            </div>
            {renderErrorMessages()}
            {!isLoading && (
                <button
                    type="submit"
                    className={`register-form__submit ${isFormValid() ? '' : 'disabled'}`}
                    onClick={handleClick}
                    disabled={isLoading}
                >
                    Send OTP
                </button>
            )}
            {isLoading && (
                <div className="register-form__loading">
                    <LoadingSpinner />
                </div>
            )}
        </form>
    );
};

export default PhoneNumberForm;
