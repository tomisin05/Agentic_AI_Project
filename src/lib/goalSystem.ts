// Goal System - Complete goal management, progress tracking, and smart recommendations

export type GoalType = 'exam' | 'project' | 'skill' | 'course' | 'certification' | 'personal';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';
export type ActionType = 'deep-work' | 'review' | 'flashcards' | 'light-study';

export interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  status: TaskStatus;
  estimatedHours?: number;
  completedAt?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  type: GoalType;
  priority: GoalPriority;
  subject: string;
  deadline?: string;
  targetHours: number;
  hoursCompleted: number;
  dailyCommitmentMinutes: number;
  tasks: Task[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  isArchived: boolean;
}

export interface GoalProgress {
  goalId: string;
  progressPercentage: number;
  tasksCompleted: number;
  totalTasks: number;
  hoursCompleted: number;
  targetHours: number;
  daysRemaining?: number;
  isOnTrack: boolean;
  recommendedDailyMinutes: number;
}

export interface DailyRecommendation {
  goalId: string;
  goalTitle: string;
  urgency: 'critical' | 'high' | 'medium' | 'low';
  recommendedAction: ActionType;
  recommendedDuration: number; // in minutes
  reason: string;
  nextTask?: Task;
}

// Calculate goal progress
export function calculateGoalProgress(goal: Goal): GoalProgress {
  const tasksCompleted = goal.tasks.filter(t => t.status === 'completed').length;
  const totalTasks = goal.tasks.length;
  
  // Progress is a combination of tasks completed and hours studied
  const taskProgress = totalTasks > 0 ? (tasksCompleted / totalTasks) * 100 : 0;
  const hourProgress = goal.targetHours > 0 ? (goal.hoursCompleted / goal.targetHours) * 100 : 0;
  
  // Weighted average: 60% tasks, 40% hours
  const progressPercentage = totalTasks > 0 
    ? (taskProgress * 0.6 + hourProgress * 0.4)
    : hourProgress;

  let daysRemaining: number | undefined;
  let isOnTrack = true;
  let recommendedDailyMinutes = goal.dailyCommitmentMinutes;

  if (goal.deadline) {
    const deadlineDate = new Date(goal.deadline);
    const today = new Date();
    daysRemaining = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining > 0) {
      const hoursRemaining = goal.targetHours - goal.hoursCompleted;
      if (hoursRemaining > 0) {
        recommendedDailyMinutes = Math.ceil((hoursRemaining * 60) / daysRemaining);
        // Check if on track (current pace vs required pace)
        isOnTrack = goal.dailyCommitmentMinutes >= recommendedDailyMinutes * 0.9;
      }
    } else {
      isOnTrack = progressPercentage >= 100;
    }
  }

  return {
    goalId: goal.id,
    progressPercentage: Math.min(progressPercentage, 100),
    tasksCompleted,
    totalTasks,
    hoursCompleted: goal.hoursCompleted,
    targetHours: goal.targetHours,
    daysRemaining,
    isOnTrack,
    recommendedDailyMinutes
  };
}

// Get daily recommendation for what to study next
export function getDailyRecommendation(goals: Goal[]): DailyRecommendation | null {
  const activeGoals = goals.filter(g => !g.isArchived && !g.completedAt);
  
  if (activeGoals.length === 0) return null;

  // Score each goal based on urgency
  const scoredGoals = activeGoals.map(goal => {
    const progress = calculateGoalProgress(goal);
    let score = 0;
    let urgency: 'critical' | 'high' | 'medium' | 'low' = 'medium';
    let reason = '';

    // Factor 1: Days remaining (most urgent)
    if (progress.daysRemaining !== undefined) {
      if (progress.daysRemaining <= 2) {
        score += 100;
        urgency = 'critical';
        reason = `Only ${progress.daysRemaining} days left!`;
      } else if (progress.daysRemaining <= 7) {
        score += 50;
        urgency = 'high';
        reason = `${progress.daysRemaining} days until deadline`;
      } else if (progress.daysRemaining <= 14) {
        score += 25;
        urgency = 'medium';
        reason = `${progress.daysRemaining} days to prepare`;
      }
    }

    // Factor 2: Off-track status
    if (!progress.isOnTrack) {
      score += 40;
      reason = progress.daysRemaining 
        ? `Behind schedule. Need ${progress.recommendedDailyMinutes} min/day to catch up`
        : 'Behind schedule';
    }

    // Factor 3: Priority
    const priorityScores = { critical: 30, high: 20, medium: 10, low: 5 };
    score += priorityScores[goal.priority];

    // Factor 4: Progress percentage (prefer goals that are started but not finished)
    if (progress.progressPercentage > 0 && progress.progressPercentage < 100) {
      score += 15;
    }

    return { goal, progress, score, urgency, reason };
  });

  // Sort by score (highest first)
  scoredGoals.sort((a, b) => b.score - a.score);
  
  const top = scoredGoals[0];
  if (!top) return null;

  // Determine recommended action type
  let recommendedAction: ActionType = 'deep-work';
  const progress = top.progress;
  
  if (progress.progressPercentage < 30) {
    recommendedAction = 'deep-work'; // Start with intensive work
  } else if (progress.progressPercentage < 70) {
    recommendedAction = progress.daysRemaining && progress.daysRemaining <= 7 
      ? 'flashcards' // Crunch time - review mode
      : 'deep-work';
  } else {
    recommendedAction = 'review'; // Final stages - review and polish
  }

  // Find next incomplete task
  const nextTask = top.goal.tasks.find(t => t.status !== 'completed');

  // Determine recommended duration
  let recommendedDuration = top.progress.recommendedDailyMinutes;
  if (recommendedAction === 'flashcards' || recommendedAction === 'review') {
    recommendedDuration = Math.min(recommendedDuration, 45); // Shorter for review
  } else if (recommendedAction === 'light-study') {
    recommendedDuration = Math.min(recommendedDuration, 30);
  }

  return {
    goalId: top.goal.id,
    goalTitle: top.goal.title,
    urgency: top.urgency,
    recommendedAction,
    recommendedDuration,
    reason: top.reason || 'Continue making progress',
    nextTask
  };
}

// Link a study session to a goal
export function linkSessionToGoal(
  goalId: string, 
  taskId: string | undefined, 
  durationMinutes: number,
  taskCompleted: boolean
): { updatedGoal: Goal | null } {
  const goals = getGoalsFromStorage();
  const goal = goals.find(g => g.id === goalId);
  
  if (!goal) return { updatedGoal: null };

  // Update hours completed
  goal.hoursCompleted += durationMinutes / 60;

  // Update task status if specified
  if (taskId && taskCompleted) {
    const task = goal.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = 'completed';
      task.completedAt = new Date().toISOString();
    }
  }

  // Check if goal is complete
  const progress = calculateGoalProgress(goal);
  if (progress.progressPercentage >= 100 && !goal.completedAt) {
    goal.completedAt = new Date().toISOString();
  }

  goal.updatedAt = new Date().toISOString();
  
  saveGoalsToStorage(goals);
  
  return { updatedGoal: goal };
}

// CRUD operations
export function getGoalsFromStorage(): Goal[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('study-goals');
  return stored ? JSON.parse(stored) : [];
}

export function saveGoalsToStorage(goals: Goal[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem('study-goals', JSON.stringify(goals));
}

export function createGoal(goalData: Omit<Goal, 'id' | 'createdAt' | 'updatedAt' | 'isArchived' | 'hoursCompleted'>): Goal {
  const newGoal: Goal = {
    ...goalData,
    id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    hoursCompleted: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isArchived: false
  };

  const goals = getGoalsFromStorage();
  goals.push(newGoal);
  saveGoalsToStorage(goals);

  return newGoal;
}

export function updateGoal(goalId: string, updates: Partial<Goal>): Goal | null {
  const goals = getGoalsFromStorage();
  const goalIndex = goals.findIndex(g => g.id === goalId);
  
  if (goalIndex === -1) return null;

  goals[goalIndex] = {
    ...goals[goalIndex],
    ...updates,
    updatedAt: new Date().toISOString()
  };

  saveGoalsToStorage(goals);
  return goals[goalIndex];
}

export function deleteGoal(goalId: string): boolean {
  const goals = getGoalsFromStorage();
  const filtered = goals.filter(g => g.id !== goalId);
  
  if (filtered.length === goals.length) return false;
  
  saveGoalsToStorage(filtered);
  return true;
}

export function addTaskToGoal(goalId: string, task: Omit<Task, 'id'>): Task | null {
  const goals = getGoalsFromStorage();
  const goal = goals.find(g => g.id === goalId);
  
  if (!goal) return null;

  const newTask: Task = {
    ...task,
    id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  };

  goal.tasks.push(newTask);
  goal.updatedAt = new Date().toISOString();
  
  saveGoalsToStorage(goals);
  return newTask;
}

export function updateTask(goalId: string, taskId: string, updates: Partial<Task>): Task | null {
  const goals = getGoalsFromStorage();
  const goal = goals.find(g => g.id === goalId);
  
  if (!goal) return null;

  const taskIndex = goal.tasks.findIndex(t => t.id === taskId);
  if (taskIndex === -1) return null;

  goal.tasks[taskIndex] = {
    ...goal.tasks[taskIndex],
    ...updates
  };
  
  goal.updatedAt = new Date().toISOString();
  saveGoalsToStorage(goals);
  
  return goal.tasks[taskIndex];
}

export function deleteTask(goalId: string, taskId: string): boolean {
  const goals = getGoalsFromStorage();
  const goal = goals.find(g => g.id === goalId);
  
  if (!goal) return false;

  const originalLength = goal.tasks.length;
  goal.tasks = goal.tasks.filter(t => t.id !== taskId);
  
  if (goal.tasks.length === originalLength) return false;

  goal.updatedAt = new Date().toISOString();
  saveGoalsToStorage(goals);
  
  return true;
}
