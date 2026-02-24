// Focus tracking utility using Page Visibility API
export class FocusTracker {
  private static instance: FocusTracker;
  private isTrackingActive = false;
  private distractionCount = 0;
  private sessionStartTime = 0;
  private totalFocusTime = 0;
  private lastVisibilityChange = 0;
  private onDistractionCallback?: (count: number) => void;
  private onFocusScoreCallback?: (score: number) => void;
  
  private constructor() {
    this.setupVisibilityTracking();
  }
  
  static getInstance(): FocusTracker {
    if (!FocusTracker.instance) {
      FocusTracker.instance = new FocusTracker();
    }
    return FocusTracker.instance;
  }
  
  private setupVisibilityTracking() {
    if (typeof document === 'undefined') return;
    
    document.addEventListener('visibilitychange', () => {
      if (!this.isTrackingActive) return;
      
      const now = Date.now();
      
      if (document.hidden) {
        // Tab became hidden - potential distraction
        this.lastVisibilityChange = now;
      } else {
        // Tab became visible again
        if (this.lastVisibilityChange > 0) {
          const awayTime = now - this.lastVisibilityChange;
          
          // Only count as distraction if away for more than 5 seconds
          if (awayTime > 5000) {
            this.distractionCount++;
            this.onDistractionCallback?.(this.distractionCount);
            
            // Update focus score
            this.updateFocusScore();
          } else {
            // Add the focused time before the brief switch
            this.totalFocusTime += awayTime;
          }
        }
        this.lastVisibilityChange = now;
      }
    });
    
    // Also track mouse movement and keyboard activity
    ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'].forEach(event => {
      document.addEventListener(event, () => {
        if (this.isTrackingActive && !document.hidden) {
          // User is actively engaging with the page
          const now = Date.now();
          if (this.lastVisibilityChange > 0) {
            this.totalFocusTime += Math.min(now - this.lastVisibilityChange, 1000);
            this.lastVisibilityChange = now;
          }
        }
      }, { passive: true });
    });
  }
  
  startTracking(
    onDistraction?: (count: number) => void,
    onFocusScore?: (score: number) => void
  ) {
    this.isTrackingActive = true;
    this.distractionCount = 0;
    this.sessionStartTime = Date.now();
    this.totalFocusTime = 0;
    this.lastVisibilityChange = Date.now();
    this.onDistractionCallback = onDistraction;
    this.onFocusScoreCallback = onFocusScore;
  }
  
  stopTracking(): FocusSessionResult {
    this.isTrackingActive = false;
    
    const sessionDuration = Date.now() - this.sessionStartTime;
    const focusPercentage = sessionDuration > 0 ? (this.totalFocusTime / sessionDuration) * 100 : 0;
    
    return {
      distractionCount: this.distractionCount,
      focusPercentage: Math.min(100, Math.max(0, focusPercentage)),
      sessionDuration,
      totalFocusTime: this.totalFocusTime,
      focusScore: this.calculateFocusScore(focusPercentage, this.distractionCount)
    };
  }
  
  private updateFocusScore() {
    if (!this.onFocusScoreCallback) return;
    
    const sessionDuration = Date.now() - this.sessionStartTime;
    const focusPercentage = sessionDuration > 0 ? (this.totalFocusTime / sessionDuration) * 100 : 0;
    const score = this.calculateFocusScore(focusPercentage, this.distractionCount);
    
    this.onFocusScoreCallback(score);
  }
  
  private calculateFocusScore(focusPercentage: number, distractions: number): number {
    // Base score from focus percentage
    let score = Math.round((focusPercentage / 100) * 5);
    
    // Penalty for distractions
    const distractionPenalty = Math.min(distractions * 0.5, 2);
    score = Math.max(1, score - distractionPenalty);
    
    return Math.round(score);
  }
  
  getCurrentStats(): CurrentFocusStats {
    const sessionDuration = Date.now() - this.sessionStartTime;
    const focusPercentage = sessionDuration > 0 ? (this.totalFocusTime / sessionDuration) * 100 : 0;
    
    return {
      distractionCount: this.distractionCount,
      focusPercentage: Math.min(100, Math.max(0, focusPercentage)),
      currentScore: this.calculateFocusScore(focusPercentage, this.distractionCount),
      isActive: this.isTrackingActive
    };
  }
  
  // Manual distraction reporting
  reportDistraction() {
    if (this.isTrackingActive) {
      this.distractionCount++;
      this.onDistractionCallback?.(this.distractionCount);
      this.updateFocusScore();
    }
  }
}

export interface FocusSessionResult {
  distractionCount: number;
  focusPercentage: number;
  sessionDuration: number;
  totalFocusTime: number;
  focusScore: number;
}

export interface CurrentFocusStats {
  distractionCount: number;
  focusPercentage: number;
  currentScore: number;
  isActive: boolean;
}