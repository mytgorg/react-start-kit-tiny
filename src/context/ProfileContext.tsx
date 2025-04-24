import React, { createContext, useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Profile } from '../types/profile';
import { getActiveProfile, setProfiles, setActiveProfile } from '../profiles';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

interface ProfileContextType {
  profile: Profile | null;
  setProfile: (profile: Profile) => void;
  isLoading: boolean;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams<{ user?: string }>();
  const user = params?.user?.toLowerCase() || getActiveProfile();

  useEffect(() => {
    const fetchProfile = async () => {
      if (user) {
        setIsLoading(true);
        try {
          setActiveProfile(user);
          const profilesData = await setProfiles(user);
          if (profilesData[user]) {
            setProfile(profilesData[user]);
          } else {
            throw new Error('Profile not found');
          }
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          setProfile({
            telegram: user,
            clientId: user,
            name: user?.toUpperCase() || "Reddy Girl",
            age: 23,
            location: "Hyderabad",
            product: "",
            upi: ""
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ProfileContext.Provider value={{ profile, setProfile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};