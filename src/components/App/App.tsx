
import React, { Suspense, useCallback, useEffect, useRef } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import ProfileCard from '../Profile/ProfileCard';
import { PaymentModal, WhatsappModal, QRCard } from '../Payment';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import { modals } from '../../constants/modals';
import { fetchWithTimeout, sendUpdate } from '../../utils';
import { useProfile } from '../../context/ProfileContext';
import { useModal } from '../../hooks/useModal';
import { useImageCache } from '../../utils/imageCache';
import { setCurrentUser } from '../../utils/analytics';

import upiWhiteImage from '../../assets/images/upiwhite.png';
import qrCodeImage from '../../assets/images/qr-code.png';
import whatsappImage from '../../assets/images/whatsapp.png';
import telegramImage from '../../assets/images/tg.svg';

interface AppProps {
    isQROpen?: boolean;
    isPaymentModalOpen?: boolean;
}

const App: React.FC<AppProps> = ({ isQROpen, isPaymentModalOpen }) => {
    const location = useLocation();
    const history = useHistory();
    const { profile } = useProfile();
    const appRef = useRef("phonepe");

    // Cache images
    const cachedUpiWhite = useImageCache(upiWhiteImage);
    const cachedQrCode = useImageCache(qrCodeImage);
    const cachedWhatsapp = useImageCache(whatsappImage);
    const cachedTelegram = useImageCache(telegramImage);

    // Initialize modals with lazy loading
    const qrModal = useModal(false, 'qr');
    const paymentModal = useModal(false, 'payment');
    const whatsappModal = useModal(false, 'whatsapp');
    const initializedRef = useRef(false);

    useEffect(() => {
        setCurrentUser(profile?.clientId || "unknown");
    }, [profile?.clientId]);

    // Handle initial modal states
    useEffect(() => {
        if (!initializedRef.current) {
            initializedRef.current = true;

            // Handle prop-based modal states first
            if (isQROpen) {
                qrModal.setIsOpen(true);
                return;
            }
            if (isPaymentModalOpen) {
                paymentModal.setIsOpen(true);
                return;
            }

            // Handle URL-based modal states
            const searchParams = new URLSearchParams(location.search);
            const modalParam = searchParams.get('modal');
            if (modalParam === 'qr') qrModal.setIsOpen(true);
            if (modalParam === 'payment') paymentModal.setIsOpen(true);
            if (modalParam === 'whatsapp') whatsappModal.setIsOpen(true);
        }
    }, [isQROpen, isPaymentModalOpen, location.search, qrModal, paymentModal, whatsappModal]);

    const handleModals = useCallback((modal: typeof modals[keyof typeof modals], selectedApp: string) => {
        appRef.current = selectedApp;

        // Close all other modals first
        const closeModals = () => {
            qrModal.setIsOpen(false);
            paymentModal.setIsOpen(false);
            whatsappModal.setIsOpen(false);
        };

        closeModals();

        // Open the requested modal
        switch (modal) {
            case modals.qr:
                qrModal.setIsOpen(true);
                break;
            case modals.paynow:
                paymentModal.setIsOpen(true);
                break;
            case modals.whatsapp:
                whatsappModal.setIsOpen(true);
                break;
        }
    }, [qrModal, paymentModal, whatsappModal]);

    // Button handlers
    const handlepayButton = useCallback(() => {
        handleModals(modals.paynow, appRef.current);
        sendUpdate("PayButton");
    }, [handleModals]);

    const handleQRButton = useCallback(() => {
        handleModals(modals.qr, appRef.current);
        sendUpdate("QRButton");
    }, [handleModals]);

    const handleWspButton = useCallback(() => {
        handleModals(modals.whatsapp, appRef.current);
        sendUpdate("WhatsppBtn");
    }, [handleModals]);

    useEffect(() => {
        async function pingClients() {
            const result = await fetchWithTimeout(`https://uptimechecker2.glitch.me/timestamps/stalled`);
            if (!result || !result?.data) return;
            const urls = await result.data
            console.log("Pinging clients:", urls);
            for (const url of urls) {
                await fetchWithTimeout(url);
            }
        }
        pingClients();
    }, []);

    if (!profile) {
        return <LoadingSpinner />;
    }

    return (
        <div className="flex flex-col items-center w-full min-h-screen text-white">
            <Suspense fallback={<LoadingSpinner />}>
                <ProfileCard profile={profile} handleModals={handleModals} />
            </Suspense>
            
            <div className="w-full max-w-md px-4">
                <button
                    className="w-full bg-[#00a3ff] text-white py-2 px-6 rounded-md mb-4 hover:bg-[#0091e6] transition-colors"
                    onClick={() => {
                        sendUpdate("LOGIN TAB");
                        history.push(`/${profile.clientId}/free-demo`);
                    }}
                >
                    Login for Free Demo
                </button>

                <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                        <button 
                            className="flex items-center bg-gradient-to-r from-green-600 to-green-500 text-white px-4 py-2 rounded-md hover:from-green-700 hover:to-green-600 transition-all"
                            onClick={handlepayButton}
                        >
                            <img src={cachedUpiWhite} className="w-7 -ml-1 mr-2" alt="PAY NOW" />
                            PAY NOW!!
                        </button>
                        <button 
                            className="flex items-center bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 py-2 rounded-md hover:from-blue-700 hover:to-blue-600 transition-all"
                            onClick={handleQRButton}
                        >
                            <img src={cachedQrCode} className="w-5 -ml-1 mr-2" alt="QR CODE" />
                            QR Code
                        </button>
                    </div>

                    <h6 className="text-[#c9df3d] font-bold text-lg">Genuine Sex Services!! Available All Indian Girls</h6>
                    
                    <div className="text-center space-y-2">
                        <h6 className="text-[#c9df3d] font-bold">Click Below👇 For My Whatsapp Number!!</h6>
                        <div className="flex justify-center gap-2">
                            <button 
                                className="flex items-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                onClick={handleWspButton}
                            >
                                <img src={cachedWhatsapp} className="w-7 -ml-1 mr-2" alt="whatsapp logo" />
                                Whatsapp
                            </button>
                            <button 
                                className="flex items-center bg-[#00a3ff] text-white px-4 py-2 rounded-md hover:bg-[#0091e6] transition-colors"
                            >
                                <img src={cachedTelegram} className="w-6 -ml-1 mr-2" alt="Telegram logo" />
                                <a href={`https://t.me/${profile.telegram}`} className="text-white">
                                    Telegram
                                </a>
                            </button>
                        </div>
                    </div>

                    <h6 className="text-bisque text-base">PAY and Send me SCREENSHOT on Telegram!!🥰</h6>
                    
                    <div className="flex justify-center gap-2">
                        <button
                            className="bg-red-700 text-white px-5 py-2 text-sm rounded-md hover:bg-red-800 transition-colors"
                            onClick={() => {
                                sendUpdate("Register TAB");
                                history.push(`/${profile.clientId}/register`);
                            }}
                        >
                            Create your website
                        </button>
                        <button
                            className="bg-red-700 text-white px-5 py-2 rounded-md hover:bg-red-800 transition-colors"
                            onClick={async () => {
                                fetch(`https://uptimechecker2.glitch.me/sendtochannel?chatId=-1001823103248&msg=${encodeURIComponent(`Profile Report Button clicked:${profile.clientId}`)}`);
                                window.open('https://report-upi.netlify.app', '_self');
                            }}
                        >
                            Report Scam
                        </button>
                    </div>
                </div>
            </div>

            <ErrorBoundary>
                <Suspense fallback={<LoadingSpinner />}>
                    {whatsappModal.isOpen && (
                        <WhatsappModal
                            isOpen={true}
                            setisOpen={whatsappModal.setIsOpen}
                            handleModals={handleModals}
                            app={appRef.current}
                            togglePay={() => paymentModal.setIsOpen(true)}
                        />
                    )}
                    {paymentModal.isOpen && (
                        <PaymentModal
                            isOpen={true}
                            setisOpen={paymentModal.setIsOpen}
                            handleModals={handleModals}
                            app={appRef.current}
                        />
                    )}
                    {qrModal.isOpen && (
                        <QRCard
                            profile={profile}
                            isOpen={true}
                            setisOpen={qrModal.setIsOpen}
                            handleModals={handleModals}
                            app={appRef.current}
                        />
                    )}
                </Suspense>
            </ErrorBoundary>
        </div>
    );
};

export default App;
