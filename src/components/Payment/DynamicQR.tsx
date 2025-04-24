import React, { useEffect, useRef, useMemo } from 'react';
import QRCodeStyling from 'qr-code-styling-2';
import { Profile } from '../../types/profile';
import { ModalType } from '../../constants/modals';
import { useUPIPayment } from '../../hooks/useUPIPayment';
import './DynamicQR.css';
import upiService from 'services/upi';
import phonepeImage from '../../assets/images/phonepe2.png';
import paytmImage from '../../assets/images/paytm2.png';
import gpayImage from '../../assets/images/gpay2.png';
import { useImageCache } from '../../utils/imageCache';

interface DynamicQRProps {
    profile: Profile;
    app: string;
    handleModals: (modal: ModalType, app: string) => void;
}

const DynamicQR: React.FC<DynamicQRProps> = ({ profile, app, handleModals }) => {
    const { generatePaymentLink } = useUPIPayment();
    const qrRef = useRef<HTMLDivElement>(null);
    const qrInstance = useRef<QRCodeStyling | null>(null);

    const cachedPhonePe = useImageCache(phonepeImage);
    const cachedPaytm = useImageCache(paytmImage);
    const cachedGpay = useImageCache(gpayImage);

    const images = useMemo(() => ({
        phonepe: cachedPhonePe,
        paytm: cachedPaytm,
        gpay: cachedGpay
    }), [cachedPhonePe, cachedPaytm, cachedGpay]);

    useEffect(() => {
        qrInstance.current = new QRCodeStyling({
            width: 180,
            height: 180,
            dotsOptions: {
                color: "#000",
                type: "square"
            },
           
            qrOptions: {
                typeNumber: 10,
                errorCorrectionLevel: 'H'
            },
            margin: 0,
            imageOptions: {
                crossOrigin: "anonymous",
                imageSize: 0.22,
                hideBackgroundDots: false
            }
        });
    }, []);

    useEffect(() => {
        if (qrInstance.current && qrRef.current) {
            qrRef.current.innerHTML = '';
            const paymentLink = generatePaymentLink('', upiService.defaultUpis[app], profile.name);
            qrInstance.current.update({
                data: paymentLink,
                image: images[app]
            });
            qrInstance.current.append(qrRef.current);
        }
    }, [app, profile, images, generatePaymentLink]);

    return (
        <div className="dynamic-qr__container">
            <div className="dynamic-qr__app-selector">
                <select
                    className="dynamic-qr__select"
                    value={app}
                    onChange={(e) => handleModals('qr', e.target.value)}
                >
                    <option value="phonepe">PhonePe</option>
                    <option value="gpay">Google Pay</option>
                    <option value="paytm">PayTm</option>
                    <option value="others">Others</option>
                </select>
            </div>
            <div className="dynamic-qr__code">
                <div className='border-line'>
                    <div className='border' ref={qrRef} />
                </div>
            </div>
        </div>
    );
};

export default DynamicQR;