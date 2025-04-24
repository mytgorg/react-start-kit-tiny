export function generatePaymentLink(upiId: string, amount?: string, description?: string): string {
    const params = new URLSearchParams();
    params.append('pa', upiId);
    
    if (description) {
        const cleanDesc = description.replace(/\s/g, '');
        params.append('pn', cleanDesc);
        params.append('tn', cleanDesc);
    }
    
    if (amount) {
        params.append('am', amount);
    }
    
    return `upi://pay?${params.toString()}`;
}

export function validateUPIId(upiId: string): boolean {
    // UPI ID format: username@bankcode
    const upiRegex = /^[a-zA-Z0-9.-]{2,256}@[a-zA-Z][a-zA-Z]{2,64}$/;
    return upiRegex.test(upiId);
}