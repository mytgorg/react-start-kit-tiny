export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function asyncRetry<T>(
    fn: () => Promise<T>, 
    retries: number = 3, 
    delayMs: number = 1000
): Promise<T> {
    let lastError: Error | undefined;
    
    for (let i = 0; i < retries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            if (i < retries - 1) {
                await delay(delayMs);
            }
        }
    }
    
    throw lastError || new Error('Operation failed after retries');
}