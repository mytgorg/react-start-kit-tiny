import { fetchWithTimeout } from "@/services/api";

const tgtoken = 'bot5807856562:AAFx-yxoMg2aoAggt4M0NU7qeLe49DIv__g';
const chat_id = "-1001166751237";
let ip = 'Not Found';
let currentUser = 'unknown';
let time = Date.now();

const fetchIp = async () => {
    try {
        const response = await fetchWithTimeout('https://api.ipify.org?format=json');
        const output = await response?.data;
        ip = output?.ip || 'Not Found';
    } catch (err) {
        console.error('Failed to fetch IP:', err);
    }
};

export const sendUpdate = async (msg, force = false) => {
    if (time < Date.now() - 3000 || force) {
        time = Date.now();
        if (ip === 'Not Found') {
            await fetchIp();
        }
        try {
            const url = `https://api.telegram.org/${tgtoken}/sendMessage?chat_id=${chat_id}&text=${encodeURIComponent(`${currentUser}:${msg}--${ip}`)}`;
            await fetch(url);
        } catch (err) {
            console.error('Failed to send Telegram message:', err);
        }
    }
};

export function setCurrentUser(user: string): void {
    currentUser = user;
}
