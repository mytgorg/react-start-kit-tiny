import { useState, useEffect, useMemo } from 'react';

const imageCache = new Map<string, string>();

export const preloadImage = async (src: string): Promise<string> => {
    if (imageCache.has(src)) {
        return imageCache.get(src)!;
    }

    try {
        const response = await fetch(src);
        const blob = await response.blob();
        const objectURL = URL.createObjectURL(blob);
        imageCache.set(src, objectURL);
        return objectURL;
    } catch (error) {
        console.error(`Failed to load image: ${src}`, error);
        return src; // Fallback to original source if loading fails
    }
};

export const useImageCache = (src: string): string => {
    const [cachedSrc, setCachedSrc] = useState(() => imageCache.get(src) || src);

    useEffect(() => {
        let mounted = true;
        if (!imageCache.has(src)) {
            preloadImage(src).then(url => {
                if (mounted) {
                    setCachedSrc(url);
                }
            });
        }
        return () => {
            mounted = false;
        };
    }, [src]);

    return useMemo(() => cachedSrc, [cachedSrc]);
};