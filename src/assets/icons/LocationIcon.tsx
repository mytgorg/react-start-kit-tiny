import React from 'react';
import locationIcon from '../../assets/images/location.svg';
import { useImageCache } from '../../utils/imageCache';

const LocationIcon = () => {
    const cachedSrc = useImageCache(locationIcon);
    return <img src={cachedSrc} alt="LocationIcon" />;
};

export default LocationIcon;