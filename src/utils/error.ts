export interface ErrorResponse {
    status: string;
    message: string;
    error: string;
}

export function parseError(err: any): ErrorResponse {
    let status = 'UNKNOWN';
    let message = 'An unknown error occurred';
    let error = 'UnknownError';

    if (err.response) {
        const response = err.response;
        status = response.data?.status || response.status || err.status || 'UNKNOWN';
        message =
            response.data?.message ||
            response.data?.errors ||
            response.message ||
            response.statusText ||
            response.data ||
            err.message ||
            'An error occurred';
        error = response.data?.error || response.error || err.name || err.code || 'Error';
    } else if (err.request) {
        status = 'NO_RESPONSE';
        message = 'The request was made but no response was received';
        error = err.name || err.code || 'NoResponseError';
    } else if (err.message) {
        status = 'UNKNOWN';
        message = err.message;
        error = err.name || err.code || 'Error';
    }

    const msg = extractMessage(message);
    return { status, message: msg, error };
}

export const extractMessage = (data: any): string => {
    if (Array.isArray(data)) {
        return `${data.map((item) => extractMessage(item)).join(', ')}`;
    }

    if (
        typeof data === 'string' ||
        typeof data === 'number' ||
        typeof data === 'boolean'
    ) {
        return String(data);
    }

    if (typeof data === 'object' && data !== null) {
        const messages: string[] = [];

        for (const key in data) {
            const value = data[key];
            const newPrefix = key;

            if (Array.isArray(value)) {
                messages.push(
                    `${newPrefix}=${value.map((item) => extractMessage(item)).join(', ')}`,
                );
            } else if (
                typeof value === 'string' ||
                typeof value === 'number' ||
                typeof value === 'boolean'
            ) {
                messages.push(`${newPrefix}=${value}`);
            } else if (typeof value === 'object' && value !== null) {
                messages.push(String(extractMessage(value)));
            }
        }

        return messages.length > 0 ? messages.join(', ') : '';
    }

    return ''; // Return empty string for null, undefined, and unhandled types
};