
import { fetchWithTimeout } from "./utils";

interface DefaultUpis {
    phonepe: string;
    gpay: string;
    paytm: string;
    others: string;
}

interface ClientData {
    name: string;
    product: string;
    gpayId: string;
    username: string;
    [key: string]: string;
}

export class UpiIds {
    static paytm1: string = "Q137045557@ybl";
    static paytm2: string = "paytmqr281005050101rgcfsaeesx4o@paytm";
    static paytm3: string = "paytmqr281005050101xv6mfg02t4m9@paytm";
    static ppay: string = "paytmqr281005050101jnirp1ueoe1y@paytm";
    static bpayGen: string = "paytmqr281005050101rgcfsaeesx4o@paytm";
    static bpay2: string = "paytmqr281005050101rgcfsaeesx4o@paytm";
    static axisUPI: string = "reddsgal@airtel";
    static gpay: string = "Q906015068@ybl";
    static gpayid: string = "reddsgal@airtel";
    static defaultId: string = 'myred1808@postbank';
    static qrId: string = 'BHARATPE.8000073302@fbpe';
    static defaultUpis: DefaultUpis;

    static getUpiId(key: string): string {
        return UpiIds[key as keyof typeof UpiIds] as string;
    }

    static setUpiId(key: string, value: string): void {
        (UpiIds as any)[key] = value;
    }

    static setDefaultUpis(): void {
        UpiIds.defaultUpis = {
            phonepe: UpiIds.ppay,
            gpay: UpiIds.gpay,
            paytm: UpiIds.paytm1,
            others: UpiIds.defaultId
        };
    }
}

UpiIds.defaultUpis = {
    phonepe: UpiIds.ppay,
    gpay: UpiIds.gpay,
    paytm: UpiIds.paytm1,
    others: UpiIds.defaultId
};

export function assigntoUpis(jsonData: Record<string, string>): void {
    Object.entries(jsonData).forEach(([key, value]) => {
        if (key in UpiIds) {
            UpiIds.setUpiId(key, value);
        }
    });
    UpiIds.setDefaultUpis();
}

export async function setUpiIds(): Promise<Record<string, string> | undefined> {
    const response = await fetchWithTimeout("https://api.npoint.io/54baf762fd873c55c6b1");
    if (response) {
        const data = response.data;
        assigntoUpis(data);
        return data;
    }
    return undefined;
}

export async function getClients(user: string): Promise<ClientData> {
    const url = `https://api.npoint.io/f0d1e44d82893490bbde/${user.toLowerCase()}`;
    const response = await fetchWithTimeout(url);
    if (response) {
        return response.data;
    }
    throw new Error(`Failed to fetch client data for user: ${user}`);
}
