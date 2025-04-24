
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useCountdownTimer = (initialSeconds: number = 10) => {
    const [seconds, setSeconds] = useState(initialSeconds);
    const navigate = useNavigate();

    useEffect(() => {
        if (seconds > 0) {
            const timer = setInterval(() => {
                setSeconds((prev) => prev - 1);
            }, 1000);

            return () => clearInterval(timer);
        } else {
            navigate('/');
        }
    }, [seconds, navigate]);

    return seconds;
};
