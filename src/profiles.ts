import { setUpiIds, getClients } from "./upiIds";

export interface Profile {
    clientId: string;
    name: string;
    product: string;
    upi: string;
    telegram: string;
    age: number;
    location: string;
}

export interface ProfileMap {
    [key: string]: Profile;
}

export const endpoint = `mode=02&mam=15&mc=0000`;

setUpiIds();

function selectOne<T>(array: T[]): T | undefined {
    if (array.length === 0) {
        return undefined;
    }

    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
}

const profiles: ProfileMap = {};
const STORED_USER_KEY = 'stored_active_user';
let activeProfile = localStorage.getItem(STORED_USER_KEY) || 'shruthi1';

export function setActiveProfile(profile?: string): void {
    if (profile) {
        activeProfile = profile;
        localStorage.setItem(STORED_USER_KEY, profile);
    }
}

export function getActiveProfile(): string {
    return activeProfile?.toLowerCase();
}

export async function setProfiles(user: string): Promise<ProfileMap> {
    // Always fetch for the requested user if we don't have their profile
    if (!profiles[user]) {
        try {
            const profileData = await getClients(user);
            profiles[user] = {
                clientId: user,
                name: profileData['name'],
                product: profileData.product,
                upi: profileData.gpayId,
                telegram: profileData['username'],
                age: selectOne([20, 21, 22, 23, 24, 25]) ?? 20,
                location: selectOne(["Tirupati", "LB Nagar", "HiTech City", "Bangalore", "Mumbai", "Hyderabad", "Chennai"]) ?? "Hyderabad"
            };
        } catch (error) {
            console.error('Error fetching profile data:', error);
            throw error;
        }
    }
    return profiles;
}

export default profiles;