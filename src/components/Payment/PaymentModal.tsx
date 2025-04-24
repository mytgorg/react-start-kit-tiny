import React, { useState, memo, useCallback } from 'react';
import { modals, ModalType } from '../../constants/modals';
import Modal from '../common/Modal';
import './PaymentModal.css';
import PaymentOptions from './PaymentOptions';

interface PaymentModalProps {
    isOpen: boolean;
    setisOpen: (isOpen: boolean) => void;
    className?: string;
    handleModals: (modal: ModalType, app: string) => void;
    app: string;
}

const PaymentModal: React.FC<PaymentModalProps> = memo(({
    isOpen,
    setisOpen,
    className,
    handleModals,
    app
}) => {
    const [selectedOption, setSelectedOption] = useState<string>("50");

    const handleOptionChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
        const value = event.target.value;
        setSelectedOption(value);
        handleModals(modals.paynow, app);
    }, [handleModals, app]);

    const handleClose = useCallback(() => {
        setisOpen(false);
    }, [setisOpen]);

    const options = [
        { id: "50", label: "50₹ Video Call" },
        { id: "25", label: "25₹ Demo Pics" },
        { id: "others", label: "Other Service" }
    ];

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            className={`payment-modal ${className || ''}`}
        >
            <div className="payment-select__header">
                <h6 className="payment-select__title">Select Service</h6>
            </div>
            <form className="payment-select__form">
                <div className='payment-select__options'>
                    {options.map(option => (
                        <div key={option.id} className="payment-select__option">
                            <input
                                type="radio"
                                id={option.id}
                                value={option.id}
                                checked={selectedOption === option.id}
                                onChange={handleOptionChange}
                            />
                            <label htmlFor={option.id}>{option.label}</label>
                        </div>
                    ))}
                </div>
            </form>
            <div className="payment-select__payment-options">
                <PaymentOptions
                    shouldPopulateVpa={true}
                    handleModals={handleModals}
                    isPay={true}
                    amount={selectedOption}
                    count={8}
                />
            </div>
        </Modal>
    );
});

PaymentModal.displayName = 'PaymentModal';
export default PaymentModal;