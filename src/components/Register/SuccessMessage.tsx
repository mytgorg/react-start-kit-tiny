import React from 'react';
import { Link } from 'react-router-dom';
import { useCountdownTimer } from '../../hooks/useCountdownTimer';
import tickImage from '../../assets/images/tick2.png';
import { HomeIcon } from '../../assets/icons';
import './styles/success-message.css';

interface SuccessMessageProps {
    message?: string;
}

const SuccessMessage: React.FC<SuccessMessageProps> = ({ 
    message = 'We will contact you soon'
}) => {
    const seconds = useCountdownTimer(5);

    return (
        <div 
            className="success-message__content"
            role="alert"
            aria-live="polite"
        >
            <img src={tickImage} alt="Success tick mark" className="tick" />
            <h1>Application has been submitted</h1>
            <p>{message}</p>
            <Link 
                to="/" 
                className="home-link"
                aria-label={`Return to home page. Redirecting in ${seconds} seconds`}
            >
                <HomeIcon aria-hidden="true" />
                <span>Redirecting to home in {seconds}s</span>
            </Link>
        </div>
    );
};

export default SuccessMessage;