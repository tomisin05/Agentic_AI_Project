export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  condition: (stats: UserStats) => boolean;
  reward?: string;
}

export interface UserStats {
  totalSessions: number;
  perfectSessions: number; // 5/5 focus
  currentStreak: number;
  longestStreak: number;
  totalFocusTime: number; // in minutes
  tasksCompleted: number;
  themesExplored: number;
  averageFocus: number;
  sessionsToday: number;
  consecutivePerfect: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Beginner Achievements
  {
    id: 'first-session',
    title: 'First Steps',
    description: 'Complete your first study session',
    icon: '🎯',
    rarity: 'common',
    condition: (stats) => stats.totalSessions >= 1,
    reward: 'Welcome to your journey!'
  },
  {
    id: 'first-perfect',
    title: 'Perfect Focus',
    description: 'Achieve 5/5 focus in a session',
    icon: '⭐',
    rarity: 'common',
    condition: (stats) => stats.perfectSessions >= 1,
    reward: 'Unlocked: Focus Master title'
  },
  {
    id: 'week-warrior',
    title: 'Week Warrior',
    description: 'Maintain a 7-day study streak',
    icon: '🔥',
    rarity: 'rare',
    condition: (stats) => stats.currentStreak >= 7,
    reward: 'Unlocked: Flame aura'
  },
  
  // Consistency Achievements
  {
    id: 'daily-dedication',
    title: 'Daily Dedication',
    description: 'Complete 3 sessions in one day',
    icon: '📅',
    rarity: 'common',
    condition: (stats) => stats.sessionsToday >= 3,
    reward: '+50 Focus Points'
  },
  {
    id: 'consistency-king',
    title: 'Consistency Champion',
    description: 'Maintain a 30-day streak',
    icon: '👑',
    rarity: 'epic',
    condition: (stats) => stats.currentStreak >= 30,
    reward: 'Unlocked: Golden crown badge'
  },
  {
    id: 'hundred-club',
    title: 'Century Club',
    description: 'Complete 100 study sessions',
    icon: '💯',
    rarity: 'epic',
    condition: (stats) => stats.totalSessions >= 100,
    reward: 'Unlocked: Elite scholar status'
  },
  
  // Focus Achievements
  {
    id: 'focus-master',
    title: 'Focus Master',
    description: 'Complete 10 perfect (5/5) sessions',
    icon: '🎯',
    rarity: 'rare',
    condition: (stats) => stats.perfectSessions >= 10,
    reward: 'Unlocked: Master badge'
  },
  {
    id: 'laser-focus',
    title: 'Laser Focus',
    description: '5 consecutive perfect sessions',
    icon: '✨',
    rarity: 'epic',
    condition: (stats) => stats.consecutivePerfect >= 5,
    reward: 'Unlocked: Diamond focus aura'
  },
  {
    id: 'zen-master',
    title: 'Zen Master',
    description: 'Maintain 4.5+ average focus over 20 sessions',
    icon: '🧘',
    rarity: 'legendary',
    condition: (stats) => stats.totalSessions >= 20 && stats.averageFocus >= 4.5,
    reward: 'Unlocked: Legendary Zen status'
  },
  
  // Time Achievements
  {
    id: 'hour-power',
    title: 'Hour of Power',
    description: 'Accumulate 60 minutes of focused study',
    icon: '⏰',
    rarity: 'common',
    condition: (stats) => stats.totalFocusTime >= 60,
    reward: '+25 Focus Points'
  },
  {
    id: 'marathon-mind',
    title: 'Marathon Mind',
    description: 'Accumulate 1000 minutes of focused study',
    icon: '🏃',
    rarity: 'rare',
    condition: (stats) => stats.totalFocusTime >= 1000,
    reward: 'Unlocked: Marathon runner badge'
  },
  {
    id: 'time-lord',
    title: 'Time Lord',
    description: 'Accumulate 5000 minutes of focused study',
    icon: '⏳',
    rarity: 'legendary',
    condition: (stats) => stats.totalFocusTime >= 5000,
    reward: 'Unlocked: Master of Time title'
  },
  
  // Task Achievements
  {
    id: 'task-tackler',
    title: 'Task Tackler',
    description: 'Complete 10 tasks',
    icon: '✅',
    rarity: 'common',
    condition: (stats) => stats.tasksCompleted >= 10,
    reward: '+50 Productivity Points'
  },
  {
    id: 'productivity-pro',
    title: 'Productivity Pro',
    description: 'Complete 50 tasks',
    icon: '🚀',
    rarity: 'rare',
    condition: (stats) => stats.tasksCompleted >= 50,
    reward: 'Unlocked: Pro badge'
  },
  {
    id: 'task-master',
    title: 'Task Master',
    description: 'Complete 200 tasks',
    icon: '🏆',
    rarity: 'epic',
    condition: (stats) => stats.tasksCompleted >= 200,
    reward: 'Unlocked: Task Master crown'
  },
  
  // Exploration Achievements
  {
    id: 'story-explorer',
    title: 'Story Explorer',
    description: 'Try 3 different story themes',
    icon: '🗺️',
    rarity: 'rare',
    condition: (stats) => stats.themesExplored >= 3,
    reward: 'Unlocked: Explorer title'
  },
  {
    id: 'theme-collector',
    title: 'Theme Collector',
    description: 'Complete sessions in all 6 themes',
    icon: '🎭',
    rarity: 'legendary',
    condition: (stats) => stats.themesExplored >= 6,
    reward: 'Unlocked: Master Collector badge'
  },
  
  // Special Achievements
  {
    id: 'early-bird',
    title: 'Early Bird',
    description: 'Complete a session before 8 AM',
    icon: '🌅',
    rarity: 'rare',
    condition: (stats) => false, // Checked separately based on time
    reward: 'Unlocked: Morning glory badge'
  },
  {
    id: 'night-owl',
    title: 'Night Owl',
    description: 'Complete a session after 10 PM',
    icon: '🦉',
    rarity: 'rare',
    condition: (stats) => false, // Checked separately based on time
    reward: 'Unlocked: Night warrior badge'
  },
  {
    id: 'comeback-kid',
    title: 'Comeback Kid',
    description: 'Restart streak after breaking one of 5+ days',
    icon: '💪',
    rarity: 'epic',
    condition: (stats) => false, // Checked separately
    reward: 'Resilience is your strength!'
  }
];

export function checkNewAchievements(
  stats: UserStats,
  unlockedAchievementIds: string[]
): Achievement[] {
  const newAchievements: Achievement[] = [];
  
  for (const achievement of ACHIEVEMENTS) {
    // Skip if already unlocked
    if (unlockedAchievementIds.includes(achievement.id)) {
      continue;
    }
    
    // Check if condition is met
    if (achievement.condition(stats)) {
      newAchievements.push(achievement);
    }
  }
  
  return newAchievements;
}

export function calculateUserStats(journalEntries: any[], tasksCompleted: number, themesUsed: Set<string>): UserStats {
  const totalSessions = journalEntries.length;
  const perfectSessions = journalEntries.filter(e => e.focusRating === 5).length;
  
  // Calculate streak
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;
  
  const sortedEntries = [...journalEntries].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get today normalized
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let lastDate: Date | null = null;
  for (const entry of sortedEntries) {
    const entryDate = new Date(entry.date);
    entryDate.setHours(0, 0, 0, 0);
    
    if (!lastDate) {
      // First entry in the sorted list (most recent)
      const daysSinceToday = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // If the most recent session was today or yesterday, start the streak
      if (daysSinceToday <= 1) {
        tempStreak = 1;
        lastDate = entryDate;
      } else {
        // Streak is broken - no recent sessions
        break;
      }
    } else {
      const dayDiff = Math.floor((lastDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        tempStreak++;
      } else if (dayDiff > 1) {
        break;
      }
      
      lastDate = entryDate;
    }
  }
  
  currentStreak = tempStreak;
  longestStreak = Math.max(tempStreak, longestStreak);
  
  // Calculate total focus time (assuming 25 min sessions)
  const totalFocusTime = totalSessions * 25;
  
  // Calculate average focus
  const averageFocus = totalSessions > 0 
    ? journalEntries.reduce((sum, e) => sum + e.focusRating, 0) / totalSessions
    : 0;
  
  // Sessions today
  const sessionsToday = journalEntries.filter(e => {
    const entryDate = new Date(e.date);
    entryDate.setHours(0, 0, 0, 0);
    return entryDate.getTime() === today.getTime();
  }).length;
  
  // Consecutive perfect sessions
  let consecutivePerfect = 0;
  for (let i = sortedEntries.length - 1; i >= 0; i--) {
    if (sortedEntries[i].focusRating === 5) {
      consecutivePerfect++;
    } else {
      break;
    }
  }
  
  return {
    totalSessions,
    perfectSessions,
    currentStreak,
    longestStreak,
    totalFocusTime,
    tasksCompleted,
    themesExplored: themesUsed.size,
    averageFocus,
    sessionsToday,
    consecutivePerfect
  };
}