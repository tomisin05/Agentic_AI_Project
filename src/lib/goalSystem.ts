// Goal-oriented study system
// This connects all features (timer, flashcards, scheduler, story) to user objectives

export type GoalType = 'exam' | 'project' | 'skill' | 'course' | 'certification' | 'personal';
export type GoalPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'not-started' | 'in-progress' | 'completed' | 'blocked';

export interface StudyGoal {
  id: string;
  title: string;
  type: GoalType;
  subject: string;
  description?: string;
  deadline?: Date;
  priority: GoalPriority;
  targetHours?: number; // Total hours needed
  hoursCompleted: number;
  createdAt: Date;
  completedAt?: Date;
  isActive: boolean;
  
  // Sub-tasks/milestones
  tasks: GoalTask[];
  
  // Study plan
  dailyCommitment?: number; // minutes per day
  weeklyCommitment?: number; // sessions per week
  preferredStudyTimes?: string[]; // e.g., ['morning', 'afternoon', 'evening']
  
  // Progress tracking
  sessionsCompleted: number;
  flashcardsCreated: number;
  flashcardsMastered: number;
  currentStreak: number;
  
  // Story integration
  storyMilestones: string[];
  currentChapter: number;
}

export interface GoalTask {
  id: string;
  goalId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  estimatedMinutes?: number;
  actualMinutes: number;
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
  
  // Related resources
  flashcardCount?: number;
  notesLink?: string;
}

export interface GoalProgress {
  goalId: string;
  progressPercentage: number;
  tasksCompleted: number;
  totalTasks: number;
  hoursCompleted: number;
  targetHours: number;
  daysUntilDeadline?: number;
  onTrack: boolean;
  recommendedDailyMinutes: number;
  projectedCompletionDate?: Date;
}

export interface DailyRecommendation {
  goalId: string;
  goalTitle: string;
  priority: number; // 1-10
  recommendedAction: 'deep-work' | 'review' | 'flashcards' | 'light-study' | 'break';
  suggestedDuration: number; // minutes
  suggestedPreset: string;
  reasoning: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface SessionGoalLink {
  sessionId: string;
  goalId: string;
  taskId?: string;
  minutesWorked: number;
  focusRating: number;
  progressMade: boolean;
  completedTask: boolean;
  notes?: string;
  timestamp: Date;
}

// Goal Management
export class GoalManager {
  private static readonly STORAGE_KEY = 'pomodoro-study-goals';
  private static readonly SESSIONS_KEY = 'pomodoro-goal-sessions';

  // CRUD Operations
  static getGoals(): StudyGoal[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      const parsed = JSON.parse(stored);
      return parsed.map((goal: any) => ({
        ...goal,
        deadline: goal.deadline ? new Date(goal.deadline) : undefined,
        createdAt: new Date(goal.createdAt),
        completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
        tasks: goal.tasks?.map((task: any) => ({
          ...task,
          dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
          completedAt: task.completedAt ? new Date(task.completedAt) : undefined,
        })) || []
      }));
    } catch (error) {
      console.error('Failed to load goals:', error);
      return [];
    }
  }

  static saveGoals(goals: StudyGoal[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(goals));
    } catch (error) {
      console.error('Failed to save goals:', error);
    }
  }

  static createGoal(goalData: Omit<StudyGoal, 'id' | 'createdAt' | 'hoursCompleted' | 'sessionsCompleted' | 'flashcardsCreated' | 'flashcardsMastered' | 'currentStreak' | 'isActive' | 'storyMilestones' | 'currentChapter'>): StudyGoal {
    const newGoal: StudyGoal = {
      ...goalData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      hoursCompleted: 0,
      sessionsCompleted: 0,
      flashcardsCreated: 0,
      flashcardsMastered: 0,
      currentStreak: 0,
      isActive: true,
      storyMilestones: [],
      currentChapter: 1,
      tasks: goalData.tasks || []
    };

    const goals = this.getGoals();
    goals.push(newGoal);
    this.saveGoals(goals);
    
    return newGoal;
  }

  static updateGoal(goalId: string, updates: Partial<StudyGoal>): void {
    const goals = this.getGoals();
    const index = goals.findIndex(g => g.id === goalId);
    
    if (index !== -1) {
      goals[index] = { ...goals[index], ...updates };
      this.saveGoals(goals);
    }
  }

  static deleteGoal(goalId: string): void {
    const goals = this.getGoals().filter(g => g.id !== goalId);
    this.saveGoals(goals);
  }

  static getActiveGoals(): StudyGoal[] {
    return this.getGoals().filter(g => g.isActive && !g.completedAt);
  }

  static getPrimaryGoal(): StudyGoal | null {
    const activeGoals = this.getActiveGoals();
    if (activeGoals.length === 0) return null;
    
    // Return highest priority goal with nearest deadline
    return activeGoals.sort((a, b) => {
      // First sort by priority
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by deadline
      if (a.deadline && b.deadline) {
        return a.deadline.getTime() - b.deadline.getTime();
      }
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      
      return 0;
    })[0];
  }

  // Task Management
  static addTask(goalId: string, taskData: Omit<GoalTask, 'id' | 'goalId' | 'actualMinutes' | 'status'>): GoalTask {
    const newTask: GoalTask = {
      ...taskData,
      id: crypto.randomUUID(),
      goalId,
      actualMinutes: 0,
      status: 'not-started'
    };

    const goals = this.getGoals();
    const goal = goals.find(g => g.id === goalId);
    
    if (goal) {
      goal.tasks.push(newTask);
      this.saveGoals(goals);
    }
    
    return newTask;
  }

  static updateTask(goalId: string, taskId: string, updates: Partial<GoalTask>): void {
    const goals = this.getGoals();
    const goal = goals.find(g => g.id === goalId);
    
    if (goal) {
      const taskIndex = goal.tasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        goal.tasks[taskIndex] = { ...goal.tasks[taskIndex], ...updates };
        
        // If task completed, mark completion time
        if (updates.status === 'completed' && !goal.tasks[taskIndex].completedAt) {
          goal.tasks[taskIndex].completedAt = new Date();
        }
        
        this.saveGoals(goals);
      }
    }
  }

  static deleteTask(goalId: string, taskId: string): void {
    const goals = this.getGoals();
    const goal = goals.find(g => g.id === goalId);
    
    if (goal) {
      goal.tasks = goal.tasks.filter(t => t.id !== taskId);
      this.saveGoals(goals);
    }
  }

  // Session Linking
  static linkSessionToGoal(sessionLink: SessionGoalLink): void {
    try {
      const stored = localStorage.getItem(this.SESSIONS_KEY);
      const sessions = stored ? JSON.parse(stored) : [];
      sessions.push(sessionLink);
      localStorage.setItem(this.SESSIONS_KEY, JSON.stringify(sessions));

      // Update goal progress
      const goals = this.getGoals();
      const goal = goals.find(g => g.id === sessionLink.goalId);
      
      if (goal) {
        goal.sessionsCompleted += 1;
        goal.hoursCompleted += sessionLink.minutesWorked / 60;
        
        // Update task progress if task was specified
        if (sessionLink.taskId) {
          const task = goal.tasks.find(t => t.id === sessionLink.taskId);
          if (task) {
            task.actualMinutes += sessionLink.minutesWorked;
            if (sessionLink.completedTask) {
              task.status = 'completed';
              task.completedAt = new Date();
            } else if (task.status === 'not-started') {
              task.status = 'in-progress';
            }
          }
        }
        
        this.saveGoals(goals);
      }
    } catch (error) {
      console.error('Failed to link session to goal:', error);
    }
  }

  static getGoalSessions(goalId: string): SessionGoalLink[] {
    try {
      const stored = localStorage.getItem(this.SESSIONS_KEY);
      if (!stored) return [];
      
      const sessions = JSON.parse(stored);
      return sessions
        .filter((s: SessionGoalLink) => s.goalId === goalId)
        .map((s: any) => ({
          ...s,
          timestamp: new Date(s.timestamp)
        }));
    } catch (error) {
      console.error('Failed to get goal sessions:', error);
      return [];
    }
  }

  // Progress Calculation
  static calculateProgress(goalId: string): GoalProgress {
    const goal = this.getGoals().find(g => g.id === goalId);
    
    if (!goal) {
      return {
        goalId,
        progressPercentage: 0,
        tasksCompleted: 0,
        totalTasks: 0,
        hoursCompleted: 0,
        targetHours: 0,
        onTrack: false,
        recommendedDailyMinutes: 0
      };
    }

    const totalTasks = goal.tasks.length;
    const tasksCompleted = goal.tasks.filter(t => t.status === 'completed').length;
    const targetHours = goal.targetHours || 0;
    const hoursCompleted = goal.hoursCompleted;

    // Calculate progress percentage (weighted between tasks and hours)
    let progressPercentage = 0;
    if (totalTasks > 0 && targetHours > 0) {
      const taskProgress = (tasksCompleted / totalTasks) * 100;
      const hourProgress = (hoursCompleted / targetHours) * 100;
      progressPercentage = (taskProgress * 0.6 + hourProgress * 0.4);
    } else if (totalTasks > 0) {
      progressPercentage = (tasksCompleted / totalTasks) * 100;
    } else if (targetHours > 0) {
      progressPercentage = (hoursCompleted / targetHours) * 100;
    }

    // Calculate days until deadline
    let daysUntilDeadline: number | undefined;
    let onTrack = true;
    let recommendedDailyMinutes = 0;
    let projectedCompletionDate: Date | undefined;

    if (goal.deadline) {
      const now = new Date();
      daysUntilDeadline = Math.ceil((goal.deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (targetHours > 0) {
        const hoursRemaining = targetHours - hoursCompleted;
        
        if (daysUntilDeadline > 0) {
          // Calculate if on track
          const requiredDailyHours = hoursRemaining / daysUntilDeadline;
          recommendedDailyMinutes = Math.ceil(requiredDailyHours * 60);
          
          // Consider on track if current pace meets deadline
          const currentDailyAverage = goal.sessionsCompleted > 0 
            ? (hoursCompleted * 60) / Math.max(1, (now.getTime() - goal.createdAt.getTime()) / (1000 * 60 * 60 * 24))
            : 0;
          
          onTrack = currentDailyAverage >= recommendedDailyMinutes * 0.8; // 80% threshold
          
          // Project completion date based on current pace
          if (currentDailyAverage > 0) {
            const daysToComplete = (hoursRemaining * 60) / currentDailyAverage;
            projectedCompletionDate = new Date(now.getTime() + daysToComplete * 24 * 60 * 60 * 1000);
          }
        }
      }
    } else if (goal.dailyCommitment && targetHours > 0) {
      const hoursRemaining = targetHours - hoursCompleted;
      const daysToComplete = (hoursRemaining * 60) / goal.dailyCommitment;
      projectedCompletionDate = new Date(Date.now() + daysToComplete * 24 * 60 * 60 * 1000);
      recommendedDailyMinutes = goal.dailyCommitment;
    }

    return {
      goalId,
      progressPercentage: Math.min(100, Math.max(0, progressPercentage)),
      tasksCompleted,
      totalTasks,
      hoursCompleted,
      targetHours,
      daysUntilDeadline,
      onTrack,
      recommendedDailyMinutes,
      projectedCompletionDate
    };
  }

  // Recommendations
  static getDailyRecommendations(): DailyRecommendation[] {
    const activeGoals = this.getActiveGoals();
    const recommendations: DailyRecommendation[] = [];

    for (const goal of activeGoals) {
      const progress = this.calculateProgress(goal.id);
      let recommendedAction: DailyRecommendation['recommendedAction'] = 'deep-work';
      let suggestedDuration = 25;
      let suggestedPreset = 'classic';
      let reasoning = '';
      let urgency: DailyRecommendation['urgency'] = 'medium';
      let priority = 5;

      // Determine urgency
      if (progress.daysUntilDeadline !== undefined) {
        if (progress.daysUntilDeadline <= 2) {
          urgency = 'critical';
          priority = 10;
        } else if (progress.daysUntilDeadline <= 7) {
          urgency = 'high';
          priority = 8;
        } else if (progress.daysUntilDeadline <= 14) {
          urgency = 'medium';
          priority = 6;
        } else {
          urgency = 'low';
          priority = 4;
        }
      }

      // Adjust by priority
      const priorityBoost = { critical: 3, high: 2, medium: 0, low: -1 };
      priority += priorityBoost[goal.priority];

      // Determine action based on progress and status
      if (progress.progressPercentage > 70) {
        recommendedAction = 'review';
        suggestedDuration = 25;
        suggestedPreset = 'classic';
        reasoning = `You're ${Math.round(progress.progressPercentage)}% complete. Focus on reviewing and consolidating knowledge.`;
      } else if (urgency === 'critical') {
        recommendedAction = 'deep-work';
        suggestedDuration = 50;
        suggestedPreset = 'deep-work';
        reasoning = `Deadline in ${progress.daysUntilDeadline} days! Deep focus session recommended.`;
      } else if (!progress.onTrack && urgency !== 'low') {
        recommendedAction = 'deep-work';
        suggestedDuration = 50;
        suggestedPreset = 'deep-work';
        reasoning = `Behind schedule. Need ${progress.recommendedDailyMinutes} min/day to stay on track.`;
      } else if (goal.flashcardsCreated > 0 && goal.flashcardsCreated > goal.flashcardsMastered * 2) {
        recommendedAction = 'flashcards';
        suggestedDuration = 15;
        suggestedPreset = 'quick-study';
        reasoning = 'Many flashcards need review. Quick study session recommended.';
      } else {
        recommendedAction = 'deep-work';
        suggestedDuration = 25;
        suggestedPreset = 'classic';
        reasoning = `Continue steady progress on ${goal.subject}.`;
      }

      recommendations.push({
        goalId: goal.id,
        goalTitle: goal.title,
        priority,
        recommendedAction,
        suggestedDuration,
        suggestedPreset,
        reasoning,
        urgency
      });
    }

    // Sort by priority
    return recommendations.sort((a, b) => b.priority - a.priority);
  }

  // Get today's tasks
  static getTodaysTasks(): GoalTask[] {
    const goals = this.getActiveGoals();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tasks: GoalTask[] = [];
    
    for (const goal of goals) {
      for (const task of goal.tasks) {
        if (task.status !== 'completed' && task.dueDate) {
          const dueDate = new Date(task.dueDate);
          dueDate.setHours(0, 0, 0, 0);
          
          if (dueDate <= today) {
            tasks.push(task);
          }
        }
      }
    }
    
    return tasks;
  }

  // Get next task to work on
  static getNextTask(goalId?: string): { goal: StudyGoal; task: GoalTask } | null {
    const goals = goalId 
      ? this.getGoals().filter(g => g.id === goalId && g.isActive)
      : this.getActiveGoals();
    
    for (const goal of goals) {
      // First, get tasks that are already in progress
      const inProgressTask = goal.tasks.find(t => t.status === 'in-progress');
      if (inProgressTask) {
        return { goal, task: inProgressTask };
      }
      
      // Then get tasks with nearest due date
      const pendingTasks = goal.tasks
        .filter(t => t.status === 'not-started')
        .sort((a, b) => {
          if (a.dueDate && b.dueDate) {
            return a.dueDate.getTime() - b.dueDate.getTime();
          }
          if (a.dueDate) return -1;
          if (b.dueDate) return 1;
          return 0;
        });
      
      if (pendingTasks.length > 0) {
        return { goal, task: pendingTasks[0] };
      }
    }
    
    return null;
  }
}
