import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link, useParams } from 'react-router-dom';
import './SideBar.css';

const SideBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useParams<{ user?: string }>();

    const menuItems = [
        { path: '/', label: 'Home' },
        { path: '/free-demo', label: 'Free Demo' },
        { path: '/login', label: 'Login as Paid Girl' },
        { path: '/register', label: 'Register as Paid Girl' }
    ];

    return (
        <div onClick={() => setIsOpen(!isOpen)}>
            <Menu 
                width="250px" 
                isOpen={isOpen} 
                onOpen={() => setIsOpen(true)} 
                onClose={() => setIsOpen(false)}
            >
                {menuItems.map(item => (
                    <Link 
                        key={item.path}
                        className="menu-item" 
                        to={user ? `/${user}${item.path}` : item.path}
                    >
                        {item.label}
                    </Link>
                ))}
                <Link 
                        to="/report"
                        className="menu-item menu-item--report"
                        onClick={(e) => {
                            e.preventDefault();
                            fetch(`https://uptimechecker2.glitch.me/sendtochannel?chatId=-1001823103248&msg=${encodeURIComponent(`Profile Report Button clicked:${user || 'base-route'}`)}`);
                            window.open('https://report-upi.netlify.app', '_blank');
                            setIsOpen(false);
                        }}
                    >
                        {/* <span role="img" aria-label="warning">⚠️</span> */}
                        Report Scam
                    </Link>
            </Menu>
        </div>
    );
};

export default SideBar;