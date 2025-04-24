import React, { useState, memo, useCallback } from 'react';
import CopyModal from './CopyModal';
import Modal from '../common/Modal';
import { upiService } from '../../services/upi';
import PaymentQRCode from './DynamicQR';
import { sendUpdate } from '../../utils';
import { ModalType } from '../../constants/modals';
import { Profile } from '../../types/profile';
import './QRCard.css';

interface QRCardProps {
    profile: Profile;
    isOpen: boolean;
    setisOpen: (isOpen: boolean) => void;
    className?: string;
    app: string;
    handleModals: (modal: ModalType, app: string) => void;
}

const QRCard: React.FC<QRCardProps> = memo(({ 
    profile, 
    isOpen, 
    setisOpen, 
    className = '', 
    app, 
    handleModals 
}) => {
    const [isCopyOpen, setIsCopyOpen] = useState<boolean>(false);
    const copyId = upiService.defaultUpis[app];

    const handleClose = useCallback(() => {
        setisOpen(false);
    }, [setisOpen]);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(copyId?.split('&')[0]);
        setIsCopyOpen(true);
        sendUpdate(`UPI ID Copied : ${copyId?.split('&')[0]}`);
    }, [copyId]);

    return (
        <>
            <Modal
                isOpen={isOpen}
                onClose={handleClose}
                className={`qr-card ${className}`}
                size="sm"
            >
                <div className="qr-card__content">
                    <div className="qr-card__header">
                        <div className="qr-card__header-content">
                            <p>Scan QR Code</p>
                            <div className="qr-card__header-line" />
                        </div>
                    </div>
                    <div className="qr-card__main">
                        <div className="qr-card__qr-wrapper">
                            <PaymentQRCode
                                profile={profile}
                                app={app}
                                handleModals={handleModals}
                            />
                        </div>
                        <div className='qr-card__upi-section'>
                            <div className="qr-card__upi-container">
                                <div className="qr-card__input-wrapper">
                                    <span className='qr-card__upi-label'>UPI:</span>
                                    <input
                                        className='qr-card__upi-input'
                                        title={copyId?.split('&')[0]}
                                        readOnly
                                        value={copyId?.split('&')[0] || ''}
                                    />
                                </div>
                                <button
                                    className='qr-card__copy-button'
                                    onClick={handleCopy}
                                >
                                    Copy
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
            {isCopyOpen && <CopyModal isOpen={isCopyOpen} setIsOpen={setIsCopyOpen} />}
        </>
    );
});

QRCard.displayName = 'QRCard';
export default QRCard;