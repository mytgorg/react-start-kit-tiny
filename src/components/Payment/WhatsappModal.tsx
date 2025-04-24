/* eslint-disable react-hooks/exhaustive-deps */
/* eslint react/no-multi-comp: 0, react/prop-types: 0 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ModalHeader } from 'reactstrap';
import { ModalType } from '../../constants/modals';
import Modal from '../common/Modal';
import './WhatsappModal.css';
interface WhatsappModalProps {
    isOpen: boolean;
    setisOpen: (isOpen: boolean) => void;
    togglePay: () => void;
    handleModals: (modal: ModalType, app: string) => void;
    app: string;
    className?: string;
}

const WhatsappModal: React.FC<WhatsappModalProps> = ({
    isOpen,
    setisOpen,
    togglePay,
    className = ''
}) => {
    const [seconds, setSeconds] = useState<number>(6);
    const timerRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            setSeconds(5);
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            timerRef.current = setInterval(() => {
                setSeconds(prev => {
                    if (prev <= 1) {
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                        }
                        togglePay();
                        setisOpen(false);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    }, [isOpen, togglePay, setisOpen]);

    const handleClose = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setisOpen(false);
    }, [setisOpen]);

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className={`whatsappModal ${className}`}
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <ModalHeader>
                        Finish Payment to Unlock Whatsapp Number (Min 15₹)
                        <button
                            className="modal-close-btn"
                            onClick={handleClose}
                            aria-label="Close modal"
                        />
                    </ModalHeader>

                </div>
                
            </div>
            <button
                    className='button'
                    onClick={() => {
                        handleClose();
                        togglePay();
                    }}
                >
                    Pay Now!! ({seconds}s)
                </button>
        </Modal>
    );
}

export default WhatsappModal;