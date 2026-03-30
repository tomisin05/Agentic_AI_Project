// Auto-Scheduler - Generates study schedules from goal deadlines

import { Goal, calculateGoalProgress, Task } from './goalSystem';

export interface ScheduledSession {
  id: string;
  goalId: string;
  goalTitle: string;
  taskId?: string;
  taskTitle?: string;
  date: string;
  startTime: string;
  durationMinutes: number;
  sessionType: 'deep-work' | 'review' | 'flashcards' | 'light-study';
  priority: 'high' | 'medium' | 'low';
  description: string;
}

export interface WeeklySchedule {
  weekStart: Date;
  weekEnd: Date;
  sessions: ScheduledSession[];
  totalMinutes: number;
  goalsIncluded: string[];
}

// Generate optimal study schedule for the week
export function generateWeeklySchedule(
  goals: Goal[],
  userPreferences: {
    availableDaysPerWeek?: number[];  // 0-6 (Sunday-Saturday)
    preferredStartTime?: string;      // "09:00"
    maxSessionsPerDay?: number;
    sessionLengthPreference?: number; // in minutes
  } = {}
): WeeklySchedule {
  const {
    availableDaysPerWeek = [1, 2, 3, 4, 5], // Mon-Fri by default
    preferredStartTime = '09:00',
    maxSessionsPerDay = 3,
    sessionLengthPreference = 50
  } = userPreferences;

  const activeGoals = goals.filter(g => !g.isArchived && !g.completedAt);
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);

  const sessions: ScheduledSession[] = [];
  const goalsIncluded: string[] = [];

  // Sort goals by urgency
  const sortedGoals = [...activeGoals].sort((a, b) => {
    const progressA = calculateGoalProgress(a);
    const progressB = calculateGoalProgress(b);
    
    // Prioritize by days remaining
    if (progressA.daysRemaining !== undefined && progressB.daysRemaining !== undefined) {
      if (progressA.daysRemaining !== progressB.daysRemaining) {
        return progressA.daysRemaining - progressB.daysRemaining;
      }
    }
    
    // Then by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  let currentDay = 0;
  let sessionsThisDay = 0;

  // Distribute sessions across the week
  for (const goal of sortedGoals) {
    const progress = calculateGoalProgress(goal);
    
    // Calculate how many sessions this goal needs this week
    const weeklyMinutes = progress.recommendedDailyMinutes * 7;
    const sessionsNeeded = Math.ceil(weeklyMinutes / sessionLengthPreference);
    const actualSessions = Math.min(sessionsNeeded, maxSessionsPerDay * availableDaysPerWeek.length);

    if (actualSessions === 0) continue;

    goalsIncluded.push(goal.id);

    // Get incomplete tasks for this goal
    const incompleteTasks = goal.tasks.filter(t => t.status !== 'completed');
    
    for (let i = 0; i < actualSessions; i++) {
      // Find next available day
      while (!availableDaysPerWeek.includes((currentDay % 7))) {
        currentDay++;
        sessionsThisDay = 0;
      }

      if (sessionsThisDay >= maxSessionsPerDay) {
        currentDay++;
        sessionsThisDay = 0;
        continue;
      }

      const sessionDate = new Date(weekStart);
      sessionDate.setDate(weekStart.getDate() + (currentDay % 7));

      // Determine session type based on goal progress and urgency
      let sessionType: 'deep-work' | 'review' | 'flashcards' | 'light-study' = 'deep-work';
      
      if (progress.daysRemaining && progress.daysRemaining <= 7) {
        sessionType = i % 2 === 0 ? 'flashcards' : 'review';
      } else if (progress.progressPercentage > 70) {
        sessionType = 'review';
      } else if (progress.progressPercentage < 30) {
        sessionType = 'deep-work';
      } else {
        sessionType = i % 3 === 0 ? 'flashcards' : 'deep-work';
      }

      // Assign task if available
      const task = incompleteTasks[i % incompleteTasks.length];

      // Calculate start time (stagger throughout the day)
      const [startHour, startMinute] = preferredStartTime.split(':').map(Number);
      const sessionStartHour = startHour + (sessionsThisDay * 2); // 2 hours apart
      const formattedStartTime = `${sessionStartHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;

      const session: ScheduledSession = {
        id: `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        goalId: goal.id,
        goalTitle: goal.title,
        taskId: task?.id,
        taskTitle: task?.title,
        date: sessionDate.toISOString().split('T')[0],
        startTime: formattedStartTime,
        durationMinutes: sessionLengthPreference,
        sessionType,
        priority: progress.daysRemaining && progress.daysRemaining <= 7 ? 'high' : 
                  progress.daysRemaining && progress.daysRemaining <= 14 ? 'medium' : 'low',
        description: task 
          ? `Focus on: ${task.title}`
          : `Continue progress on ${goal.subject}`
      };

      sessions.push(session);
      sessionsThisDay++;
    }

    currentDay++;
    sessionsThisDay = 0;
  }

  const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);

  return {
    weekStart,
    weekEnd,
    sessions,
    totalMinutes,
    goalsIncluded
  };
}

// Adjust schedule based on missed sessions
export function adjustScheduleForMissedSessions(
  currentSchedule: WeeklySchedule,
  missedSessionIds: string[]
): ScheduledSession[] {
  const missedSessions = currentSchedule.sessions.filter(s => missedSessionIds.includes(s.id));
  
  if (missedSessions.length === 0) return [];

  const today = new Date();
  const rescheduledSessions: ScheduledSession[] = [];

  missedSessions.forEach((session, index) => {
    const newDate = new Date(today);
    newDate.setDate(today.getDate() + Math.ceil((index + 1) / 2)); // Spread over next few days

    const rescheduled: ScheduledSession = {
      ...session,
      id: `session-rescheduled-${Date.now()}-${index}`,
      date: newDate.toISOString().split('T')[0],
      priority: 'high', // Bump priority
      description: `⚠️ RESCHEDULED: ${session.description}`
    };

    rescheduledSessions.push(rescheduled);
  });

  return rescheduledSessions;
}

// Get today's recommended sessions
export function getTodaySessions(schedule: WeeklySchedule): ScheduledSession[] {
  const today = new Date().toISOString().split('T')[0];
  return schedule.sessions.filter(s => s.date === today).sort((a, b) => {
    return a.startTime.localeCompare(b.startTime);
  });
}

// Auto-suggest optimal session length based on goal and user history
export function suggestSessionLength(
  goal: Goal,
  userAverageFocusTime?: number // from analytics
): number {
  const progress = calculateGoalProgress(goal);
  
  // Base recommendation on goal type and urgency
  let baseLength = 50; // minutes

  if (goal.type === 'exam' || goal.type === 'certification') {
    baseLength = 50; // Longer for intensive preparation
  } else if (goal.type === 'skill') {
    baseLength = 45; // Focused practice sessions
  } else if (goal.type === 'project') {
    baseLength = 60; // Deep work for projects
  }

  // Adjust for urgency
  if (progress.daysRemaining && progress.daysRemaining <= 7) {
    baseLength = Math.min(baseLength, 45); // Shorter, more frequent when cramming
  }

  // Adjust based on user's typical focus time
  if (userAverageFocusTime && userAverageFocusTime < 30) {
    baseLength = 25; // Start with Pomodoro if user struggles with focus
  }

  return baseLength;
}

// Generate session description with context
export function generateSessionDescription(
  goal: Goal,
  task: Task | undefined,
  sessionType: 'deep-work' | 'review' | 'flashcards' | 'light-study'
): string {
  const progress = calculateGoalProgress(goal);
  
  let description = '';

  if (task) {
    description = `📋 Task: ${task.title}`;
  } else {
    description = `📚 ${goal.subject}`;
  }

  // Add urgency context
  if (progress.daysRemaining && progress.daysRemaining <= 3) {
    description += ` ⚡ URGENT (${progress.daysRemaining}d left)`;
  }

  // Add progress context
  description += ` • ${Math.round(progress.progressPercentage)}% complete`;

  // Add session type guidance
  switch (sessionType) {
    case 'deep-work':
      description += ' • Deep focus session';
      break;
    case 'review':
      description += ' • Review and consolidate';
      break;
    case 'flashcards':
      description += ' • Active recall practice';
      break;
    case 'light-study':
      description += ' • Light review session';
      break;
  }

  return description;
}
