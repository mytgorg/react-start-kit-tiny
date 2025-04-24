import { useState, useCallback } from 'react';
import { PaymentOption, UPIDetails } from '../types/payment';
import { sendUpdate } from '../utils';

interface UseUPIPayment {
    selectedApp: string;
    isProcessing: boolean;
    handlePayment: (option: PaymentOption, upiDetails: UPIDetails) => Promise<void>;
    generatePaymentLink: (amount: string, upiId: string, description: string) => string;
}

export function useUPIPayment(): UseUPIPayment {
    const [selectedApp, setSelectedApp] = useState<string>('phonepe');
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const generatePaymentLink = useCallback((amount: string, upiId: string, description: string): string => {
        const cleanDescription = description
            .normalize('NFD') // Decompose unicode characters
            .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
            .replace(/[^\x20-\x7E]/g, '') // Remove non-ASCII characters including emojis
            .replace(/[^a-zA-Z0-9-\s]/g, '') // Keep only alphanumeric, hyphens and spaces
            .replace(/\s+/g, '') // Replace spaces with hyphens
            .trim(); // Remove leading/trailing whitespace

        let query = `upi://pay?pa=${upiId}&mam=15`;
        if (cleanDescription) {
            query += `&pn=${cleanDescription}&tn=${cleanDescription}`;
        }
        if (amount) {
            query += `&am=${amount}`;
        }
        return query;
    }, []);

    const handlePayment = useCallback(async (option: PaymentOption, upiDetails: UPIDetails): Promise<void> => {
        try {
            setIsProcessing(true);
            const paymentLink = generatePaymentLink(option.value, upiDetails.upiId, option.label);
            setSelectedApp(upiDetails.appName);
            await sendUpdate(`Payment initiated: ${upiDetails.appName} - ${option.value}`);
            window.location.href = paymentLink;
        } catch (error) {
            console.error('Payment failed:', error);
            await sendUpdate(`Payment failed: ${error}`);
        } finally {
            setIsProcessing(false);
        }
    }, [generatePaymentLink]);

    return {
        selectedApp,
        isProcessing,
        handlePayment,
        generatePaymentLink
    };
}