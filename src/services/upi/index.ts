import { fetchWithTimeout } from '../api';

export interface UPIProvider {
    phonepe: string;
    gpay: string;
    paytm: string;
    others: string;
    [key: string]: string;
}

class UPIService {
    private static instance: UPIService;
    public defaultUpis: UPIProvider = {
        phonepe: 'paytmqr281005050101jnirp1ueoe1y@paytm',
        gpay: 'Q906015068@ybl',
        paytm: 'Q137045557@ybl',
        others: 'myred1808@postbank'
    };

    private constructor() {}

    static getInstance(): UPIService {
        if (!UPIService.instance) {
            UPIService.instance = new UPIService();
        }
        return UPIService.instance;
    }

    async initializeUPIIds(): Promise<void> {
        try {
            const response = await fetchWithTimeout(
                "https://api.npoint.io/54baf762fd873c55c6b1",
                {},
                true
            );
            
            if (response?.data) {
                this.defaultUpis = {
                    ...this.defaultUpis,
                    ...response.data
                };
            }
        } catch (error) {
            console.error('Failed to initialize UPI IDs:', error);
        }
    }

    getUPIId(provider: keyof UPIProvider): string {
        return this.defaultUpis[provider] || this.defaultUpis.others;
    }

    getAllUPIIds(): UPIProvider {
        return { ...this.defaultUpis };
    }
}

export const upiService = UPIService.getInstance();
export default upiService;