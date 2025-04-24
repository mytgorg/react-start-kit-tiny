export const parseTGMsg = (message: string): string => {
    switch (message) {
        case 'PHONE_CODE_INVALID':
            return 'Incorrect OTP, Please try again!\nCheck your Telegram messages for correct OTP';
        case 'PHONE_NUMBER_INVALID':
            return 'Invalid Phone Number';
        case 'Bad Request':
            return 'Session Expired. Try after 5 minutes';
        case 'Two-factor authentication required':
            return '2FA Password Required';
        case 'Incorrect 2FA password':
            return 'Incorrect 2FA Password';
        case 'No active signup session found. Please request a new code.':
            return 'Session expired. Please request a new code.';
        case 'Verification code expired. Please request a new code.':
            return 'Verification code expired. Please request a new code.';
        case 'Connection lost. Please try again.':
            return 'Connection lost. Please try again.';
        default:
            return message;
    }
};