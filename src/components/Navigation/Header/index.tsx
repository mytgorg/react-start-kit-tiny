
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { LogoIcon } from '../../../assets/icons';
import './Header.css';

const Header: React.FC = () => {
    const navigate = useHistory();
    const location = useLocation();
    const isBaseRoute = !location.pathname.split('/')[1] || ['login', 'register', 'free-demo'].includes(location.pathname.split('/')[1]);

    const handleLogoClick = () => {
        if (isBaseRoute) {
            navigate.push('/');
        } else {
            const user = location.pathname.split('/')[1];
            navigate.push(`/${user}`);
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
