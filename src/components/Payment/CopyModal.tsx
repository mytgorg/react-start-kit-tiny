import React, { useState, useEffect, useCallback, memo } from 'react';
import { ModalHeader } from 'reactstrap';
import Modal from '../common/Modal';
import { upiService } from '../../services/upi';
import { TickIcon, ClipboardIcon } from '../../assets/icons';
import './CopyModal.css';

interface CopyModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const CopyModal: React.FC<CopyModalProps> = memo(({ isOpen, setIsOpen }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        let mounted = true;

        const initUPI = async () => {
            if (!isInitialized && isOpen) {
                setIsLoading(true);
                try {
                    await upiService.initializeUPIIds();
                    if (mounted) {
                        setIsInitialized(true);
                    }
                } catch (err) {
                    console.error('Failed to initialize UPI:', err);
                } finally {
                    if (mounted) {
                        setIsLoading(false);
                    }
                }
            }
        };

        initUPI();
        return () => {
            mounted = false;
        };
    }, [isOpen, isInitialized]);

    const handleClose = useCallback(() => {
        setIsOpen(false);
        setIsCopied(false);
    }, [setIsOpen]);

    const handleCopy = useCallback(async (upiId: string): Promise<void> => {
        if (!upiId) return;
        setIsLoading(true);
        try {
            await navigator.clipboard.writeText(upiId);
            setIsCopied(true);
        } catch (err) {
            console.error('Failed to copy:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className="copy-modal"
        >
            <ModalHeader >
                <button
                    className="modal-close-btn"
                    onClick={handleClose}
                    aria-label="Close modal"
                />
                {!isCopied ? (
                    <div className="copy-modal__success">
                        <h6>
                            UPI ID <span className='copied-span'>Copied <ClipboardIcon /> </span> to your
                            <span className='clipboard-span'> Clipboard!! <TickIcon /> </span>
                        </h6>
                        <p>
                            Open your <span className='app-span'>Payment App</span> and Paste the UPI ID
                        </p>
                    </div>
                ) : (
                    <div className="copy-modal__upi-options">
                        <div className="copy-modal__option">
                            <span>
                                <ClipboardIcon /> Google Pay:
                            </span>
                            <button
                                onClick={() => handleCopy(upiService.getUPIId('gpay'))}
                                className="copy-modal__copy-button"
                                disabled={isLoading || !isInitialized}
                            >
                                {isLoading ? 'Copying...' : 'Copy'}
                            </button>
                        </div>
                        <div className="copy-modal__option">
                            <span>
                                <ClipboardIcon />
                                <span className="purple">PhonePe</span>{' '}
                                <span className="blue">PayTm</span>{' '}
                                <span className="yellow">Others</span>:
                            </span>
                            <button
                                onClick={() => handleCopy(upiService.getUPIId('others'))}
                                className="copy-modal__copy-button"
                                disabled={isLoading || !isInitialized}
                            >
                                {isLoading ? 'Copying...' : 'Copy'}
                            </button>
                        </div>
                    </div>
                )}
            </ModalHeader>
        </Modal>
    );
});

CopyModal.displayName = 'CopyModal';
export default CopyModal;