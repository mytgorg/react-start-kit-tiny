
import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { delay } from '../../utils/async';

// Create a correct type definition for Vite's import.meta.env
// This is needed for TypeScript to recognize the env property
declare global {
  interface ImportMeta {
    env: {
      VITE_API_URL?: string;
      [key: string]: string | undefined;
    }
  }
}

export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 10000,
});

export const fetchWithTimeout = async (url: string, timeout: number = 5000): Promise<any> => {
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(id);
    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    return null;
  }
};

// Export common API functions
export { delay };
