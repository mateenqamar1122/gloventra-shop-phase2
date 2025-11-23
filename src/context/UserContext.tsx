import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Address {
  id: string;
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  addresses: Address[];
  defaultAddressId?: string;
}

interface UserContextType {
  profile: UserProfile | null;
  updateProfile: (updates: Partial<UserProfile>) => void;
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, updates: Partial<Address>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | null;
  loading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'gloventra_user_profile';

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load profile from localStorage on mount
  useEffect(() => {
    const loadProfile = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          setProfile(JSON.parse(stored));
        } else {
          // Initialize with default profile
          const defaultProfile: UserProfile = {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            avatarUrl: 'https://github.com/shadcn.png',
            addresses: [],
          };
          setProfile(defaultProfile);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
        }
      } catch (error) {
        console.error('Failed to load user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Save profile to localStorage whenever it changes
  const saveProfile = (updatedProfile: UserProfile) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
      setProfile(updatedProfile);
    } catch (error) {
      console.error('Failed to save user profile:', error);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!profile) return;

    const updatedProfile = { ...profile, ...updates };
    saveProfile(updatedProfile);
  };

  const addAddress = (addressData: Omit<Address, 'id'>) => {
    if (!profile) return;

    const newAddress: Address = {
      ...addressData,
      id: Date.now().toString(),
    };

    // If this is the first address or marked as default, make it default
    const updatedAddresses = [...profile.addresses, newAddress];
    let defaultAddressId = profile.defaultAddressId;

    if (newAddress.isDefault || updatedAddresses.length === 1) {
      // Remove default from other addresses
      updatedAddresses.forEach(addr => {
        if (addr.id !== newAddress.id) {
          addr.isDefault = false;
        }
      });
      newAddress.isDefault = true;
      defaultAddressId = newAddress.id;
    }

    const updatedProfile = {
      ...profile,
      addresses: updatedAddresses,
      defaultAddressId,
    };

    saveProfile(updatedProfile);
  };

  const updateAddress = (id: string, updates: Partial<Address>) => {
    if (!profile) return;

    const updatedAddresses = profile.addresses.map(addr =>
      addr.id === id ? { ...addr, ...updates } : addr
    );

    let defaultAddressId = profile.defaultAddressId;

    // If this address is being set as default
    if (updates.isDefault) {
      updatedAddresses.forEach(addr => {
        if (addr.id !== id) {
          addr.isDefault = false;
        }
      });
      defaultAddressId = id;
    }

    const updatedProfile = {
      ...profile,
      addresses: updatedAddresses,
      defaultAddressId,
    };

    saveProfile(updatedProfile);
  };

  const deleteAddress = (id: string) => {
    if (!profile) return;

    const updatedAddresses = profile.addresses.filter(addr => addr.id !== id);
    let defaultAddressId = profile.defaultAddressId;

    // If we're deleting the default address, set first remaining as default
    if (id === profile.defaultAddressId && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
      defaultAddressId = updatedAddresses[0].id;
    } else if (id === profile.defaultAddressId) {
      defaultAddressId = undefined;
    }

    const updatedProfile = {
      ...profile,
      addresses: updatedAddresses,
      defaultAddressId,
    };

    saveProfile(updatedProfile);
  };

  const setDefaultAddress = (id: string) => {
    if (!profile) return;

    const updatedAddresses = profile.addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === id,
    }));

    const updatedProfile = {
      ...profile,
      addresses: updatedAddresses,
      defaultAddressId: id,
    };

    saveProfile(updatedProfile);
  };

  const getDefaultAddress = (): Address | null => {
    if (!profile || !profile.defaultAddressId) return null;
    return profile.addresses.find(addr => addr.id === profile.defaultAddressId) || null;
  };

  return (
    <UserContext.Provider
      value={{
        profile,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
        loading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within UserProvider');
  }
  return context;
};
