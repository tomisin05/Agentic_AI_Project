// Adaptive Insights - Personalized coaching based on user patterns

export interface StudyPattern {
  userId?: string;
  sessions: {
    date: string;
    startTime: string;
    duration: number;
    focusLevel: number;
    completed: boolean;
  }[];
  lastAnalyzed: string;
}

export interface AdaptiveInsight {
  type: 'focus-pattern' | 'session-length' | 'consistency' | 'timing' | 'workload' | 'motivation';
  severity: 'info' | 'tip' | 'warning';
  title: string;
  message: string;
  actionable: string;
  icon: string;
}

// Analyze user patterns and generate insights
export function generateAdaptiveInsights(pattern: StudyPattern): AdaptiveInsight[] {
  const insights: AdaptiveInsight[] = [];
  
  if (pattern.sessions.length < 3) {
    return []; // Need more data
  }

  // Analyze focus patterns
  const focusInsight = analyzeFocusPatterns(pattern);
  if (focusInsight) insights.push(focusInsight);

  // Analyze session timing
  const timingInsight = analyzeOptimalTiming(pattern);
  if (timingInsight) insights.push(timingInsight);

  // Analyze session length
  const lengthInsight = analyzeSessionLength(pattern);
  if (lengthInsight) insights.push(lengthInsight);

  // Analyze consistency
  const consistencyInsight = analyzeConsistency(pattern);
  if (consistencyInsight) insights.push(consistencyInsight);

  // Analyze workload
  const workloadInsight = analyzeWorkload(pattern);
  if (workloadInsight) insights.push(workloadInsight);

  return insights;
}

function analyzeFocusPatterns(pattern: StudyPattern): AdaptiveInsight | null {
  const recentSessions = pattern.sessions.slice(-10);
  const avgFocus = recentSessions.reduce((sum, s) => sum + s.focusLevel, 0) / recentSessions.length;
  
  // Check if focus degrades over session duration
  const longSessions = recentSessions.filter(s => s.duration >= 40);
  
  if (longSessions.length >= 3) {
    const avgLongSessionFocus = longSessions.reduce((sum, s) => sum + s.focusLevel, 0) / longSessions.length;
    const shortSessions = recentSessions.filter(s => s.duration < 40);
    
    if (shortSessions.length > 0) {
      const avgShortSessionFocus = shortSessions.reduce((sum, s) => sum + s.focusLevel, 0) / shortSessions.length;
      
      if (avgShortSessionFocus > avgLongSessionFocus + 0.5) {
        return {
          type: 'session-length',
          severity: 'tip',
          title: 'Shorter sessions work better for you',
          message: `Your focus is ${Math.round((avgShortSessionFocus - avgLongSessionFocus) * 20)}% higher in sessions under 40 minutes.`,
          actionable: 'Try using 25-30 minute Pomodoro sessions instead of longer blocks.',
          icon: '⏱️'
        };
      }
    }
  }

  // Check for declining focus trend
  const firstHalf = recentSessions.slice(0, Math.floor(recentSessions.length / 2));
  const secondHalf = recentSessions.slice(Math.floor(recentSessions.length / 2));
  
  const firstHalfAvg = firstHalf.reduce((sum, s) => sum + s.focusLevel, 0) / firstHalf.length;
  const secondHalfAvg = secondHalf.reduce((sum, s) => sum + s.focusLevel, 0) / secondHalf.length;
  
  if (firstHalfAvg - secondHalfAvg > 0.8) {
    return {
      type: 'focus-pattern',
      severity: 'warning',
      title: 'Focus declining recently',
      message: `Your concentration has dropped ${Math.round((firstHalfAvg - secondHalfAvg) * 20)}% in recent sessions.`,
      actionable: 'Consider taking a break day, or trying a new study location to refresh.',
      icon: '⚠️'
    };
  }

  // Positive feedback for consistent high focus
  if (avgFocus >= 4.0) {
    return {
      type: 'focus-pattern',
      severity: 'info',
      title: 'Excellent focus maintained',
      message: `You're maintaining an impressive ${avgFocus.toFixed(1)}/5 average focus level!`,
      actionable: 'Keep up this great routine - it\'s clearly working for you.',
      icon: '🎯'
    };
  }

  return null;
}

function analyzeOptimalTiming(pattern: StudyPattern): AdaptiveInsight | null {
  const sessionsWithTime = pattern.sessions.filter(s => s.startTime && s.focusLevel > 0);
  
  if (sessionsWithTime.length < 5) return null;

  // Group by time of day
  const morning = sessionsWithTime.filter(s => {
    const hour = parseInt(s.startTime.split(':')[0]);
    return hour >= 6 && hour < 12;
  });

  const afternoon = sessionsWithTime.filter(s => {
    const hour = parseInt(s.startTime.split(':')[0]);
    return hour >= 12 && hour < 18;
  });

  const evening = sessionsWithTime.filter(s => {
    const hour = parseInt(s.startTime.split(':')[0]);
    return hour >= 18 && hour < 24;
  });

  const avgMorning = morning.length > 0 ? morning.reduce((sum, s) => sum + s.focusLevel, 0) / morning.length : 0;
  const avgAfternoon = afternoon.length > 0 ? afternoon.reduce((sum, s) => sum + s.focusLevel, 0) / afternoon.length : 0;
  const avgEvening = evening.length > 0 ? evening.reduce((sum, s) => sum + s.focusLevel, 0) / evening.length : 0;

  const timeSlots = [
    { name: 'morning', avg: avgMorning, count: morning.length },
    { name: 'afternoon', avg: avgAfternoon, count: afternoon.length },
    { name: 'evening', avg: avgEvening, count: evening.length }
  ].filter(slot => slot.count > 0);

  if (timeSlots.length < 2) return null;

  timeSlots.sort((a, b) => b.avg - a.avg);
  const best = timeSlots[0];
  const worst = timeSlots[timeSlots.length - 1];

  if (best.avg - worst.avg > 0.7) {
    return {
      type: 'timing',
      severity: 'tip',
      title: `You focus best in the ${best.name}`,
      message: `Your ${best.name} sessions average ${best.avg.toFixed(1)}/5 focus, compared to ${worst.avg.toFixed(1)}/5 in the ${worst.name}.`,
      actionable: `Schedule important or difficult tasks for ${best.name} sessions when possible.`,
      icon: '🕐'
    };
  }

  return null;
}

function analyzeSessionLength(pattern: StudyPattern): AdaptiveInsight | null {
  const completedSessions = pattern.sessions.filter(s => s.completed);
  
  if (completedSessions.length < 5) return null;

  const avgDuration = completedSessions.reduce((sum, s) => sum + s.duration, 0) / completedSessions.length;
  
  // Check for consistently short sessions
  if (avgDuration < 20) {
    return {
      type: 'session-length',
      severity: 'tip',
      title: 'Consider slightly longer sessions',
      message: `Your sessions average ${Math.round(avgDuration)} minutes. Research shows 25-30 minute blocks optimize learning.`,
      actionable: 'Try the Classic Pomodoro preset (25 min work / 5 min break) for better retention.',
      icon: '⏲️'
    };
  }

  // Check for very long sessions without adequate focus
  const longLowFocus = completedSessions.filter(s => s.duration > 50 && s.focusLevel < 3).length;
  
  if (longLowFocus >= 3) {
    return {
      type: 'session-length',
      severity: 'warning',
      title: 'Long sessions affecting focus',
      message: `You've had ${longLowFocus} sessions over 50 minutes with low focus. Mental fatigue may be setting in.`,
      actionable: 'Break longer study periods into 2-3 shorter sessions with breaks between.',
      icon: '😓'
    };
  }

  return null;
}

function analyzeConsistency(pattern: StudyPattern): AdaptiveInsight | null {
  const recentSessions = pattern.sessions.slice(-14); // Last 2 weeks
  
  if (recentSessions.length < 7) return null;

  // Check for gaps (days without sessions)
  const dates = recentSessions.map(s => s.date);
  const uniqueDates = new Set(dates);
  const daysWithSessions = uniqueDates.size;
  
  // Check for weekend gaps specifically
  const hasWeekendSessions = recentSessions.some(s => {
    const date = new Date(s.date);
    const day = date.getDay();
    return day === 0 || day === 6; // Sunday or Saturday
  });

  if (daysWithSessions >= 5 && !hasWeekendSessions && recentSessions.length >= 10) {
    return {
      type: 'consistency',
      severity: 'tip',
      title: 'Great weekday consistency',
      message: `You've studied ${daysWithSessions} days recently, but weekends show gaps.`,
      actionable: 'Consider light 15-minute review sessions on weekends to maintain momentum.',
      icon: '📅'
    };
  }

  if (daysWithSessions >= 10) {
    return {
      type: 'consistency',
      severity: 'info',
      title: 'Outstanding consistency',
      message: `${daysWithSessions} study days in two weeks - you're building powerful habits!`,
      actionable: 'Keep this rhythm going. Consistent practice compounds over time.',
      icon: '🔥'
    };
  }

  if (daysWithSessions < 4) {
    return {
      type: 'consistency',
      severity: 'warning',
      title: 'Consistency needs work',
      message: `Only ${daysWithSessions} study days recently. Regular practice is key to progress.`,
      actionable: 'Set a goal for at least one session per day, even if just 15 minutes.',
      icon: '📌'
    };
  }

  return null;
}

function analyzeWorkload(pattern: StudyPattern): AdaptiveInsight | null {
  const lastWeek = pattern.sessions.filter(s => {
    const sessionDate = new Date(s.date);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return sessionDate >= weekAgo;
  });

  if (lastWeek.length === 0) return null;

  const totalMinutes = lastWeek.reduce((sum, s) => sum + s.duration, 0);
  const hoursPerWeek = totalMinutes / 60;

  // Check for overwork
  if (hoursPerWeek > 35 && lastWeek.some(s => s.focusLevel < 3)) {
    return {
      type: 'workload',
      severity: 'warning',
      title: 'Risk of burnout',
      message: `${Math.round(hoursPerWeek)} hours studied this week. High volume + declining focus = burnout risk.`,
      actionable: 'Schedule a rest day. Quality beats quantity - protect your mental energy.',
      icon: '🛑'
    };
  }

  // Check for under-utilization
  if (hoursPerWeek < 5 && lastWeek.length > 0) {
    const avgFocus = lastWeek.reduce((sum, s) => sum + s.focusLevel, 0) / lastWeek.length;
    
    if (avgFocus >= 3.5) {
      return {
        type: 'workload',
        severity: 'tip',
        title: 'You have capacity to do more',
        message: `Only ${Math.round(hoursPerWeek)} hours this week, but your focus is strong (${avgFocus.toFixed(1)}/5).`,
        actionable: 'You could add 1-2 more sessions per week without compromising quality.',
        icon: '📈'
      };
    }
  }

  return null;
}

// Get most actionable insight
export function getTopInsight(insights: AdaptiveInsight[]): AdaptiveInsight | null {
  if (insights.length === 0) return null;

  // Prioritize warnings, then tips, then info
  const warnings = insights.filter(i => i.severity === 'warning');
  if (warnings.length > 0) return warnings[0];

  const tips = insights.filter(i => i.severity === 'tip');
  if (tips.length > 0) return tips[0];

  return insights[0];
}
