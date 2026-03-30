// Story-Goal Integration - Makes story progression react to actual goal progress

import { Goal, calculateGoalProgress, GoalProgress } from './goalSystem';

export interface StoryMilestone {
  type: 'goal-created' | 'first-session' | 'streak-achieved' | 'task-completed' | 'goal-completed' | 'deadline-near' | 'off-track' | 'back-on-track';
  message: string;
  characterMood: 'focused' | 'struggling' | 'successful' | 'determined';
}

export function getStoryMilestone(
  goals: Goal[],
  sessionCount: number,
  currentStreak: number,
  lastCompletedTask?: string
): StoryMilestone | null {
  // Check for goal completion
  const recentlyCompleted = goals.find(g => 
    g.completedAt && new Date(g.completedAt).getTime() > Date.now() - 60000 // within last minute
  );

  if (recentlyCompleted) {
    return {
      type: 'goal-completed',
      message: `🎉 TRIUMPH! You've conquered "${recentlyCompleted.title}"! The dragon of procrastination retreats in defeat. Your focused determination has led to this glorious victory. The treasure of knowledge is yours! What new quest shall we embark on next?`,
      characterMood: 'successful'
    };
  }

  // Check for first session
  if (sessionCount === 1) {
    return {
      type: 'first-session',
      message: `The journey begins! Your first focused session marks the start of an epic adventure. Every great warrior starts somewhere, and you've taken that crucial first step. The path ahead is challenging but rewarding. Let's continue building momentum!`,
      characterMood: 'determined'
    };
  }

  // Check for streak achievements
  if (currentStreak === 7) {
    return {
      type: 'streak-achieved',
      message: `⚡ LEGENDARY STREAK! Seven days of unwavering dedication! Your consistency is forging you into a true master. The dragon of distraction trembles before your discipline. This is the mark of a champion!`,
      characterMood: 'successful'
    };
  }

  if (currentStreak === 3) {
    return {
      type: 'streak-achieved',
      message: `🔥 Three-day streak! Your determination is building into an unstoppable force. The habits you're forming now will carry you to greatness. Keep this momentum going!`,
      characterMood: 'focused'
    };
  }

  // Check for critical deadlines
  const criticalGoals = goals.filter(g => {
    if (g.isArchived || g.completedAt) return false;
    const progress = calculateGoalProgress(g);
    return progress.daysRemaining !== undefined && progress.daysRemaining <= 2;
  });

  if (criticalGoals.length > 0) {
    const goal = criticalGoals[0];
    return {
      type: 'deadline-near',
      message: `⚠️ The hour grows late! "${goal.title}" requires your immediate attention - only ${calculateGoalProgress(goal).daysRemaining} days remain! But fear not - you've trained for this moment. Channel all your focus and push through!`,
      characterMood: 'determined'
    };
  }

  // Check for off-track goals
  const offTrackGoals = goals.filter(g => {
    if (g.isArchived || g.completedAt) return false;
    const progress = calculateGoalProgress(g);
    return !progress.isOnTrack;
  });

  if (offTrackGoals.length > 0 && sessionCount % 3 === 0) {
    const goal = offTrackGoals[0];
    const progress = calculateGoalProgress(goal);
    return {
      type: 'off-track',
      message: `The path grows difficult - "${goal.title}" needs ${progress.recommendedDailyMinutes} minutes per day to stay on course. But remember: every hero faces setbacks. Adjust your strategy, strengthen your resolve, and push forward!`,
      characterMood: 'struggling'
    };
  }

  // Check for task completion
  if (lastCompletedTask) {
    return {
      type: 'task-completed',
      message: `✅ Task conquered: "${lastCompletedTask}"! Another obstacle overcome through focused effort. Your quest progresses steadily. Each completed task is a step closer to victory!`,
      characterMood: 'focused'
    };
  }

  return null;
}

export function enhanceStoryWithGoalContext(
  baseStoryText: string,
  goals: Goal[],
  focusLevel: number
): string {
  const activeGoals = goals.filter(g => !g.isArchived && !g.completedAt);
  
  if (activeGoals.length === 0) {
    return baseStoryText;
  }

  // Get the most relevant goal (highest priority with nearest deadline)
  const sortedGoals = [...activeGoals].sort((a, b) => {
    const progressA = calculateGoalProgress(a);
    const progressB = calculateGoalProgress(b);
    
    if (progressA.daysRemaining !== undefined && progressB.daysRemaining !== undefined) {
      return progressA.daysRemaining - progressB.daysRemaining;
    }
    
    return 0;
  });

  const primaryGoal = sortedGoals[0];
  const progress = calculateGoalProgress(primaryGoal);

  // Add goal-specific context based on progress and focus
  let contextAddition = '';

  if (focusLevel >= 4 && progress.progressPercentage > 50) {
    contextAddition = ` Your focused efforts toward "${primaryGoal.title}" are paying off magnificently - ${Math.round(progress.progressPercentage)}% complete! Victory draws near!`;
  } else if (focusLevel >= 4 && progress.progressPercentage <= 50) {
    contextAddition = ` Your concentration on "${primaryGoal.title}" is building momentum. At ${Math.round(progress.progressPercentage)}% progress, keep this pace!`;
  } else if (focusLevel < 3 && progress.daysRemaining && progress.daysRemaining <= 7) {
    contextAddition = ` But beware - "${primaryGoal.title}" needs your full attention with only ${progress.daysRemaining} days remaining. Sharpen your focus!`;
  } else if (focusLevel < 3) {
    contextAddition = ` Your quest for "${primaryGoal.title}" requires deeper concentration. Banish the distractions and reclaim your focus!`;
  }

  return baseStoryText + contextAddition;
}

export function getGoalDrivenCharacterMood(
  focusLevel: number,
  goals: Goal[]
): 'focused' | 'struggling' | 'successful' | 'determined' {
  const activeGoals = goals.filter(g => !g.isArchived && !g.completedAt);
  
  if (activeGoals.length === 0) {
    return focusLevel >= 4 ? 'focused' : 'struggling';
  }

  const overallProgress = activeGoals.reduce((sum, goal) => {
    return sum + calculateGoalProgress(goal).progressPercentage;
  }, 0) / activeGoals.length;

  const anyOffTrack = activeGoals.some(g => !calculateGoalProgress(g).isOnTrack);
  const anyCriticalDeadline = activeGoals.some(g => {
    const progress = calculateGoalProgress(g);
    return progress.daysRemaining !== undefined && progress.daysRemaining <= 3;
  });

  // High progress + high focus = successful
  if (overallProgress > 70 && focusLevel >= 4) {
    return 'successful';
  }

  // Critical deadline or off-track = determined (needs to push harder)
  if (anyCriticalDeadline || anyOffTrack) {
    return focusLevel >= 3 ? 'determined' : 'struggling';
  }

  // Default to focus-based mood
  if (focusLevel >= 4) {
    return 'focused';
  } else if (focusLevel >= 3) {
    return 'determined';
  } else {
    return 'struggling';
  }
}
