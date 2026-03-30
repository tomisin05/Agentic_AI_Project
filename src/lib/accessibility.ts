/**
 * Accessibility utilities and system preferences detection
 */

export interface AccessibilitySettings {
  // Visual
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  
  // Audio
  soundEnabled: boolean;
  audioDescriptions: boolean;
  
  // Navigation
  keyboardNavigation: boolean;
  screenReaderOptimized: boolean;
  
  // Focus
  focusIndicators: boolean;
}

export const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  highContrast: false,
  reducedMotion: false,
  fontSize: 'medium',
  soundEnabled: true,
  audioDescriptions: false,
  keyboardNavigation: true,
  screenReaderOptimized: false,
  focusIndicators: true
};

/**
 * Accessibility System
 */
class AccessibilitySystem {
  private settings: AccessibilitySettings;
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    this.settings = this.loadSettings();
    this.applySystemPreferences();
    this.setupMediaQueryListeners();
  }

  /**
   * Load settings from localStorage
   */
  private loadSettings(): AccessibilitySettings {
    const stored = localStorage.getItem('accessibility-settings');
    if (stored) {
      try {
        return { ...DEFAULT_ACCESSIBILITY_SETTINGS, ...JSON.parse(stored) };
      } catch {
        return { ...DEFAULT_ACCESSIBILITY_SETTINGS };
      }
    }
    return { ...DEFAULT_ACCESSIBILITY_SETTINGS };
  }

  /**
   * Save settings to localStorage
   */
  private saveSettings(): void {
    localStorage.setItem('accessibility-settings', JSON.stringify(this.settings));
    this.applySettings();
    this.notifyListeners('settings-changed');
  }

  /**
   * Detect and apply system preferences
   */
  private applySystemPreferences(): void {
    // Check for prefers-reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      this.settings.reducedMotion = true;
    }

    // Check for prefers-contrast
    if (window.matchMedia('(prefers-contrast: more)').matches) {
      this.settings.highContrast = true;
    }
  }

  /**
   * Setup media query listeners for system preference changes
   */
  private setupMediaQueryListeners(): void {
    // Listen for reduced motion changes
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    motionQuery.addEventListener('change', (e) => {
      if (e.matches) {
        this.updateSetting('reducedMotion', true);
      }
    });

    // Listen for contrast changes
    const contrastQuery = window.matchMedia('(prefers-contrast: more)');
    contrastQuery.addEventListener('change', (e) => {
      if (e.matches) {
        this.updateSetting('highContrast', true);
      }
    });
  }

  /**
   * Apply settings to document
   */
  private applySettings(): void {
    const root = document.documentElement;

    // High contrast
    if (this.settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (this.settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Font size
    root.classList.remove('font-small', 'font-medium', 'font-large', 'font-extra-large');
    root.classList.add(`font-${this.settings.fontSize}`);

    // Focus indicators
    if (this.settings.focusIndicators) {
      root.classList.add('enhanced-focus');
    } else {
      root.classList.remove('enhanced-focus');
    }

    // Screen reader optimization
    if (this.settings.screenReaderOptimized) {
      root.classList.add('screen-reader-optimized');
    } else {
      root.classList.remove('screen-reader-optimized');
    }
  }

  /**
   * Get current settings
   */
  getSettings(): AccessibilitySettings {
    return { ...this.settings };
  }

  /**
   * Update a specific setting
   */
  updateSetting<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ): void {
    this.settings[key] = value;
    this.saveSettings();
  }

  /**
   * Update multiple settings at once
   */
  updateSettings(updates: Partial<AccessibilitySettings>): void {
    this.settings = { ...this.settings, ...updates };
    this.saveSettings();
  }

  /**
   * Reset to defaults
   */
  resetToDefaults(): void {
    this.settings = { ...DEFAULT_ACCESSIBILITY_SETTINGS };
    this.saveSettings();
  }

  /**
   * Subscribe to setting changes
   */
  subscribe(event: string, callback: Function): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);

    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(event);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  /**
   * Notify listeners of changes
   */
  private notifyListeners(event: string): void {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach(callback => callback(this.settings));
    }
  }

  /**
   * Announce to screen readers
   */
  announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only';
    announcement.textContent = message;

    document.body.appendChild(announcement);

    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  /**
   * Setup keyboard shortcuts
   */
  setupKeyboardShortcuts(shortcuts: Record<string, () => void>): () => void {
    const handler = (e: KeyboardEvent) => {
      if (!this.settings.keyboardNavigation) return;

      const key = e.key.toLowerCase();
      const withCtrl = e.ctrlKey || e.metaKey;
      const withShift = e.shiftKey;

      let shortcutKey = key;
      if (withCtrl) shortcutKey = `ctrl+${key}`;
      if (withShift) shortcutKey = `shift+${key}`;
      if (withCtrl && withShift) shortcutKey = `ctrl+shift+${key}`;

      if (shortcuts[shortcutKey]) {
        e.preventDefault();
        shortcuts[shortcutKey]();
      }
    };

    document.addEventListener('keydown', handler);

    // Return cleanup function
    return () => {
      document.removeEventListener('keydown', handler);
    };
  }

  /**
   * Trap focus within a container (for modals)
   */
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    container.addEventListener('keydown', handler);
    firstElement?.focus();

    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handler);
    };
  }

  /**
   * Check if reduced motion is preferred
   */
  prefersReducedMotion(): boolean {
    return this.settings.reducedMotion;
  }

  /**
   * Get animation duration based on preferences
   */
  getAnimationDuration(defaultDuration: number): number {
    return this.settings.reducedMotion ? 0 : defaultDuration;
  }
}

// Export singleton instance
export const accessibilitySystem = new AccessibilitySystem();

/**
 * React hook for accessibility settings
 */
export function useAccessibility() {
  const [settings, setSettings] = React.useState(accessibilitySystem.getSettings());

  React.useEffect(() => {
    const unsubscribe = accessibilitySystem.subscribe('settings-changed', (newSettings: AccessibilitySettings) => {
      setSettings(newSettings);
    });

    return unsubscribe;
  }, []);

  return {
    settings,
    updateSetting: (key: keyof AccessibilitySettings, value: any) => {
      accessibilitySystem.updateSetting(key, value);
    },
    updateSettings: (updates: Partial<AccessibilitySettings>) => {
      accessibilitySystem.updateSettings(updates);
    },
    resetToDefaults: () => {
      accessibilitySystem.resetToDefaults();
    },
    announce: (message: string, priority?: 'polite' | 'assertive') => {
      accessibilitySystem.announceToScreenReader(message, priority);
    },
    prefersReducedMotion: accessibilitySystem.prefersReducedMotion(),
    getAnimationDuration: (defaultDuration: number) => {
      return accessibilitySystem.getAnimationDuration(defaultDuration);
    }
  };
}

// Add React import for the hook
import React from 'react';
