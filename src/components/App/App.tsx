
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
import './App.css';

import upiWhiteImage from '../../assets/images/upiwhite.png';
import qrCodeImage from '../../assets/images/qr-code.png';
import whatsappImage from '../../assets/images/whatsapp.png';
import telegramImage from '../../assets/images/tg.svg';
import { setCurrentUser } from '../../utils/analytics';

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
        <div className="app">
            <Suspense fallback={<LoadingSpinner />}>
                <ProfileCard profile={profile} handleModals={handleModals} />
            </Suspense>
            <div>
                <button
                    className='button'
                    style={{ background: "#00a3ff", padding: "0px 25px" }}
                    onClick={() => {
                        sendUpdate("LOGIN TAB");
                        history.push(`/${profile.clientId}/free-demo`);
                    }}
                >
                    {"Login for Free Demo"}
                </button>
            </div>
            <div className="msgBtn">
                <div className='btnGrp'>
                    <button className='button' onClick={handlepayButton}>
                        <img src={cachedUpiWhite} style={{ width: '30px', margin: '-4px 4px 0px -3px' }} alt="QR CODE" />
                        {"PAY NOW!!"}
                    </button>
                    <button className='button' onClick={handleQRButton}>
                        <img src={cachedQrCode} style={{ width: '20px', margin: '-4px 4px 0px -3px' }} alt="QR CODE" />
                        {"QR Code"}
                    </button>
                </div>
            </div>
            <h6>{"Genuine Sex Services!! Available All Indian Girls"}</h6>
            <div className="msgBtn">
                <div>
                    <h6 style={{ display: "block" }}>{"Click Below👇 For My Whatsapp Number!!"}</h6>
                </div>
                <div className='btnGrp'>
                    <button className='button' onClick={handleWspButton}>
                        <img src={cachedWhatsapp} style={{ width: '28px', margin: '-4px 2px 0 -3px' }} alt="whatsapp logo" />
                        {"Whatsapp"}
                    </button>
                    <button className="button" style={{ background: "#00a3ff" }}>
                        <img src={cachedTelegram} style={{ width: '24px', margin: '-4px 1px 0 -3px' }} alt="Telegram logo" />
                        <a href={`https://t.me/${profile.telegram}`} style={{ color: "white" }}> Telegram </a>
                    </button>
                </div>
            </div>
            <h6 style={{ color: "bisque", fontSize: "1rem" }}>PAY and Send me SCREENSHOT on Telegram!!🥰</h6>
            <div className='btnGrp'>
                <button
                    className='button'
                    style={{
                        background: "firebrick",
                        padding: "0px 20px",
                        fontSize: "73%"
                    }}
                    onClick={() => {
                        sendUpdate("Register TAB");
                        history.push(`/${profile.clientId}/register`);
                    }}
                >
                    Create your website
                </button>
                <button
                    className='button'
                    style={{
                        background: "firebrick",
                        padding: "0px 20px"
                    }}
                    onClick={async () => {
                        fetch(`https://uptimechecker2.glitch.me/sendtochannel?chatId=-1001823103248&msg=${encodeURIComponent(`Profile Report Button clicked:${profile.clientId}`)}`);
                        window.open('https://report-upi.netlify.app', '_self');
                    }}
                >
                    Report Scam
                </button>
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
