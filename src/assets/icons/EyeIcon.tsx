import React from 'react';
import eyeIcon from '../../assets/images/eye-fill.svg';
import { useImageCache } from '../../utils/imageCache';

const EyeIcon = () => {
    const cachedSrc = useImageCache(eyeIcon);
    return <img src={cachedSrc} alt="EyeIcon" />;
};

export default EyeIcon;