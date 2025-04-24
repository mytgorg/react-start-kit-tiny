import React from 'react';
import eyeIcon from '../../assets/images/eye-slash-fill.svg';
import { useImageCache } from '../../utils/imageCache';

const EyeSlashIcon = () => {
    const cachedSrc = useImageCache(eyeIcon);
    return <img src={cachedSrc} alt="EyeSlashIcon" style={{ filter: 'brightness(0) invert(1)' }} />;
};

export default EyeSlashIcon;