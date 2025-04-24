import axios, { AxiosResponse } from 'axios';
import { parseError } from '../../utils/error';
import { sendUpdate } from '@/utils';

interface FetchOptions extends Record<string, any> {
    timeout?: number;
    method?: string;
    headers?: Record<string, string>;
}

export async function fetchWithTimeout(
    resource: string,
    options: FetchOptions = {},
    sendErr: boolean = true,
    maxRetries: number = 1
): Promise<AxiosResponse | undefined> {
    options.timeout = options.timeout || 50000;
    options.method = options.method || 'GET';

    const fetchWithProtocol = async (url: string): Promise<AxiosResponse | undefined> => {
        const source = axios.CancelToken.source();
        const id = setTimeout(() => {
            source.cancel(`Request timed out after ${options.timeout}ms`);
        }, options.timeout);

        const defaultHeaders = {
            'Content-Type': 'application/json'
        };
        const headers = { ...defaultHeaders, ...options.headers };

        try {
            const response = await axios({
                headers,
                ...options,
                url,
                cancelToken: source.token
            });
            clearTimeout(id);
            return response;
        } catch (error) {
            clearTimeout(id);
            if (axios.isCancel(error)) {
                console.log('Request canceled:', error.message, url);
                return undefined;
            }
            throw error;
        }
    };

    for (let retryCount = 0; retryCount <= maxRetries; retryCount++) {
        try {
            const response = await fetchWithProtocol(resource);
            if (response) return response;
        } catch (error: any) {
            const errorDetails = parseError(error);
            if (shouldRetry(errorDetails, error) && retryCount < maxRetries) {
                await delay(2000);
                continue;
            }
            if (sendErr) {
                logError(resource, maxRetries, errorDetails);
            }
            return undefined;
        }
    }
    return undefined;
}

function shouldRetry(errorDetails: any, error: any): boolean {
    return !(
        errorDetails.status.toString() === '429' ||
        errorDetails.status.toString() === 'NO_RESPONSE' ||
        error.code === 'ERR_NETWORK' ||
        error.code === "ECONNABORTED" ||
        error.code === "ETIMEDOUT" ||
        errorDetails.message.toLowerCase().includes('too many req') ||
        axios.isCancel(error)
    );
}

function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function logError(resource: string, maxRetries: number, errorDetails: any): void {
    console.log(`All ${maxRetries + 1} retries failed for ${resource}`);
    console.log("Sending error");
    sendUpdate(`Portal :All ${maxRetries + 1} retries failed for ${resource}\n${errorDetails.message}`, true);
}