/**
 * Internationalization (i18n) System
 * Supports multiple languages with automatic detection and fallback
 */

export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'ja' | 'zh' | 'pt' | 'ru';

export interface LanguageConfig {
  code: SupportedLanguage;
  name: string;
  nativeName: string;
  flag: string;
}

export const SUPPORTED_LANGUAGES: LanguageConfig[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' }
];

// Translation dictionary type
type TranslationDict = Record<string, string | Record<string, string>>;

// Translations for each language
const translations: Record<SupportedLanguage, TranslationDict> = {
  en: {
    // App
    appName: 'StoryStudy',
    tagline: 'Study with a Story',
    
    // Navigation
    home: 'Home',
    goals: 'Goals',
    timer: 'Timer',
    journal: 'Journal',
    stats: 'Statistics',
    flashcards: 'Flashcards',
    scheduler: 'Scheduler',
    settings: 'Settings',
    
    // Timer
    startSession: 'Start Session',
    pauseSession: 'Pause',
    resumeSession: 'Resume',
    stopSession: 'Stop',
    skipBreak: 'Skip Break',
    session: 'Session',
    break: 'Break',
    longBreak: 'Long Break',
    focusTime: 'Focus Time',
    
    // Check-in
    checkIn: 'Session Check-In',
    howFocused: 'How focused were you?',
    yourMood: 'What was your mood?',
    reflection: 'Reflection',
    reflectionPlaceholder: 'What did you learn or accomplish?',
    whichGoal: 'Which goal were you working on?',
    specificTask: 'Specific task?',
    madeProgress: 'Made progress',
    completedTask: 'Completed task',
    submitCheckIn: 'Submit',
    
    // Goals
    myGoals: 'My Goals',
    createGoal: 'Create Goal',
    editGoal: 'Edit Goal',
    goalTitle: 'Goal Title',
    goalType: 'Goal Type',
    deadline: 'Deadline',
    targetHours: 'Target Hours',
    dailyCommitment: 'Daily Commitment (minutes)',
    addTask: 'Add Task',
    taskName: 'Task Name',
    taskDueDate: 'Due Date',
    progress: 'Progress',
    onTrack: 'On Track',
    behindSchedule: 'Behind Schedule',
    aheadOfSchedule: 'Ahead of Schedule',
    completed: 'Completed',
    
    // Flashcards
    newCard: 'New Card',
    front: 'Front',
    back: 'Back',
    tags: 'Tags',
    studyNow: 'Study Now',
    dueCards: 'Due Cards',
    newCards: 'New Cards',
    allCards: 'All Cards',
    showAnswer: 'Show Answer',
    hideAnswer: 'Hide Answer',
    difficulty: 'Difficulty',
    again: 'Again',
    hard: 'Hard',
    good: 'Good',
    easy: 'Easy',
    perfect: 'Perfect',
    trivial: 'Trivial',
    
    // Scheduler
    schedule: 'Schedule',
    newSession: 'New Session',
    title: 'Title',
    subject: 'Subject',
    description: 'Description',
    date: 'Date',
    time: 'Time',
    duration: 'Duration',
    pomodoros: 'Pomodoros',
    sessionType: 'Session Type',
    priority: 'Priority',
    recurring: 'Recurring',
    reminder: 'Reminder',
    exportCalendar: 'Export to Calendar',
    
    // Statistics
    totalSessions: 'Total Sessions',
    totalStudyTime: 'Total Study Time',
    averageFocus: 'Average Focus',
    currentStreak: 'Current Streak',
    longestStreak: 'Longest Streak',
    successRate: 'Success Rate',
    today: 'Today',
    week: 'Week',
    month: 'Month',
    allTime: 'All Time',
    
    // Notifications
    sessionStarted: 'Session started!',
    sessionComplete: 'Session complete!',
    breakTime: 'Break time!',
    breakOver: 'Break over!',
    stayFocused: 'Stay focused!',
    
    // Accessibility
    accessibility: 'Accessibility',
    highContrast: 'High Contrast',
    reducedMotion: 'Reduced Motion',
    fontSize: 'Font Size',
    soundEffects: 'Sound Effects',
    keyboardNavigation: 'Keyboard Navigation',
    screenReader: 'Screen Reader',
    
    // Common
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    close: 'Close',
    confirm: 'Confirm',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info'
  },
  
  es: {
    appName: 'EstudioConHistoria',
    tagline: 'Estudia con una Historia',
    home: 'Inicio',
    goals: 'Objetivos',
    timer: 'Temporizador',
    journal: 'Diario',
    stats: 'Estadísticas',
    flashcards: 'Tarjetas',
    scheduler: 'Horario',
    settings: 'Ajustes',
    startSession: 'Iniciar Sesión',
    pauseSession: 'Pausar',
    resumeSession: 'Reanudar',
    stopSession: 'Detener',
    session: 'Sesión',
    break: 'Descanso',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    edit: 'Editar',
    close: 'Cerrar'
  },
  
  fr: {
    appName: 'ÉtudeAvecHistoire',
    tagline: 'Étudiez avec une Histoire',
    home: 'Accueil',
    goals: 'Objectifs',
    timer: 'Minuteur',
    journal: 'Journal',
    stats: 'Statistiques',
    flashcards: 'Cartes',
    scheduler: 'Planificateur',
    settings: 'Paramètres',
    startSession: 'Démarrer',
    pauseSession: 'Pause',
    resumeSession: 'Reprendre',
    stopSession: 'Arrêter',
    session: 'Session',
    break: 'Pause',
    save: 'Enregistrer',
    cancel: 'Annuler',
    delete: 'Supprimer',
    edit: 'Modifier',
    close: 'Fermer'
  },
  
  de: {
    appName: 'StudierenMitGeschichte',
    tagline: 'Lernen mit einer Geschichte',
    home: 'Startseite',
    goals: 'Ziele',
    timer: 'Timer',
    journal: 'Tagebuch',
    stats: 'Statistiken',
    flashcards: 'Karteikarten',
    scheduler: 'Planer',
    settings: 'Einstellungen',
    startSession: 'Sitzung starten',
    pauseSession: 'Pause',
    resumeSession: 'Fortsetzen',
    stopSession: 'Stoppen',
    session: 'Sitzung',
    break: 'Pause',
    save: 'Speichern',
    cancel: 'Abbrechen',
    delete: 'Löschen',
    edit: 'Bearbeiten',
    close: 'Schließen'
  },
  
  ja: {
    appName: 'ストーリースタディ',
    tagline: 'ストーリーと共に学ぶ',
    home: 'ホーム',
    goals: '目標',
    timer: 'タイマー',
    journal: '日記',
    stats: '統計',
    flashcards: '単語カード',
    scheduler: 'スケジュール',
    settings: '設定',
    startSession: 'セッション開始',
    pauseSession: '一時停止',
    resumeSession: '再開',
    stopSession: '停止',
    session: 'セッション',
    break: '休憩',
    save: '保存',
    cancel: 'キャンセル',
    delete: '削除',
    edit: '編集',
    close: '閉じる'
  },
  
  zh: {
    appName: '故事学习',
    tagline: '用故事学习',
    home: '首页',
    goals: '目标',
    timer: '计时器',
    journal: '日志',
    stats: '统计',
    flashcards: '闪卡',
    scheduler: '日程',
    settings: '设置',
    startSession: '开始会话',
    pauseSession: '暂停',
    resumeSession: '继续',
    stopSession: '停止',
    session: '会话',
    break: '休息',
    save: '保存',
    cancel: '取消',
    delete: '删除',
    edit: '编辑',
    close: '关闭'
  },
  
  pt: {
    appName: 'EstudoComHistória',
    tagline: 'Estude com uma História',
    home: 'Início',
    goals: 'Objetivos',
    timer: 'Temporizador',
    journal: 'Diário',
    stats: 'Estatísticas',
    flashcards: 'Cartões',
    scheduler: 'Agenda',
    settings: 'Configurações',
    startSession: 'Iniciar Sessão',
    pauseSession: 'Pausar',
    resumeSession: 'Retomar',
    stopSession: 'Parar',
    session: 'Sessão',
    break: 'Intervalo',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    close: 'Fechar'
  },
  
  ru: {
    appName: 'ИзучениеСИсторией',
    tagline: 'Учитесь с Историей',
    home: 'Главная',
    goals: 'Цели',
    timer: 'Таймер',
    journal: 'Журнал',
    stats: 'Статистика',
    flashcards: 'Карточки',
    scheduler: 'Расписание',
    settings: 'Настройки',
    startSession: 'Начать Сессию',
    pauseSession: 'Пауза',
    resumeSession: 'Продолжить',
    stopSession: 'Остановить',
    session: 'Сессия',
    break: 'Перерыв',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Редактировать',
    close: 'Закрыть'
  }
};

/**
 * i18n System Class
 */
class I18nSystem {
  private currentLanguage: SupportedLanguage = 'en';
  private listeners: Function[] = [];

  constructor() {
    this.loadLanguage();
  }

  /**
   * Load language from localStorage or detect from browser
   */
  private loadLanguage(): void {
    const stored = localStorage.getItem('language') as SupportedLanguage;
    if (stored && this.isSupported(stored)) {
      this.currentLanguage = stored;
    } else {
      this.currentLanguage = this.detectBrowserLanguage();
    }
  }

  /**
   * Detect browser language
   */
  private detectBrowserLanguage(): SupportedLanguage {
    const browserLang = navigator.language.split('-')[0] as SupportedLanguage;
    return this.isSupported(browserLang) ? browserLang : 'en';
  }

  /**
   * Check if language is supported
   */
  private isSupported(lang: string): lang is SupportedLanguage {
    return SUPPORTED_LANGUAGES.some(l => l.code === lang);
  }

  /**
   * Get current language
   */
  getLanguage(): SupportedLanguage {
    return this.currentLanguage;
  }

  /**
   * Set language
   */
  setLanguage(lang: SupportedLanguage): void {
    if (!this.isSupported(lang)) {
      console.warn(`Language ${lang} is not supported`);
      return;
    }

    this.currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    this.notifyListeners();
  }

  /**
   * Get translation
   */
  t(key: string, fallback?: string): string {
    const keys = key.split('.');
    let value: any = translations[this.currentLanguage];

    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to English
        value = translations['en'];
        for (const fk of keys) {
          if (value && typeof value === 'object' && fk in value) {
            value = value[fk];
          } else {
            return fallback || key;
          }
        }
        break;
      }
    }

    return typeof value === 'string' ? value : (fallback || key);
  }

  /**
   * Format message with variables
   */
  formatMessage(key: string, vars: Record<string, string | number>): string {
    let message = this.t(key);
    Object.entries(vars).forEach(([varKey, varValue]) => {
      message = message.replace(`{${varKey}}`, String(varValue));
    });
    return message;
  }

  /**
   * Subscribe to language changes
   */
  subscribe(callback: Function): () => void {
    this.listeners.push(callback);
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  /**
   * Notify listeners of language change
   */
  private notifyListeners(): void {
    this.listeners.forEach(callback => callback(this.currentLanguage));
  }

  /**
   * Get all supported languages
   */
  getSupportedLanguages(): LanguageConfig[] {
    return SUPPORTED_LANGUAGES;
  }

  /**
   * Get language config
   */
  getLanguageConfig(lang: SupportedLanguage): LanguageConfig | undefined {
    return SUPPORTED_LANGUAGES.find(l => l.code === lang);
  }
}

// Export singleton instance
export const i18n = new I18nSystem();

/**
 * React hook for i18n
 */
import React from 'react';

export function useTranslation() {
  const [language, setLanguage] = React.useState(i18n.getLanguage());

  React.useEffect(() => {
    const unsubscribe = i18n.subscribe((newLang: SupportedLanguage) => {
      setLanguage(newLang);
    });

    return unsubscribe;
  }, []);

  return {
    t: (key: string, fallback?: string) => i18n.t(key, fallback),
    formatMessage: (key: string, vars: Record<string, string | number>) => i18n.formatMessage(key, vars),
    language,
    setLanguage: (lang: SupportedLanguage) => i18n.setLanguage(lang),
    supportedLanguages: i18n.getSupportedLanguages()
  };
}
