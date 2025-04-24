import React, { useState } from 'react';
import { ModalType } from '../../constants/modals';
import { sendUpdate } from '../../utils';
import { useImageCache } from '../../utils/imageCache';
import './PaymentOptions.css';

// Import images statically
import phonepeImage from '../../assets/images/phonepe.png';
import paytmImage from '../../assets/images/paytm.png';
import gpayImage from '../../assets/images/gpay.png';
import upiImage from '../../assets/images/upi.png';

interface PaymentOptionsProps {
    shouldPopulateVpa: boolean;
    count?: number;
    amount?: string;
    isPay: boolean;
    handleModals: (modal: ModalType, app: string) => void;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({
    shouldPopulateVpa,
    count,
    amount,
    isPay,
    handleModals
}) => {
    const [selectedOption, setSelectedOption] = useState('paytm');

    // Cache all payment app images
    const cachedPhonePe = useImageCache(phonepeImage);
    const cachedPaytm = useImageCache(paytmImage);
    const cachedGpay = useImageCache(gpayImage);
    const cachedUpi = useImageCache(upiImage);

    const paymentOptions = [
        { id: 'phonepe', label: 'PhonePe', image: cachedPhonePe },
        { id: 'paytm', label: 'Paytm', image: cachedPaytm },
        { id: 'gpay', label: 'Google Pay', image: cachedGpay },
        { id: 'others', label: 'Other UPI Apps', image: cachedUpi, title: "(Others)" }
    ];
    const handlePayment = () => {
        if (isPay) {
            handleModals('qr', selectedOption.toLowerCase());
        } else {
            window.open("upi://", '_self');
        }
    };
    const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setSelectedOption(value);
        sendUpdate(`PaymentOption_${value}`);
        handleModals('paynow', value);
    };

    return (
        <div className="payment-options">
            <h6 className="payment-options__title">
                Select Payment Method
            </h6>
            <form className="payment-options__form">
                {paymentOptions.map(option => (
                    <div key={option.id} className="payment-options__item">
                        <label>
                            <input
                                type="radio"
                                name="payment"
                                value={option.id}
                                checked={selectedOption === option.id}
                                onChange={handleOptionChange}
                            />
                            <img src={option.image} alt={option.label} />
                            {option.title ? <span>{option.title}</span> : null}
                        </label>
                    </div>
                ))}
            </form>
            <button
                className="payment-options__submit"
                onClick={handlePayment}
            >
                {isPay ? 'Pay Now' : 'Open APP'}
            </button>
        </div>
    );
};

export default PaymentOptions;


