export interface PaymentOption {
    id: string;
    value: string;
    label: string;
    imageUrl: string;
}

export interface UPIDetails {
    id: string;
    appName: string;
    upiId: string;
}

export interface PaymentService {
    id: string;
    name: string;
    amount: string;
    description: string;
}