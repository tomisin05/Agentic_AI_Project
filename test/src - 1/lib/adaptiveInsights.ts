// Adaptive Insights & Nudges System
// Analyzes user patterns and provides personalized recommendations

import { StudyGoal, GoalManager } from './goalSystem';

export interface UserInsight {
  id: string;
  type: 'tip' | 'warning' | 'achievement' | 'suggestion';
  category: 'focus' | 'timing' | 'consistency' | 'progress' | 'efficiency';
  title: string;
  message: string;
  actionable: boolean;
  action?: {
    label: string;
    type: 'adjust-preset' | 'change-schedule' | 'enable-feature' | 'review-goal';
    data?: any;
  };
  priority: number; // 1-10
  createdAt: Date;
  dismissedAt?: Date;
}

export interface StudyPattern {
  averageFocusLevel: number;
  focusTrend: 'improving' | 'declining' | 'stable';
  optimalSessionLength: number; // minutes
  focusDropoffPoint: number; // minutes into session when focus typically drops
  mostProductiveHours: number[]; // hours of day (0-23)
  leastProductiveHours: number[];
  weekdayVsWeekend: {
    weekdayAvgFocus: number;
    weekendAvgFocus: number;
  };
  consistencyScore: number; // 0-100
  streakData: {
    currentStreak: number;
    longestStreak: number;
    streakBreaks: number;
  };
}

export class AdaptiveInsightsEngine {
  private static readonly INSIGHTS_KEY = 'pomodoro-insights';
  private static readonly PATTERN_KEY = 'pomodoro-user-pattern';

  // Analyze user data and generate insights
  static analyzeAndGenerateInsights(
    journalEntries: any[],
    goals: StudyGoal[]
  ): UserInsight[] {
    if (journalEntries.length < 3) {
      return []; // Not enough data
    }

    const pattern = this.analyzeStudyPattern(journalEntries);
    const insights: UserInsight[] = [];

    // Focus-related insights
    insights.push(...this.generateFocusInsights(pattern, journalEntries));

    // Timing insights
    insights.push(...this.generateTimingInsights(pattern, journalEntries));

    // Consistency insights
    insights.push(...this.generateConsistencyInsights(pattern, journalEntries));

    // Goal progress insights
    insights.push(...this.generateGoalInsights(goals));

    // Efficiency insights
    insights.push(...this.generateEfficiencyInsights(pattern, journalEntries, goals));

    // Sort by priority and return top insights
    return insights
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10); // Limit to top 10 insights
  }

  private static analyzeStudyPattern(journalEntries: any[]): StudyPattern {
    const focusLevels = journalEntries.map(e => e.focusRating);
    const averageFocusLevel = focusLevels.reduce((sum, f) => sum + f, 0) / focusLevels.length;

    // Calculate trend
    const recentFocus = focusLevels.slice(-5).reduce((sum, f) => sum + f, 0) / Math.min(5, focusLevels.length);
    const olderFocus = focusLevels.slice(0, -5).reduce((sum, f) => sum + f, 0) / Math.max(1, focusLevels.length - 5);
    
    let focusTrend: 'improving' | 'declining' | 'stable' = 'stable';
    if (recentFocus > olderFocus + 0.5) focusTrend = 'improving';
    if (recentFocus < olderFocus - 0.5) focusTrend = 'declining';

    // Analyze hourly patterns
    const hourCounts: Record<number, { total: number; focus: number }> = {};
    for (const entry of journalEntries) {
      const hour = new Date(entry.date).getHours();
      if (!hourCounts[hour]) {
        hourCounts[hour] = { total: 0, focus: 0 };
      }
      hourCounts[hour].total += 1;
      hourCounts[hour].focus += entry.focusRating;
    }

    const hourlyAverages = Object.entries(hourCounts).map(([hour, data]) => ({
      hour: parseInt(hour),
      avgFocus: data.focus / data.total,
      count: data.total
    }));

    const mostProductiveHours = hourlyAverages
      .filter(h => h.count >= 2) // At least 2 sessions
      .sort((a, b) => b.avgFocus - a.avgFocus)
      .slice(0, 3)
      .map(h => h.hour);

    const leastProductiveHours = hourlyAverages
      .filter(h => h.count >= 2)
      .sort((a, b) => a.avgFocus - b.avgFocus)
      .slice(0, 2)
      .map(h => h.hour);

    // Weekday vs weekend
    const weekdaySessions = journalEntries.filter(e => {
      const day = new Date(e.date).getDay();
      return day >= 1 && day <= 5;
    });
    const weekendSessions = journalEntries.filter(e => {
      const day = new Date(e.date).getDay();
      return day === 0 || day === 6;
    });

    const weekdayAvgFocus = weekdaySessions.length > 0
      ? weekdaySessions.reduce((sum, e) => sum + e.focusRating, 0) / weekdaySessions.length
      : 0;
    const weekendAvgFocus = weekendSessions.length > 0
      ? weekendSessions.reduce((sum, e) => sum + e.focusRating, 0) / weekendSessions.length
      : 0;

    // Consistency score
    const datesStudied = new Set(journalEntries.map(e => e.date.split('T')[0]));
    const daysSinceFirst = Math.ceil(
      (new Date().getTime() - new Date(journalEntries[0].date).getTime()) / (1000 * 60 * 60 * 24)
    );
    const consistencyScore = Math.min(100, Math.round((datesStudied.size / Math.max(1, daysSinceFirst)) * 100));

    // Streak data
    const sortedDates = Array.from(datesStudied).sort();
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 1;
    let streakBreaks = 0;

    for (let i = 0; i < sortedDates.length; i++) {
      if (i > 0) {
        const prevDate = new Date(sortedDates[i - 1]);
        const currDate = new Date(sortedDates[i]);
        const dayDiff = Math.round((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          if (dayDiff > 1) streakBreaks++;
          tempStreak = 1;
        }
      }
    }

    // Check if current streak is active
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    if (sortedDates.includes(today) || sortedDates.includes(yesterday)) {
      currentStreak = tempStreak;
    }

    longestStreak = Math.max(longestStreak, tempStreak);

    return {
      averageFocusLevel,
      focusTrend,
      optimalSessionLength: 25, // Default, could be calculated
      focusDropoffPoint: 18, // Default, could be calculated from focus tracking data
      mostProductiveHours,
      leastProductiveHours,
      weekdayVsWeekend: { weekdayAvgFocus, weekendAvgFocus },
      consistencyScore,
      streakData: { currentStreak, longestStreak, streakBreaks }
    };
  }

  private static generateFocusInsights(pattern: StudyPattern, entries: any[]): UserInsight[] {
    const insights: UserInsight[] = [];

    // Declining focus warning
    if (pattern.focusTrend === 'declining') {
      insights.push({
        id: 'focus-declining',
        type: 'warning',
        category: 'focus',
        title: 'Focus Declining',
        message: `Your focus has decreased recently (avg ${pattern.averageFocusLevel.toFixed(1)}/5). Consider taking a longer break or adjusting your study environment.`,
        actionable: true,
        action: {
          label: 'Tips for Better Focus',
          type: 'enable-feature',
          data: { feature: 'focus-tips' }
        },
        priority: 8,
        createdAt: new Date()
      });
    }

    // Improving focus achievement
    if (pattern.focusTrend === 'improving' && pattern.averageFocusLevel >= 4) {
      insights.push({
        id: 'focus-improving',
        type: 'achievement',
        category: 'focus',
        title: 'Focus Champion! 🌟',
        message: `Your focus is improving! Average ${pattern.averageFocusLevel.toFixed(1)}/5. Whatever you're doing, keep it up!`,
        actionable: false,
        priority: 6,
        createdAt: new Date()
      });
    }

    // Low average focus
    if (pattern.averageFocusLevel < 3) {
      insights.push({
        id: 'focus-low',
        type: 'suggestion',
        category: 'focus',
        title: 'Boost Your Focus',
        message: `Your average focus is ${pattern.averageFocusLevel.toFixed(1)}/5. Try shorter sessions or enable focus blocking features.`,
        actionable: true,
        action: {
          label: 'Try Shorter Sessions',
          type: 'adjust-preset',
          data: { presetId: 'quick-study' }
        },
        priority: 7,
        createdAt: new Date()
      });
    }

    return insights;
  }

  private static generateTimingInsights(pattern: StudyPattern, entries: any[]): UserInsight[] {
    const insights: UserInsight[] = [];

    // Best time to study
    if (pattern.mostProductiveHours.length > 0) {
      const hoursList = pattern.mostProductiveHours.map(h => {
        if (h < 12) return `${h}AM`;
        if (h === 12) return '12PM';
        return `${h - 12}PM`;
      }).join(', ');

      insights.push({
        id: 'timing-optimal',
        type: 'tip',
        category: 'timing',
        title: 'Peak Performance Hours',
        message: `You focus best at: ${hoursList}. Try scheduling important study sessions during these times.`,
        actionable: true,
        action: {
          label: 'Auto-Schedule',
          type: 'change-schedule',
          data: { preferredHours: pattern.mostProductiveHours }
        },
        priority: 7,
        createdAt: new Date()
      });
    }

    // Avoid low-focus times
    if (pattern.leastProductiveHours.length > 0) {
      const hoursList = pattern.leastProductiveHours.map(h => {
        if (h < 12) return `${h}AM`;
        if (h === 12) return '12PM';
        return `${h - 12}PM`;
      }).join(', ');

      insights.push({
        id: 'timing-avoid',
        type: 'suggestion',
        category: 'timing',
        title: 'Low Energy Times',
        message: `Your focus dips around ${hoursList}. Consider light review or breaks during these hours instead of deep work.`,
        actionable: false,
        priority: 5,
        createdAt: new Date()
      });
    }

    // Weekday vs weekend pattern
    const diff = Math.abs(pattern.weekdayVsWeekend.weekdayAvgFocus - pattern.weekdayVsWeekend.weekendAvgFocus);
    if (diff > 1) {
      const better = pattern.weekdayVsWeekend.weekdayAvgFocus > pattern.weekdayVsWeekend.weekendAvgFocus 
        ? 'weekdays' : 'weekends';
      
      insights.push({
        id: 'timing-weekday-weekend',
        type: 'tip',
        category: 'timing',
        title: 'Weekday vs Weekend Pattern',
        message: `You focus better on ${better}. Consider adjusting your study schedule to capitalize on this.`,
        actionable: true,
        action: {
          label: 'Adjust Schedule',
          type: 'change-schedule'
        },
        priority: 6,
        createdAt: new Date()
      });
    }

    return insights;
  }

  private static generateConsistencyInsights(pattern: StudyPattern, entries: any[]): UserInsight[] {
    const insights: UserInsight[] = [];

    // Low consistency warning
    if (pattern.consistencyScore < 50) {
      insights.push({
        id: 'consistency-low',
        type: 'warning',
        category: 'consistency',
        title: 'Consistency Challenge',
        message: `Your study consistency is ${pattern.consistencyScore}%. Regular short sessions beat irregular long ones. Try studying at the same time each day.`,
        actionable: true,
        action: {
          label: 'Set Daily Reminder',
          type: 'enable-feature',
          data: { feature: 'daily-reminder' }
        },
        priority: 9,
        createdAt: new Date()
      });
    }

    // High consistency achievement
    if (pattern.consistencyScore >= 80) {
      insights.push({
        id: 'consistency-high',
        type: 'achievement',
        category: 'consistency',
        title: 'Consistency Master! 🏆',
        message: `${pattern.consistencyScore}% consistency! Your discipline is exceptional. This habit will serve you well.`,
        actionable: false,
        priority: 7,
        createdAt: new Date()
      });
    }

    // Streak about to break
    if (pattern.streakData.currentStreak >= 3) {
      const lastStudy = new Date(entries[entries.length - 1].date);
      const hoursSince = (Date.now() - lastStudy.getTime()) / (1000 * 60 * 60);
      
      if (hoursSince > 20 && hoursSince < 48) {
        insights.push({
          id: 'streak-warning',
          type: 'warning',
          category: 'consistency',
          title: `Streak Alert! 🔥`,
          message: `Don't break your ${pattern.streakData.currentStreak}-day streak! Study today to keep it alive.`,
          actionable: true,
          action: {
            label: 'Start Quick Session',
            type: 'adjust-preset',
            data: { presetId: 'quick-study' }
          },
          priority: 10,
          createdAt: new Date()
        });
      }
    }

    // New streak milestone
    if (pattern.streakData.currentStreak === pattern.streakData.longestStreak && pattern.streakData.currentStreak >= 7) {
      insights.push({
        id: 'streak-milestone',
        type: 'achievement',
        category: 'consistency',
        title: 'New Streak Record! 🎉',
        message: `${pattern.streakData.currentStreak} days - your longest streak ever! Legendary dedication!`,
        actionable: false,
        priority: 8,
        createdAt: new Date()
      });
    }

    return insights;
  }

  private static generateGoalInsights(goals: StudyGoal[]): UserInsight[] {
    const insights: UserInsight[] = [];

    for (const goal of goals) {
      const progress = GoalManager.calculateProgress(goal.id);

      // Behind schedule
      if (!progress.onTrack && progress.daysUntilDeadline !== undefined && progress.daysUntilDeadline > 0) {
        insights.push({
          id: `goal-behind-${goal.id}`,
          type: 'warning',
          category: 'progress',
          title: `${goal.title}: Behind Schedule`,
          message: `You need ${progress.recommendedDailyMinutes} min/day to meet your deadline in ${progress.daysUntilDeadline} days. Consider increasing your daily commitment.`,
          actionable: true,
          action: {
            label: 'Adjust Goal',
            type: 'review-goal',
            data: { goalId: goal.id }
          },
          priority: 9,
          createdAt: new Date()
        });
      }

      // Approaching deadline
      if (progress.daysUntilDeadline !== undefined && progress.daysUntilDeadline <= 3 && progress.daysUntilDeadline > 0) {
        insights.push({
          id: `goal-urgent-${goal.id}`,
          type: 'warning',
          category: 'progress',
          title: `${goal.title}: Urgent! ⚠️`,
          message: `Only ${progress.daysUntilDeadline} days until deadline! Focus on this goal immediately.`,
          actionable: true,
          action: {
            label: 'Start Now',
            type: 'review-goal',
            data: { goalId: goal.id }
          },
          priority: 10,
          createdAt: new Date()
        });
      }

      // Good progress
      if (progress.onTrack && progress.progressPercentage >= 25) {
        insights.push({
          id: `goal-ontrack-${goal.id}`,
          type: 'achievement',
          category: 'progress',
          title: `${goal.title}: On Track! ✅`,
          message: `${Math.round(progress.progressPercentage)}% complete and on schedule. Great work!`,
          actionable: false,
          priority: 5,
          createdAt: new Date()
        });
      }
    }

    return insights;
  }

  private static generateEfficiencyInsights(
    pattern: StudyPattern,
    entries: any[],
    goals: StudyGoal[]
  ): UserInsight[] {
    const insights: UserInsight[] = [];

    // Flashcard balance
    const totalFlashcards = goals.reduce((sum, g) => sum + g.flashcardsCreated, 0);
    const masteredFlashcards = goals.reduce((sum, g) => sum + g.flashcardsMastered, 0);
    
    if (totalFlashcards > 50 && masteredFlashcards < totalFlashcards * 0.3) {
      insights.push({
        id: 'flashcard-backlog',
        type: 'suggestion',
        category: 'efficiency',
        title: 'Flashcard Backlog',
        message: `You have ${totalFlashcards - masteredFlashcards} flashcards to review. Regular review prevents overwhelming backlogs.`,
        actionable: true,
        action: {
          label: 'Review Now',
          type: 'enable-feature',
          data: { feature: 'flashcards' }
        },
        priority: 6,
        createdAt: new Date()
      });
    }

    // No flashcards created
    if (entries.length > 10 && totalFlashcards === 0) {
      insights.push({
        id: 'no-flashcards',
        type: 'tip',
        category: 'efficiency',
        title: 'Try Flashcards',
        message: `You haven't created any flashcards yet. They're proven to improve retention and make review sessions more effective.`,
        actionable: true,
        action: {
          label: 'Create Flashcards',
          type: 'enable-feature',
          data: { feature: 'flashcards' }
        },
        priority: 5,
        createdAt: new Date()
      });
    }

    // Session length optimization
    const recentSessions = entries.slice(-10);
    const lowFocusSessions = recentSessions.filter(e => e.focusRating < 3);
    
    if (lowFocusSessions.length > 5) {
      insights.push({
        id: 'session-too-long',
        type: 'suggestion',
        category: 'efficiency',
        title: 'Consider Shorter Sessions',
        message: `You've had ${lowFocusSessions.length} low-focus sessions recently. Try shorter 15-minute sessions instead.`,
        actionable: true,
        action: {
          label: 'Try Quick Study',
          type: 'adjust-preset',
          data: { presetId: 'quick-study' }
        },
        priority: 7,
        createdAt: new Date()
      });
    }

    return insights;
  }

  // Get insights for display
  static getActiveInsights(): UserInsight[] {
    try {
      const stored = localStorage.getItem(this.INSIGHTS_KEY);
      if (!stored) return [];
      
      const insights = JSON.parse(stored);
      return insights
        .filter((i: UserInsight) => !i.dismissedAt)
        .map((i: any) => ({
          ...i,
          createdAt: new Date(i.createdAt)
        }));
    } catch (error) {
      return [];
    }
  }

  static saveInsights(insights: UserInsight[]): void {
    try {
      localStorage.setItem(this.INSIGHTS_KEY, JSON.stringify(insights));
    } catch (error) {
      console.error('Failed to save insights:', error);
    }
  }

  static dismissInsight(insightId: string): void {
    const insights = this.getActiveInsights();
    const insight = insights.find(i => i.id === insightId);
    if (insight) {
      insight.dismissedAt = new Date();
      this.saveInsights(insights);
    }
  }
}
