import React, { useState, useMemo } from 'react';
import { Profile } from '../../types/profile';
import { ModalType } from '../../constants/modals';
import { sendUpdate } from '../../utils';
import EyeIcon from '../../assets/icons/EyeIcon';
import EyeSlashIcon from '../../assets/icons/EyeSlashIcon';
import LocationIcon from '../../assets/icons/LocationIcon';
import TickIcon from '../../assets/icons/TickIcon';
import { useImageCache } from '../../utils/imageCache';
import './ProfileCard.css';

// Import a default fallback image
import defaultProfileImage from '../../assets/images/shruthi.jpg';

interface ProfileCardProps {
    profile: Profile;
    handleModals: (modal: ModalType, app: string) => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ profile, handleModals }) => {
    const [showPhoneNumber, setShowPhoneNumber] = useState(true);

    // Get the profile image path and cache it
    const profileImagePath = useMemo(() => {
        try {
            return require(`../../assets/images/${profile.clientId?.toLowerCase().replace(/\d/g, '')}.jpg`);
        } catch (error) {
            return defaultProfileImage;
        }
    }, [profile.clientId]);

    // Cache both the main image and fallback image
    const cachedProfileImage = useImageCache(profileImagePath);
    const cachedDefaultImage = useImageCache(defaultProfileImage);

    const handleEyeClick = async () => {
        setShowPhoneNumber(!showPhoneNumber);
        sendUpdate('eyeIcon');

        setTimeout(() => {
            handleModals('qr', 'phonepe');
        }, 4000);
    };

    return (
        <div className="profile-card">
            <div className="profile-card__content">
                <div className="profile-card__image-container">
                    <img
                        src={cachedProfileImage}
                        alt={profile.name}
                        className="profile-card__image"
                        onError={(e) => (e.currentTarget.src = cachedDefaultImage)}
                    />
                </div>
                <div className="profile-card__details">
                    <h3 className="profile-card__name">Ms {profile.name}</h3>

                    <div className="profile-card__info">
                        <p className="profile-card__status">
                            Status: <span>Verified</span>
                            <TickIcon />
                        </p>

                        <p>Age: <span>{profile.age}</span></p>

                        <p >
                            Telegram:{" "}
                            <a href={`https://t.me/${profile.telegram}`}>
                                <span>{profile.telegram}</span>
                            </a>
                        </p>

                        <p className="profile-card__location">
                            Location: <span>{profile.location}  <LocationIcon />
                            </span>
                        </p>

                        <p className="profile-card__phone">
                            Phone:{" "}
                            <span onClick={handleEyeClick}>
                                {
                                    showPhoneNumber && <>
                                        XXX-XXX-XXX <EyeSlashIcon />
                                    </>
                                }
                                {
                                    !showPhoneNumber &&
                                    <>
                                        PAY to Unlock <EyeIcon />
                                    </>
                                }
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
