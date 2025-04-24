
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogoIcon } from '../../../assets/icons';
import './Header.css';

const Header: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isBaseRoute = !location.pathname.split('/')[1] || ['login', 'register', 'free-demo'].includes(location.pathname.split('/')[1]);

    const handleLogoClick = () => {
        if (isBaseRoute) {
            navigate('/');
        } else {
            const user = location.pathname.split('/')[1];
            navigate(`/${user}`);
        }
    };

    return (
        <header className="header">
            <div className="header__container" onClick={handleLogoClick}>
                <LogoIcon className="header__logo" />
                <h6 className="header__service-name">
                    WebCam Services
                </h6>
            </div>
        </header>
    );
};

export default Header;
