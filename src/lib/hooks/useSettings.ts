// Custom React Hook for User Settings Management

import { useState, useEffect } from 'react';
import { UserSettings } from '../types';
import {
  getUserSettings as getUserSettingsDB,
  updateUserSettings as updateUserSettingsDB
} from '../firebase/db';

export const useSettings = (userId: string | undefined) => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchSettings = async () => {
      try {
        const userSettings = await getUserSettingsDB(userId);
        
        // If no settings exist, create default settings
        if (!userSettings) {
          const defaultSettings: UserSettings = {
            userId,
            language: 'ko',
            notifications: {
              enabled: true,
              sound: true,
              vibration: true,
              advanceReminder: 0
            },
            theme: 'light',
            fontSize: 'large', // Large for elderly users
            weekStartsOn: 'sunday',
            updatedAt: new Date()
          };
          
          // Save default settings
          await updateUserSettingsDB(userId, defaultSettings);
          setSettings(defaultSettings);
        } else {
          setSettings(userSettings);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, [userId]);

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!userId) {
      throw new Error('User ID is required to update settings');
    }

    try {
      await updateUserSettingsDB(userId, updates);
      
      // Update local state
      setSettings(prev => prev ? { ...prev, ...updates, updatedAt: new Date() } : null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const updateLanguage = async (language: 'ko' | 'en') => {
    await updateSettings({ language });
  };

  const updateNotifications = async (notifications: Partial<UserSettings['notifications']>) => {
    if (!settings) return;
    
    await updateSettings({
      notifications: {
        ...settings.notifications,
        ...notifications
      }
    });
  };

  const updateTheme = async (theme: 'light' | 'dark' | 'system') => {
    await updateSettings({ theme });
  };

  const updateFontSize = async (fontSize: 'small' | 'medium' | 'large') => {
    await updateSettings({ fontSize });
  };

  const updateWeekStartsOn = async (weekStartsOn: 'sunday' | 'monday') => {
    await updateSettings({ weekStartsOn });
  };

  return {
    settings,
    loading,
    error,
    updateSettings,
    updateLanguage,
    updateNotifications,
    updateTheme,
    updateFontSize,
    updateWeekStartsOn
  };
};
