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
    <div className="min-h-screen bg-gradient-to-b from-[#1a1a1a] to-[#2a2a2a] text-white px-4 py-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <Suspense fallback={<LoadingSpinner />}>
          <ProfileCard profile={profile} handleModals={handleModals} />
        </Suspense>

        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
            WebCam Services
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Experience premium webcam services with verified profiles
          </p>
        </div>
        
        <div className="space-y-4 w-full max-w-md mx-auto">
          <button
            onClick={() => {
              history.push(`/${profile.clientId}/free-demo`);
            }}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
          >
            Login for Free Demo
          </button>
          
          <div className="grid grid-cols-2 gap-4">
            <button 
              className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              onClick={() => window.open(`https://t.me/${profile.telegram || ''}`)}
            >
              <img src="/src/assets/images/tg.svg" className="w-5 h-5" alt="Telegram" />
              Telegram
            </button>
            <button 
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-colors"
              onClick={handleWspButton}
            >
              <img src={cachedWhatsapp} className="w-5 h-5" alt="whatsapp logo" />
              WhatsApp
            </button>
          </div>
        </div>
        
        <div className="bg-black/20 backdrop-blur-lg rounded-xl p-6 space-y-4 w-full max-w-md mx-auto">
          <h2 className="text-xl font-semibold text-center text-[#c9df3d]">
            Premium Services Available
          </h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={handlepayButton}
              className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <img src={cachedUpiWhite} className="w-5 h-5" alt="PAY NOW" />
              Pay Now
            </button>
            <button
              onClick={handleQRButton}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-lg hover:shadow-lg transition-all duration-300"
            >
              <img src={cachedQrCode} className="w-5 h-5" alt="QR" />
              QR Code
            </button>
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
    </div>
  );
};

export default App;
