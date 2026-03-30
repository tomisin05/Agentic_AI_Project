// Simple notifications utility for the study app
export class NotificationManager {
  private static instance: NotificationManager;
  private permission: NotificationPermission = 'default';
  
  private constructor() {
    this.checkPermission();
  }
  
  static getInstance(): NotificationManager {
    if (!NotificationManager.instance) {
      NotificationManager.instance = new NotificationManager();
    }
    return NotificationManager.instance;
  }
  
  private checkPermission() {
    if ('Notification' in window) {
      this.permission = Notification.permission;
    }
  }
  
  async requestPermission(): Promise<NotificationPermission> {
    if ('Notification' in window) {
      this.permission = await Notification.requestPermission();
    }
    return this.permission;
  }
  
  canSendNotifications(): boolean {
    return 'Notification' in window && this.permission === 'granted';
  }
  
  sendNotification(title: string, options?: NotificationOptions): Notification | null {
    if (!this.canSendNotifications()) {
      console.log('Notification:', title, options?.body);
      return null;
    }
    
    const defaultOptions: NotificationOptions = {
      icon: '/icon-192.png', // You can add this icon later
      badge: '/icon-72.png',
      tag: 'study-session',
      requireInteraction: false,
      ...options
    };
    
    return new Notification(title, defaultOptions);
  }
  
  sendSessionStartReminder() {
    return this.sendNotification('Time to Study! 📚', {
      body: 'Your focus session is ready to begin. Let\'s conquer the Dragon of Distraction!',
      tag: 'session-start'
    });
  }
  
  sendBreakReminder() {
    return this.sendNotification('Break Time! ☕', {
      body: 'Take a well-deserved break. You\'ve earned it!',
      tag: 'break-start'
    });
  }
  
  sendSessionCompleteNotification(focusLevel: number) {
    const emoji = focusLevel >= 4 ? '🎉' : focusLevel >= 3 ? '👍' : '💪';
    const message = focusLevel >= 4 
      ? 'Excellent focus! The dragon retreats!' 
      : focusLevel >= 3 
      ? 'Good effort! Keep pushing forward!'
      : 'Every battle makes you stronger!';
      
    return this.sendNotification(`Session Complete! ${emoji}`, {
      body: message,
      tag: 'session-complete'
    });
  }
  
  sendLongBreakNotification() {
    return this.sendNotification('Long Break Time! 🌟', {
      body: 'You\'ve completed multiple sessions! Take a longer break to recharge.',
      tag: 'long-break'
    });
  }
  
  sendStreakNotification(days: number) {
    return this.sendNotification(`${days} Day Streak! 🔥`, {
      body: `Amazing consistency! You're on a ${days}-day study streak!`,
      tag: 'streak-milestone'
    });
  }
}