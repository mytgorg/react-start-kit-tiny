import React from 'react';
import tick from '../../assets/images/tick.png';
import { useImageCache } from '../../utils/imageCache';

const TickIcon = () => {
    const cachedSrc = useImageCache(tick);
    return <img src={cachedSrc} alt="Tick icon" />;
};

export default TickIcon;