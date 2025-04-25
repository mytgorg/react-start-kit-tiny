
import React, { useState } from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link, useParams } from 'react-router-dom';
import { Home, UserPlus, LogIn, AlertTriangle, Menu as MenuIcon } from 'lucide-react';

const SideBar: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useParams<{ user?: string }>();

    const menuItems = [
        { path: '/', label: 'Home', icon: Home },
        { path: '/free-demo', label: 'Free Demo', icon: LogIn },
        { path: '/login', label: 'Login as Paid Girl', icon: LogIn },
        { path: '/register', label: 'Register as Paid Girl', icon: UserPlus }
    ];

    const burgerStyles = {
        bmBurgerButton: {
            position: 'fixed',
            width: '36px',
            height: '36px',
            left: '24px',
            top: '24px',
            zIndex: 1000,
        },
        bmBurgerBars: {
            background: '#ffffff',
            height: '2px',
            borderRadius: '2px',
        },
        bmMenuWrap: {
            position: 'fixed',
            height: '100%',
            width: '280px',
        },
        bmMenu: {
            background: 'linear-gradient(to bottom right, rgb(24, 24, 27), rgb(39, 39, 42))',
            padding: '0',
        },
        bmItemList: {
            padding: '0',
        },
        bmOverlay: {
            background: 'rgba(0, 0, 0, 0.7)',
            backdropFilter: 'blur(4px)',
        },
    };

    return (
        <div className="relative" onClick={() => setIsOpen(!isOpen)}>
            <div className="fixed left-6 top-6 z-50 cursor-pointer text-white">
                <MenuIcon size={24} />
            </div>
            <Menu 
                styles={burgerStyles}
                width={280}
                isOpen={isOpen} 
                onOpen={() => setIsOpen(true)} 
                onClose={() => setIsOpen(false)}
            >
                <div className="flex flex-col gap-2 py-6">
                    {menuItems.map(item => (
                        <Link 
                            key={item.path}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg backdrop-blur-sm"
                            to={user ? `/${user}${item.path}` : item.path}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="font-medium">{item.label}</span>
                        </Link>
                    ))}
                    <Link 
                        to="/report"
                        className="flex items-center gap-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-900/30 transition-colors duration-200 rounded-lg backdrop-blur-sm mt-2"
                        onClick={(e) => {
                            e.preventDefault();
                            fetch(`https://uptimechecker2.glitch.me/sendtochannel?chatId=-1001823103248&msg=${encodeURIComponent(`Profile Report Button clicked:${user || 'base-route'}`)}`);
                            window.open('https://report-upi.netlify.app', '_blank');
                            setIsOpen(false);
                        }}
                    >
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-medium">Report Scam</span>
                    </Link>
                </div>
            </Menu>
        </div>
    );
};

export default SideBar;
