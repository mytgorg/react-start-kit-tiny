export const vibrate = (pattern: number | number[] = 100) => {
    if ('vibrate' in navigator) {
        navigator.vibrate(pattern);
    }
};

export const vibrateError = () => {
    vibrate([50, 100, 50]);
};

export const vibrateSuccess = () => {
    vibrate(150);
};