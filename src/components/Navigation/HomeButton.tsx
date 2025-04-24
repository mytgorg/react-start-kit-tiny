
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeIcon } from '../../assets/icons';
import './HomeButton.css';

const HomeButton: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const pathSegments = location.pathname.split('/');
    const isBaseRoute = !pathSegments[1] || ['login', 'register', 'free-demo'].includes(pathSegments[1]);
    const isHome = pathSegments.length <= 2;

    if (isHome) return null;

    const handleClick = () => {
        if (isBaseRoute) {
            navigate('/');
        } else {
            const user = pathSegments[1];
            navigate(`/${user}`);
        }
    };

    return (
        <button onClick={handleClick} className="home-button" aria-label="Go to home">
            <HomeIcon />
        </button>
    );
};

export default HomeButton;
