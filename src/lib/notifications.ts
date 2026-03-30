/**
 * Browser Notification System
 * Manages desktop and mobile notifications for study reminders
 */

export type NotificationType = 
  | 'session-start'
  | 'session-complete'
  | 'break-start'
  | 'break-complete'
  | 'study-reminder'
  | 'distraction-warning'
  | 'achievement-unlocked'
  | 'goal-milestone';

export interface NotificationConfig {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
  requireInteraction?: boolean;
}

class NotificationSystem {
  private permission: NotificationPermission = 'default';
  private enabled: boolean = true;

  constructor() {
    this.checkPermission();
  }

  /**
   * Check current notification permission status
   */
  private checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    try {
      const permission = await Notification.requestPermission();
      this.permission = permission;
      return permission === 'granted';
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return false;
    }
  }

  /**
   * Show a browser notification
   */
  async show(config: NotificationConfig): Promise<void> {
    if (!this.enabled) return;

    if (this.permission !== 'granted') {
      const granted = await this.requestPermission();
      if (!granted) return;
    }

    try {
      const notification = new Notification(config.title, {
        body: config.body,
        icon: config.icon || '/icon-192.png',
        tag: config.tag,
        requireInteraction: config.requireInteraction || false,
        badge: '/icon-96.png'
      });

      // Auto-close after 5 seconds unless requireInteraction is true
      if (!config.requireInteraction) {
        setTimeout(() => notification.close(), 5000);
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
      };
    } catch (error) {
      console.error('Failed to show notification:', error);
    }
  }

  /**
   * Pre-built notification templates
   */
  async showSessionStart(sessionNumber: number): Promise<void> {
    await this.show({
      title: '🎯 Session Started!',
      body: `Focus session #${sessionNumber} has begun. Time to defeat the Dragon of Distraction!`,
      tag: 'session-start'
    });
  }

  async showSessionComplete(duration: number, focusLevel: number): Promise<void> {
    const emoji = focusLevel >= 4 ? '🌟' : focusLevel >= 3 ? '✅' : '💪';
    await this.show({
      title: `${emoji} Session Complete!`,
      body: `You studied for ${duration} minutes with ${focusLevel}/5 focus. Time to reflect!`,
      tag: 'session-complete',
      requireInteraction: true
    });
  }

  async showBreakStart(duration: number): Promise<void> {
    await this.show({
      title: '☕ Break Time!',
      body: `Take a ${duration}-minute break. You've earned it!`,
      tag: 'break-start'
    });
  }

  async showBreakComplete(): Promise<void> {
    await this.show({
      title: '⏰ Break Over!',
      body: 'Ready to continue? Your next session awaits!',
      tag: 'break-complete',
      requireInteraction: true
    });
  }

  async showStudyReminder(subject: string, inMinutes: number): Promise<void> {
    await this.show({
      title: '📚 Study Reminder',
      body: `${subject} session starts in ${inMinutes} minutes. Get ready!`,
      tag: 'study-reminder'
    });
  }

  async showDistractionWarning(distractionCount: number): Promise<void> {
    await this.show({
      title: '⚠️ Focus Alert',
      body: `You've switched tabs ${distractionCount} times. Stay focused, warrior!`,
      tag: 'distraction-warning'
    });
  }

  async showAchievementUnlocked(achievement: string): Promise<void> {
    await this.show({
      title: '🏆 Achievement Unlocked!',
      body: achievement,
      tag: 'achievement',
      requireInteraction: true
    });
  }

  async showGoalMilestone(goalName: string, progress: number): Promise<void> {
    await this.show({
      title: '🎯 Goal Progress!',
      body: `${goalName} is now ${progress}% complete. Keep going!`,
      tag: 'goal-milestone'
    });
  }

  /**
   * Schedule a notification for future delivery
   */
  scheduleNotification(config: NotificationConfig, delayMs: number): number {
    const timeoutId = window.setTimeout(() => {
      this.show(config);
    }, delayMs);
    return timeoutId;
  }

  /**
   * Cancel a scheduled notification
   */
  cancelScheduledNotification(timeoutId: number): void {
    clearTimeout(timeoutId);
  }

  /**
   * Enable/disable notifications
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    localStorage.setItem('notifications-enabled', String(enabled));
  }

  /**
   * Check if notifications are enabled
   */
  isEnabled(): boolean {
    const stored = localStorage.getItem('notifications-enabled');
    if (stored !== null) {
      this.enabled = stored === 'true';
    }
    return this.enabled;
  }

  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return 'Notification' in window;
  }

  /**
   * Get permission status
   */
  getPermission(): NotificationPermission {
    return this.permission;
  }
}

// Export singleton instance
export const notificationSystem = new NotificationSystem();

/**
 * Toast notification system (in-app)
 */
export interface ToastConfig {
  message: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

export const toast = {
  success: (message: string, duration = 3000) => {
    showToast({ message, type: 'success', duration });
  },
  error: (message: string, duration = 4000) => {
    showToast({ message, type: 'error', duration });
  },
  warning: (message: string, duration = 3500) => {
    showToast({ message, type: 'warning', duration });
  },
  info: (message: string, duration = 3000) => {
    showToast({ message, type: 'info', duration });
  }
};

function showToast(config: ToastConfig) {
  // Create toast element
  const toastEl = document.createElement('div');
  const { message, type = 'info', duration = 3000 } = config;
  
  const bgColors = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    warning: 'bg-yellow-500',
    info: 'bg-blue-500'
  };

  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  };

  toastEl.className = `fixed bottom-4 right-4 ${bgColors[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-[9999] animate-in slide-in-from-bottom-5`;
  toastEl.innerHTML = `
    <span class="text-xl">${icons[type]}</span>
    <span>${message}</span>
  `;

  document.body.appendChild(toastEl);

  // Remove after duration
  setTimeout(() => {
    toastEl.classList.add('animate-out', 'slide-out-to-bottom-5');
    setTimeout(() => {
      document.body.removeChild(toastEl);
    }, 300);
  }, duration);
}
