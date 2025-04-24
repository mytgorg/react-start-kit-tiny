
import { api } from '../services/api';

export const setCurrentUser = async (clientId: string) => {
    try {
        await api.post('/analytics/set-user', { clientId });
    } catch (error) {
        console.error('Failed to set current user:', error);
    }
};
