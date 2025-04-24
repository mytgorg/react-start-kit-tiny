
import axios from 'axios';

export const setCurrentUser = async (clientId: string) => {
    try {
        await axios.post('/analytics/set-user', { clientId });
    } catch (error) {
        console.error('Failed to set current user:', error);
    }
};

export const sendUpdate = async (action: string) => {
    try {
        await axios.post('/analytics/update', { action });
    } catch (error) {
        console.error('Failed to send update:', error);
    }
};
