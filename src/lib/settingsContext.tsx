import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { accessibilitySystem, AccessibilitySettings } from './accessibility';
import { useTranslation, SupportedLanguage } from './i18n';
import { PomodoroPreset } from '../components/SessionPresets';

interface SettingsContextType {
  // Accessibility
  accessibilitySettings: AccessibilitySettings;
  updateAccessibilitySetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  
  // Language
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  
  // Pomodoro Preset
  currentPreset: PomodoroPreset | null;
  setCurrentPreset: (preset: PomodoroPreset) => void;
  
  // Notifications
  notificationsEnabled: boolean;
  setNotificationsEnabled: (enabled: boolean) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const { language, setLanguage } = useTranslation();
  const [accessibilitySettings, setAccessibilitySettings] = useState<AccessibilitySettings>(
    accessibilitySystem.getSettings()
  );
  const [currentPreset, setCurrentPresetState] = useState<PomodoroPreset | null>(null);
  const [notificationsEnabled, setNotificationsEnabledState] = useState(() => {
    return localStorage.getItem('notifications-enabled') !== 'false';
  });

  // Load current preset from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('current-pomodoro-preset');
    if (saved) {
      try {
        setCurrentPresetState(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load preset:', error);
      }
    }
  }, []);

  // Subscribe to accessibility changes
  useEffect(() => {
    const unsubscribe = accessibilitySystem.subscribe('settings-changed', (newSettings: AccessibilitySettings) => {
      setAccessibilitySettings(newSettings);
    });
    return unsubscribe;
  }, []);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast
    if (accessibilitySettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Reduced motion
    if (accessibilitySettings.reduceMotion) {
      root.style.setProperty('--motion-reduce', '0');
    } else {
      root.style.removeProperty('--motion-reduce');
    }
    
    // Font size
    const fontSizes = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'extra-large': '20px'
    };
    root.style.setProperty('--base-font-size', fontSizes[accessibilitySettings.fontSize]);
    
    // Sound effects
    if (!accessibilitySettings.soundEffects) {
      root.setAttribute('data-sound-disabled', 'true');
    } else {
      root.removeAttribute('data-sound-disabled');
    }
  }, [accessibilitySettings]);

  const updateAccessibilitySetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    accessibilitySystem.updateSetting(key, value);
  };

  const setCurrentPreset = (preset: PomodoroPreset) => {
    setCurrentPresetState(preset);
    localStorage.setItem('current-pomodoro-preset', JSON.stringify(preset));
  };

  const setNotificationsEnabled = (enabled: boolean) => {
    setNotificationsEnabledState(enabled);
    localStorage.setItem('notifications-enabled', enabled.toString());
  };

  return (
    <SettingsContext.Provider
      value={{
        accessibilitySettings,
        updateAccessibilitySetting,
        language,
        setLanguage,
        currentPreset,
        setCurrentPreset,
        notificationsEnabled,
        setNotificationsEnabled,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
}
