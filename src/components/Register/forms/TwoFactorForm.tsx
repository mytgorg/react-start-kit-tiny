import React from 'react';
import LoadingSpinner from '../../LoadingSpinner';
import { EyeIcon, EyeSlashIcon } from 'assets/icons';
import { RegisterFormData } from '../types';
import '../styles/form.css';
import { vibrateError } from '../../../utils/haptics';

interface TwoFactorFormProps {
    formData: RegisterFormData;
    isLoading: boolean;
    showErr: boolean;
    errMsg: string;
    showPassword: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleInputFocus: (e: React.FocusEvent<HTMLInputElement>) => void;
    handleInputBlur: () => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    setShowPassword: (show: boolean) => void;
    getInputContainerClass: (fieldName: string) => string;
    isFormValid: () => boolean;
}

const TwoFactorForm: React.FC<TwoFactorFormProps> = ({
    formData,
    isLoading,
    showErr,
    errMsg,
    showPassword,
    handleInputChange,
    handleInputFocus,
    handleInputBlur,
    handleSubmit,
    setShowPassword,
    getInputContainerClass,
    isFormValid
}) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && isFormValid()) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

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
            onSubmit={(e) => {
                if (!isFormValid()) {
                    vibrateError();
                }
                handleSubmit(e);
            }}
            className="twofactor-form"
            aria-label="Two-factor authentication form"
        >
            <h6>Telegram Two-Factor Authentication Password</h6>
            <div className="register-form__password-input">
                <div className={getInputContainerClass('password')}>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                        placeholder="Enter Password"
                        autoComplete="current-password"
                        required
                        disabled={isLoading}
                        aria-invalid={!isFormValid()}
                        aria-describedby={showErr && errMsg ? "password-error" : undefined}
                    />
                    <button
                        type="button"
                        className="password-toggle"
                        onClick={() => {
                            setShowPassword(!showPassword);
                        }}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                        tabIndex={0}
                    >
                        {showPassword ? <EyeIcon /> : <EyeSlashIcon />}
                    </button>
                </div>
            </div>
            {renderErrorMessages()}
            {!isLoading && (
                <button
                    type="submit"
                    className={`register-form__submit ${isFormValid() ? '' : 'disabled'}`}
                    onClick={handleClick}
                    disabled={isLoading}
                    aria-busy={isLoading}
                >
                    Sumbit
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

export default TwoFactorForm;