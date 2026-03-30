// Internationalization (i18n) system for the Pomodoro study app
// Simple string dictionary approach with language detection and fallbacks

export type Language = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'pt' | 'ru';

export interface TranslationStrings {
  // Common UI
  common: {
    start: string;
    pause: string;
    stop: string;
    reset: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    close: string;
    back: string;
    next: string;
    previous: string;
    loading: string;
    error: string;
    success: string;
    warning: string;
    info: string;
    yes: string;
    no: string;
    ok: string;
    retry: string;
  };

  // Timer and Study Session
  timer: {
    workSession: string;
    breakTime: string;
    longBreak: string;
    session: string;
    minutes: string;
    seconds: string;
    sessionComplete: string;
    breakComplete: string;
    startStudying: string;
    continueBreak: string;
    focusLevel: string;
    howFocused: string;
    demoMode: string;
    skipSession: string;
    skipBreak: string;
    sessionsToday: string;
    currentFocus: string;
    distractions: string;
  };

  // Focus descriptions
  focus: {
    struggling: string;
    decent: string;
    good: string;
    excellent: string;
    level1: string;
    level2: string;
    level3: string;
    level4: string;
    level5: string;
  };

  // Onboarding
  onboarding: {
    welcome: string;
    subtitle: string;
    studyWithStory: string;
    description: string;
    getStarted: string;
    howItWorks: string;
    step1Title: string;
    step1Description: string;
    step2Title: string;
    step2Description: string;
    step3Title: string;
    step3Description: string;
  };

  // Journal and Reflection
  journal: {
    title: string;
    sessionHistory: string;
    reflection: string;
    insights: string;
    progress: string;
    export: string;
    import: string;
    searchJournal: string;
    noEntries: string;
    writeReflection: string;
    howWasSession: string;
    whatDidYouLearn: string;
    challengesFaced: string;
    improvementAreas: string;
  };

  // Story/Narrative
  story: {
    storyProgresses: string;
    encountersChallenge: string;
    heroSucceeds: string;
    heroStruggles: string;
    questContinues: string;
    wisdomGained: string;
    mysteriousPath: string;
    dragonEncounter: string;
    victorious: string;
    needsReflection: string;
  };

  // Statistics
  stats: {
    dashboard: string;
    totalSessions: string;
    studyTime: string;
    averageFocus: string;
    completionRate: string;
    streakCount: string;
    weeklyProgress: string;
    monthlyStats: string;
    topSubjects: string;
    productivity: string;
    insights: string;
  };

  // Flashcards
  flashcards: {
    title: string;
    study: string;
    browse: string;
    create: string;
    front: string;
    back: string;
    tags: string;
    showAnswer: string;
    hideAnswer: string;
    difficulty: string;
    again: string;
    hard: string;
    good: string;
    easy: string;
    perfect: string;
    trivial: string;
    dueCards: string;
    newCards: string;
    allCards: string;
    noCards: string;
    createFirstCard: string;
    spacedRepetition: string;
    reviewSession: string;
    cardProgress: string;
  };

  // Scheduler
  scheduler: {
    title: string;
    calendar: string;
    schedule: string;
    scheduleSession: string;
    editSession: string;
    sessionTitle: string;
    subject: string;
    description: string;
    dateTime: string;
    duration: string;
    priority: string;
    type: string;
    reminders: string;
    recurring: string;
    export: string;
    upcomingSessions: string;
    noSessions: string;
    sessionTypes: {
      study: string;
      review: string;
      project: string;
      examPrep: string;
      break: string;
    };
    priorities: {
      low: string;
      medium: string;
      high: string;
    };
  };

  // Accessibility
  accessibility: {
    title: string;
    visualSettings: string;
    audioSettings: string;
    navigationSettings: string;
    highContrast: string;
    reduceMotion: string;
    fontSize: string;
    soundEffects: string;
    autoplayAudio: string;
    keyboardNavigation: string;
    screenReader: string;
    testScreenReader: string;
    keyboardShortcuts: string;
    resetSettings: string;
  };

  // Settings
  settings: {
    title: string;
    general: string;
    notifications: string;
    appearance: string;
    language: string;
    timezone: string;
    theme: string;
    autoSave: string;
    enableNotifications: string;
    soundVolume: string;
    exportData: string;
    importData: string;
    resetApp: string;
  };

  // Notifications and Messages
  notifications: {
    sessionStarted: string;
    sessionPaused: string;
    sessionCompleted: string;
    breakStarted: string;
    breakCompleted: string;
    focusDecreased: string;
    distractionDetected: string;
    stayFocused: string;
    welcomeBack: string;
    dataExported: string;
    dataImported: string;
    settingsSaved: string;
    flashcardCreated: string;
    sessionScheduled: string;
  };

  // Error Messages
  errors: {
    somethingWentWrong: string;
    failedToSave: string;
    failedToLoad: string;
    invalidFile: string;
    networkError: string;
    permissionDenied: string;
    sessionNotFound: string;
    flashcardError: string;
  };
}

// English translations (default)
const en: TranslationStrings = {
  common: {
    start: 'Start',
    pause: 'Pause',
    stop: 'Stop',
    reset: 'Reset',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    back: 'Back',
    next: 'Next',
    previous: 'Previous',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    yes: 'Yes',
    no: 'No',
    ok: 'OK',
    retry: 'Retry',
  },
  
  timer: {
    workSession: 'Work Session',
    breakTime: 'Break Time',
    longBreak: 'Long Break',
    session: 'Session',
    minutes: 'minutes',
    seconds: 'seconds',
    sessionComplete: 'Session Complete!',
    breakComplete: 'Break Complete!',
    startStudying: 'Start Studying',
    continueBreak: 'Continue Break',
    focusLevel: 'Focus Level',
    howFocused: 'How focused are you?',
    demoMode: 'Demo Mode',
    skipSession: 'Skip Session',
    skipBreak: 'Skip Break',
    sessionsToday: 'Sessions Today',
    currentFocus: 'Current Focus',
    distractions: 'Distractions',
  },

  focus: {
    struggling: 'Struggling to focus',
    decent: 'Decent focus',
    good: 'Good focus',
    excellent: 'Excellent focus',
    level1: 'Complete blackout',
    level2: 'Incorrect but familiar',
    level3: 'Incorrect, easy to recall',
    level4: 'Correct but difficult',
    level5: 'Perfect recall',
  },

  onboarding: {
    welcome: 'Welcome to Study Quest',
    subtitle: 'Study with a Story',
    studyWithStory: 'Study with a Story',
    description: 'Transform your study sessions into an epic adventure where your focus determines the hero\'s fate.',
    getStarted: 'Get Started',
    howItWorks: 'How It Works',
    step1Title: 'Start Your Session',
    step1Description: 'Begin a Pomodoro study session and set your focus level',
    step2Title: 'Study & Progress',
    step2Description: 'Stay focused as your hero\'s story unfolds based on your concentration',
    step3Title: 'Reflect & Grow',
    step3Description: 'Review your session and watch your story evolve with each study period',
  },

  journal: {
    title: 'Study Journal',
    sessionHistory: 'Session History',
    reflection: 'Reflection',
    insights: 'Insights',
    progress: 'Progress',
    export: 'Export',
    import: 'Import',
    searchJournal: 'Search journal...',
    noEntries: 'No journal entries yet',
    writeReflection: 'Write your reflection...',
    howWasSession: 'How was this study session?',
    whatDidYouLearn: 'What did you learn?',
    challengesFaced: 'What challenges did you face?',
    improvementAreas: 'Areas for improvement',
  },

  story: {
    storyProgresses: 'The story progresses...',
    encountersChallenge: 'The hero encounters a challenge...',
    heroSucceeds: 'The hero succeeds brilliantly!',
    heroStruggles: 'The hero struggles with the task...',
    questContinues: 'The quest continues with determination...',
    wisdomGained: 'Wisdom is gained through perseverance...',
    mysteriousPath: 'A mysterious path opens ahead...',
    dragonEncounter: 'A mighty dragon blocks the way!',
    victorious: 'Victory is achieved through focus!',
    needsReflection: 'Time for reflection and growth...',
  },

  stats: {
    dashboard: 'Statistics Dashboard',
    totalSessions: 'Total Sessions',
    studyTime: 'Study Time',
    averageFocus: 'Average Focus',
    completionRate: 'Completion Rate',
    streakCount: 'Streak Count',
    weeklyProgress: 'Weekly Progress',
    monthlyStats: 'Monthly Statistics',
    topSubjects: 'Top Subjects',
    productivity: 'Productivity',
    insights: 'Insights',
  },

  flashcards: {
    title: 'Flashcards',
    study: 'Study',
    browse: 'Browse Cards',
    create: 'Create',
    front: 'Front (Question)',
    back: 'Back (Answer)',
    tags: 'Tags',
    showAnswer: 'Show Answer',
    hideAnswer: 'Hide Answer',
    difficulty: 'Difficulty',
    again: 'Again',
    hard: 'Hard',
    good: 'Good',
    easy: 'Easy',
    perfect: 'Perfect',
    trivial: 'Trivial',
    dueCards: 'Due Cards',
    newCards: 'New Cards',
    allCards: 'All Cards',
    noCards: 'No cards to review',
    createFirstCard: 'Create your first card',
    spacedRepetition: 'Spaced repetition learning system',
    reviewSession: 'Review session completed!',
    cardProgress: 'Card {current} of {total}',
  },

  scheduler: {
    title: 'Study Scheduler',
    calendar: 'Calendar',
    schedule: 'Schedule',
    scheduleSession: 'Schedule Session',
    editSession: 'Edit Session',
    sessionTitle: 'Session Title',
    subject: 'Subject',
    description: 'Description',
    dateTime: 'Date & Time',
    duration: 'Duration',
    priority: 'Priority',
    type: 'Type',
    reminders: 'Reminders',
    recurring: 'Recurring',
    export: 'Export',
    upcomingSessions: 'Upcoming Sessions',
    noSessions: 'No sessions scheduled',
    sessionTypes: {
      study: 'Study',
      review: 'Review',
      project: 'Project',
      examPrep: 'Exam Prep',
      break: 'Break',
    },
    priorities: {
      low: 'Low',
      medium: 'Medium',
      high: 'High',
    },
  },

  accessibility: {
    title: 'Accessibility Settings',
    visualSettings: 'Visual Settings',
    audioSettings: 'Audio Settings',
    navigationSettings: 'Navigation Settings',
    highContrast: 'High Contrast Mode',
    reduceMotion: 'Reduce Motion',
    fontSize: 'Font Size',
    soundEffects: 'Sound Effects',
    autoplayAudio: 'Autoplay Audio',
    keyboardNavigation: 'Enhanced Keyboard Navigation',
    screenReader: 'Screen Reader Optimization',
    testScreenReader: 'Test Screen Reader',
    keyboardShortcuts: 'Keyboard Shortcuts',
    resetSettings: 'Reset Settings',
  },

  settings: {
    title: 'Settings',
    general: 'General',
    notifications: 'Notifications',
    appearance: 'Appearance',
    language: 'Language',
    timezone: 'Timezone',
    theme: 'Theme',
    autoSave: 'Auto Save',
    enableNotifications: 'Enable Notifications',
    soundVolume: 'Sound Volume',
    exportData: 'Export Data',
    importData: 'Import Data',
    resetApp: 'Reset App',
  },

  notifications: {
    sessionStarted: 'Study session started',
    sessionPaused: 'Study session paused',
    sessionCompleted: 'Study session completed',
    breakStarted: 'Break time started',
    breakCompleted: 'Break completed',
    focusDecreased: 'Focus decreased due to distractions',
    distractionDetected: 'Distraction detected!',
    stayFocused: 'Stay focused on your studies',
    welcomeBack: 'Welcome back! Stay focused.',
    dataExported: 'Data exported successfully',
    dataImported: 'Data imported successfully',
    settingsSaved: 'Settings saved',
    flashcardCreated: 'Flashcard created!',
    sessionScheduled: 'Study session scheduled!',
  },

  errors: {
    somethingWentWrong: 'Something went wrong',
    failedToSave: 'Failed to save data',
    failedToLoad: 'Failed to load data',
    invalidFile: 'Invalid file format',
    networkError: 'Network error occurred',
    permissionDenied: 'Permission denied',
    sessionNotFound: 'Session not found',
    flashcardError: 'Error with flashcard operation',
  },
};

// Add Spanish translations
const es: TranslationStrings = {
  common: {
    start: 'Iniciar',
    pause: 'Pausar',
    stop: 'Detener',
    reset: 'Reiniciar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar',
    back: 'Atrás',
    next: 'Siguiente',
    previous: 'Anterior',
    loading: 'Cargando...',
    error: 'Error',
    success: 'Éxito',
    warning: 'Advertencia',
    info: 'Información',
    yes: 'Sí',
    no: 'No',
    ok: 'OK',
    retry: 'Reintentar',
  },
  
  timer: {
    workSession: 'Sesión de Trabajo',
    breakTime: 'Descanso',
    longBreak: 'Descanso Largo',
    session: 'Sesión',
    minutes: 'minutos',
    seconds: 'segundos',
    sessionComplete: '¡Sesión Completada!',
    breakComplete: '¡Descanso Completado!',
    startStudying: 'Comenzar Estudio',
    continueBreak: 'Continuar Descanso',
    focusLevel: 'Nivel de Concentración',
    howFocused: '¿Qué tan concentrado estás?',
    demoMode: 'Modo Demo',
    skipSession: 'Saltar Sesión',
    skipBreak: 'Saltar Descanso',
    sessionsToday: 'Sesiones Hoy',
    currentFocus: 'Concentración Actual',
    distractions: 'Distracciones',
  },

  focus: {
    struggling: 'Luchando por concentrarse',
    decent: 'Concentración decente',
    good: 'Buena concentración',
    excellent: 'Excelente concentración',
    level1: 'Bloqueo total',
    level2: 'Incorrecto pero familiar',
    level3: 'Incorrecto, fácil de recordar',
    level4: 'Correcto pero difícil',
    level5: 'Recuerdo perfecto',
  },

  // Add more Spanish translations...
  onboarding: en.onboarding, // Placeholder - would be fully translated
  journal: en.journal,
  story: en.story,
  stats: en.stats,
  flashcards: en.flashcards,
  scheduler: en.scheduler,
  accessibility: en.accessibility,
  settings: en.settings,
  notifications: en.notifications,
  errors: en.errors,
};

// Translation store
const translations: Record<Language, TranslationStrings> = {
  en,
  es,
  fr: en, // Placeholder - would be fully translated
  de: en, // Placeholder - would be fully translated
  ja: en, // Placeholder - would be fully translated
  zh: en, // Placeholder - would be fully translated
  pt: en, // Placeholder - would be fully translated
  ru: en, // Placeholder - would be fully translated
};

// Language detection and management
export class I18nManager {
  private static currentLanguage: Language = 'en';
  private static readonly STORAGE_KEY = 'pomodoro-language';

  static getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  static setLanguage(language: Language): void {
    this.currentLanguage = language;
    localStorage.setItem(this.STORAGE_KEY, language);
  }

  static detectLanguage(): Language {
    // Try to get from localStorage first
    const stored = localStorage.getItem(this.STORAGE_KEY) as Language;
    if (stored && translations[stored]) {
      return stored;
    }

    // Detect from browser
    const browserLang = navigator.language.slice(0, 2) as Language;
    if (translations[browserLang]) {
      return browserLang;
    }

    // Default to English
    return 'en';
  }

  static initialize(): void {
    this.currentLanguage = this.detectLanguage();
  }

  static getTranslations(): TranslationStrings {
    return translations[this.currentLanguage] || translations.en;
  }

  static translate(key: string): string {
    const keys = key.split('.');
    let current: any = this.getTranslations();
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        console.warn(`Translation key not found: ${key}`);
        return key;
      }
    }
    
    return typeof current === 'string' ? current : key;
  }

  static formatMessage(key: string, params: Record<string, string | number> = {}): string {
    let message = this.translate(key);
    
    Object.entries(params).forEach(([param, value]) => {
      message = message.replace(`{${param}}`, String(value));
    });
    
    return message;
  }

  static getAvailableLanguages(): { code: Language; name: string; nativeName: string }[] {
    return [
      { code: 'en', name: 'English', nativeName: 'English' },
      { code: 'es', name: 'Spanish', nativeName: 'Español' },
      { code: 'fr', name: 'French', nativeName: 'Français' },
      { code: 'de', name: 'German', nativeName: 'Deutsch' },
      { code: 'ja', name: 'Japanese', nativeName: '日本語' },
      { code: 'zh', name: 'Chinese', nativeName: '中文' },
      { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
      { code: 'ru', name: 'Russian', nativeName: 'Русский' },
    ];
  }
}

// React hook for translations
import { useState } from 'react';

export function useTranslation() {
  const [language, setLanguageState] = useState(I18nManager.getCurrentLanguage());

  const setLanguage = (lang: Language) => {
    I18nManager.setLanguage(lang);
    setLanguageState(lang);
  };

  const t = (key: string) => I18nManager.translate(key);
  const formatMessage = (key: string, params?: Record<string, string | number>) => 
    I18nManager.formatMessage(key, params);

  return {
    language,
    setLanguage,
    t,
    formatMessage,
    availableLanguages: I18nManager.getAvailableLanguages(),
  };
}

// Initialize i18n system
I18nManager.initialize();