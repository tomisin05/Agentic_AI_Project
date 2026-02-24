// Accessibility utilities and constants for the Pomodoro study app

export interface AccessibilitySettings {
  reduceMotion: boolean;
  highContrast: boolean;
  screenReaderOptimized: boolean;
  keyboardNavigationEnabled: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  soundEnabled: boolean;
  autoplayEnabled: boolean;
}

export const defaultAccessibilitySettings: AccessibilitySettings = {
  reduceMotion: false,
  highContrast: false,
  screenReaderOptimized: false,
  keyboardNavigationEnabled: true,
  fontSize: 'medium',
  soundEnabled: true,
  autoplayEnabled: true,
};

// ARIA labels and descriptions
export const ariaLabels = {
  // Timer
  timer: {
    start: 'Start study session timer',
    pause: 'Pause study session timer',
    reset: 'Reset timer to beginning',
    skipSession: 'Skip current session for demo purposes',
    toggleDemo: 'Toggle demo mode for quick navigation',
    focusIncrease: 'Increase focus level rating',
    focusDecrease: 'Decrease focus level rating',
  },
  
  // Focus tracking
  focus: {
    level: (level: number) => `Current focus level: ${level} out of 5`,
    tracker: 'Rate your current focus level from 1 to 5',
    distraction: (count: number) => `${count} distractions detected this session`,
  },
  
  // Navigation
  navigation: {
    mainMenu: 'Main navigation menu',
    studyView: 'Switch to study view',
    journalView: 'Switch to journal view',
    statsView: 'Switch to statistics view',
    flashcardsView: 'Switch to flashcards view',
    schedulerView: 'Switch to scheduler view',
    settingsView: 'Switch to settings view',
  },
  
  // Study components
  study: {
    sessionComplete: 'Study session completed',
    breakTime: 'Break time started',
    storyProgression: 'Story progression based on focus level',
    checkIn: 'Session reflection and check-in modal',
  },
  
  // Forms
  forms: {
    required: 'This field is required',
    optional: 'This field is optional',
    save: 'Save changes',
    cancel: 'Cancel and discard changes',
    delete: 'Delete item',
    export: 'Export data',
    import: 'Import data',
  },
  
  // Flashcards
  flashcards: {
    showAnswer: 'Reveal the answer to this flashcard',
    hideAnswer: 'Hide the answer to this flashcard',
    nextCard: 'Move to next flashcard',
    previousCard: 'Move to previous flashcard',
    difficulty: (level: number, description: string) => `Rate difficulty as ${level}: ${description}`,
    cardProgress: (current: number, total: number) => `Card ${current} of ${total}`,
  },
  
  // Calendar/Scheduler
  calendar: {
    selectDate: 'Select date for scheduling',
    scheduleSession: 'Schedule a new study session',
    editSession: 'Edit scheduled session',
    deleteSession: 'Delete scheduled session',
    exportCalendar: 'Export session to calendar application',
  }
};

// Screen reader announcements
export const announcements = {
  sessionStarted: 'Study session started',
  sessionPaused: 'Study session paused',
  sessionCompleted: 'Study session completed',
  breakStarted: 'Break time started',
  breakCompleted: 'Break completed, ready for next study session',
  focusLevelChanged: (level: number) => `Focus level updated to ${level} out of 5`,
  timerWarning: (minutes: number) => `${minutes} minutes remaining in session`,
  distractionDetected: 'Distraction detected, please return focus to your studies',
  storyProgression: (success: boolean) => success ? 'Story progresses successfully' : 'Story encounters challenge',
};

// Keyboard shortcuts
export const keyboardShortcuts = {
  'space': 'Toggle timer (start/pause)',
  'r': 'Reset timer',
  's': 'Skip session (demo mode)',
  'd': 'Toggle demo mode',
  'j': 'Open journal view',
  'f': 'Open flashcards',
  'c': 'Open calendar/scheduler',
  'escape': 'Close modal or return to main view',
  'enter': 'Activate focused element',
  'tab': 'Navigate to next element',
  'shift+tab': 'Navigate to previous element',
  'arrow keys': 'Navigate between options',
};

// Color contrast utilities
export const getContrastText = (backgroundColor: string): string => {
  // Simple implementation - in production, use proper color contrast calculation
  const darkColors = ['#000', '#333', '#030213', '#1a1a1a'];
  const isDark = darkColors.some(color => backgroundColor.includes(color));
  return isDark ? '#ffffff' : '#000000';
};

// Focus management utilities
export class FocusManager {
  private static focusHistory: HTMLElement[] = [];
  
  static saveFocus(): void {
    const activeElement = document.activeElement as HTMLElement;
    if (activeElement && activeElement !== document.body) {
      this.focusHistory.push(activeElement);
    }
  }
  
  static restoreFocus(): void {
    const lastFocused = this.focusHistory.pop();
    if (lastFocused && document.contains(lastFocused)) {
      lastFocused.focus();
    }
  }
  
  static trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];
    
    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
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
      }
    };
    
    container.addEventListener('keydown', handleTabKey);
    
    // Focus first element
    if (firstElement) {
      firstElement.focus();
    }
    
    // Return cleanup function
    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  }
}

// Screen reader utilities
export class ScreenReaderAnnouncer {
  private static liveRegion: HTMLElement | null = null;
  
  static initialize(): void {
    if (!this.liveRegion) {
      this.liveRegion = document.createElement('div');
      this.liveRegion.setAttribute('aria-live', 'polite');
      this.liveRegion.setAttribute('aria-atomic', 'true');
      this.liveRegion.setAttribute('class', 'sr-only');
      this.liveRegion.style.position = 'absolute';
      this.liveRegion.style.left = '-10000px';
      this.liveRegion.style.width = '1px';
      this.liveRegion.style.height = '1px';
      this.liveRegion.style.overflow = 'hidden';
      document.body.appendChild(this.liveRegion);
    }
  }
  
  static announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    if (!this.liveRegion) {
      this.initialize();
    }
    
    if (this.liveRegion) {
      this.liveRegion.setAttribute('aria-live', priority);
      this.liveRegion.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        if (this.liveRegion) {
          this.liveRegion.textContent = '';
        }
      }, 1000);
    }
  }
}

// Motion preferences
export const getReducedMotionSettings = (): boolean => {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

// High contrast detection
export const getHighContrastPreference = (): boolean => {
  return window.matchMedia('(prefers-contrast: high)').matches;
};

// Text size utilities
export const fontSizeClasses = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
  'extra-large': 'text-xl',
};

// Accessibility settings management
export class AccessibilityManager {
  private static readonly STORAGE_KEY = 'pomodoro-accessibility-settings';
  
  static getSettings(): AccessibilitySettings {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return { ...defaultAccessibilitySettings, ...JSON.parse(stored) };
      }
    } catch (error) {
      console.error('Failed to load accessibility settings:', error);
    }
    
    // Auto-detect system preferences
    return {
      ...defaultAccessibilitySettings,
      reduceMotion: getReducedMotionSettings(),
      highContrast: getHighContrastPreference(),
    };
  }
  
  static saveSettings(settings: AccessibilitySettings): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save accessibility settings:', error);
    }
  }
  
  static applySettings(settings: AccessibilitySettings): void {
    const root = document.documentElement;
    
    // Apply font size
    root.style.fontSize = settings.fontSize === 'small' ? '14px' : 
                         settings.fontSize === 'large' ? '18px' :
                         settings.fontSize === 'extra-large' ? '20px' : '16px';
    
    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    
    // Apply reduced motion
    if (settings.reduceMotion) {
      root.classList.add('reduce-motion');
    } else {
      root.classList.remove('reduce-motion');
    }
  }
}

// Initialize accessibility features
export const initializeAccessibility = (): void => {
  ScreenReaderAnnouncer.initialize();
  
  const settings = AccessibilityManager.getSettings();
  AccessibilityManager.applySettings(settings);
  
  // Add keyboard navigation styles
  const style = document.createElement('style');
  style.textContent = `
    .focus-visible {
      outline: 2px solid #3b82f6;
      outline-offset: 2px;
    }
    
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
    
    .high-contrast {
      --background: #ffffff;
      --foreground: #000000;
      --primary: #0000ff;
      --secondary: #666666;
      --border: #000000;
    }
    
    .reduce-motion * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  `;
  document.head.appendChild(style);
};