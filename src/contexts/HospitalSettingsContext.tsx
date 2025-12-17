import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import ApiService from '../services/apiService';

interface HospitalSettings {
    id: number;
    hospital_name: string;
    hospital_abbreviation: string;
    address: string | null;
    phone: string | null;
    email: string | null;
    logo_url: string | null;
}

interface HospitalSettingsContextType {
    settings: HospitalSettings | null;
    loading: boolean;
    error: string | null;
    refreshSettings: () => Promise<void>;
    updateSettings: (data: Partial<HospitalSettings>) => Promise<void>;
}

const HospitalSettingsContext = createContext<HospitalSettingsContextType | undefined>(undefined);

export const HospitalSettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [settings, setSettings] = useState<HospitalSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await ApiService.getHospitalSettings();
            setSettings(data);
        } catch (err: any) {
            console.error('Failed to fetch hospital settings:', err);
            setError(err.message || 'Failed to load hospital settings');
            // Set default fallback settings
            setSettings({
                id: 1,
                hospital_name: 'Archmedics Hospital',
                hospital_abbreviation: 'ARC',
                address: null,
                phone: null,
                email: null,
                logo_url: null
            });
        } finally {
            setLoading(false);
        }
    };

    const refreshSettings = async () => {
        await fetchSettings();
    };

    const updateSettings = async (data: Partial<HospitalSettings>) => {
        try {
            const updated = await ApiService.updateHospitalSettings(data as any);
            setSettings(updated);
        } catch (err: any) {
            console.error('Failed to update hospital settings:', err);
            throw err;
        }
    };

    useEffect(() => {
        fetchSettings();
    }, []);

    return (
        <HospitalSettingsContext.Provider value={{ settings, loading, error, refreshSettings, updateSettings }}>
            {children}
        </HospitalSettingsContext.Provider>
    );
};

export const useHospitalSettings = () => {
    const context = useContext(HospitalSettingsContext);
    if (context === undefined) {
        throw new Error('useHospitalSettings must be used within a HospitalSettingsProvider');
    }
    return context;
};
